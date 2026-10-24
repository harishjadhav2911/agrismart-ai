import fs from "fs";
import path from "path";
import { isPostgresConfigured, getPostgresPool } from "./postgresReliefStore";
import { createAuthSessionToken } from "../auth/authTokens";

export type UserRole = "farmer" | "admin" | "agronomist";
export type AccountStatus = "active" | "suspended" | "deactivated";
export type AuthProviderType = "email_password" | "google" | "phone";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  accountStatus: AccountStatus;
  authProvider: AuthProviderType;
  preferredLanguage: string;
  location?: {
    state: string;
    district: string;
    taluka: string;
    village: string;
  };
  farmDetails?: {
    farmSize: string;
    soilType: string;
    primaryCrops: string[];
  };
  loginCount: number;
  lastLoginAt: string; // ISO 8601 UTC
  createdAt: string;   // ISO 8601 UTC
  updatedAt: string;   // ISO 8601 UTC
  sessionToken?: string;
}

/**
 * Anonymizes client IP addresses by masking trailing segments to respect data privacy standards (GDPR/DPDP).
 */
export function sanitizeAndMaskIp(ip?: string): string | undefined {
  if (!ip || typeof ip !== "string") return undefined;
  const clean = ip.trim();
  if (/^(\d{1,3}\.\d{1,3}\.\d{1,3})\.\d{1,3}$/.test(clean)) {
    return clean.replace(/^(\d{1,3}\.\d{1,3}\.\d{1,3})\.\d{1,3}$/, "$1.xxx");
  }
  if (clean.includes(":")) {
    const parts = clean.split(":");
    return parts.slice(0, 3).join(":") + "::xxxx";
  }
  return clean.slice(0, 45);
}

export interface LoginAuditLog {
  id: string;
  userId: string;
  email: string;
  eventType: "registration_success" | "login_success" | "status_change";
  authProvider: string;
  ipAddress?: string;
  createdAt: string; // ISO 8601 UTC
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  action: "view_users" | "view_details" | "update_status" | "delete_user" | "export_data";
  targetUserId?: string;
  details: Record<string, unknown>;
  createdAt: string; // ISO 8601 UTC
}

