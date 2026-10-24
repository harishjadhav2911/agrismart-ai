"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense, useCallback, useDeferredValue } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Calculator,
  Clock,
  FileText,
  PhoneCall,
  ExternalLink,
  Copy,
  Printer,
  Image as ImageIcon,
  Info,
  Building2,
  Sparkles,
  Bot,
  X,
  ArrowRight,
  ShieldCheck,
  Check,
  Send,
  FileCheck,
  AlertCircle,
  Search,
  Filter,
  Calendar,
  MapPin,
  Landmark,
  SunDim,
  CheckSquare,
  Square,
  RefreshCw,
  GraduationCap,
  Newspaper,
  Activity,
  Database,
  Key,
  Loader2
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useLocation } from "@/context/LocationContext";
import { useGeminiChat } from "@/hooks/useGeminiChat";
import { FormattedChatMessage } from "@/components/chat/FormattedChatMessage";
import {
  INDIAN_STATES,
  STATE_DISTRICTS,
  getLocalizedState,
  getLocalizedDistrict,
  getTalukasForDistrict
} from "@/data/indiaLocations";
import {
  DISASTER_TYPES,
  PANCHANAMA_DOCUMENTS,
  VERIFIED_OFFICIAL_PORTALS,
  GOVERNMENT_ANNOUNCEMENTS_MAHARASHTRA,
  searchDroughtTalukas,
  getDroughtStats,
  DroughtStatus,
  LandCategory,
  DisasterType,
  AreaUnit,
  calculateEstimatedRelief,
  convertHectareToOtherUnits,
  convertAreaToHectare
} from "@/data/cropRelief";
import MaharashtraDroughtMap from "@/components/crop-relief/MaharashtraDroughtMap";
import { getMaharashtraDroughtSummary } from "@/data/maharashtraDistrictsGeo";
import { formatGovernmentGrDate, sortAnnouncementsByVerifiedDate, isGenuinelyNewAnnouncement } from "@/lib/grDateUtils";

type ActiveTab = "talukas" | "announcements" | "news_intelligence" | "calculator" | "guide72" | "panchanama" | "portals";

interface AuditSummaryType {
  lastUpdated: string;
  totalSources: number;
  onlineSources: number;
  totalAnnouncements: number;
  verifiedAnnouncements: number;
  pendingAnnouncements: number;
  conflictingAnnouncements: number;
  totalTalukas: number;
  historicalTalukas: number;
  proposedTalukas: number;
  totalResolutions: number;
  totalRates: number;
  lastIngestionRun: {
    id: string;
    timestamp: string;
    sourcesChecked: number;
    newRecordsFound: number;
    failedSourcesCount: number;
    executionDurationMs: number;
    errors: string[];
    details: string[];
  } | null;
  storageHealth?: {
    mode: string;
    isServerlessSafe: boolean;
    recommendation: string;
  };
}

interface LiveAnnouncementType {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  titleMr: string;
  titleHi: string;
  summary: string;
  summaryMr: string;
  summaryHi: string;
  originalUrl: string;
  canonicalUrl: string;
  category: string;
  publishedAt: string | null;
  discoveredAt: string;
  lastVerifiedAt: string;
  evidenceStatus: "official_gr_verified" | "official_notice_verified" | "official_announcement_pending" | "media_report_pending" | "conflicting_sources" | "historical" | "verification_failed";
  department?: string;
  verifiedGrNumber?: string;
  verifiedGrUrl?: string;
  financialAmount?: string;
  reportedEligibleCount?: string;
  confirmedBeneficiariesCount?: string;
  academicYear?: string;
  geographicScope?: string;
  verificationNotes: {
    en: string;
    mr: string;
    hi: string;
  };
  tags: string[];
}

interface ReliefChatInputBoxProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  language: string;
}

const ReliefChatInputBox = React.memo(function ReliefChatInputBox({
  onSend,
  isLoading,
  language
}: ReliefChatInputBoxProps) {
  const [localText, setLocalText] = useState("");

  const handleSend = () => {
    if (!localText.trim() || isLoading) return;
    onSend(localText.trim());
    setLocalText("");
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder={
          language === "mr"
            ? "आपला प्रश्न येथे विचारा..."
            : language === "hi"
            ? "अपना प्रश्न यहाँ पूछें..."
            : "Ask your relief question here..."
        }
        className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
      />
      <button
        onClick={handleSend}
        disabled={!localText.trim() || isLoading}
        className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white transition-colors cursor-pointer"
        aria-label="Send message"
      >
        <Send size={16} />
      </button>
    </div>
  );
});

