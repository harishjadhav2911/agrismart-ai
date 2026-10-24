"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  BellRing, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft, 
  Pause, 
  Play, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  AlertTriangle,
  FileCheck
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  formatGovernmentGrDate,
  isGenuinelyNewAnnouncement,
  sortAnnouncementsByVerifiedDate
} from "@/lib/grDateUtils";

export interface TickerGrItem {
  id: string;
  officialDate: string;
  officialDateMr: string;
  officialDateHi: string;
  headline: string;
  headlineMr: string;
  headlineHi: string;
  grNumber?: string;
  officialUrl?: string;
  status: "verified" | "notice" | "pending" | "conflicting" | "historical";
  statusLabelEn: string;
  statusLabelMr: string;
  statusLabelHi: string;
  internalHref: string;
  isNew: boolean;
}

const DEFAULT_TICKER_ITEMS: TickerGrItem[] = [
  {
    id: "ticker_gr_food_304",
    officialDate: "22 Oct 2026",
    officialDateMr: "२२ ऑक्टो २०२६",
    officialDateHi: "22 अक्तू 2026",
    headline: "Food Dept GR: 304 Drought Talukas Notified across 33 Districts for NFSA Concessions",
    headlineMr: "अन्न व नागरी पुरवठा GR: राज्यातील ३३ जिल्ह्यांमधील ३०४ तालुके दुष्काळग्रस्त घोषित (NFSA सवलती)",
    headlineHi: "खाद्य विभाग शासनादेश: 33 जिलों की 304 तहसीलें सूखा प्रभावित घोषित (NFSA रियायती खाद्यान्न)",
    grNumber: "२०२६१०२२१६५५४८२५०६",
    officialUrl: "https://gr.maharashtra.gov.in/Site/Upload/Government%20Resolutions/Marathi/202610221655482506.pdf",
    status: "verified",
    statusLabelEn: "Officially Verified GR",
    statusLabelMr: "अधिकृत GR प्रमाणित",
    statusLabelHi: "आधिकारिक GR सत्यापित",
    internalHref: "/crop-relief",
    isNew: true
  },
  {
    id: "ticker_gr_water_tankers",
    officialDate: "19 Oct 2026",
    officialDateMr: "१९ ऑक्टो २०२६",
    officialDateHi: "19 अक्तू 2026",
    headline: "Water Supply Dept Scarcity Report: Active Drinking Water Tanker Operations in Scarcity Zones",
    headlineMr: "पाणी पुरवठा विभाग अहवाल: टंचाईग्रस्त भागांत पिण्याच्या पाण्याचे टँकर वाटप व अहवाल",
    headlineHi: "जल आपूर्ति विभाग रिपोर्ट: जल संकटग्रस्त क्षेत्रों में पेयजल टैंकर तैनाती विवरण",
    grNumber: "संकीर्ण-२०२६/प्र.क्र.८२/म-२",
    officialUrl: "https://water.maharashtra.gov.in",
    status: "notice",
    statusLabelEn: "Official Dept Notice",
    statusLabelMr: "अधिकृत परिपत्रक",
    statusLabelHi: "आधिकारिक विभागीय सूचना",
    internalHref: "/crop-relief",
    isNew: true
  },
  {
    id: "ticker_gr_diwali_5000",
    officialDate: "12 Oct 2026",
    officialDateMr: "१२ ऑक्टो २०२६",
    officialDateHi: "12 अक्तू 2026",
    headline: "Ministerial Announcement: Pre-Diwali ₹5,000 Upfront Aid (Finance Dept Sanction GR Pending)",
    headlineMr: "मंत्रालयीन घोषणा: दिवाळीपूर्वी ₹५,००० तात्काळ मदत (वित्त विभाग GR व कोषागार निधी वाटप प्रतीक्षेत)",
    headlineHi: "मंत्रालयीन घोषणा: दिवाली पूर्व ₹5,000 अग्रिम सहायता (वित्त विभाग GR एवं कोषालय स्वीकृति प्रतीक्षारत)",
    status: "pending",
    statusLabelEn: "Awaiting Sanction GR",
    statusLabelMr: "आदेश प्रतीक्षेत",
    statusLabelHi: "शासनादेश प्रतीक्षारत",
    internalHref: "/crop-relief",
    isNew: false
  },
  {
    id: "ticker_gr_exam_fee_waiver",
    officialDate: "19 Oct 2024",
    officialDateMr: "१९ ऑक्टो २०२४",
    officialDateHi: "19 अक्तू 2024",
    headline: "Historical Record: Drought Exam Fee Waiver Applied at Pune University (Academic Year 2023-24)",
    headlineMr: "ऐतिहासिक नोंद: दुष्काळग्रस्त विद्यार्थ्यांसाठी परीक्षा शुल्कमाफी (शैक्षणिक वर्ष २०२३-२४)",
    headlineHi: "ऐतिहासिक रिकॉर्ड: सूखा प्रभावित विद्यार्थियों हेतु परीक्षा शुल्क माफी (सत्र 2023-24)",
    grNumber: "संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    officialUrl: "https://unipune.ac.in",
    status: "historical",
    statusLabelEn: "Historical (2023-24)",
    statusLabelMr: "ऐतिहासिक नोंद (२०२३-२४)",
    statusLabelHi: "ऐतिहासिक (2023-24)",
    internalHref: "/crop-relief",
    isNew: false
  }
];

