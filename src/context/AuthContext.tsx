"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl: string | null;
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
    try {
      const savedUserStr = localStorage.getItem("agrismart_user");
      const localBookmarksStr = localStorage.getItem("agrismart_bookmarks");
      const localBookmarks: string[] = localBookmarksStr ? JSON.parse(localBookmarksStr) : [];

      if (savedUserStr) {
        const parsedUser: UserProfile = JSON.parse(savedUserStr);
        // Merge any unique bookmarks from local storage
        const mergedSchemes = Array.from(new Set([...(parsedUser.savedSchemes || []), ...localBookmarks]));
        parsedUser.savedSchemes = mergedSchemes;
        setUser(parsedUser);
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
        setUser(guestUser);
        localStorage.setItem("agrismart_user", JSON.stringify(guestUser));
      }
    } catch (e) {
      console.warn("Auth initialization fallback:", e);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        setIsLoading(false);
        if (email === "farmer@agrismart.com" && password === "password123") {
          // Read any existing bookmarks in browser
          let existingBookmarks: string[] = [];
          try {
            const b = localStorage.getItem("agrismart_bookmarks");
            if (b) existingBookmarks = JSON.parse(b);
          } catch {}

          const mergedSchemes = Array.from(new Set(["pm-kisan", "pmfby", ...existingBookmarks]));

          const mockUser: UserProfile = {
            id: "u123",
            name: "Ramesh Kumar",
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
              language: "hi",
            },
            savedSchemes: mergedSchemes,
            savedMarketPrices: ["Cotton - Pune", "Soybean - Latur"],
            chatHistoryCount: 12,
          };
          setUser(mockUser);
          localStorage.setItem("agrismart_user", JSON.stringify(mockUser));
          localStorage.setItem("agrismart_bookmarks", JSON.stringify(mergedSchemes));
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
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        let existingBookmarks: string[] = [];
        try {
          const b = localStorage.getItem("agrismart_bookmarks");
          if (b) existingBookmarks = JSON.parse(b);
        } catch {}

        const newUser: UserProfile = {
          id: `u${Date.now()}`,
          name: data.name || "New Farmer",
          email: data.email || "",
          phone: data.phone || "",
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
        };
        setUser(newUser);
        localStorage.setItem("agrismart_user", JSON.stringify(newUser));
        resolve();
      }, 500);
    });
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
