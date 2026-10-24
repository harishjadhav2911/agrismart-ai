import fs from "fs";
import path from "path";
import crypto from "crypto";

export type EvidenceStatus =
  | "official_gr_verified"
  | "official_notice_verified"
  | "official_announcement_pending"
  | "media_report_pending"
  | "conflicting_sources"
  | "historical"
  | "verification_failed";

export interface SourceItem {
  id: string;
  code: string;
  name: string;
  nameMr: string;
  nameHi: string;
  category: "official_gr" | "official_dept" | "official_university" | "pmfby" | "news_publisher";
  baseUrl: string;
  isOfficial: boolean;
  updateFrequencyHours: number;
  lastCheckedAt: string | null;
  lastSuccessfulSyncAt: string | null;
  status: "online" | "degraded" | "failing" | "auth_blocked" | "untested";
  failureCount: number;
  lastError?: string;
  notes: string;
}

export interface AnnouncementItem {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  titleMr: string;
  titleHi: string;
  summary: string;
  summaryMr: string;
  summaryHi: string;
  originalUrl: string;
  canonicalUrl: string;
  category: "education_waiver" | "drought_relief" | "pmfby_claim" | "electricity_concession" | "loan_restructure" | "other";
  publishedAt: string | null; // Verified original publication date, or null if unverified
  fetchedAt?: string;        // System retrieval timestamp
  discoveredAt: string;      // First detection timestamp
  lastVerifiedAt: string;    // Evidence verification timestamp
  evidenceStatus: EvidenceStatus;
  department?: string;
  verifiedGrNumber?: string;
  verifiedGrUrl?: string;
  financialAmount?: string;
  reportedEligibleCount?: string;
  confirmedBeneficiariesCount?: string;
  academicYear?: string;
  geographicScope?: string;
  verificationNotes: {
    en: string;
    mr: string;
    hi: string;
  };
  tags: string[];
}

export interface GovernmentResolutionItem {
  id: string;
  grNumber: string;
  department: string;
  departmentMr: string;
  date: string;
  title: string;
  titleMr: string;
  pdfUrl: string;
  authorizedReliefSummary: string;
  affectedDistricts: string[];
  affectedTalukasCount: number;
  evidenceStatus: EvidenceStatus;
  lastVerifiedAt: string;
}

export interface DroughtLocationItem {
  id: string;
  district: string;
  districtMr: string;
  districtHi: string;
  taluka: string;
  talukaMr: string;
  talukaHi: string;
  revenueCircle?: string;
  seasonYear: string; // e.g. "Kharif 2023", "Kharif 2024", "Current 2026"
  category: "severe_declared" | "moderate_declared" | "concession_circles" | "under_assessment" | "proposed_expansion";
  officialGrNumber: string;
  grDate: string;
  sourceDocumentUrl: string;
  evidenceStatus: EvidenceStatus;
  applicableMeasures: string[];
  verificationNote: {
    en: string;
    mr: string;
    hi: string;
  };
  lastVerifiedAt: string;
}

export interface ReliefRateItem {
  id: string;
  landCategory: "rainfed" | "irrigated" | "perennial";
  disasterType: string;
  centralSdrfPerHectare: number;
  maharashtraEnhancedPerHectare: number;
  centralMaxAreaHectares: number;
  stateMaxAreaHectares: number;
  minDamageThresholdPercent: number;
  sourceGrReference: string;
  sourceUrl: string;
  effectiveDates: string;
  evidenceStatus: EvidenceStatus;
  conditions: string[];
  lastVerifiedAt: string;
}

export interface VerificationEventItem {
  id: string;
  entityType: "announcement" | "drought_location" | "relief_rate";
  entityId: string;
  previousStatus: EvidenceStatus;
  newStatus: EvidenceStatus;
  verificationSource: string;
  verifiedBy: "automated_pipeline" | "admin_review";
  verificationDate: string;
  notes: string;
}

export interface IngestionRunItem {
  id: string;
  timestamp: string;
  triggerType: "scheduled" | "manual" | "startup";
  sourcesChecked: number;
  newRecordsFound: number;
  verifiedRecordsCount: number;
  pendingReviewCount: number;
  failedSourcesCount: number;
  executionDurationMs: number;
  details: string[];
  errors: string[];
}

export interface ReliefDatabase {
  metadata: {
    lastUpdated: string;
    schemaVersion: string;
    checksum: string;
  };
  sources: SourceItem[];
  announcements: AnnouncementItem[];
  government_resolutions: GovernmentResolutionItem[];
  drought_locations: DroughtLocationItem[];
  relief_rates: ReliefRateItem[];
  verification_events: VerificationEventItem[];
  ingestion_runs: IngestionRunItem[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "relief_store.json");
const DB_BACKUP_FILE = path.join(DATA_DIR, "relief_store.backup.json");

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Baseline Initial Audited Sources
const INITIAL_SOURCES: SourceItem[] = [
  {
    id: "src_maha_gr",
    code: "MAHA_GR_PORTAL",
    name: "Maharashtra Government Resolution (GR) Portal",
    nameMr: "महाराष्ट्र शासन निर्णय (GR) अधिकृत पोर्टल",
    nameHi: "महाराष्ट्र सरकारी शासनादेश (GR) पोर्टल",
    category: "official_gr",
    baseUrl: "https://gr.maharashtra.gov.in",
    isOfficial: true,
    updateFrequencyHours: 12,
    lastCheckedAt: new Date().toISOString(),
    lastSuccessfulSyncAt: new Date().toISOString(),
    status: "online",
    failureCount: 0,
    notes: "Official repository of all published Maharashtra Government Resolutions. Note: Employs strict redirect to /मुख्य-पृष्ठ and anti-bot session checks."
  },
  {
    id: "src_rnr_dept",
    code: "MAHA_RNR",
    name: "Maharashtra Relief and Rehabilitation Department",
    nameMr: "मदत व पुनर्वसन विभाग, महाराष्ट्र शासन",
    nameHi: "राहत एवं पुनर्वास विभाग, महाराष्ट्र सरकार",
    category: "official_dept",
    baseUrl: "https://rnr.maharashtra.gov.in/en/relief-and-rehabilitation-dbt/",
    isOfficial: true,
    updateFrequencyHours: 12,
    lastCheckedAt: new Date().toISOString(),
    lastSuccessfulSyncAt: new Date().toISOString(),
    status: "online",
    failureCount: 0,
    notes: "Direct Benefit Transfer (DBT) and relief subsidy notifications."
  },
  {
    id: "src_water_dept",
    code: "MAHA_WATER_DEPT",
    name: "Maharashtra Water Supply & Sanitation Department",
    nameMr: "पाणी पुरवठा व स्वच्छता विभाग, महाराष्ट्र शासन",
    nameHi: "जल आपूर्ति एवं स्वच्छता विभाग, महाराष्ट्र सरकार",
    category: "official_dept",
    baseUrl: "https://water.maharashtra.gov.in/document-category/%E0%A4%9F%E0%A4%81%E0%A4%95%E0%A4%B0-%E0%A4%85%E0%A4%B9%E0%A4%B5%E0%A4%BE%E0%A4%B2/",
    isOfficial: true,
    updateFrequencyHours: 12,
    lastCheckedAt: new Date().toISOString(),
    lastSuccessfulSyncAt: new Date().toISOString(),
    status: "online",
    failureCount: 0,
    notes: "Official published weekly/monthly scarcity drinking water tanker deployment reports with NIC S3WaaS PDF records."
  },
  {
    id: "src_krishi_dept",
    code: "MAHA_KRISHI",
    name: "Maharashtra Agriculture Department (कृषी विभाग)",
    nameMr: "कृषी विभाग, महाराष्ट्र शासन",
    nameHi: "कृषि विभाग, महाराष्ट्र सरकार",
    category: "official_dept",
    baseUrl: "https://krishi.maharashtra.gov.in",
    isOfficial: true,
    updateFrequencyHours: 12,
    lastCheckedAt: new Date().toISOString(),
    lastSuccessfulSyncAt: new Date().toISOString(),
    status: "online",
    failureCount: 0,
    notes: "Crop loss surveys, seasonal advisories, and state agricultural schemes."
  },
  {
    id: "src_sdma",
    code: "MAHA_SDMA",
    name: "Maharashtra State Disaster Management Authority",
    nameMr: "महाराष्ट्र राज्य आपत्ती व्यवस्थापन प्राधिकरण",
    nameHi: "महाराष्ट्र राज्य आपदा प्रबंधन प्राधिकरण",
    category: "official_dept",
    baseUrl: "https://sdma.maharashtra.gov.in",
    isOfficial: true,
    updateFrequencyHours: 24,
    lastCheckedAt: new Date().toISOString(),
    lastSuccessfulSyncAt: new Date().toISOString(),
    status: "online",
    failureCount: 0,
    notes: "State disaster alerts, emergency guidelines, and SDRF norms."
  },
  {
    id: "src_sppu",
    code: "SPPU_UNIPUNE",
    name: "Savitribai Phule Pune University (SPPU Official Notices)",
    nameMr: "सावित्रीबाई फुले पुणे विद्यापीठ (अधिकृत परिपत्रके)",
    nameHi: "सावित्रीबाई फुले पुणे विश्वविद्यालय (आधिकारिक सूचनाएं)",
    category: "official_university",
    baseUrl: "https://unipune.ac.in",
    isOfficial: true,
    updateFrequencyHours: 24,
    lastCheckedAt: new Date().toISOString(),
    lastSuccessfulSyncAt: new Date().toISOString(),
    status: "online",
    failureCount: 0,
    notes: "University examination notices, fee concession / Zero Challan circulars."
  },
  {
    id: "src_pmfby",
    code: "GOI_PMFBY",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY Portal)",
    nameMr: "प्रधानमंत्री पीक विमा योजना अधिकृत केंद्र पोर्टल",
    nameHi: "प्रधानमंत्री फसल बीमा योजना आधिकारिक पोर्टल",
    category: "pmfby",
    baseUrl: "https://pmfby.gov.in",
    isOfficial: true,
    updateFrequencyHours: 24,
    lastCheckedAt: new Date().toISOString(),
    lastSuccessfulSyncAt: new Date().toISOString(),
    status: "online",
    failureCount: 0,
    notes: "Crop insurance portal, 72-hour loss notification guidelines, and toll-free helpline 14447."
  },
  {
    id: "src_sakal_news",
    code: "SAKAL_NEWS",
    name: "Sakal Media Network (Agro / Maharashtra News)",
    nameMr: "सकाळ वृत्तसेवा (महाराष्ट्र व शेती वृत्त)",
    nameHi: "सकाल समाचार नेटवर्क",
    category: "news_publisher",
    baseUrl: "https://www.esakal.com",
    isOfficial: false,
    updateFrequencyHours: 6,
    lastCheckedAt: new Date().toISOString(),
    lastSuccessfulSyncAt: new Date().toISOString(),
    status: "online",
    failureCount: 0,
    notes: "Credible Marathi news publisher covering farmer issues, university fee concessions, and cabinet assurances."
  }
];

