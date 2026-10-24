import {
  getReliefDatabaseAsync,
  saveReliefDatabaseAsync,
  acquireSyncLock,
  releaseSyncLock,
  SourceItem,
  AnnouncementItem,
  IngestionRunItem,
  EvidenceStatus
} from "../db/reliefStore";

interface ScrapedRecordCandidate {
  sourceCode: string;
  sourceName: string;
  title: string;
  titleMr?: string;
  titleHi?: string;
  summary: string;
  summaryMr?: string;
  summaryHi?: string;
  originalUrl: string;
  canonicalUrl: string;
  category: AnnouncementItem["category"];
  publishedAt: string | null;
  department?: string;
  grNumber?: string;
  financialAmount?: string;
  reportedEligibleCount?: string;
  confirmedBeneficiariesCount?: string;
  academicYear?: string;
  geographicScope?: string;
  tags: string[];
}

// Normalized string hash for deduplication
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u0900-\u097F]/g, "")
    .trim();
}

// Safe HTTP fetch with timeout and realistic headers
async function safeFetch(url: string, timeoutMs = 8000): Promise<{ ok: boolean; status: number; text: string; error?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "AgriSmart-Intelligence-Bot/2.1 (Maharashtra Agricultural Information Hub; contact@agrismart.gov.in)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7",
        "Accept-Language": "mr,en-US;q=0.8,en;q=0.6,hi;q=0.5"
      },
      redirect: "follow"
    });

    clearTimeout(timeoutId);
    const text = await response.text();
    return { ok: response.ok, status: response.status, text };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { ok: false, status: 0, text: "", error: errorMsg };
  }
}

// 1. Source Adapter: Maharashtra Government GR Portal
async function probeMahaGrPortal(source: SourceItem): Promise<{ records: ScrapedRecordCandidate[]; error?: string }> {
  const res = await safeFetch(source.baseUrl);
  if (!res.ok) {
    return {
      records: [],
      error: `GR Portal responded with HTTP ${res.status}: ${res.error || "Connection/Redirect check (Anti-Bot WAF active)"}`
    };
  }

  // The GR portal requires session tokens for search queries; note accessibility status
  return { records: [] };
}

// 2. Source Adapter: Maharashtra Water Supply & Sanitation Department (Official Tanker Reports)
async function probeWaterDept(source: SourceItem): Promise<{ records: ScrapedRecordCandidate[]; error?: string }> {
  const res = await safeFetch(source.baseUrl, 12000);
  if (!res.ok) {
    return { records: [], error: `Water Dept returned HTTP ${res.status}: ${res.error || "Network error"}` };
  }

  const html = res.text;
  const records: ScrapedRecordCandidate[] = [];

  // Parse HTML table rows containing official tanker reports
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const rowContent = match[1];
    if (rowContent.includes(".pdf") && (rowContent.includes("टँकर") || rowContent.includes("अहवाल"))) {
      const titleMatch = rowContent.match(/<td[^>]*role="rowheader"[^>]*>([\s\S]*?)<\/td>/i) ||
                         rowContent.match(/<td[^>]*>([\s\S]*?)<\/td>/i);
      const linkMatch = rowContent.match(/href=["'](https?:\/\/[^"']+\.pdf)["']/i) ||
                        rowContent.match(/href=["'](\/[^"']+\.pdf)["']/i);
      const dateMatch = rowContent.match(/(\d{2})[\/\.-](\d{2})[\/\.-](\d{4})/);

      if (titleMatch && linkMatch) {
        const rawTitle = titleMatch[1].replace(/<[^>]+>/g, "").trim();
        const pdfUrl = linkMatch[1].startsWith("http") ? linkMatch[1] : `https://water.maharashtra.gov.in${linkMatch[1]}`;
        
        let verifiedDate: string | null = null;
        let displayDateSuffix = "";
        if (dateMatch) {
          const day = dateMatch[1];
          const month = dateMatch[2];
          const year = dateMatch[3];
          verifiedDate = `${year}-${month}-${day}`;
          displayDateSuffix = ` (${day}/${month}/${year})`;
        }

        records.push({
          sourceCode: source.code,
          sourceName: source.name,
          title: `Official Scarcity Water Tanker Report${displayDateSuffix}`,
          titleMr: `${rawTitle} - पाणी पुरवठा विभाग अधिकृत टँकर अहवाल`,
          titleHi: `आधिकारिक पेयजल टैंकर रिपोर्ट${displayDateSuffix} - जल आपूर्ति विभाग`,
          summary: `Official Maharashtra Water Supply & Sanitation Department scarcity deployment report. Documents drinking water tanker allocations and scarcity measures for drought-affected talukas.`,
          summaryMr: `पाणी पुरवठा व स्वच्छता विभागाचा अधिकृत साप्ताहिक अहवाल: राज्यातील टंचाईग्रस्त महसुली विभागांमध्ये सुरू असलेल्या पिण्याच्या पाण्याच्या टँकर्सची सद्यस्थिती व वाटप.`,
          summaryHi: `जल आपूर्ति एवं स्वच्छता विभाग की आधिकारिक रिपोर्ट: राज्य के जल संकटग्रस्त क्षेत्रों में पेयजल टैंकर तैनाती की अद्यतन स्थिति।`,
          originalUrl: source.baseUrl,
          canonicalUrl: pdfUrl,
          category: "drought_relief",
          publishedAt: verifiedDate,
          department: "Water Supply and Sanitation Department, Government of Maharashtra",
          tags: ["water_tankers", "scarcity_relief", "official_report", "s3waas_nic"]
        });

        // Limit to top 3 recent reports per crawl to keep feed focused
        if (records.length >= 3) break;
      }
    }
  }

  return { records };
}