export default function GovernmentGrTicker() {
  const { language } = useLanguage();
  const [items, setItems] = useState<TickerGrItem[]>(DEFAULT_TICKER_ITEMS);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Fetch live stored announcements from database
  useEffect(() => {
    let isMounted = true;
    fetch("/api/crop-relief/updates")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted || !data?.success || !Array.isArray(data?.announcements)) return;

        interface LiveAnnouncementJson {
          id: string;
          evidenceStatus: string;
          publishedAt: string | null;
          title: string;
          titleMr?: string;
          titleHi?: string;
          verifiedGrNumber?: string;
          verifiedGrUrl?: string;
          canonicalUrl?: string;
          originalUrl?: string;
        }

        // 1. Filter out corrupted/failed items
        const validAnnouncements = (data.announcements as LiveAnnouncementJson[]).filter(
          (a) => a.evidenceStatus !== "verification_failed"
        );

        // 2. Sort safely by verified publication date (newest first, undated items at end)
        const sortedAnnouncements = sortAnnouncementsByVerifiedDate(validAnnouncements);

        // 3. Deduplicate to avoid repeating identical headlines in ticker
        const seenHeadlines = new Set<string>();
        const uniqueAnnouncements = sortedAnnouncements.filter((a) => {
          const key = (a.title || "").toLowerCase().replace(/[^\w\u0900-\u097F]/g, "").trim();
          if (!key || seenHeadlines.has(key)) return false;
          seenHeadlines.add(key);
          return true;
        });

        // 4. Map into localized TickerGrItem objects
        const mappedItems: TickerGrItem[] = uniqueAnnouncements
          .slice(0, 10)
          .map((a) => {
            const isGr = a.evidenceStatus === "official_gr_verified";
            const isNotice = a.evidenceStatus === "official_notice_verified";
            const isConflicting = a.evidenceStatus === "conflicting_sources";
            const isHistorical = a.evidenceStatus === "historical";

            let status: TickerGrItem["status"] = "pending";
            let statusLabelEn = "Awaiting GR";
            let statusLabelMr = "आदेश प्रतीक्षेत";
            let statusLabelHi = "शासनादेश प्रतीक्षारत";

            if (isGr) {
              status = "verified";
              statusLabelEn = "Officially Verified";
              statusLabelMr = "अधिकृत GR प्रमाणित";
              statusLabelHi = "आधिकारिक GR सत्यापित";
            } else if (isNotice) {
              status = "notice";
              statusLabelEn = "Official Notice";
              statusLabelMr = "अधिकृत परिपत्रक";
              statusLabelHi = "आधिकारिक सूचना";
            } else if (isConflicting) {
              status = "conflicting";
              statusLabelEn = "Conflicting Reports";
              statusLabelMr = "विसंगत आकडेवारी";
              statusLabelHi = "परस्परविरोधी रिपोर्ट";
            } else if (isHistorical) {
              status = "historical";
              statusLabelEn = "Historical Record";
              statusLabelMr = "ऐतिहासिक नोंद";
              statusLabelHi = "ऐतिहासिक रिकॉर्ड";
            }

            // Language-specific verified dates (avoids timezone shifts)
            const officialDateEn = formatGovernmentGrDate(a.publishedAt, "en");
            const officialDateMr = formatGovernmentGrDate(a.publishedAt, "mr", { shortMonth: true, useDevanagariDigits: true });
            const officialDateHi = formatGovernmentGrDate(a.publishedAt, "hi");

            // Recency check: Only genuine new verified documents within 14 days get NEW badge
            const isNew = isGenuinelyNewAnnouncement(a.publishedAt, a.evidenceStatus, 14);

            return {
              id: a.id,
              officialDate: officialDateEn,
              officialDateMr: officialDateMr,
              officialDateHi: officialDateHi,
              headline: a.title,
              headlineMr: a.titleMr || a.title,
              headlineHi: a.titleHi || a.title,
              grNumber: a.verifiedGrNumber,
              officialUrl: a.verifiedGrUrl || a.canonicalUrl || a.originalUrl,
              status,
              statusLabelEn,
              statusLabelMr,
              statusLabelHi,
              internalHref: "/crop-relief",
              isNew
            };
          });

        if (mappedItems.length > 0) {
          setItems(mappedItems);
        }
      })
      .catch((err) => {
        console.warn("Serving baseline ticker items:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Check for prefers-reduced-motion on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setIsReducedMotion(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // For reduced motion mode or step-based display, cycle every 6 seconds if not paused
  useEffect(() => {
    if (isReducedMotion && !isPaused && items.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [isReducedMotion, isPaused, items.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const tickerHeading = 
    language === "mr" 
      ? "महाराष्ट्र शासन निर्णय • नवीन अपडेट"
      : language === "hi" 
      ? "महाराष्ट्र शासनादेश • ताज़ा अपडेट" 
      : "Maharashtra Govt GR • Live Updates";

  const getLocalizedHeadline = (item: TickerGrItem) => {
    if (language === "mr") return item.headlineMr;
    if (language === "hi") return item.headlineHi;
    return item.headline;
  };

  const getLocalizedDate = (item: TickerGrItem) => {
    if (language === "mr") return item.officialDateMr;
    if (language === "hi") return item.officialDateHi;
    return item.officialDate;
  };

  const getLocalizedStatus = (item: TickerGrItem) => {
    if (language === "mr") return item.statusLabelMr;
    if (language === "hi") return item.statusLabelHi;
    return item.statusLabelEn;
  };

  const renderDateBadge = (item: TickerGrItem) => {
    const isUnavailable = 
      item.officialDate === "Date unavailable" || 
      item.officialDateMr === "तारीख उपलब्ध नाही" ||
      item.officialDateHi === "तिथि उपलब्ध नहीं";

    return (
      <span 
        className={`text-[11px] px-2 py-0.5 rounded border flex-shrink-0 ${
          isUnavailable 
            ? "text-gray-400 bg-slate-900/90 border-slate-700/60 font-medium" 
            : "text-amber-300 bg-amber-950/80 border-amber-600/40 font-bold"
        }`}
      >
        {getLocalizedDate(item)}
      </span>
    );
  };

  const renderStatusBadge = (item: TickerGrItem) => {
    if (item.status === "verified") {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-tight flex-shrink-0">
          <ShieldCheck size={11} className="text-emerald-400" />
          <span>{getLocalizedStatus(item)}</span>
        </span>
      );
    }
    if (item.status === "notice") {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-teal-500/20 text-teal-300 border border-teal-500/40 uppercase tracking-tight flex-shrink-0">
          <FileCheck size={11} className="text-teal-400" />
          <span>{getLocalizedStatus(item)}</span>
        </span>
      );
    }
    if (item.status === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-tight flex-shrink-0">
          <AlertCircle size={11} className="text-amber-400" />
          <span>{getLocalizedStatus(item)}</span>
        </span>
      );
    }
    if (item.status === "conflicting") {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-orange-500/20 text-orange-300 border border-orange-500/40 uppercase tracking-tight flex-shrink-0">
          <AlertTriangle size={11} className="text-orange-400" />
          <span>{getLocalizedStatus(item)}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-800 text-gray-300 border border-gray-600/50 flex-shrink-0">
        <Clock size={10} className="text-gray-400" />
        <span>{getLocalizedStatus(item)}</span>
      </span>
    );
  };

  return (
    <aside 
      className="bg-slate-950 dark:bg-black text-white text-xs border-b border-red-600/40 select-none relative z-30"
      aria-label="Government Resolutions Live Breaking Ticker"
    >
      <div className="max-w-[1400px] mx-auto flex items-stretch h-10 sm:h-11 overflow-hidden">
        
        {/* Left Breaking News Channel Badge */}
        <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 bg-gradient-to-r from-red-700 to-red-800 dark:from-red-800 dark:to-red-900 text-white font-black text-[11px] sm:text-xs tracking-wide shadow-md z-20 relative">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <BellRing size={13} className="text-red-100 flex-shrink-0 hidden xs:inline" />
          <span className="whitespace-nowrap font-extrabold uppercase">
            {tickerHeading}
          </span>
          {/* Subtle Angled Divider / Chevron for news channel look */}
          <div className="absolute right-0 top-0 bottom-0 w-2.5 translate-x-full overflow-hidden pointer-events-none hidden sm:block">
            <div className="w-5 h-full bg-red-800 dark:bg-red-900 origin-top-left -skew-x-12" />
          </div>
        </div>

        {/* Ticker Content Strip */}
        <div 
          className="flex-grow flex items-center overflow-hidden relative group pl-2 sm:pl-5 pr-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          ref={tickerRef}
        >
          {items.length === 0 ? (
            <div className="text-gray-400 text-xs px-4">
              {language === "mr" 
                ? "सध्या कोणताही नवीन शासन निर्णय उपलब्ध नाही" 
                : language === "hi" 
                ? "वर्तमान में कोई नया शासनादेश उपलब्ध नहीं है" 
                : "No new verified Government Resolutions"}
            </div>
          ) : isReducedMotion ? (
            /* Reduced Motion / Step Mode */
            <div className="flex items-center justify-between w-full gap-3 py-1">
              {items[currentIndex] && (
                <div className="flex items-center gap-2.5 truncate">
                  {/* NEW Indicator for genuinely new verified records */}
                  {items[currentIndex].isNew && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black bg-red-600 text-white tracking-wider animate-pulse flex-shrink-0 shadow-sm">
                      NEW
                    </span>
                  )}

                  {/* Verified Calendar Date (No UTC Timezone Shifts) */}
                  {renderDateBadge(items[currentIndex])}
                  
                  {renderStatusBadge(items[currentIndex])}

                  <Link 
                    href={items[currentIndex].internalHref}
                    className="truncate text-slate-100 hover:text-amber-300 font-semibold transition-colors"
                  >
                    {getLocalizedHeadline(items[currentIndex])}
                  </Link>

                  {items[currentIndex].officialUrl && (
                    <a
                      href={items[currentIndex].officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden md:inline-flex items-center gap-1 text-[11px] text-amber-400 hover:underline flex-shrink-0 font-bold ml-1"
                      title={language === "mr" ? "अधिकृत GR दस्तऐवज उघडा" : "View Official GR Document"}
                    >
                      <span>{language === "mr" ? "अधिकृत GR" : "View Official GR"}</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              )}

              {/* Prev / Next controls for accessible step navigation */}
              <div className="flex items-center gap-1 flex-shrink-0 pl-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1 rounded hover:bg-slate-800 text-gray-300 hover:text-white transition-colors"
                  aria-label="Previous update"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[10px] text-gray-400 px-1 font-mono">
                  {currentIndex + 1}/{items.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1 rounded hover:bg-slate-800 text-gray-300 hover:text-white transition-colors"
                  aria-label="Next update"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            /* Animated Continuous Marquee Strip */
            <div 
              className="animate-marquee items-center gap-10 whitespace-nowrap will-change-transform"
              style={{ animationPlayState: isPaused ? "paused" : "running" }}
            >
              {/* Render items twice to create seamless loop */}
              {[...items, ...items].map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="inline-flex items-center gap-2.5 text-xs">
                  {/* NEW Indicator for genuinely new verified records */}
                  {item.isNew && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black bg-red-600 text-white tracking-wider animate-pulse flex-shrink-0 shadow-sm">
                      NEW
                    </span>
                  )}

                  {/* Issue Date Badge */}
                  {renderDateBadge(item)}

                  {/* Status Badge */}
                  {renderStatusBadge(item)}

                  {/* Headline */}
                  <Link 
                    href={item.internalHref}
                    className="text-slate-100 hover:text-amber-300 font-medium transition-colors hover:underline focus:outline-none focus:ring-1 focus:ring-amber-400 px-1 rounded"
                  >
                    {getLocalizedHeadline(item)}
                  </Link>

                  {/* Direct Official Link */}
                  {item.officialUrl && (
                    <a
                      href={item.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-bold underline decoration-amber-500/60 flex-shrink-0 ml-1"
                      title={language === "mr" ? "अधिकृत शासन निर्णय PDF पहा" : language === "hi" ? "आधिकारिक शासनादेश PDF देखें" : "Open official Government Resolution PDF"}
                    >
                      <span>{language === "mr" ? "अधिकृत GR" : language === "hi" ? "शासनादेश" : "Official GR"}</span>
                      <ExternalLink size={11} />
                    </a>
                  )}

                  <span className="text-gray-600 font-bold select-none px-2">•</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Play/Pause Control Button */}
        {!isReducedMotion && (
          <div className="flex-shrink-0 flex items-center px-2 bg-slate-950 border-l border-slate-800/80">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 rounded text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isPaused ? "Resume Ticker Scrolling" : "Pause Ticker Scrolling"}
              aria-label={isPaused ? "Resume Ticker Scrolling" : "Pause Ticker Scrolling"}
            >
              {isPaused ? <Play size={12} className="text-emerald-400" /> : <Pause size={12} />}
            </button>
          </div>
        )}

      </div>
    </aside>
  );
}
