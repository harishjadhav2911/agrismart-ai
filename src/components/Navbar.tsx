"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, User, Moon, Sun, ChevronDown, LogOut, Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import { LanguageCode } from "@/context/LanguageContext";
import { usePWA } from "@/components/PWAProvider";

import BrandLogo from "@/components/BrandLogo";
import { isGenuinelyNewAnnouncement } from "@/lib/grDateUtils";

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
  const { isInstalled, installApp } = usePWA();

  // Notification indicator status for priority features
  const [indicators, setIndicators] = useState({
    cropRelief: false,    // Red blinking indicator: Genuine new verified GR
    cropDetection: false, // Blue indicator: Model/feature update
    schemes: false,       // Blue indicator: Schemes DBT update
    market: false         // Blue indicator: Market price refresh
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Evaluate notification indicators from localStorage and current URL
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const RELIEF_GR_KEY = "202610221655482506"; // Food Dept GR 22 Oct 2026
      const DISEASE_KEY = "2026_model";
      const SCHEMES_KEY = "2026_dbt";
      const MARKET_KEY = "20261024";

      // If user currently visits a page, clear its indicator
      if (path === "/crop-relief") localStorage.setItem("agrismart_viewed_relief_gr", RELIEF_GR_KEY);
      if (path === "/disease-detection") localStorage.setItem("agrismart_viewed_disease", DISEASE_KEY);
      if (path === "/schemes") localStorage.setItem("agrismart_viewed_schemes", SCHEMES_KEY);
      if (path === "/market") localStorage.setItem("agrismart_viewed_market", MARKET_KEY);

      const hasViewedRelief = localStorage.getItem("agrismart_viewed_relief_gr") === RELIEF_GR_KEY;
      const hasViewedDisease = localStorage.getItem("agrismart_viewed_disease") === DISEASE_KEY;
      const hasViewedSchemes = localStorage.getItem("agrismart_viewed_schemes") === SCHEMES_KEY;
      const hasViewedMarket = localStorage.getItem("agrismart_viewed_market") === MARKET_KEY;

      setIndicators({
        cropRelief: !hasViewedRelief,
        cropDetection: !hasViewedDisease,
        schemes: !hasViewedSchemes,
        market: !hasViewedMarket,
      });

      // Dynamically check if a genuine new verified GR exists in database (published within 14 days)
      fetch("/api/crop-relief/updates")
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.announcements)) {
            const latestVerified = data.announcements.find(
              (a: { id: string; evidenceStatus: string; publishedAt?: string | null; verifiedGrNumber?: string }) =>
                isGenuinelyNewAnnouncement(a.publishedAt, a.evidenceStatus, 14)
            );
            if (latestVerified) {
              const latestKey = latestVerified.verifiedGrNumber || latestVerified.id;
              if (path === "/crop-relief") {
                localStorage.setItem("agrismart_viewed_relief_gr", latestKey);
                setIndicators(prev => ({ ...prev, cropRelief: false }));
              } else {
                const storedViewed = localStorage.getItem("agrismart_viewed_relief_gr");
                setIndicators(prev => ({ ...prev, cropRelief: storedViewed !== latestKey }));
              }
            } else {
              // No genuinely new verified announcement within recency window
              setIndicators(prev => ({ ...prev, cropRelief: false }));
            }
          }
        })
        .catch(() => {});
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const markAsViewed = (feature: "cropRelief" | "cropDetection" | "schemes" | "market") => {
    if (typeof window !== "undefined") {
      if (feature === "cropRelief") {
        // Also fetch to ensure latest verified key is marked
        fetch("/api/crop-relief/updates")
          .then((res) => res.json())
          .then((data) => {
            const latest = data?.announcements?.find(
              (a: { id: string; evidenceStatus: string; publishedAt?: string | null; verifiedGrNumber?: string }) =>
                isGenuinelyNewAnnouncement(a.publishedAt, a.evidenceStatus, 14)
            );
            if (latest) {
              localStorage.setItem("agrismart_viewed_relief_gr", latest.verifiedGrNumber || latest.id);
            }
          })
          .catch(() => {});
        setIndicators(prev => ({ ...prev, cropRelief: false }));
      } else if (feature === "cropDetection") {
        localStorage.setItem("agrismart_viewed_disease", "2026_model");
        setIndicators(prev => ({ ...prev, cropDetection: false }));
      } else if (feature === "schemes") {
        localStorage.setItem("agrismart_viewed_schemes", "2026_dbt");
        setIndicators(prev => ({ ...prev, schemes: false }));
      } else if (feature === "market") {
        localStorage.setItem("agrismart_viewed_market", "20261024");
        setIndicators(prev => ({ ...prev, market: false }));
      }
    }
  };

  // Nav links strictly ordered by priority:
  // 1. Crop Relief, 2. Crop Detection, 3. Government Schemes, 4. Market Prices, followed by standard modules
  const navLinks = [
    { name: t("nav_home"), href: "/" },
    { 
      name: t("nav_crop_relief", "Crop Relief"), 
      href: "/crop-relief", 
      featureKey: "cropRelief" as const,
      tooltip: language === "mr" 
        ? "नवीन अधिकृत शासन निर्णय (२२ ऑक्टोबर २०२६) • पाहण्यासाठी क्लिक करा" 
        : language === "hi" 
        ? "नया आधिकारिक शासनादेश (22 अक्टूबर 2026) • देखने के लिए क्लिक करें" 
        : "New verified Government Resolution (22 Oct 2026) • Click to view"
    },
    { 
      name: t("nav_disease"), 
      href: "/disease-detection", 
      featureKey: "cropDetection" as const,
      tooltip: language === "mr"
        ? "एआय पीक रोग निदान: अद्ययावत मॉडेल सक्रिय"
        : language === "hi"
        ? "एआई फसल रोग पहचान: अद्यतन मॉडल सक्रिय"
        : "AI Crop Disease Detection: Precision model update"
    },
    { 
      name: t("nav_gov"), 
      href: "/schemes", 
      featureKey: "schemes" as const,
      tooltip: language === "mr"
        ? "शासकीय योजना: अद्ययावत सबसिडी व अनुदान यादी"
        : language === "hi"
        ? "सरकारी योजनाएं: अद्यतन सब्सिडी व अनुदान सूची"
        : "Government Schemes: Updated central & state subsidies"
    },
    { 
      name: t("nav_market"), 
      href: "/market", 
      featureKey: "market" as const,
      tooltip: language === "mr"
        ? "थेट एपीएमसी व एगमार्कनेट दैनिक बाजारभाव उपलब्ध"
        : language === "hi"
        ? "दैनिक एपीएमसी एवं एगमार्कनेट मंडी भाव उपलब्ध"
        : "Live Agmarknet & APMC daily market prices available"
    },
    { name: t("nav_ai_assistant"), href: "/guidance" },
    { name: t("nav_crop_rec"), href: "/crop-recommendation" },
    { name: t("nav_weather"), href: "/weather" },
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
            {navLinks.map((link, idx) => {
              const hasRedIndicator = link.featureKey === "cropRelief" && indicators.cropRelief;
              const hasBlueIndicator = 
                (link.featureKey === "cropDetection" && indicators.cropDetection) ||
                (link.featureKey === "schemes" && indicators.schemes) ||
                (link.featureKey === "market" && indicators.market);

              const isCropRelief = link.href === "/crop-relief";

              return (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={() => link.featureKey && markAsViewed(link.featureKey)}
                  className={`relative inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isCropRelief
                      ? "text-amber-800 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 font-bold"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  }`}
                  title={link.tooltip || link.name}
                >
                  {/* Small red blinking indicator for genuinely new verified GR */}
                  {hasRedIndicator && (
                    <span 
                      className="relative flex h-2 w-2 mr-0.5" 
                      title={link.tooltip}
                      aria-label={link.tooltip}
                    >
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 motion-reduce:hidden" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                      <span className="sr-only">{link.tooltip}</span>
                    </span>
                  )}

                  {/* Small subtle blue indicator (not continuously blinking, respects reduced motion) */}
                  {hasBlueIndicator && (
                    <span 
                      className="inline-flex rounded-full h-1.5 w-1.5 bg-blue-600 dark:bg-blue-400 mr-0.5 flex-shrink-0"
                      title={link.tooltip}
                      aria-label={link.tooltip}
                    >
                      <span className="sr-only">{link.tooltip}</span>
                    </span>
                  )}

                  <span>{link.name}</span>
                </Link>
              );
            })}
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
                      {user.role === "admin" && (
                        <Link
                          href="/admin/users"
                          className="block px-4 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border-b border-gray-100 dark:border-gray-800"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          🛡️ Admin Dashboard
                        </Link>
                      )}
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

              {navLinks.map((link, idx) => {
                const hasRedIndicator = link.featureKey === "cropRelief" && indicators.cropRelief;
                const hasBlueIndicator = 
                  (link.featureKey === "cropDetection" && indicators.cropDetection) ||
                  (link.featureKey === "schemes" && indicators.schemes) ||
                  (link.featureKey === "market" && indicators.market);

                const isCropRelief = link.href === "/crop-relief";

                return (
                  <Link
                    key={idx}
                    href={link.href}
                    onClick={() => {
                      if (link.featureKey) markAsViewed(link.featureKey);
                      setIsMobileMenuOpen(false);
                    }}
                    className={
                      isCropRelief
                        ? "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-bold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 transition-colors shadow-sm my-1"
                        : "flex items-center justify-between px-3 py-2.5 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 transition-colors"
                    }
                    title={link.tooltip || link.name}
                  >
                    <div className="flex items-center gap-2">
                      {hasRedIndicator && (
                        <span 
                          className="relative flex h-2 w-2"
                          title={link.tooltip}
                          aria-label={link.tooltip}
                        >
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 motion-reduce:hidden" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                          <span className="sr-only">{link.tooltip}</span>
                        </span>
                      )}

                      {hasBlueIndicator && (
                        <span 
                          className="inline-flex rounded-full h-1.5 w-1.5 bg-blue-600 dark:bg-blue-400 flex-shrink-0"
                          title={link.tooltip}
                          aria-label={link.tooltip}
                        >
                          <span className="sr-only">{link.tooltip}</span>
                        </span>
                      )}

                      <span>{link.name}</span>
                    </div>

                    {isCropRelief && (
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-600 text-white">
                        {language === "mr" ? "मदत" : language === "hi" ? "राहत" : "Relief"}
                      </span>
                    )}
                  </Link>
                );
              })}
              
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