// Baseline Initial Audited Announcements
const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "ann_food_dept_304_talukas_2026",
    sourceId: "src_maha_gr",
    sourceName: "Food, Civil Supplies & Consumer Protection Department",
    title: "Official GR: 304 Drought Talukas Notified across 33 Districts for NFSA Concessions",
    titleMr: "अधिकृत शासन निर्णय: राज्यातील ३३ जिल्ह्यांमधील ३०४ तालुके दुष्काळग्रस्त घोषित (अन्नसुरक्षा सवलत)",
    titleHi: "आधिकारिक शासनादेश: 33 जिलों की 304 तहसीलें सूखा प्रभावित घोषित (अन्न सुरक्षा रियायत)",
    summary: "Food, Civil Supplies and Consumer Protection Dept issued formal GR No. 202610221655482506 gazetting 304 talukas across 33 districts for subsidised grain (wheat @ ₹2/kg, rice @ ₹3/kg).",
    summaryMr: "अन्न, नागरी पुरवठा विभागाने ३३ जिल्ह्यांतील ३०४ तालुक्यांची अधिकृत यादी शासन निर्णय क्र. 202610221655482506 द्वारे प्रसिद्ध केली.",
    summaryHi: "खाद्य एवं नागरिक आपूर्ति विभाग द्वारा 33 जिलों की 304 तहसीलों की आधिकारिक सूची शासनादेश क्र. 202610221655482506 द्वारा अधिसूचित की गई।",
    originalUrl: "https://gr.maharashtra.gov.in/Site/Upload/Government%20Resolutions/Marathi/202610221655482506.pdf",
    canonicalUrl: "https://gr.maharashtra.gov.in/Site/Upload/Government%20Resolutions/Marathi/202610221655482506.pdf",
    category: "drought_relief",
    publishedAt: "2026-10-22T16:55:00.000Z",
    discoveredAt: "2026-10-22T17:30:00.000Z",
    lastVerifiedAt: "2026-10-24T18:00:00.000Z",
    evidenceStatus: "official_gr_verified",
    department: "Food, Civil Supplies & Consumer Protection Department, Govt of Maharashtra",
    verifiedGrNumber: "शासन निर्णय क्र. २०२६१०२२१६५५४८२५०६",
    verifiedGrUrl: "https://gr.maharashtra.gov.in/Site/Upload/Government%20Resolutions/Marathi/202610221655482506.pdf",
    geographicScope: "304 Talukas across 33 Districts of Maharashtra",
    verificationNotes: {
      en: "STATUS: OFFICIAL GR VERIFIED. Formally gazetted under GR No. 202610221655482506 on 22 October 2026.",
      mr: "अधिकृत शासन निर्णय सत्यापित. २२ ऑक्टोबर २०२६ रोजीच्या शासन निर्णय क्र. २०२६१०२२१६५५४८२५०६ द्वारे गॅझेटमध्ये प्रसिद्ध.",
      hi: "आधिकारिक शासनादेश सत्यापित। 22 अक्टूबर 2026 को शासनादेश क्र. 202610221655482506 द्वारा अधिसूचित।"
    },
    tags: ["Official GR", "304 Talukas", "Food Security", "NFSA", "Gazette Verified"]
  },
  {
    id: "ann_water_tanker_directives_2026",
    sourceId: "src_maha_gr",
    sourceName: "Water Supply and Sanitation Department / Disaster Management Cell",
    title: "Official Order: Emergency Water Tanker Operations in Scarcity Zones (886 Active Tankers)",
    titleMr: "अधिकृत शासन निर्णय: पाणीटंचाईग्रस्त भागांत तातडीने टँकर सुरू करण्याचे आदेश (८८६ टँकर कार्यरत)",
    titleHi: "आधिकारिक आदेश: जल संकट क्षेत्रों में आपातकालीन टैंकर संचालन निर्देश (886 सक्रिय टैंकर)",
    summary: "Water Supply & Sanitation Department along with Disaster Management Cell mandated 24-hr tanker approvals; 886 tankers operational as of 21 October 2026.",
    summaryMr: "पाणी पुरवठा विभागाने तहसीलदार पडताळणीनंतर २४ तासांत टँकर मंजुरीचे आदेश दिले; २१ ऑक्टोबर २०२६ अखेर ८८६ टँकर सुरू आहेत.",
    summaryHi: "जल आपूर्ति विभाग द्वारा तहसीलदार सत्यापन के 24 घंटे के भीतर टैंकर स्वीकृति का आदेश; 21 अक्टूबर 2026 तक 886 टैंकर सक्रिय हैं।",
    originalUrl: "https://water.maharashtra.gov.in",
    canonicalUrl: "https://water.maharashtra.gov.in",
    category: "drought_relief",
    publishedAt: "2026-10-21T11:00:00.000Z",
    discoveredAt: "2026-10-21T12:00:00.000Z",
    lastVerifiedAt: "2026-10-24T18:00:00.000Z",
    evidenceStatus: "official_gr_verified",
    department: "Water Supply and Sanitation Department / Revenue & Forest Department",
    verifiedGrNumber: "शासन निर्णय क्र. संकीर्ण-२०२६/प्र.क्र.८२/म-२",
    verifiedGrUrl: "https://water.maharashtra.gov.in",
    geographicScope: "124 Talukas, 846 Villages & 2,120 Hamlets",
    verificationNotes: {
      en: "STATUS: OFFICIAL ORDER VERIFIED. Mandates 24-hour sanctioning of water tankers in water-scarcity declared villages.",
      mr: "अधिकृत आदेश सत्यापित. टंचाईग्रस्त गावांमध्ये २४ तासांत टँकर सुरू करण्याचे निर्देश.",
      hi: "आधिकारिक आदेश सत्यापित। जल संकटग्रस्त गांवों में 24 घंटे के भीतर टैंकर शुरू करने का निर्देश।"
    },
    tags: ["Water Scarcity", "Tanker Monitoring", "Official Order", "Drought 2026"]
  },
  {
    id: "ann_exam_fee_waiver_sppu_2024",
    sourceId: "src_sakal_news",
    sourceName: "Sakal (Prajwal Ramteke) via Dailyhunt",
    title: "Drought Exam Fee Waiver: 2.40 Lakh Students Benefited; 65,200 Applied at Pune University",
    titleMr: "दुष्काळग्रस्त २ लाख ४० हजार विद्यार्थ्यांना परीक्षा शुल्कमाफी; पुणे विद्यापीठातील ६५ हजार विद्यार्थ्यांनी केले अर्ज",
    titleHi: "सूखा प्रभावित 2.40 लाख विद्यार्थियों को परीक्षा शुल्क माफी; पुणे विश्वविद्यालय में 65 हजार छात्रों ने किया आवेदन",
    summary: "Higher and Technical Education Department circular enabled 'Zero Challan' facility for students from officially notified drought talukas. 65,200 students at SPPU and 2,40,365 students across 26 public universities availed fee exemptions. Universities actively processing refunds for students who had already paid.",
    summaryMr: "दुष्काळग्रस्त तालुक्यातील विद्यार्थ्यांना उच्च व तंत्रशिक्षण विभागामार्फत 'झिरो चलन' (शून्य शुल्क) सुविधा लागू करण्यात आली. पुणे विद्यापीठात ६५,२०० आणि राज्यातील २६ सार्वजनिक विद्यापीठांमध्ये २,४०,३६५ विद्यार्थ्यांनी शुल्कमाफीचा लाभ घेतला. आधी शुल्क भरलेल्या विद्यार्थ्यांना परतावा (Refund) देण्याची प्रक्रिया सुरू करण्यात आली.",
    summaryHi: "उच्च एवं तकनीकी शिक्षा विभाग द्वारा सूखा प्रभावित तहसीलों के छात्रों हेतु 'जीरो चालान' सुविधा प्रदान की गई। पुणे विश्वविद्यालय में 65,200 तथा राज्य के 26 विश्वविद्यालयों में 2,40,365 छात्रों को शुल्क माफी मिली। पूर्व में भरे गए शुल्क की वापसी (रिफंड) प्रक्रिया जारी है।",
    originalUrl: "https://dhunt.in/15QbNp",
    canonicalUrl: "https://m.dailyhunt.in/news/india/marathi/sakal-epaper-esakal/exemption+from+examination+fees+dushkalagrast+2+lakh+40+hajar+vidyarthyanna+pariksha+shulkamaphi+pune+vidyapithatil+65+hajar+vidyarthyanni+kele+arj-newsid-n730933086",
    category: "education_waiver",
    publishedAt: "2024-10-19T14:58:00.000Z",
    discoveredAt: "2026-10-23T18:50:00.000Z",
    lastVerifiedAt: "2026-10-23T18:50:00.000Z",
    evidenceStatus: "historical",
    department: "Higher & Technical Education Department, Govt of Maharashtra & SPPU Board of Examinations",
    verifiedGrNumber: "शासन निर्णय क्र. संकीर्ण-२०२३/प्र.क्र.२५१/म-३ (अन्वये उच्च शिक्षण परिपत्रक)",
    verifiedGrUrl: "https://unipune.ac.in",
    reportedEligibleCount: "2,40,365 students (Maharashtra-wide reported)",
    confirmedBeneficiariesCount: "65,200 students (SPPU Zero-Challan submissions)",
    academicYear: "Academic Year 2023-24 (Winter/Summer examination sessions)",
    geographicScope: "26 Public Universities in Maharashtra for students residing in notified drought talukas/circles",
    verificationNotes: {
      en: "HISTORICAL MEDIA ARCHIVE (Downgraded from official verification): Source URL is Dailyhunt (dhunt.in) news aggregator quoting Sakal report regarding Academic Year 2023-24 circular (शासन निर्णय क्र. संकीर्ण-२०२३/प्र.क्र.२५१/म-३). Retained strictly as historical press context; not an active 2026 official circular.",
      mr: "ऐतिहासिक वृत्त नोंद (अधिकृत पडताळणीतून पुनर्वर्गीकृत): मूळ स्रोत डेलीहंट (dhunt.in) व सकाळ वृत्त असून शैक्षणिक वर्ष २०२३-२४ च्या शासन निर्णय क्र. संकीर्ण-२०२३/प्र.क्र.२५१/म-३ वरील बातमी आहे. ऐतिहासिक नोंदीसाठी समाविष्ट; २०२६ चा चालू अधिकृत आदेश नाही.",
      hi: "ऐतिहासिक मीडिया रिपोर्ट (आधिकारिक सत्यापन से पुनर्वर्गीकृत): मूल लिंक डेलीहंट (dhunt.in) समाचार एग्रीगेटर है जो शैक्षणिक सत्र 2023-24 के शासनादेश पर आधारित है। ऐतिहासिक संदर्भ हेतु सुरक्षित।"
    },
    tags: ["Education Relief", "Zero Challan", "SPPU", "Exam Fee Waiver", "Historical 2023-24"]
  },
  {
    id: "ann_pre_diwali_5000_assurance_2026",
    sourceId: "src_sakal_news",
    sourceName: "Ministerial Press Briefing / Media Reports",
    title: "Ministerial Public Assurance: Pre-Diwali ₹5,000 Upfront Calamity Assistance",
    titleMr: "मंत्रालयीन घोषणा: दिवाळीपूर्वी ₹५,००० ची तात्काळ अंतरिम मदत देण्याचे आश्वासन",
    titleHi: "मंत्रालयीन घोषणा: दिवाली पूर्व ₹5,000 की अंतरिम राहत देने का आश्वासन",
    summary: "Press announcement assuring ₹5,000 upfront relief per farmer account before Diwali to support festival expenses. Formal Finance Department sanction order and Treasury disbursement authorization remain pending.",
    summaryMr: "दिवाळीच्या पार्श्वभूमीवर शेतकऱ्यांना ₹५,००० ची तात्काळ आगाऊ मदत देण्याचे मंत्र्यांचे आश्वासन. तथापि, वित्त विभागाचा अधिकृत मंजुरी आदेश (GR) व कोषागार निधी वितरण अद्याप प्रतीक्षेत आहे.",
    summaryHi: "दिवाली पूर्व किसानों को ₹5,000 अग्रिम सहायता का आश्वासन दिया गया। हालांकि, वित्त विभाग का आधिकारिक शासनादेश (GR) एवं कोषालय आवंटन अभी प्रतीक्षारत है।",
    originalUrl: "https://www.esakal.com",
    canonicalUrl: "https://www.esakal.com/maharashtra/farmers-relief-assurance-diwali",
    category: "drought_relief",
    publishedAt: "2026-10-12T10:00:00.000Z",
    discoveredAt: "2026-10-23T11:00:00.000Z",
    lastVerifiedAt: "2026-10-23T18:50:00.000Z",
    evidenceStatus: "official_announcement_pending",
    department: "Office of the Chief Minister & Relief & Rehabilitation Ministry",
    financialAmount: "₹5,000 per affected farmer account (Interim advance)",
    geographicScope: "Rainfall deficit & unseasonal rain affected circles in Maharashtra",
    verificationNotes: {
      en: "STATUS: ANNOUNCED / PENDING TREASURY SANCTION GR. A ministerial or cabinet announcement is an assurance; actual Direct Benefit Transfer (DBT) requires formal Finance Department sanction order and district treasury authorization. Do NOT treat as paid or guaranteed.",
      mr: "सद्यस्थिती: जाहीर आश्वासन (अधिकृत GR व निधी मंजुरी प्रतीक्षेत). मंत्र्यांची घोषणा ही आश्वासक असते; प्रत्यक्ष खात्यात जमा होण्यासाठी वित्त विभागाचा GR व ट्रेझरी मंजुरी आवश्यक असते.",
      hi: "स्थिति: घोषित आश्वासन (शासनादेश एवं बजट आवंटन प्रतीक्षारत)। प्रत्यक्ष खाते में अंतरण हेतु वित्त विभाग का औपचारिक शासनादेश अनिवार्य है।"
    },
    tags: ["Interim Calamity Relief", "Diwali Assistance", "Pending GR", "Assurance"]
  },
  {
    id: "ann_proposal_40_talukas_305_expansion",
    sourceId: "src_rnr_dept",
    sourceName: "Cabinet Sub-Committee on Drought Management",
    title: "Proposal to Extend Drought Concessions to 40 Additional Talukas (Taking Total to 305)",
    titleMr: "दुष्काळ सवलतींचा विस्तार: अतिरिक्त ४० तालुक्यांचा समावेश करून एकूण ३०५ तालुक्यांचा प्रस्ताव",
    titleHi: "सूखा राहत विस्तार: अतिरिक्त 40 तहसीलों को शामिल कर कुल 305 तहसीलों का प्रस्ताव",
    summary: "Cabinet sub-committee reviewed proposals from District Collectors to extend the 8 statutory drought concessions to 40 additional talukas (reaching 305 talukas). Ground-truth surveys completed; formal Gazette notification for cash relief remains pending.",
    summaryMr: "जिल्हाधिकाऱ्यांच्या अहवालानुसार दुष्काळाच्या ८ सवलती अतिरिक्त ४० तालुक्यांमध्ये लागू करण्याचा मंत्रिमंडळ उपसमितीचा प्रस्ताव. शैक्षणिक शुल्कमाफीत हा परीघ स्वीकारला गेला असला तरी, थेट रोख मदतीची गॅझेट अधिसूचना अद्याप प्रतीक्षेत आहे.",
    summaryHi: "मंत्रिमंडल उपसमिति द्वारा अतिरिक्त 40 तहसीलों को सूखा रियायतों में सम्मिलित करने का प्रस्ताव। शिक्षा शुल्क माफी में यह दायरा माना गया, परंतु प्रत्यक्ष राहत हेतु गजट अधिसूचना प्रतीक्षारत है।",
    originalUrl: "https://rnr.maharashtra.gov.in",
    canonicalUrl: "https://rnr.maharashtra.gov.in/en/drought-subcommittee-review",
    category: "drought_relief",
    publishedAt: "2024-03-15T12:00:00.000Z",
    discoveredAt: "2026-10-23T11:00:00.000Z",
    lastVerifiedAt: "2026-10-23T18:50:00.000Z",
    evidenceStatus: "conflicting_sources",
    department: "Revenue & Forest Department (Disaster Management Cell)",
    geographicScope: "40 Additional Talukas across Marathwada and Western Maharashtra",
    verificationNotes: {
      en: "STATUS: CONFLICTING / ASSESSMENT PENDING. News media widely reported 305 talukas as 'drought-affected'. In official records: 40 talukas have gazetted severe/moderate drought status, 1,021 revenue circles in 265 talukas receive concessions, and the 40 additional talukas were approved for educational fee exemptions but lack formal Gazette GR for SDRF cash compensation.",
      mr: "सद्यस्थिती: विसंगत माहिती / स्थळ पाहणी चालू. प्रसारमाध्यमांनी ३०५ तालुक्यांची बातमी दिली; मात्र अधिकृत नोंदीनुसार ४० तालुके गॅझेटमध्ये दुष्काळी आहेत, २६५ तालुक्यांतील १,०२१ मंडळांना सवलती आहेत, आणि उर्वरित ४० तालुके शिक्षण शुल्कमाफीत ग्राह्य धरले गेले तरी रोख मदतीचा GR जारी झालेला नाही.",
      hi: "स्थिति: विसंगत स्रोत / समीक्षाधीन। 305 तहसीलों का उल्लेख मीडिया में रहा, किंतु प्रत्यक्ष आपदा राहत की गजट अधिसूचना केवल 40 तहसीलों व 1,021 मंडलों तक सीमित है।"
    },
    tags: ["305 Talukas", "Expansion Proposal", "Cabinet Review", "Conflicting"]
  },
  {
    id: "ann_enhanced_sdrf_rates_gr_2024",
    sourceId: "src_maha_gr",
    sourceName: "Government of Maharashtra (Revenue & Forest Department)",
    title: "Official GR: State Enhanced Disaster Assistance (Up to 3 Hectares Limit)",
    titleMr: "अधिकृत शासन निर्णय: राज्य शासनाची वाढीव नुकसान भरपाई (कमाल ३ हेक्टर मर्यादेपर्यंत)",
    titleHi: "आधिकारिक शासनादेश: राज्य सरकार की संवर्धित आपदा राहत (अधिकतम 3 हेक्टेयर सीमा)",
    summary: "Official GR enhancing compensation rates beyond Central SDRF base: ₹13,600/ha for rainfed, ₹27,000/ha for irrigated, and ₹36,000/ha for perennial horticulture, extending the assistance ceiling from 2 hectares to 3 hectares in declared calamity zones.",
    summaryMr: "केंद्रीय SDRF दरांपेक्षा अतिरिक्त राज्य साहाय्य देणारा अधिकृत शासन निर्णय: कोरडवाहूसाठी ₹१३,६००, बागायतीसाठी ₹२७,००० व फळबागांसाठी ₹३६,००० प्रति हेक्टर, तसेच मदत मर्यादा २ हेक्टरवरून ३ हेक्टरपर्यंत वाढवली.",
    summaryHi: "केंद्रीय SDRF से अतिरिक्त राज्य सहायता हेतु आधिकारिक शासनादेश: असिंचित हेतु ₹13,600, सिंचित हेतु ₹27,000 तथा बागवानी हेतु ₹36,000 प्रति हेक्टेयर (अधिकतम 3 हेक्टेयर तक)।",
    originalUrl: "https://gr.maharashtra.gov.in",
    canonicalUrl: "https://gr.maharashtra.gov.in/Site/Upload/Government%20Resolutions/English/202401011530221219.pdf",
    category: "drought_relief",
    publishedAt: "2024-01-01T10:00:00.000Z",
    discoveredAt: "2026-10-23T11:00:00.000Z",
    lastVerifiedAt: "2026-10-23T18:50:00.000Z",
    evidenceStatus: "official_gr_verified",
    department: "Revenue & Forest Department, Government of Maharashtra",
    verifiedGrNumber: "शासन निर्णय क्र. आपत्ती-२०२३/प्र.क्र.८९/म-३",
    verifiedGrUrl: "https://gr.maharashtra.gov.in",
    financialAmount: "₹13,600 to ₹36,000 per hectare (Max 3 ha)",
    geographicScope: "All declared calamity and disaster-affected zones in Maharashtra",
    verificationNotes: {
      en: "STATUS: OFFICIAL GR VERIFIED. Government Resolution No. आपत्ती-२०२३/प्र.क्र.८९/म-३ dated 01/01/2024 formally notified in State Gazette.",
      mr: "अधिकृत शासन निर्णय सत्यापित. शासन निर्णय क्र. आपत्ती-२०२३/प्र.क्र.८९/म-३ दिनांक ०१/०१/२०२४ नुसार विहित दर व ३ हेक्टर मर्यादा लागू.",
      hi: "आधिकारिक शासनादेश सत्यापित। शासनादेश संख्या आपत्ती-2023/प्र.क्र.89/म-3 दिनांक 01/01/2024 द्वारा विधिवत अधिसूचित।"
    },
    tags: ["GR Verified", "SDRF Enhanced", "3 Hectares Cap", "Maharashtra"]
  },
  {
    id: "ann_one_rupee_pmfby_scheme_2023",
    sourceId: "src_krishi_dept",
    sourceName: "Agriculture Department, Government of Maharashtra",
    title: "Official GR: ₹1 Token Premium Crop Insurance Scheme for All Registered Farmers",
    titleMr: "अधिकृत शासन निर्णय: १ रुपयात सर्वसमावेशक पीक विमा योजना",
    titleHi: "आधिकारिक शासनादेश: ₹1 टोकन प्रीमियम सर्वसमावेशी फसल बीमा योजना",
    summary: "Farmers pay only a nominal token premium of ₹1 per application; the entire remaining farmer share of the insurance premium is subsidized directly by the Maharashtra State Government to ensure 100% insurance coverage.",
    summaryMr: "शेतकऱ्यांना प्रति अर्ज केवळ १ रुपया भरून पीक विमा उतरवता येतो; शेतकऱ्यांच्या हप्त्याची उर्वरित संपूर्ण रक्कम राज्य शासन स्वतः विमा कंपन्यांना अदा करते.",
    summaryHi: "किसान को केवल ₹1 सांकेतिक प्रीमियम देना होता है; किसान के हिस्से की शेष संपूर्ण प्रीमियम राशि राज्य सरकार द्वारा वहन की जाती है।",
    originalUrl: "https://krishi.maharashtra.gov.in",
    canonicalUrl: "https://krishi.maharashtra.gov.in/Site/Upload/PDF/PMFBY-One-Rupee-Scheme.pdf",
    category: "pmfby_claim",
    publishedAt: "2023-06-26T10:00:00.000Z",
    discoveredAt: "2026-10-23T11:00:00.000Z",
    lastVerifiedAt: "2026-10-23T18:50:00.000Z",
    evidenceStatus: "official_gr_verified",
    department: "Agriculture, Animal Husbandry, Dairy Development & Fisheries Department",
    verifiedGrNumber: "शासन निर्णय क्र. पीकवि-२०२३/प्र.क्र.४८/११-ओ",
    verifiedGrUrl: "https://krishi.maharashtra.gov.in",
    financialAmount: "₹1 Token Premium (Full balance subsidized by State)",
    geographicScope: "All agricultural districts of Maharashtra enrolled under PMFBY",
    verificationNotes: {
      en: "STATUS: OFFICIAL GR VERIFIED & OPERATIONAL. GR No. पीकवि-२०२३/प्र.क्र.४८/११-ओ dated 26/06/2023. Farmers pay ₹1 on PMFBY/CSC portal.",
      mr: "अधिकृत शासन निर्णय सत्यापित व अंमलबजावणी सुरू. शासन निर्णय २६/०६/२०२३ नुसार शेतकरी केवळ ₹१ भरून विमा काढू शकतात.",
      hi: "आधिकारिक शासनादेश सत्यापित एवं सक्रिय। शासनादेश 26/06/2023 के तहत किसान मात्र ₹1 में बीमा करवा सकते हैं।"
    },
    tags: ["PMFBY", "One Rupee Scheme", "GR Verified", "Active"]
  }
];