export interface UserStoreDatabase {
  metadata: {
    schemaVersion: string;
    lastUpdated: string;
    totalUsers: number;
  };
  users: UserRecord[];
  login_audit_logs: LoginAuditLog[];
  admin_audit_logs: AdminAuditLog[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const USER_DB_FILE = path.join(DATA_DIR, "user_store.json");
const USER_DB_BACKUP_FILE = path.join(DATA_DIR, "user_store.backup.json");

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getInitialUserSeed(): UserStoreDatabase {
  const now = new Date().toISOString();
  return {
    metadata: {
      schemaVersion: "1.0.0",
      lastUpdated: now,
      totalUsers: 3
    },
    users: [
      {
        id: "usr_ramesh_kumar_123",
        name: "Ramesh Kumar",
        email: "farmer@agrismart.com",
        phone: "+91 9876543210",
        role: "farmer",
        accountStatus: "active",
        authProvider: "email_password",
        preferredLanguage: "hi",
        location: {
          state: "Maharashtra",
          district: "Pune",
          taluka: "Haveli",
          village: "Khadakwasla"
        },
        farmDetails: {
          farmSize: "5 Acres",
          soilType: "Black Soil",
          primaryCrops: ["Cotton", "Soybean"]
        },
        loginCount: 14,
        lastLoginAt: now,
        createdAt: "2026-09-15T08:30:00.000Z",
        updatedAt: now
      },
      {
        id: "usr_sunita_patil_456",
        name: "Sunita Patil",
        email: "sunita.farmer@example.com",
        phone: "+91 9822012345",
        role: "farmer",
        accountStatus: "active",
        authProvider: "google",
        preferredLanguage: "mr",
        location: {
          state: "Maharashtra",
          district: "Kolhapur",
          taluka: "Karvir",
          village: "Uchgaon"
        },
        farmDetails: {
          farmSize: "3.5 Acres",
          soilType: "Clay Loam",
          primaryCrops: ["Sugarcane", "Rice"]
        },
        loginCount: 8,
        lastLoginAt: "2026-10-22T11:15:00.000Z",
        createdAt: "2026-10-01T10:00:00.000Z",
        updatedAt: now
      },
      {
        id: "usr_admin_system_001",
        name: "AgriSmart System Admin",
        email: "admin@agrismart.gov.in",
        phone: "+91 9422000000",
        role: "admin",
        accountStatus: "active",
        authProvider: "email_password",
        preferredLanguage: "en",
        loginCount: 42,
        lastLoginAt: now,
        createdAt: "2026-08-01T00:00:00.000Z",
        updatedAt: now
      }
    ],
    login_audit_logs: [
      {
        id: "log_init_001",
        userId: "usr_ramesh_kumar_123",
        email: "farmer@agrismart.com",
        eventType: "registration_success",
        authProvider: "email_password",
        createdAt: "2026-09-15T08:30:00.000Z"
      },
      {
        id: "log_init_002",
        userId: "usr_sunita_patil_456",
        email: "sunita.farmer@example.com",
        eventType: "registration_success",
        authProvider: "google",
        createdAt: "2026-10-01T10:00:00.000Z"
      }
    ],
    admin_audit_logs: []
  };
}

export function getUserDatabase(): UserStoreDatabase {
  ensureDataDir();
  if (!fs.existsSync(USER_DB_FILE)) {
    const seed = getInitialUserSeed();
    saveUserDatabase(seed);
    return seed;
  }

  try {
    const raw = fs.readFileSync(USER_DB_FILE, "utf-8");
    const data = JSON.parse(raw) as UserStoreDatabase;
    return data;
  } catch (err) {
    console.error("Failed to parse user_store.json, attempting backup restore:", err);
    if (fs.existsSync(USER_DB_BACKUP_FILE)) {
      try {
        const backupRaw = fs.readFileSync(USER_DB_BACKUP_FILE, "utf-8");
        return JSON.parse(backupRaw) as UserStoreDatabase;
      } catch (backupErr) {
        console.error("Backup also unreadable:", backupErr);
      }
    }
    const seed = getInitialUserSeed();
    saveUserDatabase(seed);
    return seed;
  }
}

export function saveUserDatabase(db: UserStoreDatabase): boolean {
  ensureDataDir();
  try {
    db.metadata.lastUpdated = new Date().toISOString();
    db.metadata.totalUsers = db.users.length;
    const json = JSON.stringify(db, null, 2);
    const tempFile = path.join(DATA_DIR, `user_store_${Date.now()}.tmp`);

    fs.writeFileSync(tempFile, json, "utf-8");
    if (fs.existsSync(USER_DB_FILE)) {
      try {
        fs.copyFileSync(USER_DB_FILE, USER_DB_BACKUP_FILE);
      } catch {
        // ignore backup copy failure
      }
    }
    try {
      fs.renameSync(tempFile, USER_DB_FILE);
    } catch {
      // Windows EPERM / file lock fallback
      fs.copyFileSync(tempFile, USER_DB_FILE);
      try {
        fs.unlinkSync(tempFile);
      } catch {
        // temp file cleanup
      }
    }
    return true;
  } catch (err) {
    console.error("Failed to save user database atomically:", err);
    return false;
  }
}

// ============================================================================
// ASYNC STORE METHODS (POSTGRESQL WITH AUTOMATIC FALLBACK)
// ============================================================================

export async function getUserById(id: string): Promise<UserRecord | null> {
  if (isPostgresConfigured()) {
    try {
      const p = getPostgresPool();
      const res = await p.query(`SELECT * FROM users WHERE id = $1 LIMIT 1`, [id]);
      if (res.rows.length > 0) {
        const r = res.rows[0];
        return {
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone || undefined,
          role: r.role as UserRole,
          accountStatus: r.account_status as AccountStatus,
          authProvider: r.auth_provider as AuthProviderType,
          preferredLanguage: r.preferred_language || "en",
          location: r.state ? {
            state: r.state,
            district: r.district || "",
            taluka: r.taluka || "",
            village: r.village || ""
          } : undefined,
          farmDetails: r.farm_size ? {
            farmSize: r.farm_size,
            soilType: r.soil_type || "",
            primaryCrops: r.primary_crops || []
          } : undefined,
          loginCount: r.login_count,
          lastLoginAt: new Date(r.last_login_at).toISOString(),
          createdAt: new Date(r.created_at).toISOString(),
          updatedAt: new Date(r.updated_at).toISOString(),
          sessionToken: createAuthSessionToken(r.id, r.email)
        };
      }
      return null;
    } catch (err) {
      console.warn("[UserStore] Postgres query failed, falling back to JSON:", err);
    }
  }

  const db = getUserDatabase();
  const user = db.users.find(u => u.id === id) || null;
  if (user) {
    user.sessionToken = createAuthSessionToken(user.id, user.email);
  }
  return user;
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const normalizedEmail = email.toLowerCase().trim();

  if (isPostgresConfigured()) {
    try {
      const p = getPostgresPool();
      const res = await p.query(`SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1`, [normalizedEmail]);
      if (res.rows.length > 0) {
        const r = res.rows[0];
        return {
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone || undefined,
          role: r.role as UserRole,
          accountStatus: r.account_status as AccountStatus,
          authProvider: r.auth_provider as AuthProviderType,
          preferredLanguage: r.preferred_language || "en",
          location: r.state ? {
            state: r.state,
            district: r.district || "",
            taluka: r.taluka || "",
            village: r.village || ""
          } : undefined,
          farmDetails: r.farm_size ? {
            farmSize: r.farm_size,
            soilType: r.soil_type || "",
            primaryCrops: r.primary_crops || []
          } : undefined,
          loginCount: r.login_count,
          lastLoginAt: new Date(r.last_login_at).toISOString(),
          createdAt: new Date(r.created_at).toISOString(),
          updatedAt: new Date(r.updated_at).toISOString(),
          sessionToken: createAuthSessionToken(r.id, r.email)
        };
      }
      return null;
    } catch (err) {
      console.warn("[UserStore] Postgres query failed, falling back to JSON:", err);
    }
  }

  const db = getUserDatabase();
  const user = db.users.find(u => u.email.toLowerCase() === normalizedEmail) || null;
  if (user) {
    user.sessionToken = createAuthSessionToken(user.id, user.email);
  }
  return user;
}

export async function registerUser(
  data: {
    name: string;
    email: string;
    phone?: string;
    preferredLanguage?: string;
    role?: UserRole;
    location?: { state?: string; district?: string; taluka?: string; village?: string };
    farmDetails?: { farmSize?: string; soilType?: string; primaryCrops?: string[] };
  },
  authProvider: AuthProviderType = "email_password",
  ipAddress?: string
): Promise<{ success: boolean; user?: UserRecord; error?: string }> {
  const normalizedEmail = data.email?.toLowerCase().trim();
  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { success: false, error: "A valid email address is required." };
  }

  const trimmedName = data.name?.trim();
  if (!trimmedName || trimmedName.length < 2) {
    return { success: false, error: "Name must be at least 2 characters." };
  }

  const existing = await getUserByEmail(normalizedEmail);
  if (existing) {
    return { success: false, error: "An account with this email address already exists." };
  }

  const now = new Date().toISOString();
  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const sessionToken = createAuthSessionToken(userId, normalizedEmail);
  const maskedIp = sanitizeAndMaskIp(ipAddress);

  const newUser: UserRecord = {
    id: userId,
    name: trimmedName,
    email: normalizedEmail,
    phone: data.phone?.trim() || undefined,
    role: "farmer", // Strict least privilege: registrants cannot assign themselves admin role
    accountStatus: "active",
    authProvider,
    preferredLanguage: data.preferredLanguage || "en",
    location: data.location ? {
      state: data.location.state || "Maharashtra",
      district: data.location.district || "",
      taluka: data.location.taluka || "",
      village: data.location.village || ""
    } : undefined,
    farmDetails: data.farmDetails ? {
      farmSize: data.farmDetails.farmSize || "",
      soilType: data.farmDetails.soilType || "",
      primaryCrops: data.farmDetails.primaryCrops || []
    } : undefined,
    loginCount: 1,
    lastLoginAt: now,
    createdAt: now,
    updatedAt: now,
    sessionToken
  };

  const auditLog: LoginAuditLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId,
    email: normalizedEmail,
    eventType: "registration_success",
    authProvider,
    ipAddress: maskedIp,
    createdAt: now
  };

