import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, createUnauthorizedResponse } from "@/server/auth/adminAuth";
import { listUsersForAdmin } from "@/server/db/userStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // 1. Enforce strict server-side authorization
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return createUnauthorizedResponse(auth);
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const provider = searchParams.get("provider") || undefined;
    const role = searchParams.get("role") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const result = await listUsersForAdmin({
      search,
      status,
      provider,
      role,
      startDate,
      endDate,
      page,
      limit
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve user records", details: errorMsg },
      { status: 500 }
    );
  }
}