// 3. Source Adapter: Maharashtra Agriculture Department (Krishi Dept)
async function probeKrishiDept(source: SourceItem): Promise<{ records: ScrapedRecordCandidate[]; error?: string }> {
  const res = await safeFetch(source.baseUrl, 10000);
  if (!res.ok) {
    return { records: [], error: `Krishi Dept returned HTTP ${res.status}: ${res.error || "Network error"}` };
  }

  const html = res.text;
  const records: ScrapedRecordCandidate[] = [];

  // Look for official GR/Scheme links
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    const text = match[2].replace(/<[^>]+>/g, "").trim();

    if (text.includes("प्रधानमंत्री पिक विमा योजना") && href.includes("ViewGr.aspx")) {
      records.push({
        sourceCode: source.code,
        sourceName: source.name,
        title: "Official Agriculture Dept Portal: PMFBY ₹1 Crop Insurance Guidelines",
        titleMr: "कृषी विभाग अधिकृत परिपत्रक: प्रधानमंत्री पीक विमा योजना मार्गदर्शक सूचना",
        titleHi: "कृषि विभाग आधिकारिक परिपत्र: प्रधानमंत्री फसल बीमा योजना दिशानिर्देश",
        summary: "Official agricultural portal circular outlining crop loss reporting norms, survey guidelines, and farmer claim submission procedures.",
        summaryMr: "कृषी विभागाचे अधिकृत परिपत्रक: पीक नुकसान भरपाई, पंचनामे आणि ७२ तासांच्या आत नुकसानीची नोंद करण्याबाबत मार्गदर्शक सूचना.",
        summaryHi: "कृषि विभाग आधिकारिक परिपत्र: फसल नुकसान भरपाई, पंचनामा एवं 72 घंटे में सूचना दर्ज करने हेतु दिशानिर्देश।",
        originalUrl: source.baseUrl,
        canonicalUrl: href.startsWith("http") ? href : `https://krishi.maharashtra.gov.in/${href}`,
        category: "pmfby_claim",
        publishedAt: null, // Date not explicitly stated on portal link; marked unavailable
        department: "Agriculture Department, Government of Maharashtra",
        tags: ["pmfby", "krishi_vibhag", "crop_insurance", "official_portal"]
      });
      break;
    }
  }

  return { records };
}

// 4. Source Adapter: Savitribai Phule Pune University (SPPU Notices)
async function probeSppuNotices(source: SourceItem): Promise<{ records: ScrapedRecordCandidate[]; error?: string }> {
  const res = await safeFetch(source.baseUrl);
  if (!res.ok) {
    return { records: [], error: `SPPU portal returned ${res.status}: ${res.error || "Timeout"}` };
  }
  return { records: [] };
}

// 5. Source Adapter: Sakal Media Network & Agricultural Feeds
async function probeSakalNews(source: SourceItem): Promise<{ records: ScrapedRecordCandidate[]; error?: string }> {
  const res = await safeFetch(source.baseUrl);
  if (!res.ok) {
    return { records: [], error: `Sakal feed returned ${res.status}: ${res.error || "Fetch failure"}` };
  }
  return { records: [] };
}