  // Always persist locally
  const localDb = getUserDatabase();
  localDb.users.unshift(newUser);
  localDb.login_audit_logs.unshift(auditLog);
  saveUserDatabase(localDb);

  // If Postgres is configured, persist to database
  if (isPostgresConfigured()) {
    try {
      const p = getPostgresPool();
      await p.query(
        `INSERT INTO users (
          id, name, email, phone, role, account_status, auth_provider,
          preferred_language, state, district, taluka, village,
          farm_size, soil_type, primary_crops, login_count,
          last_login_at, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        ON CONFLICT (email) DO NOTHING`,
        [
          newUser.id, newUser.name, newUser.email, newUser.phone || null, newUser.role,
          newUser.accountStatus, newUser.authProvider, newUser.preferredLanguage,
          newUser.location?.state || null, newUser.location?.district || null,
          newUser.location?.taluka || null, newUser.location?.village || null,
          newUser.farmDetails?.farmSize || null, newUser.farmDetails?.soilType || null,
          newUser.farmDetails?.primaryCrops || [], newUser.loginCount,
          newUser.lastLoginAt, newUser.createdAt, newUser.updatedAt
        ]
      );

      await p.query(
        `INSERT INTO login_audit_logs (id, user_id, email, event_type, auth_provider, ip_address, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [auditLog.id, auditLog.userId, auditLog.email, auditLog.eventType, auditLog.authProvider, auditLog.ipAddress || null, auditLog.createdAt]
      );
    } catch (err) {
      console.warn("[UserStore] Failed to write new user to PostgreSQL:", err);
    }
  }

  return { success: true, user: newUser };
}

export async function recordSuccessfulLogin(
  email: string,
  authProvider: AuthProviderType = "email_password",
  ipAddress?: string
): Promise<{ success: boolean; user?: UserRecord; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await getUserByEmail(normalizedEmail);

  if (!user) {
    return { success: false, error: "User record not found." };
  }

  if (user.accountStatus === "suspended" || user.accountStatus === "deactivated") {
    return { success: false, error: `Account is ${user.accountStatus}. Please contact support.` };
  }

  const now = new Date();
  const nowIso = now.toISOString();

  // Deduplication check: if login was recorded within the last 5 seconds, do not increment count
  const lastLoginTime = new Date(user.lastLoginAt).getTime();
  const isDuplicateRetry = now.getTime() - lastLoginTime < 5000;

  if (!isDuplicateRetry) {
    user.loginCount += 1;
  }
  user.lastLoginAt = nowIso;
  user.updatedAt = nowIso;

  user.sessionToken = createAuthSessionToken(user.id, user.email);
  const maskedIp = sanitizeAndMaskIp(ipAddress);

  const auditLog: LoginAuditLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId: user.id,
    email: normalizedEmail,
    eventType: "login_success",
    authProvider,
    ipAddress: maskedIp,
    createdAt: nowIso
  };

  // Update local file
  const localDb = getUserDatabase();
  const localIdx = localDb.users.findIndex(u => u.id === user.id);
  if (localIdx >= 0) {
    localDb.users[localIdx] = user;
  } else {
    localDb.users.unshift(user);
  }
  if (!isDuplicateRetry) {
    localDb.login_audit_logs.unshift(auditLog);
  }
  saveUserDatabase(localDb);

  // Update PostgreSQL if configured
  if (isPostgresConfigured()) {
    try {
      const p = getPostgresPool();
      await p.query(
        `UPDATE users
         SET login_count = $1, last_login_at = $2, updated_at = $3
         WHERE id = $4`,
        [user.loginCount, user.lastLoginAt, user.updatedAt, user.id]
      );

      if (!isDuplicateRetry) {
        await p.query(
          `INSERT INTO login_audit_logs (id, user_id, email, event_type, auth_provider, ip_address, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [auditLog.id, auditLog.userId, auditLog.email, auditLog.eventType, auditLog.authProvider, auditLog.ipAddress || null, auditLog.createdAt]
        );
      }
    } catch (err) {
      console.warn("[UserStore] Failed to update login record in PostgreSQL:", err);
    }
  }

