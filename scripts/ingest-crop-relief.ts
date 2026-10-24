import { runIngestionPipeline } from "../src/server/ingestion/engine";
import { getDatabaseAuditSummary } from "../src/server/db/reliefStore";

async function main() {
  console.log("=================================================");
  console.log("AGRISMART AI: LIVE CROP RELIEF INGESTION TRIGGER");
  console.log("=================================================");
  console.log(`Starting ingestion at: ${new Date().toISOString()}`);

  try {
    const report = await runIngestionPipeline("manual");
    console.log("\n--- INGESTION REPORT ---");
    console.log(`Run ID: ${report.id}`);
    console.log(`Duration: ${report.executionDurationMs} ms`);
    console.log(`Sources Checked: ${report.sourcesChecked}`);
    console.log(`Failed Sources: ${report.failedSourcesCount}`);
    console.log(`New Records Found: ${report.newRecordsFound}`);
    console.log(`Verified Records Total: ${report.verifiedRecordsCount}`);
    console.log(`Pending Review Total: ${report.pendingReviewCount}`);

    console.log("\nDetails:");
    report.details.forEach((d) => console.log(`  • ${d}`));

    if (report.errors.length > 0) {
      console.log("\nWarnings / Errors:");
      report.errors.forEach((e) => console.log(`  ⚠️ ${e}`));
    }

    const summary = getDatabaseAuditSummary();
    console.log("\n--- STORE AUDIT SUMMARY ---");
    console.log(`Last Updated: ${summary.lastUpdated}`);
    console.log(`Active Sources: ${summary.onlineSources}/${summary.totalSources}`);
    console.log(`Announcements: ${summary.totalAnnouncements} (Verified: ${summary.verifiedAnnouncements}, Pending: ${summary.pendingAnnouncements})`);
    console.log(`Talukas: ${summary.totalTalukas} (Historical: ${summary.historicalTalukas}, Proposed: ${summary.proposedTalukas})`);
    console.log("=================================================\n");
  } catch (err) {
    console.error("FATAL: Ingestion failed with exception:", err);
    process.exit(1);
  }
}

main();
