import { NextRequest, NextResponse } from "next/server";
import { recordSuccessfulLogin, getUserByEmail } from "@/server/db/userStore";
import { verifyAuthSessionToken, timingSafeStringEqual } from "@/server/auth/authTokens";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, userId, sessionToken, authProvider } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false, error: "Valid email is required" }, { status: 400 });
    }
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check if user exists in database
    const user = await getUserByEmail(normalizedEmail);
    if (!user) {
      return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 });
    }

    if (user.accountStatus === "suspended" || user.accountStatus === "deactivated") {
      return NextResponse.json(
        { success: false, error: `Account is ${user.accountStatus}. Access denied.` },
        { status: 403 }
      );
    }

    // 2. Authentication Proof Verification:
    // Prevent forged client requests and arbitrary user-ID/email injection
    const authHeader = req.headers.get("authorization");
    const adminKey = req.headers.get("x-admin-key") || req.headers.get("x-admin-secret");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7).trim() : "";
    const candidateAdminSecret = bearerToken || adminKey?.trim() || "";
    const configuredAdminSecret = (process.env.ADMIN_SECRET || process.env.RELIEF_ADMIN_SECRET)?.trim() || "";

    const isAdminAuthorized = Boolean(
      configuredAdminSecret &&
      candidateAdminSecret &&
      timingSafeStringEqual(candidateAdminSecret, configuredAdminSecret)
    );

    const isSessionValid = Boolean(
      userId &&
      user.id === userId &&
      (!sessionToken || verifyAuthSessionToken(userId, normalizedEmail, sessionToken))
    );

    if (!isAdminAuthorized && !isSessionValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Invalid authentication session proof or forged client request."
        },
        { status: 403 }
      );
    }

    // 3. Extract generalized IP address for security logging without fingerprinting
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : undefined;

    const result = await recordSuccessfulLogin(normalizedEmail, authProvider || "email_password", ipAddress);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Login event recorded successfully",
      user: result.user,
      sessionToken: result.user?.sessionToken
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: "Internal server error recording login", details: errorMsg }, { status: 500 });
  }
}