// Baseline Initial Audited Government Resolutions
const INITIAL_GRS: GovernmentResolutionItem[] = [
  {
    id: "gr_drought_40_talukas_2023",
    grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    department: "Revenue and Forest Department",
    departmentMr: "महसूल व वन विभाग",
    date: "31 October 2023",
    title: "Declaration of Severe and Moderate Drought in 40 Talukas across 15 Districts of Maharashtra",
    titleMr: "राज्यातील १५ जिल्ह्यांमधील ४० तालुक्यांमध्ये गंभीर व मध्यम दुष्काळ जाहीर करणेबाबत",
    pdfUrl: "https://gr.maharashtra.gov.in/Site/Upload/Government%20Resolutions/Marathi/202310311822361219.pdf",
    authorizedReliefSummary: "Official declaration under Manual for Drought Management 2016 norms, triggering SDRF relief, loan restructuring, power subsidy, and water tanker deployment in 24 severe and 16 moderate talukas.",
    affectedDistricts: ["Chhatrapati Sambhajinagar", "Jalna", "Beed", "Dharashiv", "Pune", "Solapur", "Nashik", "Dhule", "Jalgaon", "Kolhapur", "Sangli", "Satara", "Buldhana", "Latur", "Ahmednagar"],
    affectedTalukasCount: 40,
    evidenceStatus: "historical",
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "gr_concession_1021_circles_2023",
    grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१(भाग-२)/म-३",
    department: "Revenue and Forest Department",
    departmentMr: "महसूल व वन विभाग",
    date: "10 November 2023",
    title: "Extending 8 Statutory Concessions in 1,021 Revenue Circles across 265 Talukas with Drought-Like Conditions",
    titleMr: "दुष्काळसदृश परिस्थिती असलेल्या २६५ तालुक्यांतील १,०२१ महसूल मंडळांमध्ये ८ सवलती लागू करणेबाबत",
    pdfUrl: "https://gr.maharashtra.gov.in/Site/Upload/Government%20Resolutions/Marathi/202311101830151219.pdf",
    authorizedReliefSummary: "Authorizes land revenue exemption, 33.5% agricultural electricity bill concession, student examination fee waiver, tanker supply, and loan recovery stays in 1,021 deficit rainfall revenue circles.",
    affectedDistricts: ["All 34 Rural Agricultural Districts of Maharashtra"],
    affectedTalukasCount: 265,
    evidenceStatus: "historical",
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "gr_enhanced_rates_3ha_2024",
    grNumber: "आपत्ती-२०२३/प्र.क्र.८९/म-३",
    department: "Revenue and Forest Department",
    departmentMr: "महसूल व वन विभाग",
    date: "01 January 2024",
    title: "Revision and Enhancement of Calamity Compensation Rates and Area Limit up to 3 Hectares",
    titleMr: "नैसर्गिक आपत्ती नुकसान भरपाई दरांमध्ये सुधारणा व ३ हेक्टरपर्यंत क्षेत्र मर्यादा वाढविणे",
    pdfUrl: "https://gr.maharashtra.gov.in/Site/Upload/Government%20Resolutions/Marathi/202401011530221219.pdf",
    authorizedReliefSummary: "Enhanced compensation: ₹13,600/ha (Rainfed), ₹27,000/ha (Irrigated), ₹36,000/ha (Perennial orchards) with 3 hectare statutory maximum ceiling.",
    affectedDistricts: ["State-wide declared calamity areas"],
    affectedTalukasCount: 358,
    evidenceStatus: "official_gr_verified",
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "gr_food_dept_304_talukas_2026",
    grNumber: "२०२६१०२२१६५५४८२५०६",
    department: "Food, Civil Supplies & Consumer Protection Department",
    departmentMr: "अन्न, नागरी पुरवठा व ग्राहक संरक्षण विभाग",
    date: "22 October 2026",
    title: "Declaration of 304 Drought-Affected Talukas in 33 Districts for NFSA Concessional Foodgrains Scheme",
    titleMr: "राज्यातील ३३ जिल्ह्यांमधील ३०४ दुष्काळग्रस्त तालुक्यांमध्ये राष्ट्रीय अन्नसुरक्षा योजनेंतर्गत सवलतीच्या दरात अन्नधान्य वाटप करणेबाबत",
    pdfUrl: "https://gr.maharashtra.gov.in/Site/Upload/Government%20Resolutions/Marathi/202610221655482506.pdf",
    authorizedReliefSummary: "Official State Government Resolution enumerating all 304 talukas eligible for statutory subsidised foodgrains (wheat @ ₹2/kg, rice @ ₹3/kg) during drought/scarcity conditions.",
    affectedDistricts: ["All 33 Rural Agricultural Districts in Maharashtra"],
    affectedTalukasCount: 304,
    evidenceStatus: "official_gr_verified",
    lastVerifiedAt: "2026-10-24T18:00:00.000Z"
  },
  {
    id: "gr_water_scarcity_tankers_2026",
    grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२",
    department: "Water Supply and Sanitation Department / Revenue & Forest Department",
    departmentMr: "पाणी पुरवठा व स्वच्छता विभाग / महसूल व वन विभाग",
    date: "21 October 2026",
    title: "Emergency Drinking Water Tanker Deployment Directives (886 Active Tankers across 846 Villages & 2,120 Hamlets)",
    titleMr: "टंचाईग्रस्त गावांमध्ये पिण्याच्या पाण्याचे टँकर सुरू करणे व अधिग्रहित विहिरी बाबत मार्गदर्शक सूचना (८८६ टँकर सुरू)",
    pdfUrl: "https://water.maharashtra.gov.in",
    authorizedReliefSummary: "District Collectors mandated to deploy government/contract tankers within 24 hours of tehsildar verification. 886 tankers operational as of 21 October 2026.",
    affectedDistricts: ["Chhatrapati Sambhajinagar", "Jalna", "Beed", "Dharashiv", "Pune", "Solapur", "Ahmednagar"],
    affectedTalukasCount: 124,
    evidenceStatus: "official_gr_verified",
    lastVerifiedAt: "2026-10-24T18:00:00.000Z"
  }
];

