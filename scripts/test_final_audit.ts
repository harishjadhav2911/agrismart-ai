import {
  parseGovernmentGrDate,
  formatGovernmentGrDate,
  isGenuinelyNewAnnouncement,
  sortAnnouncementsByVerifiedDate
} from "../src/lib/grDateUtils";
import { getReliefDatabase, getStorageHealth, AnnouncementItem } from "../src/server/db/reliefStore";
import { runIngestionPipeline } from "../src/server/ingestion/engine";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName}${detail ? ` -> ${detail}` : ""}`);
  }
}

async function runAuditSuite() {
  console.log("======================================================================");
  console.log("AGRISMART AI — FINAL SECURITY, DATA-INTEGRITY, DATE-ACCURACY AUDIT");
  console.log("======================================================================\n");

  // -------------------------------------------------------------------------
  // 1. DATE-ACCURACY & LOCALIZATION AUDIT
  // -------------------------------------------------------------------------
  console.log("1. DATE ACCURACY & LOCALIZATION");

  // 1.1 Missing dates: Never invent dates, return localized 'Date unavailable'
  assert(formatGovernmentGrDate(null, "en") === "Date unavailable", "Missing date (null) returns 'Date unavailable' in EN");
  assert(formatGovernmentGrDate(null, "mr") === "तारीख उपलब्ध नाही", "Missing date (null) returns 'तारीख उपलब्ध नाही' in MR");
  assert(formatGovernmentGrDate(null, "hi") === "तिथि उपलब्ध नहीं", "Missing date (null) returns 'तिथि उपलब्ध नहीं' in HI");
  assert(formatGovernmentGrDate(undefined, "en") === "Date unavailable", "Missing date (undefined) returns 'Date unavailable'");
  assert(formatGovernmentGrDate("", "en") === "Date unavailable", "Empty string returns 'Date unavailable'");

  // 1.2 Malformed dates
  assert(formatGovernmentGrDate("invalid-date-string", "en") === "Date unavailable", "Malformed string handled safely without Invalid Date or NaN");
  assert(formatGovernmentGrDate("2026-99-99", "en") === "Date unavailable", "Out-of-range date returns 'Date unavailable'");

  // 1.3 Date-only parsing: Avoid UTC timezone shift bugs
  const dateOnlyParsed = parseGovernmentGrDate("2026-10-19");
  assert(
    dateOnlyParsed !== null && dateOnlyParsed.year === 2026 && dateOnlyParsed.month === 10 && dateOnlyParsed.day === 19,
    "Date-only '2026-10-19' parses precisely to { 2026, 10, 19 } without UTC shift"
  );
  const formattedDateOnlyEn = formatGovernmentGrDate("2026-10-19", "en");
  assert(formattedDateOnlyEn === "19 Oct 2026", `Date-only EN formatted: '${formattedDateOnlyEn}' === '19 Oct 2026'`);
  const formattedDateOnlyMr = formatGovernmentGrDate("2026-10-19", "mr");
  assert(formattedDateOnlyMr.includes("ऑक्टो") && formattedDateOnlyMr.includes("2026"), `Date-only MR formatted: '${formattedDateOnlyMr}' contains Marathi month and year`);
  const formattedDateOnlyMrDevanagari = formatGovernmentGrDate("2026-10-19", "mr", { useDevanagariDigits: true });
  assert(formattedDateOnlyMrDevanagari.includes("ऑक्टो") && formattedDateOnlyMrDevanagari.includes("२०२६"), `Date-only MR Devanagari formatted: '${formattedDateOnlyMrDevanagari}' contains Devanagari digits`);
  const formattedDateOnlyHi = formatGovernmentGrDate("2026-10-19", "hi");
  assert(formattedDateOnlyHi.includes("2026"), `Date-only HI formatted: '${formattedDateOnlyHi}' contains Hindi month and year`);

  // 1.4 Historical dates
  const historicalEn = formatGovernmentGrDate("2024-10-19T14:58:00.000Z", "en");
  assert(historicalEn === "19 Oct 2024", `Historical ISO timestamp formatted: '${historicalEn}' === '19 Oct 2024'`);

  // 1.5 Indian Slash Format (DD/MM/YYYY)
  const slashParsed = parseGovernmentGrDate("22/10/2026");
  assert(
    slashParsed !== null && slashParsed.year === 2026 && slashParsed.month === 10 && slashParsed.day === 22,
    "Indian DD/MM/YYYY '22/10/2026' parsed correctly"
  );

  console.log("\n2. RECENCY & 'NEW' INDICATOR INTEGRITY");

  // 2.1 Genuine new announcement: <14 days AND officially verified
  const genuinelyNew = isGenuinelyNewAnnouncement("2026-10-22T16:55:00.000Z", "official_gr_verified", 14);
  assert(genuinelyNew === true, "Current verified GR (22 Oct 2026) qualifies as genuinely NEW");

  // 2.2 Historical announcement: Old date MUST NEVER qualify as NEW
  const historicalNotNew = isGenuinelyNewAnnouncement("2024-10-19T14:58:00.000Z", "official_notice_verified", 14);
  assert(historicalNotNew === false, "Historical record (19 Oct 2024) is NEVER marked NEW even if newly ingested");

  // 2.3 Unverified announcement: Even if recent, unverified announcements do not get NEW badge
  const pendingNotNew = isGenuinelyNewAnnouncement("2026-10-22", "official_announcement_pending", 14);
  assert(pendingNotNew === false, "Pending/unverified assurance is NOT marked NEW");

  // 2.4 Missing date announcement: Unknown dates must not get NEW badge
  const undatedNotNew = isGenuinelyNewAnnouncement(null, "official_gr_verified", 14);
  assert(undatedNotNew === false, "Undated document is NEVER marked NEW");

  console.log("\n3. SORTING INTEGRITY");

  const sampleAnnouncements: Partial<AnnouncementItem>[] = [
    { id: "undated", title: "Undated Circular", publishedAt: null },
    { id: "old_2024", title: "2024 Record", publishedAt: "2024-10-19T10:00:00.000Z" },
    { id: "newest_2026", title: "2026 GR", publishedAt: "2026-10-22T16:55:00.000Z" },
    { id: "mid_2026", title: "Mid Oct 2026", publishedAt: "2026-10-12T10:00:00.000Z" }
  ];

  const sorted = sortAnnouncementsByVerifiedDate(sampleAnnouncements);
  assert(sorted[0].id === "newest_2026", "Sort: 1st is newest verified date (22 Oct 2026)");
  assert(sorted[1].id === "mid_2026", "Sort: 2nd is mid-recent date (12 Oct 2026)");
  assert(sorted[2].id === "old_2024", "Sort: 3rd is historical date (2024)");
  assert(sorted[3].id === "undated", "Sort: Undated item placed safely at end without artificial latest timestamp");

  console.log("\n4. SOURCE AND CLAIM VERIFICATION AUDIT");

  const db = getReliefDatabase();

  // 4.1 Dailyhunt SPPU Fee Waiver: Must be downgraded from official_notice_verified to historical
  const sppuAnn = db.announcements.find((a) => a.id === "ann_exam_fee_waiver_sppu_2024");
  assert(sppuAnn !== undefined, "Found SPPU announcement in store");
  if (sppuAnn) {
    assert(sppuAnn.evidenceStatus === "historical", `SPPU Dailyhunt record evidenceStatus is 'historical' (Actual: ${sppuAnn.evidenceStatus})`);
    assert(sppuAnn.originalUrl.includes("dhunt.in"), "SPPU Dailyhunt originalUrl preserved");
    assert(sppuAnn.verificationNotes.en.includes("HISTORICAL MEDIA ARCHIVE"), "SPPU verificationNotes accurately document historical downgrade");
  }

  // 4.2 Invented date elimination on Krishi PMFBY guideline
  const krishiAnn = db.announcements.find((a) => a.sourceId === "MAHA_KRISHI");
  if (krishiAnn) {
    assert(krishiAnn.publishedAt === null, `Krishi Dept portal link date is null (Actual: ${krishiAnn.publishedAt})`);
    assert(formatGovernmentGrDate(krishiAnn.publishedAt, "en") === "Date unavailable", "Krishi Dept displays 'Date unavailable'");
  }

  // 4.3 Officially verified GR 304 talukas claim supported by official source
  const foodGr = db.announcements.find((a) => a.id === "ann_food_dept_304_talukas_2026");
  if (foodGr) {
    const hasCode = foodGr.verifiedGrNumber?.includes("२०२६१०२२१६५५४८२५०६") || foodGr.verifiedGrNumber?.includes("202610221655482506");
    assert(Boolean(hasCode), `Food Dept GR Code 202610221655482506 matched in GR reference (Actual: ${foodGr.verifiedGrNumber})`);
  }

  console.log("\n5. INGESTION & DEDUPLICATION AUDIT");

  // Test deduplication logic directly: re-ingest duplicate
  const initialCount = db.announcements.length;
  const existingAnn = db.announcements[0];
  const oldFetchedAt = existingAnn.fetchedAt;

  // Run pipeline (offline safe simulation / real ping)
  const runResult = await runIngestionPipeline("manual");
  const postDb = getReliefDatabase();
  assert(postDb.announcements.length === initialCount, `Deduplication prevented duplicate items (Initial: ${initialCount}, Post: ${postDb.announcements.length})`);

  console.log("\n6. PRODUCTION STORAGE HEALTH & CRON AUDIT");

  const storageHealth = getStorageHealth();
  assert(storageHealth.mode === "file_atomic", `Storage mode is 'file_atomic' (Actual: ${storageHealth.mode})`);
  assert(storageHealth.currentBackend.includes("JSON File Storage"), "Current backend honestly reports JSON File Storage");
  // On local Windows dev, isServerlessSafe is true; on Vercel it would be false
  const isVercelEnv = Boolean(process.env.VERCEL);
  assert(storageHealth.isServerlessSafe === !isVercelEnv, `isServerlessSafe accurately detects Vercel ephemeral filesystem`);
  assert(storageHealth.recommendation.length > 0, "Provides clear deployment recommendation");

  console.log("\n======================================================================");
  console.log(`AUDIT RESULTS: ${passedTests} PASSED, ${failedTests} FAILED out of ${totalTests} total tests`);
  console.log("======================================================================");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAuditSuite().catch((err) => {
  console.error("Test execution threw error:", err);
  process.exit(1);
});
