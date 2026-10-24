import crypto from "crypto";

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