  return { success: true, user };
}

export async function listUsersForAdmin(params: {
  search?: string;
  status?: string;
  provider?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}): Promise<{
  users: UserRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 10));

  if (isPostgresConfigured()) {
    try {
      const p = getPostgresPool();
      const conditions: string[] = [];
      const values: (string | number)[] = [];
      let valIdx = 1;

      if (params.search) {
        conditions.push(`(name ILIKE $${valIdx} OR email ILIKE $${valIdx})`);
        values.push(`%${params.search}%`);
        valIdx++;
      }

      if (params.status && params.status !== "all") {
        conditions.push(`account_status = $${valIdx}`);
        values.push(params.status);
        valIdx++;
      }

      if (params.provider && params.provider !== "all") {
        conditions.push(`auth_provider = $${valIdx}`);
        values.push(params.provider);
        valIdx++;
      }

      if (params.role && params.role !== "all") {
        conditions.push(`role = $${valIdx}`);
        values.push(params.role);
        valIdx++;
      }

      if (params.startDate) {
        conditions.push(`created_at >= $${valIdx}`);
        values.push(params.startDate);
        valIdx++;
      }

      if (params.endDate) {
        conditions.push(`created_at <= $${valIdx}`);
        values.push(params.endDate);
        valIdx++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      const countRes = await p.query(`SELECT COUNT(*) FROM users ${whereClause}`, values);
      const total = parseInt(countRes.rows[0].count, 10);
      const totalPages = Math.ceil(total / limit) || 1;

      const offset = (page - 1) * limit;
      const query = `
        SELECT * FROM users
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${valIdx} OFFSET $${valIdx + 1}
      `;
      const rowsRes = await p.query(query, [...values, limit, offset]);

      const users: UserRecord[] = rowsRes.rows.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone || undefined,
        role: r.role as UserRole,
        accountStatus: r.account_status as AccountStatus,
        authProvider: r.auth_provider as AuthProviderType,
        preferredLanguage: r.preferred_language || "en",
        location: r.state ? {
          state: r.state,
          district: r.district || "",
          taluka: r.taluka || "",
          village: r.village || ""
        } : undefined,
        farmDetails: r.farm_size ? {
          farmSize: r.farm_size,
          soilType: r.soil_type || "",
          primaryCrops: r.primary_crops || []
        } : undefined,
        loginCount: r.login_count,
        lastLoginAt: new Date(r.last_login_at).toISOString(),
        createdAt: new Date(r.created_at).toISOString(),
        updatedAt: new Date(r.updated_at).toISOString()
      }));

      return { users, total, page, limit, totalPages };
    } catch (err) {
      console.warn("[UserStore] Postgres list query failed, falling back to JSON:", err);
    }
  }

  // Local JSON fallback
  const db = getUserDatabase();
  let filtered = [...db.users];

  if (params.search) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }

  if (params.status && params.status !== "all") {
    filtered = filtered.filter(u => u.accountStatus === params.status);
  }

  if (params.provider && params.provider !== "all") {
    filtered = filtered.filter(u => u.authProvider === params.provider);
  }

  if (params.role && params.role !== "all") {
    filtered = filtered.filter(u => u.role === params.role);
  }

  if (params.startDate) {
    const start = new Date(params.startDate).getTime();
    filtered = filtered.filter(u => new Date(u.createdAt).getTime() >= start);
  }

  if (params.endDate) {
    const end = new Date(params.endDate).getTime();
    filtered = filtered.filter(u => new Date(u.createdAt).getTime() <= end);
  }

  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const offset = (page - 1) * limit;
  const users = filtered.slice(offset, offset + limit);

  return { users, total, page, limit, totalPages };
}

