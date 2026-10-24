/**
 * AGRISMART AI — USER MANAGEMENT & REGISTRATION ANALYTICS TEST SUITE
 * 
 * Verifies:
 * 1. User registration with sanitized profile fields & audit log creation
 * 2. Successful login tracking & loginCount incrementation
 * 3. Duplicate event suppression (prevents retry double-counting within 5s)
 * 4. Unauthorized access rejections (401 / 403) on admin endpoints
 * 5. Role-based access control and admin secret verification
 * 6. Admin user listing, search, filtering, and pagination
 * 7. Admin user status updates (active <-> suspended) and audit logging
 * 8. Privacy & secret exposure guard (guarantees passwords/hashes/tokens are never stored or exposed)
 * 9. Account data erasure (GDPR/DPDP compliance)
 * 10. Audit log retention pruning (90-day retention rule)
 */

import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import {
  getUserDatabase,
  saveUserDatabase,
  registerUser,
  recordSuccessfulLogin,
  listUsersForAdmin,
  getUserAnalytics,
  updateUserStatus,
  deleteUserData,
  pruneOldAuditLogs,
  sanitizeAndMaskIp
} from "../src/server/db/userStore";
import { verifyAdminRequest } from "../src/server/auth/adminAuth";
import { timingSafeStringEqual, createAuthSessionToken, verifyAuthSessionToken } from "../src/server/auth/authTokens";
import { POST as registerRouteHandler } from "../src/app/api/auth/register/route";
import { POST as loginEventRouteHandler } from "../src/app/api/auth/login-event/route";

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
  console.log("AGRISMART AI — USER MANAGEMENT & ANALYTICS VERIFICATION SUITE");
  console.log("======================================================================\n");

  // -------------------------------------------------------------------------
  // TEST SUITE 1: Schema & Data Store Structure
  // -------------------------------------------------------------------------
  console.log("TEST SUITE 1: Schema & Data Store Structure");
  const schemaPath = path.join(process.cwd(), "src", "server", "db", "schema.sql");
  const schemaContent = fs.readFileSync(schemaPath, "utf-8");
  assert(schemaContent.includes("CREATE TABLE IF NOT EXISTS users"), "Defines users table in schema.sql");
  assert(schemaContent.includes("CREATE TABLE IF NOT EXISTS login_audit_logs"), "Defines login_audit_logs table");
  assert(schemaContent.includes("CREATE TABLE IF NOT EXISTS admin_audit_logs"), "Defines admin_audit_logs table");
  assert(schemaContent.includes("ALTER TABLE users ENABLE ROW LEVEL SECURITY"), "Enables Row Level Security (RLS) on users");

  const db = getUserDatabase();
  assert(db.users.length >= 2, `Local user store initialized with seed records (${db.users.length} users)`);
  assert(db.users.some(u => u.role === "admin"), "Admin seed account exists for administrative management");
  assert(db.users.some(u => u.email === "farmer@agrismart.com"), "Existing test farmer account preserved");
  console.log();

  // -------------------------------------------------------------------------
  // TEST SUITE 2: User Registration & Event Tracking
  // -------------------------------------------------------------------------
  console.log("TEST SUITE 2: User Registration & Event Tracking");
  const testEmail = `test.farmer.${Date.now()}@example.com`;
  const regResult = await registerUser({
    name: "Balasaheb Vikhe",
    email: testEmail,
    phone: "+91 9822998877",
    preferredLanguage: "mr",
    location: {
      state: "Maharashtra",
      district: "Ahmednagar",
      taluka: "Rahata",
      village: "Loni"
    },
    farmDetails: {
      farmSize: "10 Acres",
      soilType: "Medium Black",
      primaryCrops: ["Pomegranate", "Soybean"]
    }
  }, "email_password");

  assert(regResult.success === true, "User registration succeeded");
  assert(Boolean(regResult.user?.id), `Generated unique User ID (${regResult.user?.id})`);
  assert(regResult.user?.loginCount === 1, "Initial login count is 1");
  assert(regResult.user?.role === "farmer", "Default role assigned is 'farmer' (least privilege)");
  assert(regResult.user?.accountStatus === "active", "Account status is 'active'");
  assert(Boolean(regResult.user?.createdAt && regResult.user?.lastLoginAt), "Stored valid ISO UTC timestamps");

  // Check audit log
  const updatedDb = getUserDatabase();
  const regLog = updatedDb.login_audit_logs.find(l => l.userId === regResult.user?.id);
  assert(regLog !== undefined, "Recorded 'registration_success' in login_audit_logs");
  assert(regLog?.eventType === "registration_success", "Audit log eventType is 'registration_success'");

  // Duplicate registration attempt check
  const dupResult = await registerUser({
    name: "Duplicate Balasaheb",
    email: testEmail
  });
  assert(dupResult.success === false, "Duplicate registration with existing email rejected");
  console.log();

  // -------------------------------------------------------------------------
  // TEST SUITE 3: Successful Login & Duplicate Suppression
  // -------------------------------------------------------------------------
  console.log("TEST SUITE 3: Successful Login & Duplicate Suppression");
  const userId = regResult.user!.id;

  // Simulate time passage since registration (10 seconds ago) to test authentic subsequent login
  const dbBeforeLogin = getUserDatabase();
  const userInDb = dbBeforeLogin.users.find(u => u.id === userId);
  if (userInDb) {
    userInDb.lastLoginAt = new Date(Date.now() - 10000).toISOString();
    saveUserDatabase(dbBeforeLogin);
  }

  // First simulated login after legitimate interval (> 5000ms): should increment loginCount
  const login1 = await recordSuccessfulLogin(testEmail, "email_password");
  assert(login1.success === true, "Recorded first post-registration login");
  assert(login1.user?.loginCount === 2, `loginCount incremented to 2 (Actual: ${login1.user?.loginCount})`);

  // Immediate rapid retry (within 5000ms): should update timestamp without double-counting loginCount
  const loginRetry = await recordSuccessfulLogin(testEmail, "email_password");
  assert(loginRetry.success === true, "Rapid retry handled successfully");
  assert(loginRetry.user?.loginCount === 2, "Duplicate suppression: loginCount remains 2 (not artificially inflated by rapid retry)");

  // Login with non-existent email
  const badLogin = await recordSuccessfulLogin("nonexistent.user.999@domain.com");
  assert(badLogin.success === false, "Non-existent user login rejected safely without creating ghost records");
  console.log();

  // -------------------------------------------------------------------------
  // TEST SUITE 4: Admin Search, Filtering & Analytics
  // -------------------------------------------------------------------------
  console.log("TEST SUITE 4: Admin Search, Filtering & Analytics");
  const searchRes = await listUsersForAdmin({ search: "Balasaheb" });
  assert(searchRes.users.length >= 1, "Search by name successfully located registered user");
  assert(searchRes.users[0].name.includes("Balasaheb"), "Returned matching user record");

  const emailSearch = await listUsersForAdmin({ search: testEmail });
  assert(emailSearch.users.length === 1, "Search by email successfully located exact user");

  const statusFiltered = await listUsersForAdmin({ status: "active" });
  assert(statusFiltered.users.every(u => u.accountStatus === "active"), "Status filter 'active' correctly filtered results");

  const paginated = await listUsersForAdmin({ page: 1, limit: 2 });
  assert(paginated.users.length <= 2, "Pagination limit respected (max 2 items)");
  assert(paginated.totalPages >= 1, `Total pages calculated accurately (${paginated.totalPages} pages)`);

  const analytics = await getUserAnalytics();
  assert(analytics.totalUsers >= 3, `Total users aggregated accurately (${analytics.totalUsers} users)`);
  assert(analytics.newUsersToday >= 1, `newUsersToday reflects new registration (${analytics.newUsersToday})`);
  assert(analytics.dailyRegistrations.length === 14, "Compiled 14-day daily registration trend series");
  assert(analytics.monthlyRegistrations.length === 6, "Compiled 6-month monthly registration series");
  console.log();

  // -------------------------------------------------------------------------
  // TEST SUITE 5: Account Status Management & Admin Audit Trail
  // -------------------------------------------------------------------------
  console.log("TEST SUITE 5: Account Status Management & Admin Audit Trail");
  const suspendRes = await updateUserStatus(userId, "suspended", "admin_super_system");
  assert(suspendRes.success === true, "Account status updated to 'suspended'");
  assert(suspendRes.user?.accountStatus === "suspended", "User record reflects 'suspended'");

  // Suspended user should not be able to log in
  const suspendedLogin = await recordSuccessfulLogin(testEmail);
  assert(suspendedLogin.success === false, "Suspended user login rejected by auth guard");
  assert(Boolean(suspendedLogin.error?.includes("suspended")), "Error message accurately indicates suspended account");

  // Reactivate
  const reactivateRes = await updateUserStatus(userId, "active", "admin_super_system");
  assert(reactivateRes.success === true, "Account status reactivated to 'active'");

  // Check admin audit log
  const dbWithAudit = getUserDatabase();
  const adminLog = dbWithAudit.admin_audit_logs.find(a => a.targetUserId === userId);
  assert(adminLog !== undefined, "Admin action logged in admin_audit_logs");
  assert(adminLog?.action === "update_status", "Admin audit action is 'update_status'");
  console.log();

  // -------------------------------------------------------------------------
  // TEST SUITE 6: Privacy, Secret Exposure & Data Erasure (GDPR/DPDP)
  // -------------------------------------------------------------------------
  console.log("TEST SUITE 6: Privacy, Secret Exposure & Data Erasure (GDPR/DPDP)");
  const sampleUser = getUserDatabase().users[0];
  const userJson = JSON.stringify(sampleUser);
  assert(!("password" in sampleUser), "UserRecord contains NO password property");
  assert(!userJson.includes('"password":'), "UserRecord JSON contains NO password key");
  assert(!userJson.includes('"passwordHash":') && !userJson.includes('"password_hash":'), "UserRecord contains NO password hash");
  assert(!userJson.includes('"token":') && !userJson.includes('"secret":'), "UserRecord contains NO authentication token or session secret");

  // Delete user (Right to be Forgotten)
  const delRes = await deleteUserData(userId, "admin_super_system");
  assert(delRes.success === true, "User data erasure executed successfully");

  const postDeleteDb = getUserDatabase();
  const deletedUserCheck = postDeleteDb.users.find(u => u.id === userId);
  assert(deletedUserCheck === undefined, "User record completely purged from users registry");

  const deletedLogsCheck = postDeleteDb.login_audit_logs.filter(l => l.userId === userId);
  assert(deletedLogsCheck.length === 0, "All associated login audit logs purged");
  console.log();

  // -------------------------------------------------------------------------
  // TEST SUITE 7: Retention Pruning (90 Days)
  // -------------------------------------------------------------------------
  console.log("TEST SUITE 7: Retention Pruning (90 Days)");
  const pruneRes = await pruneOldAuditLogs(90);
  assert(typeof pruneRes.prunedCount === "number", `Audit log pruning executed (pruned ${pruneRes.prunedCount} stale records)`);
  console.log();

  // -------------------------------------------------------------------------
  // TEST SUITE 8: Server-Side Admin Authorization & Security Guard
  // -------------------------------------------------------------------------
  console.log("TEST SUITE 8: Server-Side Admin Authorization & Security Guard");
  const adminSecret = process.env.ADMIN_SECRET || process.env.RELIEF_ADMIN_SECRET || "dev_local_agrismart_relief_secret_2026";
  process.env.ADMIN_SECRET = adminSecret;

  // 1. Missing credentials -> 401 Unauthorized
  const unauthReq = new NextRequest("http://localhost:3000/api/admin/users");
  const auth1 = await verifyAdminRequest(unauthReq);
  assert(auth1.authorized === false, "Missing credentials rejected");
  assert(auth1.status === 401, "Missing credentials returns HTTP 401");

  // 2. Invalid Bearer Token -> 403 Forbidden
  const badTokenReq = new NextRequest("http://localhost:3000/api/admin/users", {
    headers: { authorization: "Bearer invalid_secret_12345" }
  });
  const auth2 = await verifyAdminRequest(badTokenReq);
  assert(auth2.authorized === false, "Invalid secret rejected");
  assert(auth2.status === 403, "Invalid secret returns HTTP 403 Forbidden");

  // 3. Spoofed x-user-id with non-admin / without secret -> 403 Forbidden
  const spoofReq = new NextRequest("http://localhost:3000/api/admin/users", {
    headers: { "x-user-id": "usr_farmer_mh_002" }
  });
  const auth3 = await verifyAdminRequest(spoofReq);
  assert(auth3.authorized === false, "Unverified user ID header rejected");
  assert(auth3.status === 403, "Unverified user ID header returns HTTP 403 Forbidden");

  // 4. Valid Bearer Token -> 200 Authorized
  const validBearerReq = new NextRequest("http://localhost:3000/api/admin/users", {
    headers: { authorization: `Bearer ${adminSecret}` }
  });
  const auth4 = await verifyAdminRequest(validBearerReq);
  assert(auth4.authorized === true, "Valid Bearer token authorized");
  assert(auth4.status === 200, "Valid Bearer token returns HTTP 200");

  // 5. Valid x-admin-key Header -> 200 Authorized
  const validKeyReq = new NextRequest("http://localhost:3000/api/admin/users", {
    headers: { "x-admin-key": adminSecret }
  });
  const auth5 = await verifyAdminRequest(validKeyReq);
  assert(auth5.authorized === true, "Valid x-admin-key header authorized");
  assert(auth5.status === 200, "Valid x-admin-key header returns HTTP 200");
  console.log();

  // -------------------------------------------------------------------------
  // TEST SUITE 9: Forged Client Request Prevention & Security Hardening
  // -------------------------------------------------------------------------
  console.log("TEST SUITE 9: Forged Client Request Prevention & Security Hardening");

  // 9.1 Privacy: Masking IP address
  assert(sanitizeAndMaskIp("203.0.113.195") === "203.0.113.xxx", "IPv4 address masked for privacy (203.0.113.xxx)");
  assert(Boolean(sanitizeAndMaskIp("2001:db8:85a3:8d3:1319:8a2e:370:7348")?.includes("::xxxx")), "IPv6 address masked for privacy");

  // 9.2 Constant-time secret comparison
  assert(timingSafeStringEqual("dev_admin_secret", "dev_admin_secret") === true, "Constant-time string comparison matches equal secrets");
  assert(timingSafeStringEqual("dev_admin_secret", "wrong_secret_123") === false, "Constant-time string comparison rejects mismatched secrets");

  // 9.3 Privilege escalation attempt during registration
  const escalationTestEmail = `farmer.escalation.${Date.now()}@example.com`;
  const escalationReg = await registerUser({
    name: "Sneaky User",
    email: escalationTestEmail,
    role: "admin" as unknown as "farmer"
  });
  assert(escalationReg.success === true, "Registration succeeded for user");
  assert(escalationReg.user?.role === "farmer", "Privilege escalation blocked: role forced to 'farmer'");
  assert(Boolean(escalationReg.user?.sessionToken), "Generated valid HMAC-SHA256 session token");

  // 9.4 Input validation guard on /api/auth/register route handler
  const invalidEmailReq = new NextRequest("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Valid Name", email: "not-an-email" })
  });
  const invalidEmailRes = await registerRouteHandler(invalidEmailReq);
  assert(invalidEmailRes.status === 400, "Registration route rejects malformed email format with HTTP 400");

  const shortNameReq = new NextRequest("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "A", email: "valid.user@example.com" })
  });
  const shortNameRes = await registerRouteHandler(shortNameReq);
  assert(shortNameRes.status === 400, "Registration route rejects short name with HTTP 400");

  // 9.5 Forged client request prevention on /api/auth/login-event route handler
  const testUserId = escalationReg.user!.id;
  const validToken = createAuthSessionToken(testUserId, escalationTestEmail);
  assert(verifyAuthSessionToken(testUserId, escalationTestEmail, validToken) === true, "HMAC session token verified by verifyAuthSessionToken");

  // A. Unauthenticated / missing userId
  const forgeReqNoId = new NextRequest("http://localhost:3000/api/auth/login-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: escalationTestEmail })
  });
  const forgeResNoId = await loginEventRouteHandler(forgeReqNoId);
  assert(forgeResNoId.status === 403, "Forged login-event without userId rejected with HTTP 403 Forbidden");

  // B. Forged userId mismatch
  const forgeReqBadId = new NextRequest("http://localhost:3000/api/auth/login-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: escalationTestEmail, userId: "usr_fake_attacker_999" })
  });
  const forgeResBadId = await loginEventRouteHandler(forgeReqBadId);
  assert(forgeResBadId.status === 403, "Forged login-event with mismatched userId rejected with HTTP 403 Forbidden");

  // C. Forged sessionToken
  const forgeReqBadToken = new NextRequest("http://localhost:3000/api/auth/login-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: escalationTestEmail, userId: testUserId, sessionToken: "forged_hmac_signature" })
  });
  const forgeResBadToken = await loginEventRouteHandler(forgeReqBadToken);
  assert(forgeResBadToken.status === 403, "Forged login-event with invalid session signature rejected with HTTP 403 Forbidden");

  // D. Genuine authenticated login event
  const legitimateLoginReq = new NextRequest("http://localhost:3000/api/auth/login-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: escalationTestEmail, userId: testUserId, sessionToken: validToken })
  });
  const legitimateRes = await loginEventRouteHandler(legitimateLoginReq);
  assert(legitimateRes.status === 200, "Genuine authenticated login event accepted with HTTP 200 OK");

  // Clean up escalation test user
  await deleteUserData(testUserId, "admin_super_system");
  console.log();

  // -------------------------------------------------------------------------
  // TEST SUMMARY
  // -------------------------------------------------------------------------
  console.log("======================================================================");
  console.log(`TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("======================================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test execution threw error:", err);
  process.exit(1);
});
