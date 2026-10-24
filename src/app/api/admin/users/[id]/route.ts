import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, createUnauthorizedResponse } from "@/server/auth/adminAuth";
import {
  getUserById,
  updateUserStatus,
  deleteUserData,
  getUserDatabase,
  AccountStatus
} from "@/server/db/userStore";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return createUnauthorizedResponse(auth);
  }

  const { id } = await context.params;
  const user = await getUserById(id);

  if (!user) {
    return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
  }

  // Retrieve user's login audit history (recent 20 logs)
  const db = getUserDatabase();
  const logs = db.login_audit_logs
    .filter(l => l.userId === id)
    .slice(0, 20);

  return NextResponse.json({
    success: true,
    user,
    logs
  });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return createUnauthorizedResponse(auth);
  }

  try {
    const { id } = await context.params;
    const body = await req.json();
    const { status } = body;

    if (!["active", "suspended", "deactivated"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status. Allowed: active, suspended, deactivated" },
        { status: 400 }
      );
    }

    const result = await updateUserStatus(id, status as AccountStatus, auth.adminId || "admin");
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Account status updated to ${status}`,
      user: result.user
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: "Failed to update user status", details: errorMsg },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return createUnauthorizedResponse(auth);
  }

  const { id } = await context.params;
  const result = await deleteUserData(id, auth.adminId || "admin");

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: "User account and associated login history purged in accordance with privacy data erasure."
  });
}
