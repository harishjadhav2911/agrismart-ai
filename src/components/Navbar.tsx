"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Menu, X, Globe, User, Moon, Sun, ChevronDown, LogOut, Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import { LanguageCode } from "@/context/LanguageContext";
import { usePWA } from "@/components/PWAProvider";

import BrandLogo from "@/components/BrandLogo";

const languages: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" }
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { isInstallable, isInstalled, installApp } = usePWA();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("nav_home"), href: "/" },
    { name: t("nav_ai_assistant"), href: "/guidance" },
    { name: t("nav_crop_rec"), href: "/crop-recommendation" },
    { name: t("nav_disease"), href: "/disease-detection" },
    { name: t("nav_weather"), href: "/weather" },
    { name: t("nav_market"), href: "/market" },
    { name: t("nav_gov"), href: "/schemes" },
    { name: t("nav_irrigation"), href: "/smart-irrigation" },
    { name: t("nav_dashboard"), href: "/dashboard" },
    { name: t("nav_contact"), href: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-50 h-[72px] sm:h-20 flex items-center transition-all duration-300 border-b ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md border-gray-200 dark:border-gray-800"
          : "bg-white/95 dark:bg-gray-900/95 border-gray-100 dark:border-gray-800"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-4">
          {/* Official Brand Logo (Left Section) */}
          <div className="flex-shrink-0 flex items-center">
            <BrandLogo size="md" linkHref="/" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium px-3 py-2 rounded-md text-sm transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                title="Change Language / भाषा निवडा"
              >
                <Globe size={20} className="text-primary-600 dark:text-primary-400" />
                <span className="hidden sm:inline-block text-sm font-bold uppercase">
                  {language === "mr" ? "मराठी" : language === "hi" ? "हिंदी" : "EN"}
                </span>
                <ChevronDown size={14} className={`transition-transform ${isLangMenuOpen ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      {language === "mr" ? "भाषा निवडा" : language === "hi" ? "भाषा चुनें" : "Select Language"}
                    </div>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                          language === lang.code
                            ? "text-primary-600 dark:text-primary-400 font-bold bg-primary-50/70 dark:bg-gray-700/70"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <span>{lang.label}</span>
                        {language === lang.code && <span className="text-xs text-primary-600 font-bold">✓</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Install App Button (if not already installed) */}
            {!isInstalled && (
              <button
                onClick={installApp}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-500/20 transition-all shadow-sm"
                title="Install AgriSmart App"
              >
                <Download size={14} className="text-emerald-600 dark:text-emerald-400 animate-bounce" />
                <span>Install App</span>
              </button>
            )}

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors hidden sm:block"
                title="Toggle Theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}

            {/* Auth Profile / Login */}
            {user ? (
              <div className="relative hidden sm:block">
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 overflow-hidden">
                    {user.photoUrl ? (
                      <Image src={user.photoUrl} alt="Profile" fill className="object-cover" unoptimized />
                    ) : (
                      <User size={14} />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[80px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown size={14} className={`text-gray-500 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 overflow-hidden z-50"
                    >
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setIsProfileMenuOpen(false)}>{t("nav_profile")}</Link>
                      <button onClick={() => { logout(); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10">{t("nav_logout")}</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="hidden sm:flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-lg shadow-primary-500/30 text-sm"
              >
                <User size={18} />
                <span>{t("nav_login", "Login / Sign Up")}</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {/* Mobile Language Switcher Row */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 mb-3 border border-gray-200/50 dark:border-gray-700/50">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                  <Globe size={16} className="text-primary-500" />
                  {language === "mr" ? "भाषा" : language === "hi" ? "भाषा" : "Language"}
                </span>
                <div className="flex gap-1">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-colors ${
                        language === l.code
                          ? "bg-primary-600 text-white"
                          : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile Install App Button */}
              {!isInstalled && (
                <div className="pt-2 pb-1">
                  <button
                    onClick={() => {
                      installApp();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <Download size={16} />
                    <span>Install AgriSmart App</span>
                  </button>
                </div>
              )}

              <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <User size={18} />{t("nav_profile")}</Link>
                    <button
                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-3 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                      <LogOut size={18} />{t("nav_logout")}</button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-3 rounded-md text-base font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
                  >
                    <User size={18} />{t("nav_login")}</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