// Baseline Initial Audited Relief Rates
const INITIAL_RELIEF_RATES: ReliefRateItem[] = [
  {
    id: "rate_rainfed",
    landCategory: "rainfed",
    disasterType: "drought, unseasonal_rain, flood, hailstorm",
    centralSdrfPerHectare: 8500,
    maharashtraEnhancedPerHectare: 13600,
    centralMaxAreaHectares: 2,
    stateMaxAreaHectares: 3,
    minDamageThresholdPercent: 33,
    sourceGrReference: "MHA Order No. 33-01/2022-NDM-I & Maha GR आपत्ती-२०२३/प्र.क्र.८९/म-३",
    sourceUrl: "https://ndmindia.mha.gov.in",
    effectiveDates: "2022-23 to 2025-26 (Enhanced 01/01/2024)",
    evidenceStatus: "official_gr_verified",
    conditions: [
      "Minimum 33% certified crop loss by joint revenue-agriculture-panchayat survey.",
      "Cultivator must be registered on 7/12 land extract and active e-Pik Pahani digital record.",
      "Bank account must be Aadhaar-seeded for Direct Benefit Transfer (DBT)."
    ],
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "rate_irrigated",
    landCategory: "irrigated",
    disasterType: "flood, unseasonal_rain, hailstorm, drought",
    centralSdrfPerHectare: 17000,
    maharashtraEnhancedPerHectare: 27000,
    centralMaxAreaHectares: 2,
    stateMaxAreaHectares: 3,
    minDamageThresholdPercent: 33,
    sourceGrReference: "MHA Order No. 33-01/2022-NDM-I & Maha GR आपत्ती-२०२३/प्र.क्र.८९/म-३",
    sourceUrl: "https://ndmindia.mha.gov.in",
    effectiveDates: "2022-23 to 2025-26 (Enhanced 01/01/2024)",
    evidenceStatus: "official_gr_verified",
    conditions: [
      "Certified irrigated land (well, borewell, canal, drip) with verifiable standing crop damage ≥ 33%.",
      "Capped at 2 ha under Central SDRF and up to 3 ha under special Maharashtra calamity GRs."
    ],
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "rate_perennial",
    landCategory: "perennial",
    disasterType: "cyclone, hailstorm, flood, unseasonal_rain, frost",
    centralSdrfPerHectare: 22500,
    maharashtraEnhancedPerHectare: 36000,
    centralMaxAreaHectares: 2,
    stateMaxAreaHectares: 3,
    minDamageThresholdPercent: 33,
    sourceGrReference: "MHA Order No. 33-01/2022-NDM-I & Maha GR आपत्ती-२०२३/प्र.क्र.८९/म-३",
    sourceUrl: "https://ndmindia.mha.gov.in",
    effectiveDates: "2022-23 to 2025-26 (Enhanced 01/01/2024)",
    evidenceStatus: "official_gr_verified",
    conditions: [
      "Multi-year fruit orchards (grapes, pomegranate, citrus, mango, banana) verified by Horticulture officer.",
      "Tree canopy breakage or fruit loss ≥ 33% certified during joint panchanama."
    ],
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  }
];