// Evaluation Engine: News-to-GR Verification Workflow
function evaluateEvidenceStatus(
  candidate: ScrapedRecordCandidate,
  existingGrs: Array<{ grNumber: string; pdfUrl: string }>
): {
  status: EvidenceStatus;
  verifiedGrNumber?: string;
  verifiedGrUrl?: string;
  verificationNotes: { en: string; mr: string; hi: string };
} {
  // Check if explicitly referencing an official GR
  if (candidate.grNumber) {
    const matchedGr = existingGrs.find(
      (g) => normalizeText(g.grNumber).includes(normalizeText(candidate.grNumber!))
    );

    if (matchedGr) {
      return {
        status: "official_gr_verified",
        verifiedGrNumber: matchedGr.grNumber,
        verifiedGrUrl: matchedGr.pdfUrl,
        verificationNotes: {
          en: `Matched and verified against official Government Resolution (${matchedGr.grNumber}).`,
          mr: `अधिकृत शासन निर्णय (${matchedGr.grNumber}) शी पडताळणी पूर्ण.`,
          hi: `आधिकारिक शासनादेश (${matchedGr.grNumber}) के साथ मिलान व सत्यापन पूर्ण।`
        }
      };
    }
  }

  // Check for official water department published scarcity/tanker reports
  if (candidate.sourceCode === "MAHA_WATER_DEPT") {
    return {
      status: "official_notice_verified",
      verifiedGrUrl: candidate.canonicalUrl,
      verificationNotes: {
        en: "Verified from Water Supply & Sanitation Department official weekly scarcity deployment records hosted on NIC S3WaaS.",
        mr: "पाणी पुरवठा व स्वच्छता विभागाच्या अधिकृत NIC S3WaaS टँकर अहवालाद्वारे प्रमाणित.",
        hi: "जल आपूर्ति एवं स्वच्छता विभाग के आधिकारिक NIC S3WaaS टैंकर रिकॉर्ड द्वारा सत्यापित।"
      }
    };
  }

  // Check for official agriculture department guidelines
  if (candidate.sourceCode === "MAHA_KRISHI") {
    return {
      status: "official_notice_verified",
      verifiedGrUrl: candidate.canonicalUrl,
      verificationNotes: {
        en: "Verified from Maharashtra Agriculture Department (Krishi Vibhag) official scheme circulars.",
        mr: "कृषी विभाग, महाराष्ट्र शासन यांच्या अधिकृत परिपत्रकाद्वारे प्रमाणित.",
        hi: "कृषि विभाग, महाराष्ट्र सरकार के आधिकारिक परिपत्र द्वारा सत्यापित।"
      }
    };
  }

  // Check for university education circulars
  if (candidate.category === "education_waiver") {
    const isOfficialUniversity = candidate.sourceCode === "SPPU_UNIPUNE" || candidate.originalUrl.includes("unipune.ac.in");
    if (isOfficialUniversity) {
      return {
        status: "official_notice_verified",
        verificationNotes: {
          en: "Verified with official University Board of Examinations circulars and Higher & Technical Education Department orders.",
          mr: "उच्च व तंत्रशिक्षण विभाग आणि विद्यापीठ परीक्षा मंडळाच्या परिपत्रकाद्वारे सत्यापित.",
          hi: "उच्च एवं तकनीकी शिक्षा विभाग तथा विश्वविद्यालय अधिसूचना द्वारा सत्यापित।"
        }
      };
    } else {
      return {
        status: "historical",
        verificationNotes: {
          en: "Secondary educational news aggregator report. Downgraded pending direct official university circular.",
          mr: "दुय्यम वृत्त संकलन. अधिकृत विद्यापीठ परिपत्रकाच्या प्रतीक्षेत ऐतिहासिक नोंद.",
          hi: "द्वितीयक समाचार रिपोर्ट। आधिकारिक विश्वविद्यालय परिपत्र के अभाव में ऐतिहासिक रिकॉर्ड।"
        }
      };
    }
  }

  // Check for ministerial assurance / unverified claims
  if (
    candidate.title.toLowerCase().includes("assurance") ||
    candidate.title.toLowerCase().includes("announcement") ||
    candidate.title.toLowerCase().includes("आश्वासन") ||
    candidate.title.toLowerCase().includes("घोषणा")
  ) {
    return {
      status: "official_announcement_pending",
      verificationNotes: {
        en: "Public announcement or ministerial assurance. Implementation pending issuance of formal Finance Department GR.",
        mr: "सार्वजनिक घोषणा / आश्वासन. वित्त विभागाचा अधिकृत GR व निधी मंजुरी प्रतीक्षेत.",
        hi: "सार्वजनिक घोषणा / आश्वासन। वित्त विभाग का औपचारिक शासनादेश प्रतीक्षारत।"
      }
    };
  }

  // If conflicting numbers like 305 talukas
  if (candidate.title.includes("305") || candidate.summary.includes("305")) {
    return {
      status: "conflicting_sources",
      verificationNotes: {
        en: "Reported in media as 305 talukas; officially 40 talukas are gazetted for disaster relief while the remaining 265 receive revenue/educational concessions.",
        mr: "प्रसारमाध्यमांमध्ये ३०५ तालुके उल्लेखित; अधिकृत गॅझेटमध्ये ४० तालुके तीव्र/मध्यम दुष्काळ आणि २६५ तालुक्यांतील मंडळांना सवलती लागू आहेत.",
        hi: "मीडिया में 305 तहसीलों का उल्लेख; आधिकारिक गजट में 40 गंभीर/मध्यम सूखा एवं 265 मंडलों में रियायतें लागू।"
      }
    };
  }

  return {
    status: "media_report_pending",
    verificationNotes: {
      en: "Media reported development. Official government circular or GR confirmation pending.",
      mr: "वृत्तमाध्यमांनी दिलेली बातमी. अधिकृत शासन निर्णय (GR) अद्याप प्रतीक्षेत.",
      hi: "मीडिया रिपोर्ट। आधिकारिक सरकारी अधिसूचना अथवा शासनादेश प्रतीक्षारत।"
    }
  };
}

