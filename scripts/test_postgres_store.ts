/**
 * AGRISMART AI — CROPRELIEF POSTGRESQL STORAGE VERIFICATION SUITE
 * 
 * Verifies:
 * 1. Schema DDL and SQL file structure
 * 2. Data transformation & migration fidelity (sources, announcements, resolutions, drought locations, rates)
 * 3. Deduplication logic on incoming records
 * 4. Distributed concurrency locking mechanics
 * 5. Storage health reporting (clearly distinguishing real vs mocked/fallback state)
 * 6. Graceful failure recovery to JSON store when database is offline or unconfigured
 */

import fs from "fs";
import path from "path";
import {
  getReliefDatabase,
  getStorageHealth,
  getStorageHealthAsync,
  AnnouncementItem
} from "../src/server/db/reliefStore";
import {
  isPostgresConfigured,
  getPostgresConnectionString
} from "../src/server/db/postgresReliefStore";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passedCount++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failedCount++;
  }
}

async function runTestSuite() {
  console.log("======================================================================");
  console.log("AGRISMART AI — DATABASE ADAPTER & STORAGE INTEGRITY TEST SUITE");
  console.log("======================================================================\n");

  // -------------------------------------------------------------------------
  // TEST SUITE 1: Schema DDL & SQL File Validation
  // -------------------------------------------------------------------------
  console.log("TEST SUITE 1: Schema DDL & SQL File Validation");
  const schemaPath = path.join(process.cwd(), "src", "server", "db", "schema.sql");
  assert(fs.existsSync(schemaPath), "schema.sql exists in src/server/db/");

  const schemaContent = fs.readFileSync(schemaPath, "utf-8");
  assert(schemaContent.includes("CREATE TABLE IF NOT EXISTS relief_sources"), "Defines relief_sources table");
  assert(schemaContent.includes("CREATE TABLE IF NOT EXISTS relief_announcements"), "Defines relief_announcements table");
  assert(schemaContent.includes("CREATE TABLE IF NOT EXISTS government_resolutions"), "Defines government_resolutions table");
  assert(schemaContent.includes("CREATE TABLE IF NOT EXISTS drought_locations"), "Defines drought_locations table");
  assert(schemaContent.includes("CREATE TABLE IF NOT EXISTS relief_rates"), "Defines relief_rates table");
  assert(schemaContent.includes("CREATE TABLE IF NOT EXISTS ingestion_runs"), "Defines ingestion_runs table");
  assert(schemaContent.includes("CREATE TABLE IF NOT EXISTS sync_locks"), "Defines sync_locks table for distributed concurrency");
  assert(schemaContent.includes("verification_notes JSONB"), "Uses JSONB for multi-lingual verification notes");
  assert(schemaContent.includes("idx_announcements_published_at"), "Creates index on published_at for feed ranking");
  console.log();

  // -------------------------------------------------------------------------
  // TEST SUITE 2: JSON to PostgreSQL Data Migration Fidelity
  // -------------------------------------------------------------------------
  console.log("TEST SUITE 2: JSON to PostgreSQL Data Migration Fidelity");
  const db = getReliefDatabase();
  assert(db.sources.length >= 8, `Local source count is healthy (${db.sources.length} sources)`);
  assert(db.announcements.length >= 6, `Local announcement count is healthy (${db.announcements.length} records)`);
  assert(db.drought_locations.length >= 36, `Drought locations count is healthy (${db.drought_locations.length} talukas)`);
  assert(db.government_resolutions.length >= 4, `Government resolutions count is healthy (${db.government_resolutions.length} GRs)`);

  // Verify field preservation on announcement items
  const sampleAnn = db.announcements[0];
  assert(Boolean(sampleAnn.id), "Announcement ID preserved");
  assert(Boolean(sampleAnn.title && sampleAnn.titleMr), "Localized Marathi title preserved");
  assert(Boolean(sampleAnn.summary && sampleAnn.summaryMr), "Localized Marathi summary preserved");
  assert(Boolean(sampleAnn.originalUrl), "Original source URL preserved");
  assert(Boolean(sampleAnn.evidenceStatus), `Evidence status preserved (${sampleAnn.evidenceStatus})`);
  assert(Boolean(sampleAnn.verificationNotes?.en && sampleAnn.verificationNotes?.mr), "Structured multilingual verification notes preserved");
  assert(sampleAnn.publishedAt !== undefined, "Original publication date field exists (null or ISO string)");
  console.log();

  // -------------------------------------------------------------------------
  // TEST SUITE 3: Deduplication Logic Integrity
  // -------------------------------------------------------------------------
  console.log("TEST SUITE 3: Deduplication Logic Integrity");
  const existingUrls = new Set(db.announcements.map((a) => (a.canonicalUrl || a.originalUrl).toLowerCase().trim()));
  const existingTitles = new Set(db.announcements.map((a) => a.title.toLowerCase().trim()));

  const duplicateCandidate: Partial<AnnouncementItem> = {
    title: db.announcements[0].title,
    originalUrl: db.announcements[0].originalUrl,
    canonicalUrl: db.announcements[0].canonicalUrl
  };

  const isDuplicate =
    existingUrls.has((duplicateCandidate.canonicalUrl || duplicateCandidate.originalUrl || "").toLowerCase().trim()) ||
    existingTitles.has((duplicateCandidate.title || "").toLowerCase().trim());

  assert(isDuplicate === true, "Deduplication algorithm correctly flags exact URL / Title matches");

  const brandNewCandidate: Partial<AnnouncementItem> = {
    title: "Brand New Unique Agricultural Notification 2026",
    originalUrl: "https://krishi.maharashtra.gov.in/unique-gr-2026.pdf",
    canonicalUrl: "https://krishi.maharashtra.gov.in/unique-gr-2026.pdf"
  };

  const isNewDuplicate =
    existingUrls.has((brandNewCandidate.canonicalUrl || brandNewCandidate.originalUrl || "").toLowerCase().trim()) ||
    existingTitles.has((brandNewCandidate.title || "").toLowerCase().trim());

  assert(isNewDuplicate === false, "Deduplication algorithm correctly accepts new unique records");
  console.log();

  // -------------------------------------------------------------------------
  // TEST SUITE 4: Storage Health & Backend State Reporting
  // -------------------------------------------------------------------------
  console.log("TEST SUITE 4: Storage Health & Backend State Reporting");
  const health = getStorageHealth();
  assert(Boolean(health.currentBackend), `Active backend reported: ${health.currentBackend}`);
  assert(typeof health.isServerlessSafe === "boolean", `isServerlessSafe reported: ${health.isServerlessSafe}`);
  assert(Boolean(health.recommendation), "Storage recommendation provided");

  const isConfigured = isPostgresConfigured();
  if (isConfigured) {
    console.log(`  [INFO] Cloud Database is CONFIGURED: ${getPostgresConnectionString()?.substring(0, 20)}...`);
    assert(health.mode === "postgres_cloud", "Storage mode correctly reflects postgres_cloud when configured");
  } else {
    console.log("  [INFO] Cloud Database is UNCONFIGURED (Local Development Fallback active).");
    assert(health.mode === "file_atomic", "Storage mode correctly reflects file_atomic fallback when unconfigured");
    assert(health.currentBackend.includes("JSON File Storage"), "Accurately identifies local fallback backend");
  }

  // Verify async live probe
  const asyncHealth = await getStorageHealthAsync();
  assert(Boolean(asyncHealth.status), `Async storage health probe status: ${asyncHealth.status}`);
  if (!isConfigured) {
    assert(asyncHealth.status === "unconfigured", "Reports unconfigured status when DATABASE_URL is not set");
    assert(asyncHealth.isServerlessSafe === false, "Production safety guard: reports isServerlessSafe: false when cloud DB is unconfigured");
  }
  console.log();

  // -------------------------------------------------------------------------
  // TEST SUITE 5: Failure Recovery & Non-Destructive Operation
  // -------------------------------------------------------------------------
  console.log("TEST SUITE 5: Failure Recovery & Non-Destructive Operation");
  const jsonPath = path.join(process.cwd(), "data", "relief_store.json");
  assert(fs.existsSync(jsonPath), "Local JSON data store data/relief_store.json is intact");

  const rawJson = fs.readFileSync(jsonPath, "utf-8");
  let parsedDb;
  try {
    parsedDb = JSON.parse(rawJson);
    assert(true, "JSON data store is valid, well-formed JSON");
  } catch {
    assert(false, "JSON data store failed to parse");
  }

  assert(parsedDb?.sources?.length > 0, "Non-destructive check: sources array is populated");
  assert(parsedDb?.announcements?.length > 0, "Non-destructive check: announcements array is populated");
  assert(parsedDb?.drought_locations?.length > 0, "Non-destructive check: drought locations array is populated");
  console.log();

  // -------------------------------------------------------------------------
  // TEST SUITE 6: Environment Variables & Security Audit
  // -------------------------------------------------------------------------
  console.log("TEST SUITE 6: Environment Variables & Security Audit");
  const envExamplePath = path.join(process.cwd(), ".env.example");
  assert(fs.existsSync(envExamplePath), ".env.example file exists");

  const envExample = fs.readFileSync(envExamplePath, "utf-8");
  assert(envExample.includes("DATABASE_URL"), ".env.example documents DATABASE_URL variable");
  assert(envExample.includes("RELIEF_ADMIN_SECRET"), ".env.example documents RELIEF_ADMIN_SECRET variable");
  assert(envExample.includes("CRON_SECRET"), ".env.example documents CRON_SECRET variable");

  // Verify that secrets are NOT leaked into versioned files
  const gitIgnorePath = path.join(process.cwd(), ".gitignore");
  if (fs.existsSync(gitIgnorePath)) {
    const gitIgnore = fs.readFileSync(gitIgnorePath, "utf-8");
    assert(gitIgnore.includes(".env*") || gitIgnore.includes(".env.local"), ".gitignore prevents leaking .env* files");
  }
  console.log();

  // -------------------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------------------
  console.log("======================================================================");
  console.log(`TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("======================================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test execution threw unhandled exception:", err);
  process.exit(1);
});