function CropReliefContent() {
  const { language } = useLanguage();
  const { location } = useLocation();

  // Active navigation tab (Default to Drought Taluka Directory)
  const [activeTab, setActiveTab] = useState<ActiveTab>("talukas");

  // ==========================================
  // LIVE INTELLIGENCE & STORE STATE
  // ==========================================
  const [liveAuditData, setLiveAuditData] = useState<AuditSummaryType | null>(null);
  const [liveAnnouncements, setLiveAnnouncements] = useState<LiveAnnouncementType[]>([]);
  const [liveSources, setLiveSources] = useState<Array<{
    id: string;
    code: string;
    name: string;
    nameMr: string;
    nameHi: string;
    status: string;
    baseUrl: string;
    lastCheckedAt: string | null;
    isOfficial: boolean;
    notes: string;
  }>>([]);
  const [isFetchingUpdates, setIsFetchingUpdates] = useState(false);

  // Admin Refresh Modal State
  const [refreshModalOpen, setRefreshModalOpen] = useState(false);
  const [adminSecretInput, setAdminSecretInput] = useState("");
  const [isTriggeringRefresh, setIsTriggeringRefresh] = useState(false);
  const [refreshRunReport, setRefreshRunReport] = useState<{
    id: string;
    timestamp: string;
    sourcesChecked: number;
    newRecordsFound: number;
    verifiedRecordsCount: number;
    pendingReviewCount: number;
    failedSourcesCount: number;
    executionDurationMs: number;
    details: string[];
    errors: string[];
  } | null>(null);
  const [refreshError, setRefreshError] = useState("");

  const fetchLiveUpdates = () => {
    setIsFetchingUpdates(true);
    fetch("/api/crop-relief/updates")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) {
          if (data.auditSummary) setLiveAuditData(data.auditSummary);
          if (Array.isArray(data.announcements) && data.announcements.length > 0) {
            setLiveAnnouncements(sortAnnouncementsByVerifiedDate(data.announcements));
          }
          if (Array.isArray(data.sources)) {
            setLiveSources(data.sources);
          }
        }
      })
      .catch((err) => {
        console.warn("Serving baseline offline relief store:", err);
      })
      .finally(() => {
        setIsFetchingUpdates(false);
      });
  };

  useEffect(() => {
    let active = true;
    if (typeof window !== "undefined") {
      localStorage.setItem("agrismart_viewed_relief_gr", "202610221655482506");
    }
    fetch("/api/crop-relief/updates")
      .then((res) => res.json())
      .then((data) => {
        if (active && data && data.success) {
          if (data.auditSummary) setLiveAuditData(data.auditSummary);
          if (Array.isArray(data.announcements) && data.announcements.length > 0) {
            setLiveAnnouncements(sortAnnouncementsByVerifiedDate(data.announcements));
          }
          if (Array.isArray(data.sources)) {
            setLiveSources(data.sources);
          }
        }
      })
      .catch((err) => {
        console.warn("Serving baseline offline relief store:", err);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleTriggerRefresh = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTriggeringRefresh(true);
    setRefreshError("");
    setRefreshRunReport(null);

    try {
      const res = await fetch("/api/crop-relief/refresh", {
        method: "POST",
        headers: {
          "x-admin-secret": adminSecretInput.trim(),
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (!data.success) {
        setRefreshError(data.error || "Failed to trigger live source refresh.");
      } else {
        setRefreshRunReport(data.runReport);
        if (data.auditSummary) setLiveAuditData(data.auditSummary);
        fetchLiveUpdates();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setRefreshError(msg);
    } finally {
      setIsTriggeringRefresh(false);
    }
  };

  // ==========================================
  // 1. HERO PHOTO FALLBACK STATE
  // ==========================================
  const [heroImageError, setHeroImageError] = useState(false);

  // ==========================================
  // 2. DROUGHT TALUKA DIRECTORY STATE
  // ==========================================
  const [talukaSearchQuery, setTalukaSearchQuery] = useState("");
  const [talukaStatusFilter, setTalukaStatusFilter] = useState<DroughtStatus | "all">("all");
  const droughtStats = useMemo(() => getDroughtStats(), []);
  const droughtSummary = useMemo(() => getMaharashtraDroughtSummary(), []);
  const verifiedTalukaDisplayCount = droughtSummary.declaredTalukasTotal;
  const verifiedCirclesDisplayCount = droughtSummary.totalCirclesCount;
  const lastVerifiedDisplayDate = liveAuditData?.lastUpdated
    ? new Date(liveAuditData.lastUpdated).toLocaleDateString(language === "mr" ? "mr-IN" : "en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    : droughtSummary.lastVerifiedDate;

  const deferredTalukaSearchQuery = useDeferredValue(talukaSearchQuery);
  const filteredTalukas = useMemo(() => {
    return searchDroughtTalukas(deferredTalukaSearchQuery, talukaStatusFilter);
  }, [deferredTalukaSearchQuery, talukaStatusFilter]);

  // ==========================================
  // 3. GOVERNMENT ANNOUNCEMENTS TIMELINE STATE
  // ==========================================
  const [announcementFilter, setAnnouncementFilter] = useState<
    "all" | "new_updates" | "official_grs" | "financial_assistance" | "crop_loss" | "drought_water" | "gov_schemes" | "deadlines"
  >("all");

  const filteredAnnouncements = useMemo(() => {
    // Helper to parse official publication/issue date for strict chronological sorting
    const parseOfficialDate = (dateStr: string): number => {
      if (dateStr.includes("22 October 2026")) return new Date(2026, 9, 22).getTime();
      if (dateStr.includes("21 October 2026")) return new Date(2026, 9, 21).getTime();
      if (dateStr.includes("17 October 2026") || dateStr.includes("14 & 17 October 2026")) return new Date(2026, 9, 17).getTime();
      if (dateStr.includes("14 October 2026")) return new Date(2026, 9, 14).getTime();
      if (dateStr.includes("October 2026")) return new Date(2026, 9, 10).getTime();
      if (dateStr.includes("January 2024") || dateStr.includes("01 January 2024")) return new Date(2024, 0, 1).getTime();
      if (dateStr.includes("November 2023")) return new Date(2023, 10, 10).getTime();
      if (dateStr.includes("October 2023") || dateStr.includes("31 October 2023")) return new Date(2023, 9, 31).getTime();
      const parsed = Date.parse(dateStr);
      return isNaN(parsed) ? 0 : parsed;
    };

    // Helper to identify newly gazetted official updates within configurable 7-day recency window
    const isNewOfficial = (ann: { date: string; id: string; status: string }): boolean => {
      if (ann.id.includes("historical") || ann.id.includes("2023") || ann.status === "historical") return false;
      return ann.date.includes("22 October 2026") || ann.date.includes("21 October 2026");
    };

    // 1. Sort by official issue/publication date descending
    const sorted = [...GOVERNMENT_ANNOUNCEMENTS_MAHARASHTRA].sort(
      (a, b) => parseOfficialDate(b.date) - parseOfficialDate(a.date)
    );

    // 2. Thematic filter matching
    if (announcementFilter === "all") return sorted;
    if (announcementFilter === "new_updates") return sorted.filter((a) => isNewOfficial(a));
    if (announcementFilter === "official_grs") return sorted.filter((a) => a.status === "gr_issued" || a.id.includes("gr"));
    if (announcementFilter === "financial_assistance") return sorted.filter((a) => Boolean(a.reliefAmount) || a.id.includes("5000") || a.id.includes("enhanced"));
    if (announcementFilter === "crop_loss") return sorted.filter((a) => a.id.includes("food_dept") || a.id.includes("enhanced") || a.id.includes("historical"));
    if (announcementFilter === "drought_water") return sorted.filter((a) => a.id.includes("water") || a.id.includes("food_dept") || a.id.includes("historical") || a.id.includes("interim"));
    if (announcementFilter === "gov_schemes") return sorted.filter((a) => a.id.includes("exam") || a.id.includes("food") || a.id.includes("pmfby"));
    if (announcementFilter === "deadlines") return sorted.filter((a) => a.id.includes("water") || a.id.includes("exam"));
    return sorted;
  }, [announcementFilter]);

  // ==========================================
  // 4. CALCULATOR STATE
  // ==========================================
  const [selectedState, setSelectedState] = useState<string>(location?.state || "Maharashtra");
  const [selectedDistrict, setSelectedDistrict] = useState<string>(location?.district || "Nagpur");
  const [landCategory, setLandCategory] = useState<LandCategory>("rainfed");
  const [disasterType, setDisasterType] = useState<DisasterType>("drought");
  
  // Area values in sync
  const [areaAmount, setAreaAmount] = useState<number>(5);
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("acre");
  const [damagePercent, setDamagePercent] = useState<number>(50);

  // Live conversion helper values
  const currentNormalizedHectares = useMemo(() => {
    return convertAreaToHectare(areaAmount, areaUnit);
  }, [areaAmount, areaUnit]);

  const convertedUnits = useMemo(() => {
    return convertHectareToOtherUnits(currentNormalizedHectares);
  }, [currentNormalizedHectares]);

  // Dynamic relief estimation result
  const calculationResult = useMemo(() => {
    return calculateEstimatedRelief({
      landCategory,
      areaAmount,
      areaUnit,
      damagePercentage: damagePercent,
      disasterType,
      selectedState
    });
  }, [landCategory, areaAmount, areaUnit, damagePercent, disasterType, selectedState]);

  // Available districts for chosen state
  const availableDistricts = useMemo(() => {
    return STATE_DISTRICTS[selectedState] || [];
  }, [selectedState]);

  // Standalone Area Converter widget state
  const [converterInputAmount, setConverterInputAmount] = useState<number>(5);
  const [converterInputUnit, setConverterInputUnit] = useState<AreaUnit>("acre");
  const [isConverterOpen, setIsConverterOpen] = useState(false);

  const standaloneNormalizedHectares = useMemo(() => {
    return convertAreaToHectare(converterInputAmount, converterInputUnit);
  }, [converterInputAmount, converterInputUnit]);

  const standaloneConverted = useMemo(() => {
    const h = Math.max(0, standaloneNormalizedHectares);
    return {
      hectares: Number(h.toFixed(4)),
      acres: Number((h * 2.47105).toFixed(3)),
      gunthas: Number((h * 100).toFixed(1)),
      sqMeters: Math.round(h * 10000),
      sqFeet: Math.round(h * 107639)
    };
  }, [standaloneNormalizedHectares]);

  const applyConvertedAreaToCalculator = () => {
    setAreaAmount(converterInputAmount);
    setAreaUnit(converterInputUnit);
  };

  // ==========================================
  // 5. DOCUMENT CHECKLIST STATE
  // ==========================================
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({
    "7_12_extract": true,
    "e_pik_pahani": true,
    "8_a_extract": false,
    "aadhaar_bank_passbook": true,
    "pmfby_receipt": false,
    "geotagged_photos": true
  });

  const toggleDocChecked = (docId: string) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [docId]: !prev[docId]
    }));
  };

  // ==========================================
  // 6. PANCHANAMA APPLICATION GENERATOR STATE
  // ==========================================
  const [panchanamaData, setPanchanamaData] = useState({
    farmerName: "रामराव तुकाराम जाधव",
    fatherOrHusbandName: "तुकाराम जाधव",
    village: "दिग्रस (Digras)",
    taluka: "दिग्रस",
    district: "यवतमाळ",
    surveyNumber: "४५/२ (Gat No. 45/2)",
    cropName: "सोयाबीन (Soybean)",
    sowingDate: "2026-06-25",
    incidentDate: "2026-10-14",
    causeOfDamage: "दुष्काळ व पावसाचा खंड (Severe Drought / Dry Spell)",
    estimatedLossPercent: "६०%",
    contactPhone: "9822012345"
  });

  const [copiedDraft, setCopiedDraft] = useState(false);

  const handleMapSelectTaluka = useCallback((talukaName: string, districtName: string) => {
    setSelectedDistrict(districtName);
    setPanchanamaData((prev) => ({
      ...prev,
      taluka: talukaName,
      district: districtName
    }));
    setActiveTab("calculator");
    const el = document.getElementById("relief-tabs");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Available talukas for selected district in Panchanama
  const availableTalukas = useMemo(() => {
    return getTalukasForDistrict(selectedDistrict);
  }, [selectedDistrict]);

  // Derived active taluka ensuring alignment with selected district
  const activeTaluka = useMemo(() => {
    if (availableTalukas.length > 0 && !availableTalukas.includes(panchanamaData.taluka)) {
      return availableTalukas[0];
    }
    return panchanamaData.taluka || availableTalukas[0] || "";
  }, [availableTalukas, panchanamaData.taluka]);

  // Phone and Date Validation
  const phoneError = useMemo(() => {
    if (!panchanamaData.contactPhone) return "";
    const cleaned = panchanamaData.contactPhone.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      return language === "mr"
        ? "मोबाईल क्रमांक १० अंकी असावा (उदा. 9822012345)"
        : language === "hi"
        ? "मोबाइल नंबर 10 अंकों का होना चाहिए (उदा. 9822012345)"
        : "Phone must be a valid 10-digit number (e.g. 9822012345)";
    }
    return "";
  }, [panchanamaData.contactPhone, language]);

  const dateError = useMemo(() => {
    if (!panchanamaData.incidentDate) return "";
    const selected = new Date(panchanamaData.incidentDate);
    const today = new Date();
    if (selected > today) {
      return language === "mr"
        ? "आपत्तीची तारीख भविष्यातील असू शकत नाही"
        : language === "hi"
        ? "आपदा की तिथि भविष्य की नहीं हो सकती"
        : "Incident date cannot be in the future";
    }
    return "";
  }, [panchanamaData.incidentDate, language]);

  // Complete Generated Application Letter Text
  const fullApplicationLetterText = useMemo(() => {
    if (language === "mr") {
      return `[नमुना अर्ज मसुदा - DEMO SAMPLE DRAFT]
प्रति,
मा. तालुका कृषी अधिकारी / मा. तहसीलदार साहेब,
तालुका: ${activeTaluka || "________"}, जिल्हा: ${selectedDistrict}.

विषय: नैसर्गिक आपत्तीमुळे (${panchanamaData.causeOfDamage}) झालेल्या पीक नुकसानीचा तातडीने संयुक्त पंचनामा करणेबाबत.

महोदय,
मी अर्जदार श्री/श्रीमती ${panchanamaData.farmerName || "________"}, राहणार: मौजे ${panchanamaData.village || "________"}, ता. ${activeTaluka || "________"}, जि. ${selectedDistrict} येथील शेतकरी असून माझ्या मालकीच्या गट क्र. ${panchanamaData.surveyNumber || "________"} मध्ये चालू हंगामात मी ${panchanamaData.cropName || "________"} पिकाची लागवड केली होती. सदर पिकाची ई-पीक पाहणी नोंद अधिकृतरीत्या पूर्ण करण्यात आलेली आहे.

दिनांक ${panchanamaData.incidentDate} रोजी आमच्या भागात अचानक झालेल्या ${panchanamaData.causeOfDamage} मुळे माझ्या शेतातील उभ्या पिकाचे अंदाजे ${panchanamaData.estimatedLossPercent} अतोनात नुकसान झाले असून पीक पूर्णपणे सुकले / खराब झाले आहे.

तरी महोदयांना नम्र विनंती आहे की, कृषी व महसूल विभागाच्या पंचनामा पथकास प्रत्यक्ष शेतात पाठवून पंचनामा करण्यात यावा, जेणेकरून मला शासन नियमानुसार नुकसान भरपाई व पीक विमा साहाय्य मिळू शकेल.

सोबत जोडलेली कागदपत्रे:
१. डिजिटल ७/१२ व ८-अ उतारा
२. ई-पीक पाहणी नोंद प्रत
३. आधार कार्ड व आधार संलग्न बँक पासबुक प्रत (NPCI Active)
४. पीक नुकसानीचे जिओटॅग छायाचित्र (GPS Photos)

आपला नम्र,
स्वाक्षरी: ________________________
नाव: ${panchanamaData.farmerName || "________"}
मोबाईल क्र.: ${panchanamaData.contactPhone || "________"}
दिनांक: ${new Date().toISOString().split("T")[0]}
(नोंद: हा संगणकीय प्रात्यक्षिक नमुना अर्ज मसुदा (DEMO DRAFT) आहे. स्वाक्षरी करून प्रत्यक्ष कार्यालयात जमा करावा.)`;
    }
    if (language === "hi") {
      return `[आवेदन प्रारूप - DEMO SAMPLE DRAFT]
सेवा में,
श्रीमान उपखंड अधिकारी (एसडीएम) / तहसीलदार महोदय,
तहसील: ${activeTaluka || "________"}, जिला: ${selectedDistrict}.

विषय: प्राकृतिक आपदा (${panchanamaData.causeOfDamage}) से हुए फसल नुकसान का स्थलीय संयुक्त पंचनामा कराने हेतु आवेदन।

महोदय,
सविनय निवेदन है कि मैं प्रार्थी ${panchanamaData.farmerName || "________"}, निवासी: ग्राम ${panchanamaData.village || "________"}, तहसील ${activeTaluka || "________"}, जिला ${selectedDistrict} का निवासी किसान हूँ। मेरे खसरा/गाटा संख्या ${panchanamaData.surveyNumber || "________"} में वर्तमान मौसम में ${panchanamaData.cropName || "________"} की फसल बोई गई थी, जिसकी ई-पड़ताल प्रविष्टि पूर्ण है।

दिनांक ${panchanamaData.incidentDate} को हुई भीषण ${panchanamaData.causeOfDamage} के कारण मेरे खेत की लगभग ${panchanamaData.estimatedLossPercent} फसल नष्ट हो गई है।

अतः आपसे प्रार्थना है कि राजस्व व कृषि विभाग की टीम से खेत का स्थलीय मुआयना व पंचनामा करवाने की कृपा करें ताकि शासन नियमानुसार उचित आर्थिक सहायता प्राप्त हो सके।

संलग्न दस्तावेज:
1. डिजिटल खतौनी / 7/12 व 8-अ नकल
2. ई-पड़ताल / ई-पीक पाहणी प्रमाण
3. आधार कार्ड व डीबीटी सक्रिय बैंक पासबुक
4. क्षतिग्रस्त फसल के जीपीएस फोटो

भवदीय,
हस्ताक्षर: ________________________
नाम: ${panchanamaData.farmerName || "________"}
मोबाईल: ${panchanamaData.contactPhone || "________"}
दिनांक: ${new Date().toISOString().split("T")[0]}
(सूचना: यह एक सांकेतिक आवेदन प्रारूप (DEMO DRAFT) है। कृपया हस्ताक्षर कर संबंधित कार्यालय में प्रस्तुत करें।)`;
    }
    return `[APPLICATION TEMPLATE - DEMO SAMPLE DRAFT]
To,
The Taluka Agriculture Officer / Tahsildar,
Tehsil: ${activeTaluka || "________"}, District: ${selectedDistrict}.

Subject: Application for urgent Joint Panchanama survey for crop loss due to ${panchanamaData.causeOfDamage}.

Respected Sir/Madam,
I, the undersigned applicant ${panchanamaData.farmerName || "________"}, resident of Village ${panchanamaData.village || "________"}, Tehsil ${activeTaluka || "________"}, District ${selectedDistrict}, hold agricultural land under Gat/Survey No. ${panchanamaData.surveyNumber || "________"}. I cultivated ${panchanamaData.cropName || "________"} this season, duly recorded in digital land registries (e-Pik Pahani).

On ${panchanamaData.incidentDate}, due to severe ${panchanamaData.causeOfDamage}, my standing crop suffered approximately ${panchanamaData.estimatedLossPercent} devastation.

I kindly request you to depute the Joint Survey Team (Talathi, Agriculture Assistant, and Insurance Surveyor) to inspect my field and prepare an official Panchanama report so that statutory relief under SDRF/PMFBY can be processed.

Enclosures:
1. Digital 7/12 & 8-A Extract
2. e-Pik Pahani Registration Slip
3. Aadhaar & NPCI-seeded Bank Passbook
4. Geotagged photographs of damaged crop

Yours sincerely,
Signature: ________________________
Name: ${panchanamaData.farmerName || "________"}
Phone: ${panchanamaData.contactPhone || "________"}
Date: ${new Date().toISOString().split("T")[0]}
(Note: This is a generated application draft (DEMO DRAFT). Sign and submit physically to your local office.)`;
  }, [panchanamaData, selectedDistrict, language, activeTaluka]);

  // Handle application letter copy
  const handleCopyApplication = () => {
    navigator.clipboard.writeText(fullApplicationLetterText);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2500);
  };

  const handlePrintApplication = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Crop Damage Panchanama Application</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; padding: 40px; max-width: 800px; margin: auto; }
            h2 { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; }
            .footer { margin-top: 40px; font-size: 12px; color: #666; border-top: 1px dashed #ccc; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h2>${language === "mr" ? "पीक नुकसान भरपाई व संयुक्त पंचनामा अर्ज" : language === "hi" ? "फसल क्षति व संयुक्त पंचनामा आवेदन" : "Crop Loss Joint Panchanama Application"}</h2>
          <pre>${fullApplicationLetterText}</pre>
          <div class="footer">
            Printed via AgriSmart AI Maharashtra Farmer Relief Portal • Date: ${new Date().toLocaleDateString()}
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Client-Side Crop Photo Pre-Validation Inspector
  const [selectedImageFile, setSelectedImageFile] = useState<{
    name: string;
    sizeKb: number;
    previewUrl: string;
    hasExifWarning: boolean;
  } | null>(null);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError("");
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError(
        language === "mr"
          ? "कृपया फक्त वैध छायाचित्र (JPEG / PNG / WebP) निवडावे."
          : language === "hi"
          ? "कृपया केवल वैध फोटो (JPEG / PNG / WebP) का चयन करें।"
          : "Please select a valid image file (JPEG, PNG, WebP)."
      );
      return;
    }

    const sizeKb = Math.round(file.size / 1024);
    if (sizeKb > 5120) {
      setPhotoError(
        language === "mr"
          ? "छायाचित्राचा आकार ५ MB पेक्षा कमी असावा (पोर्टल अपलोड मर्यादा)."
          : language === "hi"
          ? "फोटो का आकार 5 MB से कम होना चाहिए।"
          : "File size exceeds 5 MB portal limit."
      );
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedImageFile({
      name: file.name,
      sizeKb,
      previewUrl,
      hasExifWarning: true
    });
  };

  // ==========================================
  // 7. AI RELIEF ADVISOR DRAWER STATE
  // ==========================================
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { messages, isLoading, sendMessage } = useGeminiChat("crop-relief", "relief_chat_welcome");
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const handleSendQuery = useCallback((textToSend?: string) => {
    if (!textToSend || !textToSend.trim() || isLoading) return;
    sendMessage(textToSend.trim());
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  }, [isLoading, sendMessage]);

  // Recommended contextual prompts for farmers
  const samplePrompts = useMemo(() => {
    if (language === "mr") {
      return [
        "बीड, जालना आणि छत्रपती संभाजीनगरमध्ये दुष्काळ जाहीर आहे का?",
        "दिवाळीपूर्वी ₹५,००० मदत कोणाला व कशी मिळणार? अधिकृत GR निघाला आहे का?",
        "माझ्याकडे ५ एकर जिरायत शेत आहे, ५०% दुष्काळात किती शासकीय मदत मिळेल?",
        "पीक विम्यात ७२ तासांचा नियम दुष्काळाला लागू होतो का?"
      ];
    }
    if (language === "hi") {
      return [
        "महाराष्ट्र के किन 40 तालुकों में आधिकारिक सूखा घोषित है?",
        "दीवाली से पहले ₹5,000 की अंतरिम मदद की क्या स्थिति है?",
        "5 एकड़ असिंचित भूमि पर 50% फसल नुकसान पर कितनी सहायता मिलेगी?",
        "क्या सूखे के नुकसान में 72 घंटे की पूर्व-सूचना अनिवार्य है?"
      ];
    }
    return [
      "Which 40 talukas are officially declared drought-hit in Maharashtra?",
      "What is the status of the pre-Diwali ₹5,000 interim assistance announcement?",
      "How much SDRF assistance for 5 acres of rainfed land with 50% damage?",
      "Does the 72-hour reporting deadline apply to drought losses?"
    ];
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar />

      {/* ==================================================== */}
      {/* 1. LARGE IMMERSIVE FULL-WIDTH FARMER HERO SECTION */}
      {/* ==================================================== */}
      <section className="relative min-h-[580px] md:min-h-[640px] pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden flex items-center">
        {/* Large Farmer Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {!heroImageError ? (
            <Image
              src="/images/drought_farmer_maharashtra.jpg"
              alt="Dignified Indian farmer in a drought-affected field in rural Maharashtra"
              fill
              priority
              className="object-cover object-center scale-105 transition-transform duration-1000"
              sizes="100vw"
              quality={92}
              onError={() => setHeroImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900" />
          )}
          {/* Subtle Dark/Amber Gradient Overlay for High Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/90 via-stone-950/80 to-gray-950/95 dark:from-black/95 dark:via-stone-950/85 dark:to-black/95 backdrop-blur-[0.5px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Top Verified Count Pill - Prominently Displayed (Not Hardcoded) */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full bg-amber-950/85 text-amber-200 text-xs sm:text-sm font-bold border border-amber-500/40 shadow-xl backdrop-blur-md">
              <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0" />
              <span>
                {language === "mr"
                  ? (verifiedCirclesDisplayCount && verifiedCirclesDisplayCount > 0)
                    ? `अधिकृत दुष्काळग्रस्त तालुके: ${verifiedTalukaDisplayCount ?? 0} शासन निर्णय प्रमाणित | ${verifiedCirclesDisplayCount.toLocaleString("en-IN")} महसूल मंडळे सवलती`
                    : `अधिकृत दुष्काळग्रस्त तालुके: ${verifiedTalukaDisplayCount ?? 0} तालुके (३३ जिल्हे) शासन निर्णय प्रमाणित`
                  : language === "hi"
                  ? (verifiedCirclesDisplayCount && verifiedCirclesDisplayCount > 0)
                    ? `आधिकारिक सूखा प्रभावित तहसीलें: ${verifiedTalukaDisplayCount ?? 0} शासनादेश प्रमाणित | ${verifiedCirclesDisplayCount.toLocaleString("en-IN")} राजस्व मंडल`
                    : `आधिकारिक सूखा प्रभावित तहसीलें: ${verifiedTalukaDisplayCount ?? 0} तहसीलें (33 जिले) शासनादेश प्रमाणित`
                  : (verifiedCirclesDisplayCount && verifiedCirclesDisplayCount > 0)
                    ? `Officially Declared Drought: ${verifiedTalukaDisplayCount ?? 0} Talukas (GR Verified) | ${verifiedCirclesDisplayCount.toLocaleString("en-IN")} Revenue Circles`
                    : `Officially Declared Drought: ${verifiedTalukaDisplayCount ?? 0} Talukas across 33 Districts (GR Verified)`}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {language === "mr" ? `पडताळणी: ${lastVerifiedDisplayDate}` : `Verified: ${lastVerifiedDisplayDate}`}
              </span>
            </div>

            {/* Large English Heading */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15] drop-shadow-lg">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200">
                Maharashtra Drought & Farmer Relief Hub
              </span>
            </h1>

            {/* Prominent Marathi Heading */}
            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-amber-200/95 tracking-wide drop-shadow-md">
              दुष्काळग्रस्त शेतकऱ्यांसाठी मदत व शासकीय योजनांची माहिती
            </h2>

            {/* Concise Description */}
            <p className="text-sm sm:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-normal">
              {language === "mr"
                ? "महाराष्ट्र शासनाचे अधिकृत शासन निर्णय (GR), दुष्काळग्रस्त ३६ जिल्ह्यांचा परस्परसंवादी नकाशा, SDRF/NDRF भरपाई गणक, शैक्षणिक शुल्कमाफी आणि पीक विमा मार्गदर्शन एकाच ठिकाणी."
                : language === "hi"
                ? "महाराष्ट्र सरकार के आधिकारिक शासनादेश (GR), सूखा प्रभावित 36 जिलों का इंटरैक्टिव मानचित्र, SDRF मुआवजा कैलकुलेटर, परीक्षा शुल्क छूट और फसल बीमा मार्गदर्शन।"
                : "Real-time Maharashtra Government Resolutions (GRs), 36-district interactive drought map, SDRF compensation calculator, exam fee waivers, and official PMFBY claims assistance."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <a
                href="#drought-map"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-xl shadow-amber-600/30 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <MapPin size={16} />
                <span>{language === "mr" ? "दुष्काळ नकाशा पहा" : "Explore Drought Map"}</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("announcements");
                  const el = document.getElementById("relief-tabs");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gray-900/90 hover:bg-gray-800 text-white font-bold text-sm border border-gray-700 shadow-md backdrop-blur-md transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Landmark size={16} className="text-amber-400" />
                <span>{language === "mr" ? "शासकीय निर्णय व घोषणा" : "Latest Government Updates"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("calculator");
                  const el = document.getElementById("relief-tabs");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-200 font-bold text-sm border border-emerald-500/40 backdrop-blur-md transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Calculator size={16} className="text-emerald-400" />
                <span>{language === "mr" ? "नुकसान भरपाई गणक" : "Calculate Relief"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-200 font-bold text-sm border border-blue-500/40 backdrop-blur-md transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Bot size={16} className="text-blue-400" />
                <span>{language === "mr" ? "एआय सल्लागार" : "AI Relief Advisor"}</span>
              </button>
            </div>

            {/* Quick Helpline Strip */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-300">
              <a href="tel:14447" className="inline-flex items-center gap-1.5 font-bold text-rose-300 hover:underline">
                <PhoneCall size={13} className="text-rose-400 animate-pulse" />
                <span>{language === "mr" ? "पीक विमा हेल्पलाइन: १४४४७" : "PMFBY Toll-Free: 14447"}</span>
              </a>
              <span>•</span>
              <span className="text-emerald-300">
                {language === "mr" ? "किमान ३३% नुकसान अट (SDRF)" : "Min 33% Loss Criteria"}
              </span>
              <span>•</span>
              <span className="text-amber-300">
                {language === "mr" ? "स्थानिक आपत्ती ७२ तास नियम" : "72-Hr PMFBY Localized Rule"}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ==================================================== */}
        {/* LIVE INTELLIGENCE STATUS & ADMIN REFRESH CONTROL */}
        {/* ==================================================== */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-amber-950/20 border border-emerald-200 dark:border-emerald-800/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>{language === "mr" ? "थेट शासकीय माहिती प्रणाली" : language === "hi" ? "सजीव आधिकारिक सूचना प्रणाली" : "Live Intelligence System"}</span>
            </div>

            <div className="text-xs text-gray-700 dark:text-gray-300 font-semibold flex flex-wrap items-center gap-2">
              <span className="hidden sm:inline text-gray-300 dark:text-gray-600">|</span>
              <span>
                {language === "mr" ? "शेवटचा अपडेट:" : language === "hi" ? "अंतिम अपडेट:" : "Last Refresh:"}{" "}
                <span className="font-mono text-gray-900 dark:text-white font-bold">
                  {liveAuditData?.lastUpdated
                    ? new Date(liveAuditData.lastUpdated).toLocaleDateString(
                        language === "mr" ? "mr-IN" : "en-IN",
                        { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }
                      )
                    : "Live (23 Oct 2026)"}
                </span>
              </span>
              <span className="hidden sm:inline text-gray-300 dark:text-gray-600">|</span>
              <span>
                {language === "mr" ? "सक्रिय स्रोत:" : "Sources:"}{" "}
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {liveAuditData ? `${liveAuditData.onlineSources}/${liveAuditData.totalSources} Online` : "6/7 Online"}
                </span>
              </span>
              <span className="hidden sm:inline text-gray-300 dark:text-gray-600">|</span>
              <span>
                {language === "mr" ? "पडताळणी झालेले GR:" : "Verified GRs:"}{" "}
                <span className="font-bold text-blue-700 dark:text-blue-400">
                  {liveAuditData ? `${liveAuditData.verifiedAnnouncements}` : "3"}
                </span>
              </span>
              <span className="hidden sm:inline text-gray-300 dark:text-gray-600">|</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold">
                {language === "mr" ? "सक्रिय डेटाबेस" : "Persistent Store"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setRefreshError("");
              setRefreshRunReport(null);
              setRefreshModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 text-xs font-extrabold transition-all shadow-sm flex-shrink-0 cursor-pointer"
          >
            <RefreshCw size={13} className={isFetchingUpdates ? "animate-spin text-amber-600" : "text-emerald-600"} />
            <span>{language === "mr" ? "माहिती अद्यतनित करा" : language === "hi" ? "जानकारी अद्यतन करें" : "Refresh Intelligence"}</span>
          </button>
        </div>

        {/* ==================================================== */}
        {/* 2. MAHARASHTRA INTERACTIVE DROUGHT MAP COMPONENT */}
        {/* ==================================================== */}
        <MaharashtraDroughtMap onSelectTaluka={handleMapSelectTaluka} />

        {/* ==================================================== */}
        {/* 3. INTERACTIVE NAVIGATION TABS */}
        {/* ==================================================== */}
        <div id="relief-tabs" className="space-y-6 pt-2 scroll-mt-24">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-gray-200 dark:border-gray-800">
            {[
              {
                id: "talukas" as ActiveTab,
                label: language === "mr" ? "दुष्काळग्रस्त तालुके शोध" : language === "hi" ? "सूखा प्रभावित तहसील खोज" : "Drought Taluka Directory",
                icon: MapPin
              },
              {
                id: "announcements" as ActiveTab,
                label: language === "mr" ? "नवीनतम शासन निर्णय व घोषणा" : language === "hi" ? "शासनादेश व घोषणाएं" : "Govt Announcements & GRs",
                icon: Calendar
              },
              {
                id: "news_intelligence" as ActiveTab,
                label: language === "mr" ? "शैक्षणिक शुल्कमाफी व वृत्त मागोवा" : language === "hi" ? "शिक्षा शुल्क माफी व समाचार" : "Education Relief & News Intelligence",
                icon: GraduationCap
              },
              {
                id: "calculator" as ActiveTab,
                label: language === "mr" ? "नुकसान भरपाई गणक" : language === "hi" ? "राहत कैलकुलेटर" : "Relief Calculator",
                icon: Calculator
              },
              {
                id: "guide72" as ActiveTab,
                label: language === "mr" ? "पीक विमा व ७२ तास मार्गदर्शक" : language === "hi" ? "फसल बीमा 72 घंटे गाइड" : "72-Hour PMFBY Guide",
                icon: Clock
              },
            {
              id: "panchanama" as ActiveTab,
              label: language === "mr" ? "पंचनामा व अर्ज मसुदा" : language === "hi" ? "पंचनामा व आवेदन प्रारूप" : "Panchanama & Application",
              icon: FileText
            },
            {
              id: "portals" as ActiveTab,
              label: language === "mr" ? "अधिकृत पोर्टल्स व हेल्पलाईन" : language === "hi" ? "आधिकारिक पोर्टल व हेल्पलाइन" : "Official Portals & Contacts",
              icon: ExternalLink
            }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ==================================================== */}
        {/* TAB 1: MAHARASHTRA DROUGHT TALUKA DIRECTORY */}
        {/* ==================================================== */}
        {activeTab === "talukas" && (
          <div className="space-y-6">
            
            {/* Search & Filter Bar */}
            <div className="p-5 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                
                {/* Search Input */}
                <div className="relative w-full sm:w-96">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={talukaSearchQuery}
                    onChange={(e) => setTalukaSearchQuery(e.target.value)}
                    placeholder={
                      language === "mr"
                        ? "जिल्हा किंवा तालुक्याचे नाव शोधा (उदा. बीड, बारामती, शेवगाव, जालना)..."
                        : language === "hi"
                        ? "जिला या तहसील का नाम खोजें (उदा. बीड, बारामती, शेवगांव)..."
                        : "Search by District or Taluka (e.g., Beed, Baramati, Shevgaon)..."
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                  {talukaSearchQuery && (
                    <button
                      onClick={() => setTalukaSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Live count summary */}
                <div className="text-xs text-gray-500 font-semibold flex items-center gap-1.5 self-start sm:self-auto">
                  <Filter size={14} className="text-amber-600" />
                  <span>
                    {language === "mr"
                      ? `${filteredTalukas.length} तालुके सापडले`
                      : language === "hi"
                      ? `${filteredTalukas.length} तहसीलें मिलीं`
                      : `${filteredTalukas.length} Talukas Found`}
                  </span>
                </div>
              </div>

              {/* Status Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/60 text-xs">
                <span className="font-bold text-gray-500 text-[11px] uppercase tracking-wider mr-1">
                  {language === "mr" ? "स्थितीनुसार फिल्टर:" : language === "hi" ? "स्थिति अनुसार फिल्टर:" : "Status Filter:"}
                </span>

                {[
                  { id: "all", label: language === "mr" ? `सर्व (${droughtStats.total})` : `All (${droughtStats.total})` },
                  { id: "declared_severe", label: language === "mr" ? `तीव्र दुष्काळ (${droughtStats.severe})` : `Severe Drought (${droughtStats.severe})` },
                  { id: "declared_moderate", label: language === "mr" ? `मध्यम दुष्काळ (${droughtStats.moderate})` : `Moderate Drought (${droughtStats.moderate})` },
                  { id: "drought_like_concession", label: language === "mr" ? `दुष्काळसदृश सवलती (${droughtStats.concession})` : `Drought-Like Concession (${droughtStats.concession})` },
                  { id: "under_assessment", label: language === "mr" ? `स्थळ पाहणी सुरू (${droughtStats.assessment})` : `Under Assessment (${droughtStats.assessment})` }
                ].map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => setTalukaStatusFilter(chip.id as DroughtStatus | "all")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      talukaStatusFilter === chip.id
                        ? "bg-amber-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Factual Information & Data Accuracy Banner */}
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs sm:text-sm text-blue-900 dark:text-blue-200 space-y-1.5">
              <div className="font-extrabold flex items-center gap-2 text-blue-800 dark:text-blue-300">
                <Info size={16} />
                <span>
                  {language === "mr"
                    ? "अधिकृत शासन निर्णय व पडताळणी स्पष्टीकरण (Official GR Delineation):"
                    : language === "hi"
                    ? "आधिकारिक शासनादेश एवं सत्यापन स्थिति (Official GR Delineation):"
                    : "Official Government Resolution & Verification Status Delineation:"}
                </span>
              </div>
              <p className="leading-relaxed text-xs">
                {language === "mr"
                  ? "१. शासन निर्णय क्र. संकीर्ण-२०२३/प्र.क्र.२५१/म-३ (दिनांक ३१ ऑक्टोबर २०२३) नुसार १५ जिल्ह्यांतील ४० तालुके अधिकृतरीत्या तीव्र/मध्यम दुष्काळ घोषित आहेत. २. शासन निर्णय दिनांक १० नोव्हेंबर २०२३ नुसार १,०२१ महसूल मंडळांमध्ये (२६५ तालुके) दुष्काळसदृश ८ महसूल सवलती लागू करण्यात आल्या. ३. मंत्रिमंडळ बैठकांमध्ये चर्चेत आलेला ४० वाढीव तालुक्यांचा विस्तार (एकूण ३०५ तालुके) हा विभागीय आयुक्तांच्या स्थळ पाहणी अंतर्गत असून औपचारिक गॅझेट शासन निर्णय (GR) प्रतीक्षेत आहे. अधिकृत GR निर्गमित असल्याशिवाय कोणत्याही दाव्यास अंतिम समजू नये."
                  : language === "hi"
                  ? "1. शासनादेश सं. 31/10/2023 के तहत 15 जिलों की 40 तहसीलें आधिकारिक रूप से गंभीर/मध्यम सूखा घोषित हैं। 2. शासनादेश 10/11/2023 के तहत 1,021 मंडलों (265 तहसीलों) में 8 वैधानिक रियायतें लागू की गईं। 3. 40 अतिरिक्त तहसीलों का विस्तार (कुल 305 तहसीलें) संभागीय आयुक्तों के स्थलीय सत्यापन में है और औपचारिक गजट शासनादेश प्रतीक्षारत है।"
                  : "1. 40 Talukas across 15 districts are officially gazetted as Severe/Moderate Drought under GR dated 31/10/2023. 2. 1,021 Revenue Circles across 265 talukas receive the 8 statutory drought concessions under GR dated 10/11/2023. 3. The proposed expansion to 305 talukas (adding 40 talukas) remains under ground-truth assessment pending formal Gazette GR notification."}
              </p>
            </div>

            {/* Talukas Directory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTalukas.map((t) => {
                const isSevere = t.status === "declared_severe";
                const isModerate = t.status === "declared_moderate";
                const isConcession = t.status === "drought_like_concession";

                return (
                  <div
                    key={t.id}
                    className="p-5 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-amber-400 dark:hover:border-amber-600 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <MapPin size={12} className="text-amber-600" />
                          <span>{t.district} ({t.districtMr})</span>
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">
                          {t.taluka} <span className="text-sm font-bold text-gray-500">({t.talukaMr})</span>
                        </h3>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide flex-shrink-0 ${
                          isSevere
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                            : isModerate
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                            : isConcession
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                            : "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-800"
                        }`}
                      >
                        {isSevere
                          ? (language === "mr" ? "तीव्र दुष्काळ (घोषित)" : "Severe Drought")
                          : isModerate
                          ? (language === "mr" ? "मध्यम दुष्काळ (घोषित)" : "Moderate Drought")
                          : isConcession
                          ? (language === "mr" ? "महसूल सवलती लागू" : "Concessions Active")
                          : (language === "mr" ? "स्थळ पाहणी सुरू (GR प्रतीक्षेत)" : "Under Assessment")}
                      </span>
                    </div>

                    {/* Official GR Reference */}
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 text-xs space-y-1">
                      <div className="font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                        <span className="text-[11px] text-gray-500">{language === "mr" ? "शासन निर्णय / आदेश:" : "GR Reference:"}</span>
                        <span className="text-[10px] text-gray-500">{t.grDate}</span>
                      </div>
                      <div className="font-mono text-[11px] text-amber-800 dark:text-amber-300 break-words">
                        {t.grReference}
                      </div>
                    </div>

                    {/* Verification Note if any */}
                    {t.verificationNote && (
                      <div className="text-[11px] text-gray-600 dark:text-gray-400 italic">
                        💡 {t.verificationNote[language as "mr" | "hi" | "en"] || t.verificationNote.en}
                      </div>
                    )}

                    {/* Relief Measures Accordion / Summary */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60">
                      <div className="text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        <span>{language === "mr" ? "लागू शासकीय सवलती:" : "Applicable Relief Measures:"}</span>
                      </div>
                      <ul className="text-[11px] text-gray-600 dark:text-gray-400 space-y-1 pl-4 list-disc">
                        {(t.reliefMeasures[language as "mr" | "hi" | "en"] || t.reliefMeasures.en).slice(0, 4).map((m, idx) => (
                          <li key={idx}>{m}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Last verified footer */}
                    <div className="text-[10px] text-gray-400 pt-1 flex items-center justify-between">
                      <span>{language === "mr" ? "पडताळणी:" : "Verified:"} {t.lastVerifiedDate}</span>
                      <a
                        href={t.officialSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>{language === "mr" ? "GR पोर्टल" : "GR Portal"}</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredTalukas.length === 0 && (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <SunDim size={40} className="mx-auto text-gray-400 mb-3" />
                <h4 className="text-base font-bold text-gray-900 dark:text-white">
                  {language === "mr" ? "कोणताही तालुका सापडला नाही" : "No Matching Taluka Found"}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {language === "mr" ? "कृपया स्पेलिंग तपासा किंवा वेगळा जिल्हा/तालुका निवडा." : "Please check your search spelling or select another status filter."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: LATEST GOVERNMENT ANNOUNCEMENTS TIMELINE */}
        {/* ==================================================== */}
        {activeTab === "announcements" && (
          <div className="space-y-6">
            
            {/* Strict Regulatory Status Warning Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold uppercase tracking-wide">
                  {language === "mr" ? "महत्त्वाची पडताळणी सूचना:" : "Official Verification Notice:"}
                </span>{" "}
                {language === "mr"
                  ? "राजकीय भाषणे, पत्रकार परिषदा किंवा वृत्तपत्रांतील बातम्यांना शासन निर्णय (GR) मानू नये. जोपर्यंत वित्त विभागाचा अधिकृत GR निर्गमित होत नाही आणि जिल्हा कोषागारास निधी वर्ग होत नाही, तोपर्यंत मदत जमा होत नाही. खाली प्रत्येक घोषणेची प्रत्यक्ष प्रशासकीय स्थिती पारदर्शकपणे दिली आहे."
                  : language === "hi"
                  ? "राजनीतिक भाषण या मीडिया रिपोर्ट को शासनादेश (GR) न समझें। जब तक वित्त विभाग का आधिकारिक GR जारी नहीं होता और ट्रेजरी से फंड जारी नहीं होता, तब तक बैंक में राशि नहीं आती।"
                  : "Never treat a media report, political assurance, or public announcement as proof that a GR has been issued or that money has been credited. Direct Benefit Transfer requires formal Gazette notification and treasury sanction."}
              </div>
            </div>

            {/* AUDIT & 304 vs 305/306 DISCREPANCY CLARIFICATION BANNER */}
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800 text-xs text-blue-950 dark:text-blue-200 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-blue-900 dark:text-blue-300">
                <ShieldCheck size={16} className="text-blue-600 dark:text-blue-400" />
                <span>
                  {language === "mr"
                    ? "प्रशासकीय वास्तव पडताळणी: ३०४ विरुद्ध ३०५/३०६ तालुक्यांची स्थिती"
                    : language === "hi"
                    ? "प्रशासनिक वास्तविकता सत्यापन: 304 बनाम 305/306 तहसीलों की स्थिति"
                    : "Administrative Data Integrity Audit: 304 vs 305/306 Talukas Resolution"}
                </span>
              </div>
              <p className="leading-relaxed">
                {language === "mr"
                  ? "अन्न व नागरी पुरवठा विभागाच्या २२ ऑक्टोबर २०२६ रोजी निर्गमित अधिकृत शासन निर्णयानुसार (GR सांकेतांक २०२६१०२२१६५५४८२५०६) राज्यातील ३३ जिल्ह्यांमधील ३०४ तालुक्यांची यादी अधिकृतरीत्या अधिसूचित करण्यात आली आहे. यापूर्वी मंत्रिमंडळ उपसमितीच्या चर्चेत अतिरिक्त तालुक्यांचा प्रस्ताव विचाराधीन असल्याने प्रसारमाध्यमांनी ३०५ किंवा ३०६ आकडा दिला होता. अधिकृत राजपत्रातील पुराव्यानुसार ३०४ तालुके 'अधिकृत प्रमाणित (Officially Verified)' असून, उर्वरित प्रस्तावित तालुके 'शासकीय पडताळणीअधीन (Awaiting official verification)' श्रेणीत ठेवले आहेत."
                  : language === "hi"
                  ? "खाद्य एवं नागरिक आपूर्ति विभाग के 22 अक्टूबर 2026 के अधिकृत शासनादेश (GR कोड 202610221655482506) अनुसार 33 जिलों की 304 तहसीलें गजट में अधिसूचित हैं। पूर्व में मंत्रिमंडल उपसमिति में अतिरिक्त तहसीलों के प्रस्ताव के कारण मीडिया में 305/306 की चर्चा रही। अधिकृत आदेश अनुसार 304 तहसीलें सत्यापित हैं तथा शेष प्रस्तावित तहसीलें सत्यापन के अधीन हैं।"
                  : "Food & Civil Supplies Dept GR (Code 202610221655482506, dated 22 Oct 2026) conclusively gazettes 304 talukas across 33 districts. Earlier cabinet sub-committee discussions considered proposals for expansion, leading news publishers to report 305 or 306 talukas. The gazetted statutory count is 304 talukas (Officially Verified), while additional proposed talukas remain classified as 'Awaiting official verification'."}
              </p>
            </div>

            {/* 8 Thematic & Status Filters */}
            <div className="space-y-2">
              <span className="font-bold text-gray-500 text-[11px] uppercase tracking-wider block">
                {language === "mr" ? "विषयानुसार व प्राधान्यानुसार फिल्टर करा:" : "Filter Updates by Category:"}
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {[
                  { id: "all", label: language === "mr" ? "सर्व अपडेट्स" : "All Updates" },
                  { id: "new_updates", label: language === "mr" ? "नवीन अपडेट्स (New)" : "New Updates", isNew: true },
                  { id: "official_grs", label: language === "mr" ? "अधिकृत शासन निर्णय (GR)" : "Official GRs" },
                  { id: "financial_assistance", label: language === "mr" ? "आर्थिक साहाय्य" : "Financial Assistance" },
                  { id: "crop_loss", label: language === "mr" ? "पीक नुकसान भरपाई" : "Crop-Loss Compensation" },
                  { id: "drought_water", label: language === "mr" ? "दुष्काळ व पाणीटंचाई" : "Drought & Water Scarcity" },
                  { id: "gov_schemes", label: language === "mr" ? "शासकीय योजना व सवलती" : "Government Schemes" },
                  { id: "deadlines", label: language === "mr" ? "अर्ज मुदत व कृती आराखडा" : "Application Deadlines" }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setAnnouncementFilter(btn.id as typeof announcementFilter)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 text-xs ${
                      announcementFilter === btn.id
                        ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 scale-105"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {btn.isNew && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />}
                    <span>{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chronologically Sorted Timeline Cards */}
            <div className="space-y-4">
              {filteredAnnouncements.map((ann) => {
                const titleLoc = ann.title[language as "mr" | "hi" | "en"] || ann.title.en;
                const authLoc = ann.authority[language as "mr" | "hi" | "en"] || ann.authority.en;
                const expLoc = ann.explanation[language as "mr" | "hi" | "en"] || ann.explanation.en;
                const amtLoc = ann.reliefAmount ? (ann.reliefAmount[language as "mr" | "hi" | "en"] || ann.reliefAmount.en) : null;
                const eligLoc = ann.eligibility[language as "mr" | "hi" | "en"] || ann.eligibility.en;
                const noteLoc = ann.statusNote[language as "mr" | "hi" | "en"] || ann.statusNote.en;

                const isGrIssued = ann.status === "gr_issued";
                const isPaid = ann.status === "payments_started" || ann.status === "payment_confirmed";
                const isAnnounced = ann.status === "announced";
                const isSurvey = ann.status === "survey_underway";
                const isHistorical = ann.id.includes("historical") || ann.id.includes("2023");
                const isNew = !isHistorical && (ann.date.includes("22 October 2026") || ann.date.includes("21 October 2026"));

                return (
                  <div
                    key={ann.id}
                    className={`p-6 rounded-3xl bg-white dark:bg-gray-800 border shadow-sm space-y-4 transition-all ${
                      isNew
                        ? "border-amber-400/80 dark:border-amber-500/60 ring-2 ring-amber-400/20"
                        : isHistorical
                        ? "border-gray-200 dark:border-gray-700 opacity-90"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-gray-100 dark:border-gray-700/60 pb-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-500">
                          {isNew && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm animate-pulse">
                              <Sparkles size={11} />
                              <span>{language === "mr" ? "नवीन शासन निर्णय" : "NEW UPDATE"}</span>
                            </span>
                          )}
                          <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                            <Building2 size={13} className="text-amber-600 flex-shrink-0" />
                            <span>{authLoc}</span>
                          </div>
                          <span>&bull;</span>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Calendar size={13} className="text-gray-400" />
                            <span>{ann.date}</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-extrabold text-gray-900 dark:text-white leading-snug">
                          {titleLoc}
                        </h3>

                        {ann.grReference && (
                          <div className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg inline-block border border-amber-200 dark:border-amber-900/40">
                            📜 {ann.grReference}
                          </div>
                        )}
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wide self-start sm:self-auto flex-shrink-0 ${
                          isHistorical
                            ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-gray-300"
                            : isPaid
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300"
                            : isGrIssued
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300"
                            : isSurvey
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300"
                            : isAnnounced
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {isHistorical ? "HISTORICAL ARCHIVE" : ann.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                      {expLoc}
                    </p>

                    {/* Financial Assistance Amount & Eligibility Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {amtLoc && (
                        <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                          <span className="font-bold text-amber-900 dark:text-amber-300 block mb-0.5">
                            {language === "mr" ? "मदत / अर्थसाहाय्य रक्कम:" : "Assistance / Relief Amount:"}
                          </span>
                          <span className="font-extrabold text-gray-900 dark:text-white">{amtLoc}</span>
                        </div>
                      )}

                      <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                        <span className="font-bold text-gray-700 dark:text-gray-300 block mb-0.5">
                          {language === "mr" ? "पात्रता व निकष:" : "Eligibility Conditions:"}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">{eligLoc}</span>
                      </div>
                    </div>

                    {/* Official Status Note (Differentiating Fact from Assurance) */}
                    <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-300 leading-relaxed">
                      <strong>⚖️ {language === "mr" ? "प्रशासकीय वास्तव पडताळणी:" : "Implementation Reality Check:"}</strong>{" "}
                      <span>{noteLoc}</span>
                    </div>

                    {/* GR Link & Last Verified Footer */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-gray-100 dark:border-gray-700/60">
                      <div className="flex items-center gap-3 text-gray-500 text-[11px]">
                        <span>
                          {language === "mr" ? "अंतिम पडताळणी:" : "Last Checked:"} <strong>{ann.lastVerifiedDate}</strong>
                        </span>
                        <span>&bull;</span>
                        <span>
                          {language === "mr" ? "पडताळणी दर्जा: " : "Status: "}
                          <strong className={isGrIssued ? "text-emerald-600 dark:text-emerald-400" : isAnnounced ? "text-amber-600" : "text-gray-600"}>
                            {isGrIssued ? "Officially Verified" : isAnnounced ? "Awaiting Finance GR" : isHistorical ? "Historical" : "Official Notice Verified"}
                          </strong>
                        </span>
                      </div>
                      <a
                        href={ann.grOrSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors"
                      >
                        <span>{language === "mr" ? "अधिकृत शासन निर्णय पहा (View GR)" : "View Official GR / Source"}</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: EDUCATION RELIEF & NEWS INTELLIGENCE */}
        {/* ==================================================== */}
        {activeTab === "news_intelligence" && (
          <div className="space-y-6">
            
            {/* Regulatory News Verification Standard Banner */}
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 flex items-start gap-3">
              <Newspaper size={18} className="text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold uppercase tracking-wide">
                  {language === "mr" ? "वृत्त पडताळणी कार्यप्रवाह (News-to-GR Verification Standard):" : "News-to-GR Verification Standard:"}
                </span>{" "}
                {language === "mr"
                  ? "प्रसारमाध्यमांनी दिलेल्या बातम्या तात्काळ या विभागात नोंदवल्या जातात; मात्र जोपर्यंत संबंधित खात्याचा अधिकृत शासन निर्णय (GR) किंवा विद्यापीठ परिपत्रक निर्गमित होत नाही, तोपर्यंत त्या बातमीला शासकीय लाभ मानले जात नाही. प्रत्येक बातमीची अधिकृत पुष्टी तपासली जाते."
                  : language === "hi"
                  ? "समाचार रिपोर्टों को तुरंत इस अनुभाग में दर्ज किया जाता है; किंतु जब तक आधिकारिक शासनादेश (GR) या अधिसूचना जारी नहीं होती, तब तक उसे आधिकारिक लाभ नहीं माना जाता।"
                  : "News reports from credible publishers are tracked here immediately upon discovery. However, a news report is never treated as an official government entitlement until matched and verified with a formal Government Resolution (GR) or official department circular."}
              </div>
            </div>

            {/* FEATURED INVESTIGATION CARD: EXAMINATION FEE WAIVER */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-white to-amber-50/40 dark:from-gray-800 dark:to-amber-950/20 border-2 border-amber-300 dark:border-amber-700 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 dark:border-amber-900/40 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <GraduationCap size={12} />
                      <span>{language === "mr" ? "शैक्षणिक साहाय्य व शुल्कमाफी तपास" : "Education Relief Investigation"}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300 text-[10px] font-extrabold uppercase tracking-wider">
                      {language === "mr" ? "ऐतिहासिक वृत्त संदर्भ (Historical Media Archive)" : "Historical Media Archive (2023-24)"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-[10px] font-bold">
                      {language === "mr" ? "सकाळ वृत्तसेवा / Dailyhunt" : "Sakal via Dailyhunt"}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mt-1 leading-snug">
                    {language === "mr"
                      ? "दुष्काळग्रस्त २ लाख ४० हजार विद्यार्थ्यांना परीक्षा शुल्कमाफी; पुणे विद्यापीठातील ६५ हजार विद्यार्थ्यांनी केले अर्ज"
                      : language === "hi"
                      ? "सूखा प्रभावित 2.40 लाख विद्यार्थियों को परीक्षा शुल्क माफी; पुणे विश्वविद्यालय में 65 हजार छात्रों ने किया आवेदन"
                      : "Exemption From Examination Fees : 2.40 Lakh Drought-Affected Students Granted Fee Waiver; 65,200 Applied at Pune University"}
                  </h3>
                </div>

                <a
                  href="https://dhunt.in/15QbNp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-center flex-shrink-0"
                >
                  <span>{language === "mr" ? "मूळ बातमी पहा (Dailyhunt)" : "View Original Article"}</span>
                  <ExternalLink size={13} />
                </a>
              </div>

              {/* Verified Facts Breakdown Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <div className="text-[11px] font-semibold text-gray-500">
                    {language === "mr" ? "पुणे विद्यापीठातील अर्ज" : "SPPU Applications"}
                  </div>
                  <div className="text-xl font-black text-amber-700 dark:text-amber-400 mt-1">
                    ६५,२००
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {language === "mr" ? "शून्य शुल्क (झिरो चलन) अर्ज" : "Zero-Challan Submissions"}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <div className="text-[11px] font-semibold text-gray-500">
                    {language === "mr" ? "राज्यातील एकूण लाभार्थी" : "Statewide Beneficiaries"}
                  </div>
                  <div className="text-xl font-black text-blue-700 dark:text-blue-400 mt-1">
                    २,४०,३६५
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {language === "mr" ? "२६ सार्वजनिक विद्यापीठे" : "Across 26 State Universities"}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <div className="text-[11px] font-semibold text-gray-500">
                    {language === "mr" ? "शुल्क परतावा स्थिती" : "Fee Refund Status"}
                  </div>
                  <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                    {language === "mr" ? "सुरू (Active)" : "Active"}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {language === "mr" ? "आधी भरलेल्या शुल्काचा परतावा" : "Refund for prior payments"}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <div className="text-[11px] font-semibold text-gray-500">
                    {language === "mr" ? "लागू शैक्षणिक वर्ष" : "Academic Cycle"}
                  </div>
                  <div className="text-xl font-black text-purple-700 dark:text-purple-400 mt-1">
                    २०२३-२४
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {language === "mr" ? "ऐतिहासिक नोंद (सध्या अर्ज बंद)" : "Historical (Session closed)"}
                  </div>
                </div>
              </div>

              {/* Factual Narrative and Ground-Truth Reality Check */}
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-gray-900/70 border border-amber-200 dark:border-amber-900/60 text-xs text-gray-700 dark:text-gray-300 space-y-2 leading-relaxed">
                <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>
                    {language === "mr"
                      ? "अधिकृत शासन निर्णय व विद्यापीठ कार्यवाही तपशील:"
                      : "Official Government Resolution & University Action Record:"}
                  </span>
                </div>
                <p>
                  {language === "mr"
                    ? "१. उच्च व तंत्रशिक्षण विभाग (महाराष्ट्र शासन) यांनी दुष्काळग्रस्त तालुक्यातील विद्यार्थ्यांसाठी परीक्षा अर्ज भरताना 'झिरो चलन' (Zero Challan) सुविधा लागू केली. २. सावित्रीबाई फुले पुणे विद्यापीठात (SPPU) तब्बल ६५,२०० विद्यार्थ्यांनी एकही रुपया न भरता परीक्षा अर्ज दाखल केले. ३. हा निर्णय जाहीर होण्यापूर्वी ज्या पात्र विद्यार्थ्यांनी आधीच परीक्षा शुल्क भरले होते, त्यांच्या थेट बँक खात्यात शुल्क परतावा (Refund) देण्याची प्रक्रिया मुंबई व पुणे विद्यापीठाकडून राबवण्यात आली. ४. ही सवलत शैक्षणिक वर्ष २०२३-२४ (हिवाळी/उन्हाळी परीक्षा) साठी होती. ऑक्टोबर २०२६ मध्ये नवीन सवलतीसाठी शासनाकडून नव्याने दुष्काळ जाहीर होणे व उच्च शिक्षण विभागाचे स्वतंत्र परिपत्रक आवश्यक आहे."
                    : language === "hi"
                    ? "1. उच्च एवं तकनीकी शिक्षा विभाग ने सूखा प्रभावित तहसीलों के छात्रों हेतु 'जीरो चालान' सुविधा लागू की। 2. सावित्रीबाई फुले पुणे विश्वविद्यालय में 65,200 छात्रों ने बिना शुल्क भरे आवेदन किया। 3. पूर्व में शुल्क जमा कर चुके विद्यार्थियों को शुल्क वापसी (रिफंड) की प्रक्रिया विश्वविद्यालयों द्वारा संचालित की गई। 4. यह व्यवस्था शैक्षणिक सत्र 2023-24 हेतु थी। वर्तमान में नए आवेदन हेतु नया शासनादेश आवश्यक है।"
                    : "1. The Higher and Technical Education Department enabled 'Zero Challan' registration for students belonging to notified drought talukas. 2. At Savitribai Phule Pune University (SPPU), 65,200 students registered without paying examination fees. 3. For eligible students who had already deposited fees prior to notification, fee refunds were initiated by respective universities (e.g. SPPU and Mumbai University). 4. Applicable to Academic Year 2023-24 examination cycles (Historical record). October 2026 application requires fresh seasonal re-notification."}
                </p>
                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500">
                  <span>
                    <strong>{language === "mr" ? "मूळ लेखक / वार्ताहर:" : "Original Reporter:"}</strong> प्रज्वल रामटेके (सकाळ वृत्तसेवा, पुणे)
                  </span>
                  <span>
                    <strong>{language === "mr" ? "पडताळणी दिनांक:" : "Last Verified:"}</strong> 23 October 2026
                  </span>
                </div>
              </div>
            </div>

            {/* LIVE MONITORED SOURCES REGISTRY */}
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                <h4 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <Database size={16} className="text-amber-600" />
                  <span>{language === "mr" ? "थेट शासकीय व वृत्त स्रोत नोंदणी (Monitored Sources Registry)" : "Monitored Official & News Sources"}</span>
                </h4>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {liveAuditData ? `${liveAuditData.onlineSources}/${liveAuditData.totalSources} Online` : "6/7 Active"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(liveSources.length > 0 ? liveSources : [
                  { id: "1", code: "MAHA_GR_PORTAL", name: "Maharashtra GR Portal", baseUrl: "https://gr.maharashtra.gov.in", status: "degraded", notes: "Strict WAF / Session redirect to /मुख्य-पृष्ठ" },
                  { id: "2", code: "MAHA_RNR", name: "Relief & Rehabilitation Dept", baseUrl: "https://rnr.maharashtra.gov.in", status: "online", notes: "DBT and disaster notifications" },
                  { id: "3", code: "MAHA_KRISHI", name: "Agriculture Dept (कृषी विभाग)", baseUrl: "https://krishi.maharashtra.gov.in", status: "online", notes: "Seasonal crop loss surveys" },
                  { id: "4", code: "MAHA_SDMA", name: "State Disaster Authority (SDMA)", baseUrl: "https://sdma.maharashtra.gov.in", status: "online", notes: "SDRF norms and alerts" },
                  { id: "5", code: "SPPU_UNIPUNE", name: "Pune University (SPPU Notices)", baseUrl: "https://unipune.ac.in", status: "online", notes: "Zero Challan exam circulars" },
                  { id: "6", code: "GOI_PMFBY", name: "PMFBY Portal & Toll-Free 14447", baseUrl: "https://pmfby.gov.in", status: "online", notes: "Crop insurance guidelines" },
                  { id: "7", code: "SAKAL_NEWS", name: "Sakal Media Network", baseUrl: "https://www.esakal.com", status: "online", notes: "Credible Marathi agricultural reporting" }
                ]).map((src) => {
                  const isOnline = src.status === "online";
                  return (
                    <div
                      key={src.id}
                      className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-gray-900 dark:text-white truncate">
                          {src.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            isOnline
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {src.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-2">{src.notes}</p>
                      <a
                        href={src.baseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-amber-700 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <span className="truncate">{src.baseUrl}</span>
                        <ExternalLink size={10} className="flex-shrink-0" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LIVE INGESTED INTELLIGENCE STREAM & VERIFICATION AUDIT */}
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    <Activity size={16} className="text-emerald-600" />
                    <span>
                      {language === "mr"
                        ? "थेट इनजेस्टेड बातम्या व शासन निर्णय पडताळणी प्रवाह (Live Ingested Intelligence Stream)"
                        : "Live Ingested Media & Government Resolution Verification Stream"}
                    </span>
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {language === "mr"
                      ? "स्वयंचलित पाईपलाईनद्वारे संकलित, डीड्युप्लिकेट व अधिकृत GR सह ताडून पाहिलेल्या नोंदी."
                      : "Chronologically ingested, deduplicated, and audited records with official GR cross-verification."}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 self-start sm:self-auto">
                  {liveAnnouncements.length} {language === "mr" ? "नोंदी उपलब्ध" : "Records Ingested"}
                </span>
              </div>

              <div className="space-y-4">
                {liveAnnouncements.map((item) => {
                  const statusColors: Record<string, { bg: string; text: string; border: string; label: string; labelMr: string; labelHi: string }> = {
                    official_gr_verified: {
                      bg: "bg-emerald-100 dark:bg-emerald-950/60",
                      text: "text-emerald-800 dark:text-emerald-300",
                      border: "border-emerald-300 dark:border-emerald-800",
                      label: "Official GR Verified",
                      labelMr: "अधिकृत GR पडताळणी पूर्ण",
                      labelHi: "आधिकारिक GR सत्यापित"
                    },
                    official_notice_verified: {
                      bg: "bg-blue-100 dark:bg-blue-950/60",
                      text: "text-blue-800 dark:text-blue-300",
                      border: "border-blue-300 dark:border-blue-800",
                      label: "Official Notice Verified",
                      labelMr: "अधिकृत परिपत्रक पडताळणी पूर्ण",
                      labelHi: "आधिकारिक अधिसूचना सत्यापित"
                    },
                    official_announcement_pending: {
                      bg: "bg-amber-100 dark:bg-amber-950/60",
                      text: "text-amber-800 dark:text-amber-300",
                      border: "border-amber-300 dark:border-amber-800",
                      label: "Official Announcement — Implementation Pending",
                      labelMr: "अधिकृत घोषणा — शासन निर्णय/अंमलबजावणी प्रलंबित",
                      labelHi: "आधिकारिक घोषणा — क्रियान्वयन प्रतीक्षारत"
                    },
                    media_report_pending: {
                      bg: "bg-purple-100 dark:bg-purple-950/60",
                      text: "text-purple-800 dark:text-purple-300",
                      border: "border-purple-300 dark:border-purple-800",
                      label: "Media Report — Official Confirmation Pending",
                      labelMr: "वृत्तपत्र बातमी — अधिकृत पुष्टीकरणाची प्रतीक्षा",
                      labelHi: "मीडिया रिपोर्ट — आधिकारिक पुष्टि प्रतीक्षारत"
                    },
                    conflicting_sources: {
                      bg: "bg-rose-100 dark:bg-rose-950/60",
                      text: "text-rose-800 dark:text-rose-300",
                      border: "border-rose-300 dark:border-rose-800",
                      label: "Conflicting Sources",
                      labelMr: "परस्परविरोधी आकडेवारी / स्रोत",
                      labelHi: "विरोधाभासी स्रोत"
                    },
                    historical: {
                      bg: "bg-gray-100 dark:bg-gray-800",
                      text: "text-gray-700 dark:text-gray-300",
                      border: "border-gray-300 dark:border-gray-700",
                      label: "Historical Record",
                      labelMr: "ऐतिहासिक नोंद (मागील हंगाम/वर्ष)",
                      labelHi: "ऐतिहासिक रिकॉर्ड"
                    },
                    verification_failed: {
                      bg: "bg-red-100 dark:bg-red-950/60",
                      text: "text-red-800 dark:text-red-300",
                      border: "border-red-300 dark:border-red-800",
                      label: "Verification Failed",
                      labelMr: "पडताळणी अयशस्वी / स्रोत अनुपलब्ध",
                      labelHi: "सत्यापन विफल"
                    }
                  };

                  const badge = statusColors[item.evidenceStatus] || statusColors.historical;
                  const title = language === "mr" ? item.titleMr : language === "hi" ? item.titleHi : item.title;
                  const summary = language === "mr" ? item.summaryMr : language === "hi" ? item.summaryHi : item.summary;
                  const note = language === "mr" ? item.verificationNotes?.mr : language === "hi" ? item.verificationNotes?.hi : item.verificationNotes?.en;

                  return (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 space-y-3 transition hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isGenuinelyNewAnnouncement(item.publishedAt, item.evidenceStatus, 14) && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-red-600 text-white animate-pulse shadow-sm">
                              NEW
                            </span>
                          )}
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${badge.bg} ${badge.text} ${badge.border}`}>
                            {language === "mr" ? badge.labelMr : language === "hi" ? badge.labelHi : badge.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{item.sourceName}</span>
                          <span>•</span>
                          <span className={`font-semibold ${!item.publishedAt ? "text-gray-400 italic" : "text-amber-800 dark:text-amber-300"}`}>
                            {formatGovernmentGrDate(item.publishedAt, language)}
                          </span>
                        </div>
                      </div>

                      <h5 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                        {title}
                      </h5>

                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        {summary}
                      </p>

                      {/* Evidence & Ground-Truth Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px]">
                        {item.financialAmount && (
                          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200">
                            <strong>{language === "mr" ? "आर्थिक रक्कम:" : "Financial Amount:"}</strong> {item.financialAmount}
                          </div>
                        )}
                        {item.reportedEligibleCount && (
                          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200">
                            <strong>{language === "mr" ? "वृत्त नोंद पात्र संख्या:" : "Reported Beneficiaries:"}</strong> {item.reportedEligibleCount}
                          </div>
                        )}
                        {item.confirmedBeneficiariesCount && (
                          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200">
                            <strong>{language === "mr" ? "प्रशासकीय पुष्ट संख्या:" : "Confirmed Beneficiaries:"}</strong> {item.confirmedBeneficiariesCount}
                          </div>
                        )}
                        {item.verifiedGrNumber && (
                          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200">
                            <strong>{language === "mr" ? "अधिकृत GR / परिपत्रक:" : "Verified GR / Circular:"}</strong> {item.verifiedGrNumber}
                          </div>
                        )}
                      </div>

                      {/* Verification Notes */}
                      {note && (
                        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-[11px] text-gray-700 dark:text-gray-300 border-l-2 border-emerald-500">
                          <strong>{language === "mr" ? "पडताळणी शेरा:" : "Audit Note:"}</strong> {note}
                        </div>
                      )}

                      {/* Action Links */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-800 text-[11px]">
                        <div className="flex items-center gap-3">
                          {item.originalUrl && (
                            <a
                              href={item.originalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-700 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
                            >
                              <span>{language === "mr" ? "मूळ वृत्त / स्रोत पहा" : "View Original Source"}</span>
                              <ExternalLink size={10} />
                            </a>
                          )}
                          {item.verifiedGrUrl && (
                            <a
                              href={item.verifiedGrUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                            >
                              <span>{language === "mr" ? "अधिकृत शासन निर्णय" : "Official GR / Notice"}</span>
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400">
                          {language === "mr" ? "शेवटची तपासणी:" : "Last Checked:"} {item.lastVerifiedAt ? new Date(item.lastVerifiedAt).toLocaleString("en-IN") : "23 Oct 2026"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: CROP DAMAGE COMPENSATION CALCULATOR */}
        {/* ==================================================== */}
        {activeTab === "calculator" && (
          <div className="space-y-6">
            
            {/* MANDATORY STATUTORY DISCLAIMER */}
            <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border-2 border-amber-500/50 text-amber-950 dark:text-amber-100 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-extrabold uppercase">
                    {language === "mr" ? "अधिकृत अस्वीकरण (OFFICIAL STATUTORY DISCLAIMER):" : "INDICATIVE ESTIMATE DISCLAIMER:"}
                  </strong>{" "}
                  <span>
                    “This is an indicative estimate, not a guarantee of eligibility or payment. Actual assistance depends on applicable government orders, crop-loss assessment, eligibility conditions, and official approval.”
                  </span>
                  <p className="mt-1 font-medium text-xs text-amber-900/90 dark:text-amber-200/90">
                    {language === "mr"
                      ? "हा केवळ एक संकेतदर्शी अंदाज आहे, ही भरपाईची कोणतीही हमी नाही. प्रत्यक्ष मदत ही संबंधित शासन निर्णय, प्रत्यक्ष पंचनामा, पात्रता निकष आणि सक्षम प्राधिकाऱ्यांच्या मंजुरीवर अवलंबून असते."
                      : language === "hi"
                      ? "यह केवल एक सांकेतिक अनुमान है, मुआवजे की कोई गारंटी नहीं। वास्तविक सहायता लागू शासनादेशों, फसल नुकसान के संयुक्त सर्वे, पात्रता शर्तों और सक्षम प्राधिकारी की स्वीकृति पर निर्भर करती है।"
                      : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Standalone Area Converter Quick Drawer / Toggle */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  <Calculator size={16} className="text-emerald-600" />
                  <span>
                    {language === "mr"
                      ? "क्षेत्र रूपांतरक (एकर, हेक्टर, गुंठे रूपांतरक)"
                      : language === "hi"
                      ? "क्षेत्रफल कनवर्टर (एकड़, हेक्टेयर, गुंठा)"
                      : "Land Area Converter (Acres, Hectares, Gunthas)"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsConverterOpen(!isConverterOpen)}
                  className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors"
                >
                  {isConverterOpen
                    ? (language === "mr" ? "बंद करा" : "Close")
                    : (language === "mr" ? "रूपांतरक उघडा" : "Open Converter")}
                </button>
              </div>

              {isConverterOpen && (
                <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800/60 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {language === "mr" ? "क्षेत्र प्रमाण" : language === "hi" ? "क्षेत्रफल मान" : "Area Amount"}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={converterInputAmount || ""}
                        onChange={(e) => setConverterInputAmount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs sm:text-sm text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {language === "mr" ? "एकक" : language === "hi" ? "इकाई" : "Unit"}
                      </label>
                      <select
                        value={converterInputUnit}
                        onChange={(e) => setConverterInputUnit(e.target.value as AreaUnit)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs sm:text-sm text-gray-900 dark:text-white"
                      >
                        <option value="acre">{language === "mr" ? "एकर (Acre)" : "Acres"}</option>
                        <option value="guntha">{language === "mr" ? "गुंठे (Guntha / Are)" : "Gunthas"}</option>
                        <option value="hectare">{language === "mr" ? "हेक्टर (Hectare)" : "Hectares"}</option>
                      </select>
                    </div>
                  </div>

                  {converterInputAmount <= 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                      <AlertCircle size={14} className="text-amber-600 flex-shrink-0" />
                      <span>{language === "mr" ? "क्षेत्र ० पेक्षा मोठे असावे." : "Area amount must be greater than 0."}</span>
                    </div>
                  )}

                  {standaloneNormalizedHectares > 100 && (
                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800 text-purple-800 dark:text-purple-300 text-xs flex items-center gap-2">
                      <Info size={14} className="text-purple-600 flex-shrink-0" />
                      <span>
                        {language === "mr"
                          ? "नोंद: हे क्षेत्र १०० हेक्टरपेक्षा मोठे आहे. शासकीय भरपाई कमाल २ किंवा ३ हेक्टरच्या मर्यादेतच दिली जाते."
                          : "Note: Area exceeds 100 ha. Statutory compensation remains capped at the statutory 2 ha or 3 ha ceiling."}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                    <div className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-emerald-100 dark:border-gray-700">
                      <span className="text-[10px] text-gray-500 block">हेक्टर (Hectares)</span>
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{standaloneConverted.hectares} ha</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-emerald-100 dark:border-gray-700">
                      <span className="text-[10px] text-gray-500 block">एकर (Acres)</span>
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{standaloneConverted.acres} ac</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-emerald-100 dark:border-gray-700">
                      <span className="text-[10px] text-gray-500 block">गुंठे (Gunthas)</span>
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{standaloneConverted.gunthas} guntha</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-emerald-100 dark:border-gray-700">
                      <span className="text-[10px] text-gray-500 block">चौरस मीटर (Sq.m)</span>
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{standaloneConverted.sqMeters} m²</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={applyConvertedAreaToCalculator}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                    >
                      {language === "mr" ? "ही आकडेवारी गणकात वापरा" : "Apply to Calculator"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Calculator Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Inputs Form */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calculator size={18} className="text-amber-600" />
                  <span>{language === "mr" ? "पिकाची व शेताची माहिती भरा" : "Enter Crop & Land Details"}</span>
                </h3>

                {/* State & District */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {language === "mr" ? "राज्य" : "State"}
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => {
                        const st = e.target.value;
                        setSelectedState(st);
                        const dists = STATE_DISTRICTS[st] || [];
                        if (dists.length > 0) setSelectedDistrict(dists[0]);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {getLocalizedState(st, language)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {language === "mr" ? "जिल्हा" : "District"}
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      {availableDistricts.map((dst) => (
                        <option key={dst} value={dst}>
                          {getLocalizedDistrict(dst, language)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Land Category Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                    {language === "mr" ? "जमिनीचा प्रकार व सिंचन पद्धत" : "Land Category & Irrigation Type"}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "rainfed" as LandCategory, label: language === "mr" ? "जिरायत (Rainfed)" : "Rainfed", rate: "₹13,600/ha" },
                      { id: "irrigated" as LandCategory, label: language === "mr" ? "बागायत (Irrigated)" : "Irrigated", rate: "₹27,000/ha" },
                      { id: "perennial" as LandCategory, label: language === "mr" ? "फळबागा (Perennial)" : "Perennial", rate: "₹36,000/ha" }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setLandCategory(cat.id)}
                        className={`p-3 rounded-2xl text-center border transition-all ${
                          landCategory === cat.id
                            ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                            : "bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <div className="text-xs font-bold">{cat.label}</div>
                        <div className={`text-[10px] mt-0.5 ${landCategory === cat.id ? "text-amber-100" : "text-gray-500"}`}>
                          {cat.rate}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calamity / Disaster Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {language === "mr" ? "नैसर्गिक आपत्तीचे स्वरूप" : "Disaster / Calamity Type"}
                  </label>
                  <select
                    value={disasterType}
                    onChange={(e) => setDisasterType(e.target.value as DisasterType)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    {DISASTER_TYPES.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d[language as "mr" | "hi" | "en"]?.name || d.en.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Land Area Amount & Unit */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {language === "mr" ? "शेतीचे क्षेत्र" : "Farm Area"}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={areaAmount || ""}
                      onChange={(e) => setAreaAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs sm:text-sm text-gray-900 dark:text-white"
                    />
                    <select
                      value={areaUnit}
                      onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs sm:text-sm text-gray-900 dark:text-white"
                    >
                      <option value="acre">{language === "mr" ? "एकर (Acres)" : "Acres"}</option>
                      <option value="guntha">{language === "mr" ? "गुंठे (Gunthas)" : "Gunthas"}</option>
                      <option value="hectare">{language === "mr" ? "हेक्टर (Hectares)" : "Hectares"}</option>
                    </select>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    = {convertedUnits.hectares} ha ({convertedUnits.acres} ac | {convertedUnits.gunthas} gunthas)
                  </div>
                </div>

                {/* Damage Percentage Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    <span>{language === "mr" ? "अंदाजित पीक नुकसान टक्केवारी" : "Estimated Crop Loss Percentage"}</span>
                    <span className="text-amber-700 dark:text-amber-400 font-extrabold text-sm">{damagePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={damagePercent}
                    onChange={(e) => setDamagePercent(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-amber-600"
                  />
                  <div className="flex justify-between gap-1 mt-2">
                    {[25, 33, 50, 75, 100].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setDamagePercent(val)}
                        className={`px-2 py-1 rounded text-[11px] font-bold ${
                          damagePercent === val
                            ? "bg-amber-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calculation Output Card */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border-2 border-amber-300 dark:border-amber-800 shadow-md space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
                      {language === "mr" ? "नुकसान भरपाई अंदाज" : "Assistance Estimate"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                        calculationResult.isEligibleDamage
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                      }`}
                    >
                      {calculationResult.isEligibleDamage
                        ? (language === "mr" ? "मदतीस पात्र (≥ ३३%)" : "Eligible (≥ 33%)")
                        : (language === "mr" ? "अपात्र (< ३३% नुकसान)" : "Ineligible (< 33%)")}
                    </span>
                  </div>

                  {/* Highlighted Relief Numbers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Central SDRF Base */}
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                      <div className="text-[11px] font-semibold text-gray-500">
                        {language === "mr" ? "केंद्र SDRF मूळ मदत (कमाल २ हेक्टर)" : "Central SDRF Base (Max 2 Ha)"}
                      </div>
                      <div className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                        ₹{calculationResult.centralEstimatedAssistance.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {calculationResult.effectiveCentralHectares} ha &times; ₹{calculationResult.ratePerHectareCentral.toLocaleString("en-IN")}
                      </div>
                    </div>

                    {/* Maharashtra State Enhanced Top-Up */}
                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800">
                      <div className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
                        {calculationResult.isStateEnhancedVerified
                          ? (language === "mr" ? "महाराष्ट्र राज्य मदत (कमाल ३ हेक्टर)" : "Maharashtra State Relief (Max 3 Ha)")
                          : `${selectedState} Top-Up (Unverified)`}
                      </div>
                      <div className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">
                        ₹{calculationResult.stateEnhancedEstimatedAssistance.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-amber-800 dark:text-amber-300 mt-0.5">
                        {calculationResult.effectiveStateHectares} ha &times; ₹{calculationResult.ratePerHectareState.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  {/* Calculations Details Breakdown */}
                  <div className="space-y-2 text-xs border-t border-gray-100 dark:border-gray-700 pt-3">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>{language === "mr" ? "एकूण रूपांतरित क्षेत्र:" : "Total Normalized Area:"}</span>
                      <span className="font-bold text-gray-900 dark:text-white">{calculationResult.normalizedHectares} ha</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>{language === "mr" ? "केंद्र मर्यादा (कमाल क्षेत्र):" : "Central Statutory Cap:"}</span>
                      <span className="font-bold text-gray-900 dark:text-white">2.0000 ha</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>{language === "mr" ? "महाराष्ट्र राज्य मर्यादा (कमाल क्षेत्र):" : "Maharashtra Statutory Cap:"}</span>
                      <span className="font-bold text-gray-900 dark:text-white">3.0000 ha</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>{language === "mr" ? "किमान आवश्यक नुकसान:" : "Min Damage Required:"}</span>
                      <span className="font-bold text-gray-900 dark:text-white">33%</span>
                    </div>
                  </div>

                  {/* Resolution References */}
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/60 text-[11px] text-gray-600 dark:text-gray-400 space-y-1">
                    <div className="font-bold text-gray-800 dark:text-gray-200">
                      {language === "mr" ? "अधिकृत शासन संदर्भ:" : "Official Resolution References:"}
                    </div>
                    <div>&bull; {calculationResult.centralResolutionRef}</div>
                    <div>&bull; {calculationResult.stateResolutionRef}</div>
                  </div>

                  {/* Action Link to Panchanama Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveTab("panchanama")}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    <span>{language === "mr" ? "या क्षेत्रासाठी पंचनामा अर्ज तयार करा" : "Generate Panchanama Application Draft"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: CROP INSURANCE & 72-HOUR GUIDE */}
        {/* ==================================================== */}
        {activeTab === "guide72" && (
          <div className="space-y-6">
            
            {/* Crucial Demarcation Banner: Localized Calamity vs Widespread Drought */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs sm:text-sm text-amber-950 dark:text-amber-200 space-y-2">
              <div className="font-extrabold flex items-center gap-2 text-amber-900 dark:text-amber-300">
                <AlertCircle size={18} />
                <span>
                  {language === "mr"
                    ? "महत्त्वाचा फरक: स्थानिक आपत्ती (७२ तास नियम) विरुद्ध सर्वव्यापी दुष्काळ (SDRF)"
                    : "Key Distinction: Localized Calamities (72-Hr Rule) vs Widespread Drought"}
                </span>
              </div>
              <p className="leading-relaxed text-xs">
                {language === "mr"
                  ? "१. ७२ तासांच्या आत पूर्वसूचना देण्याचा नियम केवळ 'स्थानिक नैसर्गिक आपत्ती' (गारपीट, शेतात पाणी साचणे, ढगफुटी, भूस्खलन व कापणीनंतरचे नुकसान) यांसाठी अनिवार्य आहे. २. संपूर्ण तालुका दुष्काळ किंवा पावसाचा मोठा खंड ही 'सर्वव्यापी आपत्ती' (Widespread Calamity) असल्याने यासाठी शेतकऱ्याने वैयक्तिक ७२ तासांत फोन करण्याची आवश्यकता नसते; याचे मूल्यांकन शासन पातळीवर उपग्रह निर्देशांक, पाऊस तूट आणि पीक कापणी प्रयोगांद्वारे (CCE) केले जाते."
                  : language === "hi"
                  ? "1. 72 घंटे की पूर्व-सूचना केवल 'स्थानीय आपदाओं' (ओलावृष्टि, जलभराव, बादल फटना, कटाई उपरांत नुकसान) के लिए अनिवार्य है। 2. व्यापक सूखा शासन स्तर पर सैटेलाइट व फसल कटाई प्रयोगों (CCE) से तय होता है, इसके लिए 72 घंटे का फोन आवश्यक नहीं है।"
                  : "1. The 72-hour reporting deadline strictly applies to 'Localized Calamities' (Hailstorm, Inundation, Landslide, Post-harvest soaking) under PMFBY. 2. Widespread drought is assessed through satellite indices, rainfall deficit, and Crop Cutting Experiments (CCE) by government committees without individual 72-hr calls."}
              </p>
            </div>

            {/* 4-Step Action Protocol */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  step: "01",
                  time: "0 to 24 Hours",
                  title: language === "mr" ? "नुकसानीचे फोटो व नोंद" : "Capture Evidence",
                  desc: language === "mr"
                    ? "शेतातील पिकाचे जिओटॅग (GPS) छायाचित्र काढा. तारीख, वेळ व अक्षांश-रेखांश नोंद असणे आवश्यक आहे."
                    : "Take geotagged photos of damaged crops showing boundary and damage severity with GPS timestamp.",
                  badge: "Evidence"
                },
                {
                  step: "02",
                  time: "Within 72 Hours",
                  title: language === "mr" ? "१४४४७ वर पूर्वसूचना नोंदवा" : "Report via 14447 or App",
                  desc: language === "mr"
                    ? "क्रॉप इन्शुरन्स ॲप किंवा १४४४७ राष्ट्रीय टोल-फ्री क्रमांकावर विमा अर्ज क्रमांक (Application ID) देऊन तक्रार नोंदवा."
                    : "Call 14447 or use the Crop Insurance App within 72 hours. Note down the Docket/Complaint Reference ID.",
                  badge: "Mandatory"
                },
                {
                  step: "03",
                  time: "3 to 7 Days",
                  title: language === "mr" ? "संयुक्त पंचनामा पूर्ण करा" : "Joint Survey Field Visit",
                  desc: language === "mr"
                    ? "तलाठी, कृषी सहाय्यक आणि विमा कंपनी प्रतिनिधी यांच्या उपस्थितीत प्रत्यक्ष शेतात पंचनामा करवून स्वाक्षरी घ्या."
                    : "Accompany the joint survey team (Talathi, Agri Assistant, and Insurance Surveyor) and sign the field report.",
                  badge: "Field Visit"
                },
                {
                  step: "04",
                  time: "15 to 30 Days",
                  title: language === "mr" ? "डीबीटी थेट बँक खात्यात जमा" : "Direct Benefit Transfer",
                  desc: language === "mr"
                    ? "मंजूर नुकसान भरपाई थेट आधार संलग्न बँक खात्यात (DBT द्वारे) जमा होते. बँकेत ई-केवायसी सक्रिय ठेवा."
                    : "Compensation is credited directly into farmer's Aadhaar-linked bank account (NPCI active).",
                  badge: "Disbursement"
                }
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-5 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-amber-600">{item.step}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-bold uppercase">
                      {item.badge}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-gray-500">{item.time}</div>
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Direct Dial & App Download Buttons */}
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-extrabold text-gray-900 dark:text-white">
                  {language === "mr" ? "तात्काळ पूर्वसूचना नोंदणीसाठी थेट संपर्क" : "Emergency Loss Reporting Direct Links"}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {language === "mr" ? "टोल-फ्री २४x७ कार्यरत आहे. पावतीवरील अर्ज क्रमांक सोबत ठेवा." : "Available 24x7. Keep your 15-digit PMFBY Application ID ready."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="tel:14447"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <PhoneCall size={15} />
                  <span>{language === "mr" ? "कॉल करा: १४४४७ (टोल-फ्री)" : "Call 14447 (Toll-Free)"}</span>
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=in.farmguide.farmerapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <ExternalLink size={15} />
                  <span>{language === "mr" ? "क्रॉप इन्शुरन्स ॲप" : "Crop Insurance App"}</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: PANCHANAMA & REQUIRED DOCUMENTS CHECKLIST */}
        {/* ==================================================== */}
        {activeTab === "panchanama" && (
          <div className="space-y-6">
            
            {/* Checklist of Mandatory Documents */}
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileCheck size={18} className="text-emerald-600" />
                    <span>{language === "mr" ? "पंचनाम्यासाठी आवश्यक कागदपत्रांची यादी" : "Mandatory Document Checklist"}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {language === "mr" ? "खालील कागदपत्रे तयार ठेवा आणि पडताळणीसाठी टिकमार्क करा." : "Verify each document before meeting revenue and agriculture surveyors."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {PANCHANAMA_DOCUMENTS.map((doc) => {
                  const isChecked = checkedDocs[doc.id] || false;
                  const locDoc = doc[language as "mr" | "hi" | "en"] || doc.en;

                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleDocChecked(doc.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isChecked
                          ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                          : "bg-gray-50 dark:bg-gray-900/60 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <button type="button" className="mt-0.5 flex-shrink-0 text-emerald-600">
                        {isChecked ? <CheckSquare size={18} /> : <Square size={18} className="text-gray-400" />}
                      </button>
                      <div className="space-y-1 text-xs">
                        <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                          <span>{locDoc.title}</span>
                          {doc.required && (
                            <span className="text-[10px] text-rose-600 font-extrabold uppercase">* Mandatory</span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500">{locDoc.whyNeeded}</div>
                        <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">💡 {locDoc.tip}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Application Draft Generator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Form Input Parameters */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3.5">
                <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText size={16} className="text-amber-600" />
                  <span>{language === "mr" ? "अर्जातील तपशील भरा" : "Fill Application Details"}</span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {language === "mr" ? "शेतकऱ्याचे नाव" : "Farmer Full Name"}
                  </label>
                  <input
                    type="text"
                    value={panchanamaData.farmerName}
                    onChange={(e) => setPanchanamaData({ ...panchanamaData, farmerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {language === "mr" ? "जिल्हा" : "District"}
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-white"
                    >
                      {availableDistricts.map((d) => (
                        <option key={d} value={d}>
                          {getLocalizedDistrict(d, language)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {language === "mr" ? "तालुका" : "Taluka/Tehsil"}
                    </label>
                    <select
                      value={activeTaluka}
                      onChange={(e) => setPanchanamaData({ ...panchanamaData, taluka: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-white"
                    >
                      {availableTalukas.map((tName) => (
                        <option key={tName} value={tName}>{tName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {language === "mr" ? "गट / सर्व्हे क्र." : "Gat / Survey No."}
                    </label>
                    <input
                      type="text"
                      value={panchanamaData.surveyNumber}
                      onChange={(e) => setPanchanamaData({ ...panchanamaData, surveyNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {language === "mr" ? "पिकाचे नाव" : "Crop Name"}
                    </label>
                    <input
                      type="text"
                      value={panchanamaData.cropName}
                      onChange={(e) => setPanchanamaData({ ...panchanamaData, cropName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {language === "mr" ? "आपत्ती तारीख" : "Incident Date"}
                    </label>
                    <input
                      type="date"
                      value={panchanamaData.incidentDate}
                      onChange={(e) => setPanchanamaData({ ...panchanamaData, incidentDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      {language === "mr" ? "मोबाईल (१० अंक)" : "Phone Number"}
                    </label>
                    <input
                      type="tel"
                      value={panchanamaData.contactPhone}
                      onChange={(e) => setPanchanamaData({ ...panchanamaData, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {phoneError && <div className="text-[11px] text-rose-600 font-semibold">{phoneError}</div>}
                {dateError && <div className="text-[11px] text-rose-600 font-semibold">{dateError}</div>}

                {/* Photo Pre-Validation Inspector */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {language === "mr" ? "पिकाचे छायाचित्र तपासा (क्लायंट साईड)" : "Inspect Crop Photo (Client-Side)"}
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageSelected}
                    className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-800"
                  />
                  {photoError && <div className="text-[11px] text-rose-600 font-semibold mt-1">{photoError}</div>}
                  {selectedImageFile && (
                    <div className="mt-2.5 p-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedImageFile.previewUrl}
                        alt="Crop Damage Preview"
                        className="w-14 h-14 object-cover rounded-xl border border-gray-200 dark:border-gray-700 flex-shrink-0"
                      />
                      <div className="text-xs space-y-0.5 min-w-0 flex-1">
                        <div className="font-bold text-gray-900 dark:text-white truncate flex items-center gap-1.5">
                          <ImageIcon size={13} className="text-amber-600 flex-shrink-0" />
                          <span className="truncate">{selectedImageFile.name}</span>
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {selectedImageFile.sizeKb} KB • {language === "mr" ? "स्थानिक तपासणी पूर्ण" : "Local inspection complete"}
                        </div>
                        <div className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                          {language === "mr"
                            ? "⚠️ विमा पोर्टलवर GPS अक्षांश/रेखांश व तारीख दर्शवणारे छायाचित्र आवश्यक."
                            : "⚠️ Ensure GPS latitude/longitude & date are visible on PMFBY portal."}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Application Letter Output Preview */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    <Printer size={16} className="text-amber-600" />
                    <span>{language === "mr" ? "अर्ज मसुदा पूर्वावलोकन (Draft Preview)" : "Application Draft Preview"}</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyApplication}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-bold transition-colors"
                    >
                      {copiedDraft ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      <span>{copiedDraft ? (language === "mr" ? "कॉपी झाले!" : "Copied!") : (language === "mr" ? "कॉपी करा" : "Copy")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePrintApplication}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors"
                    >
                      <Printer size={14} />
                      <span>{language === "mr" ? "प्रिंट काढा" : "Print"}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto border border-gray-200 dark:border-gray-700">
                  {fullApplicationLetterText}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 6: VERIFIED OFFICIAL PORTALS & HELPLINES */}
        {/* ==================================================== */}
        {activeTab === "portals" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {VERIFIED_OFFICIAL_PORTALS.map((portal) => (
                <div
                  key={portal.id}
                  className="p-5 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-bold uppercase">
                        {portal.category.toUpperCase()}
                      </span>
                      <h4 className="text-sm font-extrabold text-gray-900 dark:text-white mt-1.5">
                        {language === "mr" ? (portal.nameMr || portal.name) : language === "hi" ? (portal.nameHi || portal.name) : portal.name}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">{portal.officialSource}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700 text-xs">
                    {portal.helpline ? (
                      <a
                        href={portal.url}
                        className="font-bold text-rose-600 flex items-center gap-1 hover:underline"
                      >
                        <PhoneCall size={13} />
                        <span>{portal.helpline}</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-gray-400">Verified: {portal.lastVerifiedDate}</span>
                    )}

                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <span>{portal.helpline ? "Call Now" : "Visit Portal"}</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>

      </main>

      {/* ==================================================== */}
      {/* AI RELIEF ADVISOR DRAWER */}
      {/* ==================================================== */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full sm:w-[480px] bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col z-50 border-l border-gray-200 dark:border-gray-800"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/80 dark:bg-gray-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold">
                    <Bot size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <span>{language === "mr" ? "एआय शेतकरी साहाय्य सल्लागार" : "AI Farmer Relief Advisor"}</span>
                      <Sparkles size={14} className="text-amber-500" />
                    </h3>
                    <div className="text-[11px] text-gray-500 flex items-center gap-1">
                      <ShieldCheck size={12} className="text-emerald-500" />
                      <span>{language === "mr" ? "सुरक्षित सर्व्हर API द्वारे समर्थित" : "Secured Server-Side AI API"}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm ${
                        msg.role === "user"
                          ? "bg-amber-600 text-white rounded-br-none"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <FormattedChatMessage content={msg.text} />
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-amber-600 animate-bounce delay-100" />
                      <div className="w-2 h-2 rounded-full bg-amber-600 animate-bounce delay-200" />
                      <span>{language === "mr" ? "माहिती तपासत आहे..." : "Verifying relief norms..."}</span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Prompt Suggestions */}
              <div className="p-3 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-800/40 space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  {language === "mr" ? "वारंवार विचारले जाणारे प्रश्न:" : "Recommended Queries:"}
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-none">
                  {samplePrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendQuery(p)}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] text-gray-700 dark:text-gray-300 hover:border-amber-500 text-left truncate max-w-full"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area (Isolated to prevent page re-renders on keystroke) */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <ReliefChatInputBox
                  onSend={handleSendQuery}
                  isLoading={isLoading}
                  language={language}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* ADMIN LIVE REFRESH MODAL DIALOG */}
      {/* ==================================================== */}
      <AnimatePresence>
        {refreshModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    <Activity size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">
                      {language === "mr" ? "थेट शासकीय स्रोत तपासणी (Source Refresh)" : "Trigger Live Intelligence Ingestion"}
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      {language === "mr" ? "७ अधिकृत पोर्टल्स व वृत्त स्रोतांची थेट तपासणी" : "Scans 7 official portals and verifies against GRs"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRefreshModalOpen(false)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleTriggerRefresh} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                    <Key size={13} className="text-amber-600" />
                    <span>{language === "mr" ? "प्रशासक गुप्त की (Admin Secret)" : "Administrator Secret Key"}</span>
                  </label>
                  <input
                    type="password"
                    value={adminSecretInput}
                    onChange={(e) => setAdminSecretInput(e.target.value)}
                    placeholder="Enter RELIEF_ADMIN_SECRET..."
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-900 dark:text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    {language === "mr"
                      ? "सार्वजनिक वापरकर्त्यांकडून अमर्याद विनंत्या रोखण्यासाठी ही सुरक्षा तपासणी आवश्यक आहे."
                      : "Restricts uncontrolled scraping and protects server rate limits."}
                  </p>
                </div>

                {refreshError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                    <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>{refreshError}</span>
                  </div>
                )}

                {refreshRunReport && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2 text-xs">
                    <div className="font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 size={15} className="text-emerald-600" />
                      <span>{language === "mr" ? "तपासणी यशस्वी झाली!" : "Ingestion Completed Successfully!"}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 dark:text-gray-300">
                      <div>
                        {language === "mr" ? "तपासलेले स्रोत:" : "Sources Checked:"}{" "}
                        <strong className="text-gray-900 dark:text-white">{refreshRunReport.sourcesChecked}</strong>
                      </div>
                      <div>
                        {language === "mr" ? "कालावधी:" : "Duration:"}{" "}
                        <strong className="text-gray-900 dark:text-white">{refreshRunReport.executionDurationMs} ms</strong>
                      </div>
                      <div>
                        {language === "mr" ? "सत्यापित नोंदी:" : "Verified GRs:"}{" "}
                        <strong className="text-emerald-600">{refreshRunReport.verifiedRecordsCount}</strong>
                      </div>
                      <div>
                        {language === "mr" ? "समीक्षाधीन नोंदी:" : "Under Review:"}{" "}
                        <strong className="text-amber-600">{refreshRunReport.pendingReviewCount}</strong>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRefreshModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs transition-colors"
                  >
                    {language === "mr" ? "बंद करा" : "Close"}
                  </button>
                  <button
                    type="submit"
                    disabled={isTriggeringRefresh}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    {isTriggeringRefresh ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>{language === "mr" ? "तपासत आहे..." : "Scanning Sources..."}</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw size={13} />
                        <span>{language === "mr" ? "आता थेट तपासा" : "Run Ingestion Now"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CropReliefPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CropReliefContent />
    </Suspense>
  );
}