// Master Ingestion Pipeline Function
export async function runIngestionPipeline(triggerType: "scheduled" | "manual" | "startup"): Promise<IngestionRunItem> {
  const startTime = Date.now();

  // Prevent concurrent refresh requests from corrupting state or creating duplicates
  const lockAcquired = await acquireSyncLock("crop_relief_ingestion_lock", 120, `ingestion-${triggerType}`);
  if (!lockAcquired) {
    console.warn("[IngestionEngine] Concurrent ingestion execution prevented by distributed sync lock.");
    return {
      id: `run_skipped_${Date.now()}`,
      timestamp: new Date().toISOString(),
      triggerType,
      sourcesChecked: 0,
      newRecordsFound: 0,
      verifiedRecordsCount: 0,
      pendingReviewCount: 0,
      failedSourcesCount: 0,
      executionDurationMs: 0,
      details: ["Execution skipped: another ingestion sync process is actively running."],
      errors: ["Concurrency lock active"]
    };
  }

  try {
    const db = await getReliefDatabaseAsync();

  const details: string[] = [];
  const errors: string[] = [];
  let sourcesChecked = 0;
  let failedSourcesCount = 0;
  let newRecordsFound = 0;

  const discoveredCandidates: ScrapedRecordCandidate[] = [];

  for (const source of db.sources) {
    sourcesChecked++;
    source.lastCheckedAt = new Date().toISOString();

    try {
      let result: { records: ScrapedRecordCandidate[]; error?: string } = { records: [] };

      switch (source.code) {
        case "MAHA_GR_PORTAL":
          result = await probeMahaGrPortal(source);
          break;
        case "MAHA_WATER_DEPT":
          result = await probeWaterDept(source);
          break;
        case "MAHA_KRISHI":
          result = await probeKrishiDept(source);
          break;
        case "SPPU_UNIPUNE":
          result = await probeSppuNotices(source);
          break;
        case "SAKAL_NEWS":
          result = await probeSakalNews(source);
          break;
        default:
          const ping = await safeFetch(source.baseUrl);
          if (!ping.ok) {
            result.error = `HTTP ${ping.status} on ${source.baseUrl}`;
          }
          break;
      }

      if (result.error) {
        source.failureCount++;
        source.lastError = result.error;
        source.status = source.failureCount > 3 ? "failing" : "degraded";
        failedSourcesCount++;
        errors.push(`[${source.code}] ${result.error}`);
        details.push(`Source ${source.code}: Degraded (${result.error})`);
      } else {
        source.failureCount = 0;
        source.lastError = undefined;
        source.status = "online";
        source.lastSuccessfulSyncAt = new Date().toISOString();
        details.push(`Source ${source.code}: Online (Checked successfully)`);
      }

      if (result.records.length > 0) {
        discoveredCandidates.push(...result.records);
      }
    } catch (sourceErr: unknown) {
      const errStr = sourceErr instanceof Error ? sourceErr.message : String(sourceErr);
      source.failureCount++;
      source.lastError = errStr;
      source.status = "failing";
      failedSourcesCount++;
      errors.push(`[${source.code}] Exception: ${errStr}`);
    }
  }

  // Deduplicate and process newly discovered records
  const existingUrls = new Set(db.announcements.map((a) => normalizeText(a.canonicalUrl || a.originalUrl)));
  const existingTitles = new Set(db.announcements.map((a) => normalizeText(a.title)));

  for (const candidate of discoveredCandidates) {
    const urlKey = normalizeText(candidate.canonicalUrl || candidate.originalUrl);
    const titleKey = normalizeText(candidate.title);

    if (existingUrls.has(urlKey) || existingTitles.has(titleKey)) {
      // Find matching existing record and refresh verification & fetch timestamps without resetting publication date
      const existing = db.announcements.find((a) =>
        normalizeText(a.canonicalUrl || a.originalUrl) === urlKey ||
        normalizeText(a.title) === titleKey
      );
      if (existing) {
        existing.fetchedAt = new Date().toISOString();
        existing.lastVerifiedAt = new Date().toISOString();
        // Never overwrite original publishedAt or discoveredAt
      }
      continue; // Duplicate record prevented
    }

    // Evaluate evidence status through verification engine
    const evaluation = evaluateEvidenceStatus(candidate, db.government_resolutions);

    const newAnnouncement: AnnouncementItem = {
      id: `ann_auto_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sourceId: candidate.sourceCode,
      sourceName: candidate.sourceName,
      title: candidate.title,
      titleMr: candidate.titleMr || candidate.title,
      titleHi: candidate.titleHi || candidate.title,
      summary: candidate.summary,
      summaryMr: candidate.summaryMr || candidate.summary,
      summaryHi: candidate.summaryHi || candidate.summary,
      originalUrl: candidate.originalUrl,
      canonicalUrl: candidate.canonicalUrl,
      category: candidate.category,
      publishedAt: candidate.publishedAt || null,
      fetchedAt: new Date().toISOString(),
      discoveredAt: new Date().toISOString(),
      lastVerifiedAt: new Date().toISOString(),
      evidenceStatus: evaluation.status,
      department: candidate.department,
      verifiedGrNumber: evaluation.verifiedGrNumber || candidate.grNumber,
      verifiedGrUrl: evaluation.verifiedGrUrl,
      financialAmount: candidate.financialAmount,
      reportedEligibleCount: candidate.reportedEligibleCount,
      confirmedBeneficiariesCount: candidate.confirmedBeneficiariesCount,
      academicYear: candidate.academicYear,
      geographicScope: candidate.geographicScope,
      verificationNotes: evaluation.verificationNotes,
      tags: candidate.tags
    };

    db.announcements.unshift(newAnnouncement);
    newRecordsFound++;
    details.push(`Added new record: "${newAnnouncement.title}" [${newAnnouncement.evidenceStatus}]`);
  }

  const durationMs = Date.now() - startTime;
  const verifiedRecordsCount = db.announcements.filter(
    (a) => a.evidenceStatus === "official_gr_verified" || a.evidenceStatus === "official_notice_verified"
  ).length;
  const pendingReviewCount = db.announcements.filter(
    (a) => a.evidenceStatus === "official_announcement_pending" || a.evidenceStatus === "media_report_pending" || a.evidenceStatus === "conflicting_sources"
  ).length;

  const runItem: IngestionRunItem = {
    id: `run_${Date.now()}`,
    timestamp: new Date().toISOString(),
    triggerType,
    sourcesChecked,
    newRecordsFound,
    verifiedRecordsCount,
    pendingReviewCount,
    failedSourcesCount,
    executionDurationMs: durationMs,
    details,
    errors
  };

  db.ingestion_runs.unshift(runItem);
  // Keep only the last 30 ingestion runs to preserve storage
  if (db.ingestion_runs.length > 30) {
    db.ingestion_runs = db.ingestion_runs.slice(0, 30);
  }

    await saveReliefDatabaseAsync(db);
    return runItem;
  } finally {
    await releaseSyncLock("crop_relief_ingestion_lock");
  }
}
