import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, createUnauthorizedResponse } from "@/server/auth/adminAuth";
import { getUserAnalytics } from "@/server/db/userStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return createUnauthorizedResponse(auth);
  }

  try {
    const analytics = await getUserAnalytics();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      analytics
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: "Failed to compile user analytics", details: errorMsg },
      { status: 500 }
    );
  }
}
