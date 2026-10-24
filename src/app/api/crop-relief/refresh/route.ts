import { NextRequest, NextResponse } from "next/server";
import { runIngestionPipeline } from "@/server/ingestion/engine";
import { getDatabaseAuditSummaryAsync } from "@/server/db/reliefStore";
import { timingSafeStringEqual } from "@/server/auth/authTokens";

export const dynamic = "force-dynamic";

// In-memory rate limiting tracker (per process)
let lastRefreshTimestamp = 0;
const MIN_REFRESH_INTERVAL_MS = 20000; // 20 seconds minimum interval

async function handleRefreshRequest(req: NextRequest, defaultTrigger: "scheduled" | "manual") {
  try {
    const authHeader = req.headers.get("authorization");
    const adminHeader = req.headers.get("x-admin-secret");

    let bodySecret = "";
    if (req.method === "POST") {
      try {
        const body = await req.json();
        bodySecret = body?.secret || "";
      } catch {
        // Body may be empty if called without json payload
      }
    }

    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7).trim() : "";
    const adminHeaderSecret = adminHeader?.trim() || "";
    const bodySecretTrimmed = bodySecret?.trim() || "";

    const configuredAdminSecret = process.env.RELIEF_ADMIN_SECRET?.trim();
    const configuredCronSecret = process.env.CRON_SECRET?.trim();

    // Strict Security Guard: Fail securely if no secrets are configured in environment
    if (!configuredAdminSecret && !configuredCronSecret) {
      console.error("[Refresh API] Security error: Neither RELIEF_ADMIN_SECRET nor CRON_SECRET is set in environment.");
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error: Authentication secret is not configured in environment variables."
        },
        { status: 500 }
      );
    }
    // Verify against configured secrets using constant-time comparison
    const matchesAdmin = Boolean(
      configuredAdminSecret &&
      (timingSafeStringEqual(adminHeaderSecret, configuredAdminSecret) ||
       timingSafeStringEqual(bodySecretTrimmed, configuredAdminSecret) ||
       timingSafeStringEqual(bearerToken, configuredAdminSecret))
    );

    const matchesCron = Boolean(
      configuredCronSecret &&
      (timingSafeStringEqual(bearerToken, configuredCronSecret) ||
       timingSafeStringEqual(adminHeaderSecret, configuredCronSecret) ||
       timingSafeStringEqual(bodySecretTrimmed, configuredCronSecret))
    );

    if (!matchesAdmin && !matchesCron) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid or missing administrator secret. Public visitors cannot trigger manual source refresh."
        },
        { status: 401 }
      );
    }

    // Rate Limiting Check
    const now = Date.now();
    const elapsed = now - lastRefreshTimestamp;
    if (elapsed < MIN_REFRESH_INTERVAL_MS) {
      const waitSeconds = Math.ceil((MIN_REFRESH_INTERVAL_MS - elapsed) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: `Rate limit active: Please wait ${waitSeconds}s before initiating another live source refresh.`
        },
        { status: 429 }
      );
    }

    lastRefreshTimestamp = now;

    // Detect if invoked via Vercel Cron or manual admin trigger
    const userAgent = req.headers.get("user-agent") || "";
    const isCron = userAgent.toLowerCase().includes("vercel-cron") || req.headers.get("x-vercel-cron") === "1" || defaultTrigger === "scheduled";
    const triggerType = isCron ? "scheduled" : "manual";

    const runReport = await runIngestionPipeline(triggerType);
    const auditSummary = await getDatabaseAuditSummaryAsync();

    return NextResponse.json({
      success: true,
      message: "Data refresh and verification pipeline executed successfully.",
      triggerType,
      runReport,
      auditSummary
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        success: false,
        error: "Data refresh execution failed",
        details: errorMsg
      },
      { status: 500 }
    );
  }
}

// Vercel Cron invokes configured endpoints via GET with Authorization: Bearer <CRON_SECRET>
export async function GET(req: NextRequest) {
  return handleRefreshRequest(req, "scheduled");
}

// Admin modal & manual API triggers invoke via POST
export async function POST(req: NextRequest) {
  return handleRefreshRequest(req, "manual");
}