export async function getUserAnalytics(): Promise<{
  totalUsers: number;
  activeUsers7d: number;
  newUsersToday: number;
  newUsersThisMonth: number;
  totalLogins: number;
  statusBreakdown: Record<string, number>;
  providerBreakdown: Record<string, number>;
  dailyRegistrations: { date: string; count: number }[];
  monthlyRegistrations: { month: string; count: number }[];
}> {
  const db = getUserDatabase();
  const users = db.users;
  const now = new Date();
  const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;

  const todayStr = now.toISOString().split("T")[0];
  const thisMonthStr = todayStr.substring(0, 7);

  let activeUsers7d = 0;
  let newUsersToday = 0;
  let newUsersThisMonth = 0;
  let totalLogins = 0;

  const statusBreakdown: Record<string, number> = { active: 0, suspended: 0, deactivated: 0 };
  const providerBreakdown: Record<string, number> = { email_password: 0, google: 0, other: 0 };

  const dayCounts: Record<string, number> = {};
  const monthCounts: Record<string, number> = {};

  // Initialize last 14 days
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split("T")[0];
    dayCounts[key] = 0;
  }

  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthCounts[key] = 0;
  }

  for (const u of users) {
    totalLogins += u.loginCount || 1;

    // Active in last 7 days
    if (new Date(u.lastLoginAt).getTime() >= sevenDaysAgo) {
      activeUsers7d++;
    }

    // New today
    const createdDate = u.createdAt.split("T")[0];
    if (createdDate === todayStr) {
      newUsersToday++;
    }

    // New this month
    if (createdDate.startsWith(thisMonthStr)) {
      newUsersThisMonth++;
    }

    // Status
    statusBreakdown[u.accountStatus] = (statusBreakdown[u.accountStatus] || 0) + 1;

    // Provider
    const prov = u.authProvider || "email_password";
    if (prov in providerBreakdown) {
      providerBreakdown[prov]++;
    } else {
      providerBreakdown.other = (providerBreakdown.other || 0) + 1;
    }

    // Day grouping
    if (createdDate in dayCounts) {
      dayCounts[createdDate]++;
    }

    // Month grouping
    const monthKey = createdDate.substring(0, 7);
    if (monthKey in monthCounts) {
      monthCounts[monthKey]++;
    }
  }

  const dailyRegistrations = Object.entries(dayCounts).map(([date, count]) => ({ date, count }));
  const monthlyRegistrations = Object.entries(monthCounts).map(([month, count]) => ({ month, count }));

  return {
    totalUsers: users.length,
    activeUsers7d,
    newUsersToday,
    newUsersThisMonth,
    totalLogins,
    statusBreakdown,
    providerBreakdown,
    dailyRegistrations,
    monthlyRegistrations
  };
}

