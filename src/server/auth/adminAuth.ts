import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getUserById } from "../db/userStore";

export interface AdminAuthResult {
  authorized: boolean;
  adminId?: string;
  adminEmail?: string;
  error?: string;
  status: 200 | 401 | 403;
}

/**
 * Constant-time string comparison using SHA-256 digests to prevent timing side channels.
 */
export function timingSafeStringEqual(a: string, b: string): boolean {
  if (!a || !b) return false;
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

/**
 * Generates an HMAC-SHA256 session signature verifying authentic account ownership.
 */
export function createAuthSessionToken(userId: string, email: string): string {
  const secret = (process.env.ADMIN_SECRET || process.env.RELIEF_ADMIN_SECRET || "agrismart_auth_session_secret_2026").trim();
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${userId.toLowerCase().trim()}:${email.toLowerCase().trim()}`);
  return hmac.digest("hex");
}

/**
 * Validates whether a provided session token matches the server-generated signature for that user.
 */
export function verifyAuthSessionToken(userId: string, email: string, candidateToken: string): boolean {
  if (!userId || !email || !candidateToken) return false;
  const expected = createAuthSessionToken(userId, email);
  return timingSafeStringEqual(candidateToken, expected);
}

/**
 * Validates administrative privileges on server endpoints.
 * Requires either:
 * 1. Valid Admin Secret in Authorization header: Bearer <ADMIN_SECRET> or x-admin-key
 * 2. Authenticated user ID with confirmed role === 'admin' and account_status === 'active' verified in database
 */
export async function verifyAdminRequest(req: NextRequest): Promise<AdminAuthResult> {
  const authHeader = req.headers.get("authorization");
  const adminKeyHeader = req.headers.get("x-admin-key") || req.headers.get("x-admin-secret");

  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7).trim() : "";
  const headerToken = adminKeyHeader?.trim() || "";
  const candidateSecret = bearerToken || headerToken;
  const sessionUserId = req.headers.get("x-user-id")?.trim() || "";

  const configuredAdminSecret = (process.env.ADMIN_SECRET || process.env.RELIEF_ADMIN_SECRET)?.trim();

  // If server admin secret is not configured, admin endpoints remain locked for safety
  if (!configuredAdminSecret) {
    return {
      authorized: false,
      error: "Server configuration error: ADMIN_SECRET or RELIEF_ADMIN_SECRET is not configured on the server.",
      status: 403
    };
  }

  // 1. Direct Secret Token verification (Strict constant-time server-side secret check)
  if (timingSafeStringEqual(candidateSecret, configuredAdminSecret)) {
    if (sessionUserId) {
      const user = await getUserById(sessionUserId);
      if (user && user.role === "admin" && user.accountStatus === "active") {
        return {
          authorized: true,
          adminId: user.id,
          adminEmail: user.email,
          status: 200
        };
      }
    }
    return {
      authorized: true,
      adminId: "admin_super_system",
      adminEmail: "admin@agrismart.gov.in",
      status: 200
    };
  }

  // Missing authentication
  if (!candidateSecret && !sessionUserId) {
    return {
      authorized: false,
      error: "Authentication required. Provide an administrative bearer token or admin API key.",
      status: 401
    };
  }

  // Invalid credentials or insufficient permissions
  return {
    authorized: false,
    error: "Forbidden. Administrative access denied.",
    status: 403
  };
}

export function createUnauthorizedResponse(authResult: AdminAuthResult) {
  return NextResponse.json(
    {
      success: false,
      error: authResult.error || "Unauthorized",
      timestamp: new Date().toISOString()
    },
    { status: authResult.status }
  );
}