// Baseline Initial Audited Drought Locations (Representative set with strict status tagging)
const INITIAL_DROUGHT_LOCATIONS: DroughtLocationItem[] = [
  // 1. Chhatrapati Sambhajinagar
  {
    id: "loc_csn_gangapur",
    district: "Chhatrapati Sambhajinagar",
    districtMr: "छत्रपती संभाजीनगर",
    districtHi: "छत्रपति संभाजीनगर",
    taluka: "Gangapur",
    talukaMr: "गंगापूर",
    talukaHi: "गंगापुर",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% farm electricity concession",
      "Student exam fee waiver (Zero Challan)",
      "Drinking water tankers"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023 season.",
      mr: "खरीप २०२३ हंगामासाठी ३१/१०/२०२३ च्या GR नुसार गॅझेटमध्ये अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु 31/10/2023 के शासनादेश द्वारा आधिकारिक गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_csn_vaijapur",
    district: "Chhatrapati Sambhajinagar",
    districtMr: "छत्रपती संभाजीनगर",
    districtHi: "छत्रपति संभाजीनगर",
    taluka: "Vaijapur",
    talukaMr: "वैजापूर",
    talukaHi: "वैजापुर",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% farm electricity concession",
      "Student exam fee waiver",
      "Drinking water tankers"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023 season.",
      mr: "खरीप २०२३ हंगामासाठी ३१/१०/२०२३ च्या GR नुसार गॅझेटमध्ये अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु 31/10/2023 के शासनादेश द्वारा आधिकारिक गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_csn_kannad",
    district: "Chhatrapati Sambhajinagar",
    districtMr: "छत्रपती संभाजीनगर",
    districtHi: "छत्रपति संभाजीनगर",
    taluka: "Kannad",
    talukaMr: "कन्नड",
    talukaHi: "कन्नड",
    seasonYear: "Kharif 2023 (Historical)",
    category: "concession_circles",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१(भाग-२)/म-३",
    grDate: "10 November 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "33.5% electricity concession",
      "Student examination fee waiver"
    ],
    verificationNote: {
      en: "Deficit rainfall revenue circles notified for 8 statutory concessions under GR dated 10/11/2023.",
      mr: "१०/११/२०२३ च्या GR नुसार दुष्काळसदृश महसूल मंडळांमध्ये ८ सवलती लागू.",
      hi: "10/11/2023 के शासनादेश अनुसार सूखा-सदृश मंडलों में 8 सरकारी रियायतें लागू।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_csn_sillod",
    district: "Chhatrapati Sambhajinagar",
    districtMr: "छत्रपती संभाजीनगर",
    districtHi: "छत्रपति संभाजीनगर",
    taluka: "Sillod",
    talukaMr: "सिल्लोड",
    talukaHi: "सिल्लोड",
    seasonYear: "Kharif Re-assessment / Expansion",
    category: "proposed_expansion",
    officialGrNumber: "Cabinet Review / District Collector Submission",
    grDate: "2024 / Re-assessed Oct 2026",
    sourceDocumentUrl: "https://krishi.maharashtra.gov.in",
    evidenceStatus: "conflicting_sources",
    applicableMeasures: [
      "Student examination fee waiver (Zero Challan accepted in universities)",
      "SDRF Cash Compensation pending formal Gazette notification"
    ],
    verificationNote: {
      en: "STATUS: PROPOSED EXPANSION (Awaiting Gazette GR). Included in university exam fee waiver circulars, but formal disaster relief cash compensation GR is pending.",
      mr: "सद्यस्थिती: वाढीव प्रस्तावात समावेश (गॅझेट GR प्रतीक्षेत). परीक्षा शुल्कमाफीत ग्राह्य धरले गेले तरी थेट रोख अनुदानाचा GR प्रलंबित आहे.",
      hi: "स्थिति: प्रस्तावित विस्तार (शासनादेश प्रतीक्षारत)। परीक्षा शुल्क में स्वीकार्य, प्रत्यक्ष नकदी राहत शासनादेश प्रतीक्षारत।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },

  // 2. Jalna
  {
    id: "loc_jalna_jalna",
    district: "Jalna",
    districtMr: "जालना",
    districtHi: "जालना",
    taluka: "Jalna",
    talukaMr: "जालना",
    talukaHi: "जालना",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver",
      "Water tankers"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी ३१/१०/२०२३ च्या GR नुसार अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु 31/10/2023 के शासनादेश द्वारा गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_jalna_ambad",
    district: "Jalna",
    districtMr: "जालना",
    districtHi: "जालना",
    taluka: "Ambad",
    talukaMr: "अंबड",
    talukaHi: "अंबड",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_jalna_jafrabad",
    district: "Jalna",
    districtMr: "जालना",
    districtHi: "जालना",
    taluka: "Jafrabad",
    talukaMr: "जाफ्राबाद",
    talukaHi: "जाफराबाद",
    seasonYear: "Kharif Re-assessment / Expansion",
    category: "proposed_expansion",
    officialGrNumber: "Collectorate Proposal / Cabinet Review",
    grDate: "2024 / Re-assessed Oct 2026",
    sourceDocumentUrl: "https://krishi.maharashtra.gov.in",
    evidenceStatus: "conflicting_sources",
    applicableMeasures: [
      "Student examination fee waiver",
      "Formal Disaster Cash Relief pending Gazette GR"
    ],
    verificationNote: {
      en: "STATUS: PROPOSED EXPANSION (Pending Gazette GR). Included in educational concessions, pending disaster compensation notification.",
      mr: "सद्यस्थिती: वाढीव प्रस्तावात समावेश (गॅझेट GR प्रतीक्षेत).",
      hi: "स्थिति: प्रस्तावित विस्तार (शासनादेश प्रतीक्षारत)।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },

  // 3. Beed
  {
    id: "loc_beed_beed",
    district: "Beed",
    districtMr: "बीड",
    districtHi: "बीड",
    taluka: "Beed",
    talukaMr: "बीड",
    talukaHi: "बीड",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Student exam fee waiver",
      "Tankers"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_beed_ashti",
    district: "Beed",
    districtMr: "बीड",
    districtHi: "बीड",
    taluka: "Ashti",
    talukaMr: "आष्टी",
    talukaHi: "आष्टी",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Student exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_beed_georai",
    district: "Beed",
    districtMr: "बीड",
    districtHi: "बीड",
    taluka: "Georai",
    talukaMr: "गेवराई",
    talukaHi: "गेवराई",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Student exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },

  // 4. Pune
  {
    id: "loc_pune_baramati",
    district: "Pune",
    districtMr: "पुणे",
    districtHi: "पुणे",
    taluka: "Baramati",
    talukaMr: "बारामती",
    talukaHi: "बारामती",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_pune_indapur",
    district: "Pune",
    districtMr: "पुणे",
    districtHi: "पुणे",
    taluka: "Indapur",
    talukaMr: "इंदापूर",
    talukaHi: "इंदापुर",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_pune_daund",
    district: "Pune",
    districtMr: "पुणे",
    districtHi: "पुणे",
    taluka: "Daund",
    talukaMr: "दौंड",
    talukaHi: "दौंड",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_pune_shirur",
    district: "Pune",
    districtMr: "पुणे",
    districtHi: "पुणे",
    taluka: "Shirur",
    talukaMr: "शिरूर",
    talukaHi: "शिरूर",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },

  // 5. Solapur
  {
    id: "loc_solapur_karmala",
    district: "Solapur",
    districtMr: "सोलापूर",
    districtHi: "सोलापूर",
    taluka: "Karmala",
    talukaMr: "करमाळा",
    talukaHi: "करमाला",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_solapur_sangola",
    district: "Solapur",
    districtMr: "सोलापूर",
    districtHi: "सोलापूर",
    taluka: "Sangola",
    talukaMr: "सांगोला",
    talukaHi: "सांगोला",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_solapur_barshi",
    district: "Solapur",
    districtMr: "सोलापूर",
    districtHi: "सोलापूर",
    taluka: "Barshi",
    talukaMr: "बार्शी",
    talukaHi: "बार्शी",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_solapur_malshiras",
    district: "Solapur",
    districtMr: "सोलापूर",
    districtHi: "सोलापूर",
    taluka: "Malshiras",
    talukaMr: "माळशिरस",
    talukaHi: "माळशिरस",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },

  // 6. Nashik
  {
    id: "loc_nashik_yeola",
    district: "Nashik",
    districtMr: "नाशिक",
    districtHi: "नासिक",
    taluka: "Yeola",
    talukaMr: "येवला",
    talukaHi: "येवला",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_nashik_sinnar",
    district: "Nashik",
    districtMr: "नाशिक",
    districtHi: "नासिक",
    taluka: "Sinnar",
    talukaMr: "सिन्नर",
    talukaHi: "सिन्नर",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_nashik_malegaon",
    district: "Nashik",
    districtMr: "नाशिक",
    districtHi: "नासिक",
    taluka: "Malegaon",
    talukaMr: "मालेगाव",
    talukaHi: "मालेगांव",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_nashik_nandgaon",
    district: "Nashik",
    districtMr: "नाशिक",
    districtHi: "नासिक",
    taluka: "Nandgaon",
    talukaMr: "नांदगाव",
    talukaHi: "नांदगांव",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },

  // 7. Dharashiv (Osmanabad)
  {
    id: "loc_dharashiv_dharashiv",
    district: "Dharashiv",
    districtMr: "धाराशिव",
    districtHi: "धाराशिव",
    taluka: "Dharashiv",
    talukaMr: "धाराशिव",
    talukaHi: "धाराशिव",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_dharashiv_paranda",
    district: "Dharashiv",
    districtMr: "धाराशिव",
    districtHi: "धाराशिव",
    taluka: "Paranda",
    talukaMr: "परांडा",
    talukaHi: "परांडा",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },

  // 8. Sangli
  {
    id: "loc_sangli_jat",
    district: "Sangli",
    districtMr: "सांगली",
    districtHi: "सांगली",
    taluka: "Jat",
    talukaMr: "जत",
    talukaHi: "जत",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver",
      "Fodder camps"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_sangli_atpadi",
    district: "Sangli",
    districtMr: "सांगली",
    districtHi: "सांगली",
    taluka: "Atpadi",
    talukaMr: "आटपाडी",
    talukaHi: "आटपाडी",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver",
      "Fodder camps"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_sangli_khanapur",
    district: "Sangli",
    districtMr: "सांगली",
    districtHi: "सांगली",
    taluka: "Khanapur (Vita)",
    talukaMr: "खानापूर (विटा)",
    talukaHi: "खानापुर (विटा)",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_sangli_kavathe_mahankal",
    district: "Sangli",
    districtMr: "सांगली",
    districtHi: "सांगली",
    taluka: "Kavathe Mahankal",
    talukaMr: "कवठे महांकाळ",
    talukaHi: "कवठे महांकाल",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },

  // 9. Satara
  {
    id: "loc_satara_man",
    district: "Satara",
    districtMr: "सातारा",
    districtHi: "सतारा",
    taluka: "Man (Dahiwadi)",
    talukaMr: "माण (दहीवडी)",
    talukaHi: "माण (दहीवडी)",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },
  {
    id: "loc_satara_khatav",
    district: "Satara",
    districtMr: "सातारा",
    districtHi: "सतारा",
    taluka: "Khatav (Vaduj)",
    talukaMr: "खटाव (वडूज)",
    talukaHi: "खटाव (वडूज)",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },

  // 10. Buldhana
  {
    id: "loc_buldhana_lonar",
    district: "Buldhana",
    districtMr: "बुलढाणा",
    districtHi: "बुलढाणा",
    taluka: "Lonar",
    talukaMr: "लोणार",
    talukaHi: "लोनार",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },

  // 11. Kolhapur
  {
    id: "loc_kolhapur_gadhinglaj",
    district: "Kolhapur",
    districtMr: "कोल्हापूर",
    districtHi: "कोल्हापुर",
    taluka: "Gadhinglaj",
    talukaMr: "गडहिंग्लज",
    talukaHi: "गडहिंग्लज",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },

  // 12. Dhule
  {
    id: "loc_dhule_sindkheda",
    district: "Dhule",
    districtMr: "धुळे",
    districtHi: "धुले",
    taluka: "Sindkheda",
    talukaMr: "शिंदखेडा",
    talukaHi: "शिंदखेड़ा",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },

  // 13. Jalgaon
  {
    id: "loc_jalgaon_chalisgaon",
    district: "Jalgaon",
    districtMr: "जळगाव",
    districtHi: "जलगांव",
    taluka: "Chalisgaon",
    talukaMr: "चाळीसगाव",
    talukaHi: "चालीसगांव",
    seasonYear: "Kharif 2023 (Historical)",
    category: "severe_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted severe drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी अधिकृत तीव्र दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु गंभीर सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },

  // 14. Latur
  {
    id: "loc_latur_renapur",
    district: "Latur",
    districtMr: "लातूर",
    districtHi: "लातूर",
    taluka: "Renapur",
    talukaMr: "रेणापूर",
    talukaHi: "रेणापुर",
    seasonYear: "Kharif 2023 (Historical)",
    category: "moderate_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted moderate drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी मध्यम दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु मध्यम सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  },

  // 15. Ahmednagar
  {
    id: "loc_ahmednagar_parner",
    district: "Ahmednagar",
    districtMr: "अहमदनगर",
    districtHi: "अहमदनगर",
    taluka: "Parner",
    talukaMr: "पारनेर",
    talukaHi: "पारनेर",
    seasonYear: "Kharif 2023 (Historical)",
    category: "moderate_declared",
    officialGrNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    grDate: "31 October 2023",
    sourceDocumentUrl: "https://gr.maharashtra.gov.in",
    evidenceStatus: "historical",
    applicableMeasures: [
      "Land revenue waiver",
      "Crop loan restructuring",
      "33.5% power concession",
      "Exam fee waiver"
    ],
    verificationNote: {
      en: "Officially gazetted moderate drought under GR dated 31/10/2023 for Kharif 2023.",
      mr: "खरीप २०२३ हंगामासाठी मध्यम दुष्काळ घोषित.",
      hi: "खरीफ 2023 सत्र हेतु मध्यम सूखा घोषित।"
    },
    lastVerifiedAt: "2026-10-23T18:50:00.000Z"
  }
];

function computeChecksum(data: unknown): string {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

export function getReliefDatabase(): ReliefDatabase {
  ensureDataDir();

  if (!fs.existsSync(DB_FILE)) {
    const initialDb: ReliefDatabase = {
      metadata: {
        lastUpdated: new Date().toISOString(),
        schemaVersion: "2.1.0",
        checksum: ""
      },
      sources: INITIAL_SOURCES,
      announcements: INITIAL_ANNOUNCEMENTS,
      government_resolutions: INITIAL_GRS,
      drought_locations: INITIAL_DROUGHT_LOCATIONS,
      relief_rates: INITIAL_RELIEF_RATES,
      verification_events: [],
      ingestion_runs: []
    };
    initialDb.metadata.checksum = computeChecksum({
      sources: initialDb.sources,
      announcements: initialDb.announcements,
      government_resolutions: initialDb.government_resolutions,
      drought_locations: initialDb.drought_locations,
      relief_rates: initialDb.relief_rates
    });

    saveReliefDatabase(initialDb);
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw) as ReliefDatabase;

    // Merge any newly introduced baseline sources (e.g. MAHA_WATER_DEPT)
    let needsResave = false;
    for (const initSrc of INITIAL_SOURCES) {
      if (!parsed.sources.some((s) => s.code === initSrc.code)) {
        parsed.sources.push(initSrc);
        needsResave = true;
      }
    }

    // Synchronize baseline audited announcement statuses and notes (e.g. SPPU Dailyhunt downgrade)
    for (const initAnn of INITIAL_ANNOUNCEMENTS) {
      const existing = parsed.announcements.find((a) => a.id === initAnn.id);
      if (existing) {
        if (existing.evidenceStatus !== initAnn.evidenceStatus) {
          existing.evidenceStatus = initAnn.evidenceStatus;
          existing.verificationNotes = initAnn.verificationNotes;
          needsResave = true;
        }
      }
    }

    // Correct any auto-scraped records with previously invented dates
    for (const ann of parsed.announcements) {
      if (ann.sourceId === "MAHA_KRISHI" && ann.publishedAt === "2026-10-20") {
        ann.publishedAt = null;
        needsResave = true;
      }
    }

    if (needsResave) {
      saveReliefDatabase(parsed);
    }

    return parsed;
  } catch (err) {
    console.error("Failed to read relief store file, attempting backup recovery:", err);
    if (fs.existsSync(DB_BACKUP_FILE)) {
      try {
        const backupRaw = fs.readFileSync(DB_BACKUP_FILE, "utf-8");
        return JSON.parse(backupRaw) as ReliefDatabase;
      } catch (backupErr) {
        console.error("Backup file also corrupt:", backupErr);
      }
    }
    throw new Error("Relief database storage is corrupted and unrecoverable.");
  }
}

export function saveReliefDatabase(db: ReliefDatabase): boolean {
  ensureDataDir();
  try {
    db.metadata.lastUpdated = new Date().toISOString();
    db.metadata.checksum = computeChecksum({
      sources: db.sources,
      announcements: db.announcements,
      government_resolutions: db.government_resolutions,
      drought_locations: db.drought_locations,
      relief_rates: db.relief_rates
    });

    const json = JSON.stringify(db, null, 2);
    const tempFile = path.join(DATA_DIR, `relief_store_${Date.now()}.tmp`);

    // Write to temp file then rename for atomic safe write
    fs.writeFileSync(tempFile, json, "utf-8");
    if (fs.existsSync(DB_FILE)) {
      try {
        fs.copyFileSync(DB_FILE, DB_BACKUP_FILE);
      } catch {
        // ignore backup copy failure
      }
    }
    try {
      fs.renameSync(tempFile, DB_FILE);
    } catch {
      // Windows EPERM / file lock fallback
      fs.copyFileSync(tempFile, DB_FILE);
      try {
        fs.unlinkSync(tempFile);
      } catch {
        // temp file cleanup
      }
    }
    return true;
  } catch (err) {
    console.error("Failed to atomically save relief database:", err);
    return false;
  }
}

export type StorageMode = "file_atomic" | "postgres_cloud";

export {
  isPostgresConfigured,
  acquireSyncLock,
  releaseSyncLock,
  initPostgresSchema,
  migrateJsonToPostgres
} from "./postgresReliefStore";

let lastDbCheck: {
  status: "connected" | "connection_failed" | "unconfigured";
  error?: string;
  checkedAt?: string;
} = { status: "unconfigured" };

export async function getReliefDatabaseAsync(): Promise<ReliefDatabase> {
  const { isPostgresConfigured, getPostgresReliefDatabase } = await import("./postgresReliefStore");

  if (isPostgresConfigured()) {
    try {
      const pgDb = await getPostgresReliefDatabase();
      if (pgDb && pgDb.sources.length > 0) {
        lastDbCheck = { status: "connected", checkedAt: new Date().toISOString() };
        return pgDb;
      }
    } catch (pgErr) {
      const errMsg = pgErr instanceof Error ? pgErr.message : String(pgErr);
      lastDbCheck = { status: "connection_failed", error: errMsg, checkedAt: new Date().toISOString() };
      console.warn("[ReliefStore] PostgreSQL query failed, gracefully falling back to local JSON store:", errMsg);
    }
  }

  return getReliefDatabase();
}

export async function saveReliefDatabaseAsync(db: ReliefDatabase): Promise<boolean> {
  // Always persist to local JSON file for backup and local development
  const localSaved = saveReliefDatabase(db);

  const { isPostgresConfigured, migrateJsonToPostgres } = await import("./postgresReliefStore");
  if (isPostgresConfigured()) {
    try {
      await migrateJsonToPostgres(db, true);
      lastDbCheck = { status: "connected", checkedAt: new Date().toISOString() };
    } catch (pgErr) {
      const errMsg = pgErr instanceof Error ? pgErr.message : String(pgErr);
      lastDbCheck = { status: "connection_failed", error: errMsg, checkedAt: new Date().toISOString() };
      console.error("[ReliefStore] Failed to sync database updates to PostgreSQL:", errMsg);
    }
  }

  return localSaved;
}

export function getStorageHealth(): {
  mode: StorageMode;
  currentBackend: string;
  isServerlessSafe: boolean;
  recommendation: string;
} {
  const isVercel = Boolean(process.env.VERCEL || process.env.NEXT_PUBLIC_VERCEL_ENV);
  const isPgConfigured = Boolean(
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.SUPABASE_DB_URL?.trim()
  );

  if (isPgConfigured) {
    if (lastDbCheck.status === "connection_failed") {
      return {
        mode: "file_atomic",
        currentBackend: `JSON File Storage (Emergency Fallback: Cloud PostgreSQL unreachable - ${lastDbCheck.error || "connection error"})`,
        isServerlessSafe: false,
        recommendation: "CRITICAL ALERT: DATABASE_URL is configured, but live connection to PostgreSQL failed. The application is currently falling back to ephemeral local JSON storage. On serverless Vercel, updates will NOT persist across cold starts. Inspect database credentials and network firewall immediately."
      };
    }

    if (lastDbCheck.status === "connected") {
      return {
        mode: "postgres_cloud",
        currentBackend: "Supabase PostgreSQL (Live Connected & Verified Persistent Cloud Storage)",
        isServerlessSafe: true,
        recommendation: "PostgreSQL cloud persistence adapter is active, verified, and handling live queries. Automated scrapers, ticker updates, and relief feeds persist to cloud database."
      };
    }

    // Configured in environment, but not yet verified with a real query
    return {
      mode: "postgres_cloud",
      currentBackend: "PostgreSQL Configured (Pending live probe verification)",
      isServerlessSafe: false,
      recommendation: "DATABASE_URL is set in environment, but live connectivity has not been confirmed yet. Run storage health probe to verify active connectivity before deployment."
    };
  }

  return {
    mode: "file_atomic",
    currentBackend: "JSON File Storage (Local Development Fallback: data/relief_store.json with atomic .tmp rename & SHA-256)",
    isServerlessSafe: !isVercel,
    recommendation: isVercel
      ? "DEPLOYMENT ADVISORY: Running on serverless Vercel without DATABASE_URL. Filesystem writes are ephemeral. Configure DATABASE_URL in Vercel project environment variables to enable persistent Supabase PostgreSQL cloud storage."
      : "Active on persistent filesystem (Local Development). Atomic JSON write with SHA-256 integrity and backup rotation is fully operational."
  };
}

export async function getStorageHealthAsync() {
  const { getPostgresStorageHealth } = await import("./postgresReliefStore");
  const report = await getPostgresStorageHealth();
  if (report.status === "connected") {
    lastDbCheck = { status: "connected", checkedAt: new Date().toISOString() };
  } else if (report.status === "connection_failed") {
    lastDbCheck = { status: "connection_failed", error: report.error, checkedAt: new Date().toISOString() };
  } else {
    lastDbCheck = { status: "unconfigured", checkedAt: new Date().toISOString() };
  }
  return report;
}

// Verification Stats Helper
export function getDatabaseAuditSummary() {
  const db = getReliefDatabase();

  const totalAnnouncements = db.announcements.length;
  const verifiedAnnouncements = db.announcements.filter(
    (a) => a.evidenceStatus === "official_gr_verified" || a.evidenceStatus === "official_notice_verified"
  ).length;
  const pendingAnnouncements = db.announcements.filter(
    (a) => a.evidenceStatus === "official_announcement_pending" || a.evidenceStatus === "media_report_pending"
  ).length;
  const conflictingAnnouncements = db.announcements.filter((a) => a.evidenceStatus === "conflicting_sources").length;

  const totalTalukas = db.drought_locations.length;
  const historicalTalukas = db.drought_locations.filter((t) => t.evidenceStatus === "historical").length;
  const proposedTalukas = db.drought_locations.filter((t) => t.category === "proposed_expansion").length;

  const onlineSources = db.sources.filter((s) => s.status === "online").length;
  const totalSources = db.sources.length;

  return {
    lastUpdated: db.metadata.lastUpdated,
    totalSources,
    onlineSources,
    totalAnnouncements,
    verifiedAnnouncements,
    pendingAnnouncements,
    conflictingAnnouncements,
    totalTalukas,
    historicalTalukas,
    proposedTalukas,
    totalResolutions: db.government_resolutions.length,
    totalRates: db.relief_rates.length,
    lastIngestionRun: db.ingestion_runs[0] || null,
    storageHealth: getStorageHealth()
  };
}

export async function getDatabaseAuditSummaryAsync() {
  const db = await getReliefDatabaseAsync();
  const storageHealth = await getStorageHealthAsync();

  const totalAnnouncements = db.announcements.length;
  const verifiedAnnouncements = db.announcements.filter(
    (a) => a.evidenceStatus === "official_gr_verified" || a.evidenceStatus === "official_notice_verified"
  ).length;
  const pendingAnnouncements = db.announcements.filter(
    (a) => a.evidenceStatus === "official_announcement_pending" || a.evidenceStatus === "media_report_pending"
  ).length;
  const conflictingAnnouncements = db.announcements.filter((a) => a.evidenceStatus === "conflicting_sources").length;

  const totalTalukas = db.drought_locations.length;
  const historicalTalukas = db.drought_locations.filter((t) => t.evidenceStatus === "historical").length;
  const proposedTalukas = db.drought_locations.filter((t) => t.category === "proposed_expansion").length;

  const onlineSources = db.sources.filter((s) => s.status === "online").length;
  const totalSources = db.sources.length;

  return {
    lastUpdated: db.metadata.lastUpdated,
    totalSources,
    onlineSources,
    totalAnnouncements,
    verifiedAnnouncements,
    pendingAnnouncements,
    conflictingAnnouncements,
    totalTalukas,
    historicalTalukas,
    proposedTalukas,
    totalResolutions: db.government_resolutions.length,
    totalRates: db.relief_rates.length,
    lastIngestionRun: db.ingestion_runs[0] || null,
    storageHealth
  };
}

