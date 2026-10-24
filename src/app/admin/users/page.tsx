"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, UserCheck, Shield, ShieldAlert, Key, Search,
  RefreshCw, ChevronLeft, ChevronRight, Eye, Clock,
  CheckCircle, AlertTriangle, Trash2, BarChart3,
  TrendingUp, FileText, Lock, X
} from "lucide-react";
import { UserRecord } from "@/server/db/userStore";
import { useAuth } from "@/context/AuthContext";

interface AnalyticsData {
  totalUsers: number;
  activeUsers7d: number;
  newUsersToday: number;
  newUsersThisMonth: number;
  totalLogins: number;
  statusBreakdown: Record<string, number>;
  providerBreakdown: Record<string, number>;
  dailyRegistrations: { date: string; count: number }[];
  monthlyRegistrations: { month: string; count: number }[];
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [adminKey, setAdminKey] = useState<string>("");
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Data State
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Modals
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [userLogs, setUserLogs] = useState<{ id: string; eventType: string; createdAt: string; authProvider: string }[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);

  const fetchUsersList = useCallback(async (
    token: string,
    targetPage: number,
    query: string,
    status: string,
    provider: string,
    role: string
  ) => {
    setIsLoadingUsers(true);
    try {
      const effectiveToken = token || adminKey || (typeof window !== "undefined" ? sessionStorage.getItem("agrismart_admin_token") || "" : "");
      const params = new URLSearchParams({
        page: String(targetPage),
        limit: "10"
      });
      if (query.trim()) params.append("search", query.trim());
      if (status !== "all") params.append("status", status);
      if (provider !== "all") params.append("provider", provider);
      if (role !== "all") params.append("role", role);

      const headers: Record<string, string> = {};
      if (effectiveToken) {
        headers["Authorization"] = `Bearer ${effectiveToken}`;
      }
      if (user?.id) {
        headers["x-user-id"] = user.id;
        headers["x-user-email"] = user.email;
      }

      const res = await fetch(`/api/admin/users?${params.toString()}`, { headers });
      if (res.ok) {
        const json = await res.json();
        setUsers(json.users || []);
        setTotalUsers(json.total || 0);
        setPage(json.page || 1);
        setTotalPages(json.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch users list:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [adminKey, user]);

  const verifyAndLoad = useCallback(async (keyToTest: string) => {
    setIsCheckingAuth(true);
    setAuthError("");

    try {
      const headers: Record<string, string> = {};
      if (keyToTest) {
        headers["Authorization"] = `Bearer ${keyToTest}`;
      }
      if (user?.id) {
        headers["x-user-id"] = user.id;
        headers["x-user-email"] = user.email;
      }

      const res = await fetch("/api/admin/analytics", { headers });
      if (res.ok) {
        const json = await res.json();
        setAnalytics(json.analytics);
        setIsAuthorized(true);
        if (keyToTest && typeof window !== "undefined") {
          sessionStorage.setItem("agrismart_admin_token", keyToTest);
        }
        // Load initial users
        fetchUsersList(keyToTest, 1, searchQuery, statusFilter, providerFilter, roleFilter);
      } else {
        const json = await res.json();
        setIsAuthorized(false);
        setAuthError(json.error || "Administrative authentication required.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setIsAuthorized(false);
      setAuthError(`Connection error: ${msg}`);
    } finally {
      setIsCheckingAuth(false);
    }
  }, [user, searchQuery, statusFilter, providerFilter, roleFilter, fetchUsersList]);

  // Check stored admin key on mount
  useEffect(() => {
    let isMounted = true;
    const initAdminAuth = async () => {
      const savedKey = typeof window !== "undefined" ? sessionStorage.getItem("agrismart_admin_token") || "" : "";
      if (savedKey) {
        if (isMounted) setAdminKey(savedKey);
        await verifyAndLoad(savedKey);
      } else if (user?.role === "admin") {
        await verifyAndLoad("");
      } else {
        if (isMounted) setIsCheckingAuth(false);
      }
    };
    void initAdminAuth();
    return () => {
      isMounted = false;
    };
  }, [user, verifyAndLoad]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) {
      setAuthError("Please enter your Administrative Access Key.");
      return;
    }
    verifyAndLoad(adminKey.trim());
  };

  const handleAdminLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("agrismart_admin_token");
    }
    setAdminKey("");
    setIsAuthorized(false);
    setUsers([]);
    setAnalytics(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsersList(adminKey, 1, searchQuery, statusFilter, providerFilter, roleFilter);
  };

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1);
    fetchUsersList(adminKey, 1, searchQuery, newStatus, providerFilter, roleFilter);
  };

  const handleProviderFilterChange = (newProvider: string) => {
    setProviderFilter(newProvider);
    setPage(1);
    fetchUsersList(adminKey, 1, searchQuery, statusFilter, newProvider, roleFilter);
  };

  const handleRoleFilterChange = (newRole: string) => {
    setRoleFilter(newRole);
    setPage(1);
    fetchUsersList(adminKey, 1, searchQuery, statusFilter, providerFilter, newRole);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchUsersList(adminKey, newPage, searchQuery, statusFilter, providerFilter, roleFilter);
  };

  const handleOpenUserDetails = async (u: UserRecord) => {
    setSelectedUser(u);
    setIsLoadingLogs(true);
    setUserLogs([]);
    try {
      const effectiveToken = adminKey || sessionStorage.getItem("agrismart_admin_token") || "";
      const headers: Record<string, string> = {};
      if (effectiveToken) headers["Authorization"] = `Bearer ${effectiveToken}`;
      if (user?.id) {
        headers["x-user-id"] = user.id;
        headers["x-user-email"] = user.email;
      }

      const res = await fetch(`/api/admin/users/${u.id}`, { headers });
      if (res.ok) {
        const json = await res.json();
        setUserLogs(json.logs || []);
      }
    } catch (err) {
      console.error("Failed to fetch user logs:", err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleUpdateStatus = async (userId: string, newStatus: "active" | "suspended" | "deactivated") => {
    try {
      const effectiveToken = adminKey || sessionStorage.getItem("agrismart_admin_token") || "";
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (effectiveToken) headers["Authorization"] = `Bearer ${effectiveToken}`;
      if (user?.id) {
        headers["x-user-id"] = user.id;
        headers["x-user-email"] = user.email;
      }

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        const json = await res.json();
        setActionMessage({ text: `Account status updated to ${newStatus}.`, type: "success" });
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(json.user);
        }
        // Refresh list
        fetchUsersList(adminKey, page, searchQuery, statusFilter, providerFilter, roleFilter);
      } else {
        const json = await res.json();
        setActionMessage({ text: json.error || "Failed to update status", type: "error" });
      }
    } catch {
      setActionMessage({ text: "Network error updating status", type: "error" });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to permanently erase this user's account and login audit history? This action complies with privacy data erasure and cannot be undone.")) {
      return;
    }

    try {
      const effectiveToken = adminKey || sessionStorage.getItem("agrismart_admin_token") || "";
      const headers: Record<string, string> = {};
      if (effectiveToken) headers["Authorization"] = `Bearer ${effectiveToken}`;
      if (user?.id) {
        headers["x-user-id"] = user.id;
        headers["x-user-email"] = user.email;
      }

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers
      });

      if (res.ok) {
        setActionMessage({ text: "User account and history permanently erased.", type: "success" });
        setSelectedUser(null);
        fetchUsersList(adminKey, page, searchQuery, statusFilter, providerFilter, roleFilter);
      } else {
        const json = await res.json();
        setActionMessage({ text: json.error || "Failed to delete user", type: "error" });
      }
    } catch {
      setActionMessage({ text: "Network error deleting user", type: "error" });
    }
  };

  const formatDate = (isoString: string | null | undefined): string => {
    if (!isoString) return "Never";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-gray-200 dark:border-gray-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-500/20">
                ADMIN CONSOLE
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                AgriSmart AI v2.2
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
              User Management & Registration Analytics
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Protected administrative registry, farmer demographics, login counts, and compliance audit trail.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80 shadow-sm transition-all"
            >
              <FileText size={15} className="text-primary-600 dark:text-primary-400" />
              <span>Privacy & Retention Notice</span>
            </button>

            {isAuthorized && (
              <button
                onClick={handleAdminLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all"
              >
                <Lock size={15} />
                <span>Lock Session</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Feedback Banner */}
        {actionMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-2xl border text-sm flex items-center justify-between ${
              actionMessage.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {actionMessage.type === "success" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
              <span>{actionMessage.text}</span>
            </div>
            <button onClick={() => setActionMessage(null)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </motion.div>
        )}

        {/* 1. AUTHENTICATION REQUIRED GUARD */}
        {!isAuthorized ? (
          <div className="max-w-md mx-auto my-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                <ShieldAlert size={28} />
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Administrative Authentication Required
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-6">
                User management and registration records contain sensitive farmer account information. Access is restricted to authorized platform administrators.
              </p>

              {authError && (
                <div className="p-3 mb-6 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-xs border border-red-200 dark:border-red-900/50 text-left flex items-start gap-2">
                  <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Administrative Access Key
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={adminKey}
                      onChange={(e) => setAdminKey(e.target.value)}
                      placeholder="Enter RELIEF_ADMIN_SECRET..."
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                    />
                    <Key size={16} className="absolute right-3.5 top-3 text-gray-400" />
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                    Configured server-side in <code>RELIEF_ADMIN_SECRET</code> or <code>ADMIN_SECRET</code>.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isCheckingAuth}
                  className="w-full py-2.5 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-primary-600/30 disabled:opacity-50"
                >
                  {isCheckingAuth ? "Verifying Credentials..." : "Authenticate Admin Session"}
                </button>
              </form>
            </motion.div>
          </div>
        ) : (
          /* 2. AUTHORIZED DASHBOARD VIEW */
          <div className="space-y-8">
            {/* KPI Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Registered
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Users size={16} />
                  </div>
                </div>
                <div className="text-3xl font-black text-gray-900 dark:text-white">
                  {analytics?.totalUsers ?? totalUsers}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Active in database
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Active This Week
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <UserCheck size={16} />
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {analytics?.activeUsers7d ?? 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Logged in last 7 days
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    New This Month
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
                  {analytics?.newUsersThisMonth ?? 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {analytics?.newUsersToday ?? 0} joined today
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Logins Tracked
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                </div>
                <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
                  {analytics?.totalLogins ?? 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Server-side verified sessions
                </div>
              </div>
            </div>

            {/* Registration Trends Chart (Visual Representation) */}
            {analytics?.dailyRegistrations && analytics.dailyRegistrations.length > 0 && (
              <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <BarChart3 size={16} className="text-primary-600" />
                      Daily Registration Trend (Last 14 Days)
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Volume of new farmer registrations recorded by day (UTC).
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Total: {analytics.dailyRegistrations.reduce((a, b) => a + b.count, 0)} new
                  </div>
                </div>

                <div className="flex items-end gap-2 h-36 pt-4 border-b border-gray-100 dark:border-gray-800">
                  {analytics.dailyRegistrations.map((item) => {
                    const maxCount = Math.max(...analytics.dailyRegistrations.map(d => d.count), 5);
                    const heightPercent = Math.max((item.count / maxCount) * 100, 6);
                    return (
                      <div key={item.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                        <div className="text-[10px] font-bold text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-5">
                          {item.count}
                        </div>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-md transition-all ${
                            item.count > 0
                              ? "bg-primary-500 dark:bg-primary-600 group-hover:bg-primary-400"
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        />
                        <span className="text-[9px] text-gray-400 dark:text-gray-500 truncate w-full text-center">
                          {item.date.substring(5)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filter & Search Bar */}
            <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-grow">
                  <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by farmer name or email..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="suspended">Suspended Only</option>
                    <option value="deactivated">Deactivated</option>
                  </select>

                  {/* Provider Filter */}
                  <select
                    value={providerFilter}
                    onChange={(e) => handleProviderFilterChange(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none"
                  >
                    <option value="all">All Providers</option>
                    <option value="email_password">Email / Password</option>
                    <option value="google">Google OAuth</option>
                    <option value="phone">Phone SMS</option>
                  </select>

                  {/* Role Filter */}
                  <select
                    value={roleFilter}
                    onChange={(e) => handleRoleFilterChange(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 focus:outline-none"
                  >
                    <option value="all">All Roles</option>
                    <option value="farmer">Farmer</option>
                    <option value="admin">Administrator</option>
                    <option value="agronomist">Agronomist</option>
                  </select>

                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-colors"
                  >
                    Search
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setProviderFilter("all");
                      setRoleFilter("all");
                      fetchUsersList(adminKey, 1, "", "all", "all", "all");
                    }}
                    className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    title="Reset Filters"
                  >
                    <RefreshCw size={15} />
                  </button>
                </div>
              </form>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/60 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                    <tr>
                      <th className="px-6 py-4">Farmer / User</th>
                      <th className="px-4 py-4">Status & Role</th>
                      <th className="px-4 py-4">Location</th>
                      <th className="px-4 py-4">Registered Date</th>
                      <th className="px-4 py-4">Last Login</th>
                      <th className="px-4 py-4 text-center">Logins</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
                    {isLoadingUsers ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                          <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-primary-600" />
                          <span>Loading user records...</span>
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                          <Users size={32} className="mx-auto mb-2 text-gray-400" />
                          <p className="font-semibold text-gray-700 dark:text-gray-300">No matching user records found</p>
                          <p className="text-xs text-gray-400 mt-1">Try adjusting your search criteria or filters.</p>
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              <span>{u.name}</span>
                              {u.role === "admin" && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                              {u.email}
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1 items-start">
                              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                u.accountStatus === "active"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400"
                              }`}>
                                {u.accountStatus.toUpperCase()}
                              </span>
                              <span className="text-[11px] text-gray-400">
                                {u.authProvider}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-300">
                            {u.location?.district ? (
                              <div>
                                <span className="font-medium">{u.location.district}</span>
                                {u.location.state && <span className="text-gray-400">, {u.location.state}</span>}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Not specified</span>
                            )}
                          </td>

                          <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-300">
                            {formatDate(u.createdAt)}
                          </td>

                          <td className="px-4 py-4 text-xs text-gray-600 dark:text-gray-300">
                            {formatDate(u.lastLoginAt)}
                          </td>

                          <td className="px-4 py-4 text-center">
                            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                              {u.loginCount || 1}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleOpenUserDetails(u)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                            >
                              <Eye size={13} />
                              <span>Details</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <div className="p-4 bg-gray-50/70 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
                <div>
                  Showing {users.length} of {totalUsers} registered accounts
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-2 font-bold text-gray-700 dark:text-gray-300">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    className="p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-40"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. USER DETAILS & AUDIT DRAWER MODAL */}
        <AnimatePresence>
          {selectedUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-lg">
                      {selectedUser.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {selectedUser.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono">
                        ID: {selectedUser.id}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6 overflow-y-auto flex-grow text-sm">
                  {/* Account Overview */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                    <div>
                      <span className="text-xs text-gray-400 block">Email Address</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedUser.email}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Account Status</span>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                        selectedUser.accountStatus === "active"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400"
                      }`}>
                        {selectedUser.accountStatus.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Role</span>
                      <span className="font-semibold text-gray-900 dark:text-white capitalize">{selectedUser.role}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Total Logins</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedUser.loginCount || 1} times</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Registered At</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{formatDate(selectedUser.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Last Active</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{formatDate(selectedUser.lastLoginAt)}</span>
                    </div>
                  </div>

                  {/* Agricultural Profile */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Farmer Agricultural Profile
                    </h4>
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-400 block">Location:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {selectedUser.location?.village ? `${selectedUser.location.village}, ` : ""}
                          {selectedUser.location?.taluka ? `${selectedUser.location.taluka}, ` : ""}
                          {selectedUser.location?.district || "Maharashtra"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Farm Size:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {selectedUser.farmDetails?.farmSize || "Not specified"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Soil Type:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {selectedUser.farmDetails?.soilType || "Not specified"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Primary Crops:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {selectedUser.farmDetails?.primaryCrops?.join(", ") || "General Crops"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Login Audit Trail */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center justify-between">
                      <span>Server-Side Login Audit Log (Last 20 Events)</span>
                      <span className="text-[10px] text-gray-400 font-normal">90-Day Retention Policy</span>
                    </h4>

                    {isLoadingLogs ? (
                      <div className="p-4 text-center text-xs text-gray-400">Loading audit trail...</div>
                    ) : userLogs.length === 0 ? (
                      <div className="p-4 text-center text-xs text-gray-400 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                        No historical login audit logs for this account.
                      </div>
                    ) : (
                      <div className="max-h-40 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800">
                        {userLogs.map((l) => (
                          <div key={l.id} className="p-2.5 px-4 text-xs flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/40">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize">
                                {l.eventType.replace("_", " ")}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono">({l.authProvider})</span>
                            </div>
                            <span className="text-gray-500 text-[11px]">{formatDate(l.createdAt)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Administrative Actions */}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500">Change Status:</span>
                      {selectedUser.accountStatus === "active" ? (
                        <button
                          onClick={() => handleUpdateStatus(selectedUser.id, "suspended")}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50"
                        >
                          Suspend Account
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(selectedUser.id, "active")}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50"
                        >
                          Reactivate Account
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteUser(selectedUser.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-100"
                    >
                      <Trash2 size={13} />
                      <span>Erase Account (GDPR/DPDP)</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 4. PRIVACY & DATA TRANSPARENCY NOTICE MODAL */}
        <AnimatePresence>
          {showPrivacyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 overflow-hidden space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <Shield size={20} className="text-emerald-600" />
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">
                      Privacy & Data Retention Disclosure
                    </h3>
                  </div>
                  <button onClick={() => setShowPrivacyModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={18} />
                  </button>
                </div>

                <div className="text-xs text-gray-600 dark:text-gray-300 space-y-3 leading-relaxed">
                  <p>
                    <strong>AgriSmart AI</strong> collects minimal, privacy-centric user and account information strictly necessary for identity verification and advisory services:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    <li><strong>Account Identification:</strong> Full Name, Email, and Phone number (if provided).</li>
                    <li><strong>Usage & Security Metrics:</strong> Account creation timestamp (UTC), last successful login timestamp, and total login count.</li>
                    <li><strong>Agricultural Profile:</strong> Voluntary farm acreage, soil type, and primary crops to tailor localized advisories.</li>
                    <li><strong>Network & Account Security:</strong> Generalized IP addresses (with trailing segments masked to prevent personal tracking) are temporarily logged during authentication events strictly for fraud prevention and intrusion detection, and are automatically purged after 90 days.</li>
                  </ul>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-[11px] text-emerald-800 dark:text-emerald-300">
                    <strong>Zero-Exposures Guarantee:</strong> Passwords, password hashes, session cookies, OAuth secrets, precise GPS coordinate trails, contacts, and browser histories are <em>never</em> collected, stored, or revealed.
                  </div>
                  <p>
                    <strong>Retention Policy:</strong> Login audit logs are automatically pruned after <strong>90 days</strong> to ensure data minimization.
                  </p>
                  <p>
                    <strong>User Rights:</strong> In accordance with India&apos;s Digital Personal Data Protection (DPDP) Act and GDPR standards, any registered farmer can view their profile or request complete account erasure via the profile page or by contacting <code>privacy@agrismart.gov.in</code>.
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setShowPrivacyModal(false)}
                    className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
