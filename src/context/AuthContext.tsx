"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl: string | null;
  role?: "farmer" | "admin" | "agronomist";
  accountStatus?: "active" | "suspended" | "deactivated";
  authProvider?: "email_password" | "google" | "phone";
  location: {
    state: string;
    district: string;
    taluka: string;
    village: string;
  };
  farmDetails: {
    farmSize: string;
    soilType: string;
    primaryCrops: string[];
  };
  preferences: {
    language: string;
  };
  savedSchemes: string[];
  savedMarketPrices: string[];
  chatHistoryCount: number;
  loginCount?: number;
  lastLoginAt?: string;
  createdAt?: string;
  sessionToken?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Partial<UserProfile>, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  toggleSaveScheme: (schemeId: string) => Promise<boolean>;
  isSchemeSaved: (schemeId: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  toggleSaveScheme: async () => false,
  isSchemeSaved: () => false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load from local storage on mount with cross-sync
  useEffect(() => {
    let isMounted = true;
    const initSession = async () => {
      try {
        const savedUserStr = typeof window !== "undefined" ? localStorage.getItem("agrismart_user") : null;
        const localBookmarksStr = typeof window !== "undefined" ? localStorage.getItem("agrismart_bookmarks") : null;
        const localBookmarks: string[] = localBookmarksStr ? JSON.parse(localBookmarksStr) : [];

        if (savedUserStr) {
          const parsedUser: UserProfile = JSON.parse(savedUserStr);
          // Merge any unique bookmarks from local storage
          const mergedSchemes = Array.from(new Set([...(parsedUser.savedSchemes || []), ...localBookmarks]));
          parsedUser.savedSchemes = mergedSchemes;
          if (isMounted) setUser(parsedUser);
          localStorage.setItem("agrismart_user", JSON.stringify(parsedUser));
          localStorage.setItem("agrismart_bookmarks", JSON.stringify(mergedSchemes));
        } else if (localBookmarks.length > 0) {
          // Create guest user profile if bookmarks exist
          const guestUser: UserProfile = {
            id: "guest",
            name: "Farmer",
            email: "farmer@agrismart.com",
            phone: "+91 9876543210",
            photoUrl: null,
            location: {
              state: "Maharashtra",
              district: "Pune",
              taluka: "Haveli",
              village: "Khadakwasla",
            },
            farmDetails: {
              farmSize: "5 Acres",
              soilType: "Black Soil",
              primaryCrops: ["Cotton", "Soybean"],
            },
            preferences: {
              language: "en",
            },
            savedSchemes: localBookmarks,
            savedMarketPrices: ["Cotton - Pune"],
            chatHistoryCount: 0,
          };
          if (isMounted) setUser(guestUser);
          localStorage.setItem("agrismart_user", JSON.stringify(guestUser));
        }
      } catch (e) {
        console.warn("Auth initialization fallback:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    void initSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(async () => {
        setIsLoading(false);
        const normalizedEmail = email.toLowerCase().trim();

        // 1. Check credentials
        const isFarmer = normalizedEmail === "farmer@agrismart.com" && password === "password123";
        const isAdmin = normalizedEmail === "admin@agrismart.gov.in" && password === "password123";

        // Also check if user registered in this browser
        let savedLocalUser: UserProfile | null = null;
        try {
          const uStr = localStorage.getItem("agrismart_user");
          if (uStr) {
            const parsed = JSON.parse(uStr);
            if (parsed.email?.toLowerCase() === normalizedEmail) {
              savedLocalUser = parsed;
            }
          }
        } catch {}

        if (isFarmer || isAdmin || savedLocalUser) {
          // Read any existing bookmarks in browser
          let existingBookmarks: string[] = [];
          try {
            const b = localStorage.getItem("agrismart_bookmarks");
            if (b) existingBookmarks = JSON.parse(b);
          } catch {}

          const mergedSchemes = Array.from(new Set(["pm-kisan", "pmfby", ...existingBookmarks]));

          let activeUser: UserProfile;
          if (isAdmin) {
            activeUser = {
              id: "usr_admin_system_001",
              name: "AgriSmart System Admin",
              email: "admin@agrismart.gov.in",
              phone: "+91 9422000000",
              role: "admin",
              accountStatus: "active",
              authProvider: "email_password",
              photoUrl: null,
              location: {
                state: "Maharashtra",
                district: "Pune",
                taluka: "Haveli",
                village: "Central Office",
              },
              farmDetails: {
                farmSize: "N/A",
                soilType: "All Soils",
                primaryCrops: ["Cotton", "Soybean", "Sugarcane"],
              },
              preferences: { language: "en" },
              savedSchemes: mergedSchemes,
              savedMarketPrices: [],
              chatHistoryCount: 5,
              loginCount: 43,
              lastLoginAt: new Date().toISOString()
            };
          } else if (savedLocalUser) {
            activeUser = {
              ...savedLocalUser,
              loginCount: (savedLocalUser.loginCount || 1) + 1,
              lastLoginAt: new Date().toISOString()
            };
          } else {
            activeUser = {
              id: "usr_ramesh_kumar_123",
              name: "Ramesh Kumar",
              email: "farmer@agrismart.com",
              phone: "+91 9876543210",
              role: "farmer",
              accountStatus: "active",
              authProvider: "email_password",
              photoUrl: null,
              location: {
                state: "Maharashtra",
                district: "Pune",
                taluka: "Haveli",
                village: "Khadakwasla",
              },
              farmDetails: {
                farmSize: "5 Acres",
                soilType: "Black Soil",
                primaryCrops: ["Cotton", "Soybean"],
              },
              preferences: {
                language: "hi",
              },
              savedSchemes: mergedSchemes,
              savedMarketPrices: ["Cotton - Pune", "Soybean - Latur"],
              chatHistoryCount: 12,
              loginCount: 15,
              lastLoginAt: new Date().toISOString()
            };
          }

          setUser(activeUser);
          localStorage.setItem("agrismart_user", JSON.stringify(activeUser));
          localStorage.setItem("agrismart_bookmarks", JSON.stringify(mergedSchemes));

          // Asynchronously record login event on server database
          fetch("/api/auth/login-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: normalizedEmail,
              userId: activeUser.id,
              sessionToken: activeUser.sessionToken,
              authProvider: activeUser.authProvider || "email_password"
            })
          })
            .then(res => res.json())
            .then(data => {
              if (data?.user?.loginCount) {
                setUser(prev => prev ? {
                  ...prev,
                  loginCount: data.user.loginCount,
                  lastLoginAt: data.user.lastLoginAt,
                  sessionToken: data.sessionToken || prev.sessionToken
                } : null);
              }
            })
            .catch(() => {});

          resolve();
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 500);
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const register = async (data: Partial<UserProfile>, _password: string) => {
    setIsLoading(true);
    let existingBookmarks: string[] = [];
    try {
      const b = localStorage.getItem("agrismart_bookmarks");
      if (b) existingBookmarks = JSON.parse(b);
    } catch {}

    const newUser: UserProfile = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: data.name || "New Farmer",
      email: data.email || "",
      phone: data.phone || "",
      role: "farmer",
      accountStatus: "active",
      authProvider: "email_password",
      photoUrl: null,
      location: data.location || {
        state: "Maharashtra",
        district: "Pune",
        taluka: "Haveli",
        village: "",
      },
      farmDetails: data.farmDetails || {
        farmSize: "5 Acres",
        soilType: "Black Soil",
        primaryCrops: ["Cotton"],
      },
      preferences: data.preferences || {
        language: "en",
      },
      savedSchemes: existingBookmarks,
      savedMarketPrices: [],
      chatHistoryCount: 0,
      loginCount: 1,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    // Record on server store / database
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          location: newUser.location,
          farmDetails: newUser.farmDetails,
          preferredLanguage: newUser.preferences.language,
          authProvider: "email_password"
        })
      });
      const resJson = await res.json();
      if (resJson?.user?.id) {
        newUser.id = resJson.user.id;
      }
      if (resJson?.sessionToken) {
        newUser.sessionToken = resJson.sessionToken;
      }
    } catch (err) {
      console.warn("Server registration sync fallback:", err);
    }

    setUser(newUser);
    localStorage.setItem("agrismart_user", JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("agrismart_user");
    router.push("/login");
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    return new Promise<void>((resolve) => {
      if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem("agrismart_user", JSON.stringify(updatedUser));
        if (updatedUser.savedSchemes) {
          localStorage.setItem("agrismart_bookmarks", JSON.stringify(updatedUser.savedSchemes));
        }
      }
      resolve();
    });
  };

  const toggleSaveScheme = useCallback(async (schemeId: string): Promise<boolean> => {
    if (!schemeId) return false;

    let nextSaved: string[] = [];
    let isNowSaved = false;

    setUser(prevUser => {
      const currentList = prevUser?.savedSchemes || [];
      if (currentList.includes(schemeId)) {
        nextSaved = currentList.filter(id => id !== schemeId);
        isNowSaved = false;
      } else {
        nextSaved = [...currentList, schemeId];
        isNowSaved = true;
      }

      // Update both agrismart_user and agrismart_bookmarks in localStorage
      localStorage.setItem("agrismart_bookmarks", JSON.stringify(nextSaved));

      if (prevUser) {
        const updatedUser = { ...prevUser, savedSchemes: nextSaved };
        localStorage.setItem("agrismart_user", JSON.stringify(updatedUser));
        return updatedUser;
      }

      return null;
    });

    return isNowSaved;
  }, []);

  const isSchemeSaved = useCallback((schemeId: string): boolean => {
    if (!schemeId || !user) return false;
    return user.savedSchemes?.includes(schemeId) ?? false;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile, toggleSaveScheme, isSchemeSaved }}>
      {children}
    </AuthContext.Provider>
  );
}
