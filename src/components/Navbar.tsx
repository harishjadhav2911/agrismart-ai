"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Menu, X, Globe, User, Moon, Sun, ChevronDown, LogOut } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import { LanguageCode } from "@/context/LanguageContext";

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
      className={`fixed w-full z-50 transition-all duration-300 border-b border-transparent ${
        scrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-gray-200 dark:border-gray-800 py-3"
          : "bg-white/90 dark:bg-gray-900/90 py-5"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
            <div className="p-2 bg-primary-500 rounded-lg text-white group-hover:scale-105 transition-transform">
              <Leaf size={24} />
            </div>
            <span className="font-bold text-xl md:text-2xl text-primary-900 dark:text-primary-400">
              AgriSmart AI
            </span>
          </Link>

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
              >
                <Globe size={20} />
                <span className="hidden sm:inline-block text-sm font-medium uppercase">
                  {language}
                </span>
                <ChevronDown size={14} className={`transition-transform ${isLangMenuOpen ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors ${
                          language === lang.code
                            ? "text-primary-600 dark:text-primary-400 font-bold bg-primary-50/50 dark:bg-gray-700/50"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors hidden sm:block"
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
                className="hidden sm:flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-lg shadow-primary-500/30"
              >
                <User size={18} />
                <span>Login</span>
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
