import { NextResponse } from "next/server";
import { getReliefDatabaseAsync, getDatabaseAuditSummaryAsync } from "@/server/db/reliefStore";

// Force dynamic execution for live updates
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [db, auditSummary] = await Promise.all([
      getReliefDatabaseAsync(),
      getDatabaseAuditSummaryAsync()
    ]);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      metadata: db.metadata,
      auditSummary,
      sources: db.sources,
      announcements: db.announcements,
      government_resolutions: db.government_resolutions,
      drought_locations: db.drought_locations,
      relief_rates: db.relief_rates,
      lastIngestionRun: db.ingestion_runs[0] || null
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
      }
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve relief updates", details: errorMsg },
      { status: 500 }
    );
  }
}

