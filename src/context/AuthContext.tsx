"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load from local storage on mount (mock persistence)
  useEffect(() => {
    const savedUser = localStorage.getItem("agrismart_user");
    if (savedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock authentication
    setIsLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        setIsLoading(false);
        if (email === "farmer@agrismart.com" && password === "password123") {
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
            savedSchemes: ["pm-kisan", "pmfby"],
            savedMarketPrices: ["Cotton - Pune", "Soybean - Latur"],
            chatHistoryCount: 12,
          };
          setUser(mockUser);
          localStorage.setItem("agrismart_user", JSON.stringify(mockUser));
          resolve();
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 1000);
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const register = async (data: Partial<UserProfile>, _password: string) => {
    setIsLoading(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        const newUser: UserProfile = {
          id: `u${Date.now()}`,
          name: data.name || "New Farmer",
          email: data.email || "",
          phone: data.phone || "",
          photoUrl: null,
          location: data.location || {
            state: "",
            district: "",
            taluka: "",
            village: "",
          },
          farmDetails: data.farmDetails || {
            farmSize: "",
            soilType: "",
            primaryCrops: [],
          },
          preferences: data.preferences || {
            language: "en",
          },
          savedSchemes: [],
          savedMarketPrices: [],
          chatHistoryCount: 0,
        };
        setUser(newUser);
        localStorage.setItem("agrismart_user", JSON.stringify(newUser));
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("agrismart_user");
    router.push("/login");
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (user) {
          const updatedUser = { ...user, ...data };
          setUser(updatedUser);
          localStorage.setItem("agrismart_user", JSON.stringify(updatedUser));
        }
        resolve();
      }, 500);
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
