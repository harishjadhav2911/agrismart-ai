"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import mr from "@/locales/mr.json";
import LanguageOnboardingModal from "@/components/LanguageOnboardingModal";

export type LanguageCode = "en" | "hi" | "mr";

const translations: Record<LanguageCode, Record<string, string>> = {
  en,
  hi,
  mr
};

type LanguageContextType = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  isLanguageModalOpen: boolean;
  hasSelectedLanguage: boolean;
  openLanguageModal: () => void;
  closeLanguageModal: () => void;
  selectLanguageAndClose: (lang: LanguageCode) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("mr");
  const [isMounted, setIsMounted] = useState(false);
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState<boolean | null>(null);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const savedLang = localStorage.getItem("agrismart_lang") as LanguageCode;
    const hasExplicitSelection = localStorage.getItem("agrismart_lang_selected");

    if (savedLang && translations[savedLang]) {
      setLanguageState(savedLang);
    }

    if (hasExplicitSelection === "true" && savedLang) {
      setHasSelectedLanguage(true);
      setIsLanguageModalOpen(false);
    } else {
      setHasSelectedLanguage(false);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("agrismart_lang", lang);
    localStorage.setItem("agrismart_lang_selected", "true");
    setHasSelectedLanguage(true);
  };

  const openLanguageModal = () => {
    setIsLanguageModalOpen(true);
  };

  const closeLanguageModal = () => {
    setIsLanguageModalOpen(false);
  };

  const selectLanguageAndClose = (lang: LanguageCode) => {
    setLanguage(lang);
    setIsLanguageModalOpen(false);
  };

  const t = (key: string, fallback?: string): string => {
    const activeDict = isMounted ? translations[language] : translations["en"];
    const text = activeDict?.[key] || translations["en"]?.[key];
    if (text) return text;
    if (fallback) return fallback;
    
    // Safety check: Never expose raw internal keys with underscores to farmers
    if (key.includes("_")) {
      const parts = key.split("_");
      const meaningful = parts.length > 1 ? parts.slice(1).join(" ") : parts.join(" ");
      return meaningful.charAt(0).toUpperCase() + meaningful.slice(1);
    }
    return key;
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        t, 
        isLanguageModalOpen,
        hasSelectedLanguage: hasSelectedLanguage ?? false,
        openLanguageModal,
        closeLanguageModal,
        selectLanguageAndClose
      }}
    >
      {children}
      {isLanguageModalOpen && (
        <LanguageOnboardingModal
          isOpen={isLanguageModalOpen}
          currentLanguage={language}
          onSelectLanguage={selectLanguageAndClose}
          canDismiss={true}
          onClose={closeLanguageModal}
        />
      )}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