export async function updateUserStatus(
  userId: string,
  newStatus: AccountStatus,
  adminId: string
): Promise<{ success: boolean; user?: UserRecord; error?: string }> {
  const user = await getUserById(userId);
  if (!user) return { success: false, error: "User not found." };

  const oldStatus = user.accountStatus;
  user.accountStatus = newStatus;
  user.updatedAt = new Date().toISOString();

  const auditLog: AdminAuditLog = {
    id: `admin_act_${Date.now()}`,
    adminId,
    action: "update_status",
    targetUserId: userId,
    details: { oldStatus, newStatus },
    createdAt: new Date().toISOString()
  };

  const localDb = getUserDatabase();
  const idx = localDb.users.findIndex(u => u.id === userId);
  if (idx >= 0) {
    localDb.users[idx] = user;
    localDb.admin_audit_logs.unshift(auditLog);
    saveUserDatabase(localDb);
  }

  if (isPostgresConfigured()) {
    try {
      const p = getPostgresPool();
      await p.query(`UPDATE users SET account_status = $1, updated_at = NOW() WHERE id = $2`, [newStatus, userId]);
      await p.query(
        `INSERT INTO admin_audit_logs (id, admin_id, action, target_user_id, details, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [auditLog.id, auditLog.adminId, auditLog.action, auditLog.targetUserId, JSON.stringify(auditLog.details)]
      );
    } catch (err) {
      console.warn("[UserStore] Postgres status update failed:", err);
    }
  }

  return { success: true, user };
}

export async function deleteUserData(
  userId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  const localDb = getUserDatabase();
  const idx = localDb.users.findIndex(u => u.id === userId);
  if (idx === -1) return { success: false, error: "User not found." };

  const [removedUser] = localDb.users.splice(idx, 1);
  localDb.login_audit_logs = localDb.login_audit_logs.filter(l => l.userId !== userId);

  const auditLog: AdminAuditLog = {
    id: `admin_act_${Date.now()}`,
    adminId,
    action: "delete_user",
    targetUserId: userId,
    details: { deletedEmail: removedUser.email, reason: "privacy_data_erasure_request" },
    createdAt: new Date().toISOString()
  };
  localDb.admin_audit_logs.unshift(auditLog);
  saveUserDatabase(localDb);

  if (isPostgresConfigured()) {
    try {
      const p = getPostgresPool();
      await p.query(`DELETE FROM login_audit_logs WHERE user_id = $1`, [userId]);
      await p.query(`DELETE FROM users WHERE id = $1`, [userId]);
      await p.query(
        `INSERT INTO admin_audit_logs (id, admin_id, action, target_user_id, details, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [auditLog.id, auditLog.adminId, auditLog.action, auditLog.targetUserId, JSON.stringify(auditLog.details)]
      );
    } catch (err) {
      console.warn("[UserStore] Postgres user deletion failed:", err);
    }
  }

  return { success: true };
}

export async function pruneOldAuditLogs(retentionDays = 90): Promise<{ prunedCount: number }> {
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString();
  const localDb = getUserDatabase();
  const initialCount = localDb.login_audit_logs.length;

  localDb.login_audit_logs = localDb.login_audit_logs.filter(l => l.createdAt >= cutoff);
  const prunedCount = initialCount - localDb.login_audit_logs.length;
  if (prunedCount > 0) {
    saveUserDatabase(localDb);
  }

  if (isPostgresConfigured()) {
    try {
      const p = getPostgresPool();
      await p.query(`DELETE FROM login_audit_logs WHERE created_at < $1`, [cutoff]);
    } catch (err) {
      console.warn("[UserStore] Postgres log pruning failed:", err);
    }
  }

  return { prunedCount };
}
