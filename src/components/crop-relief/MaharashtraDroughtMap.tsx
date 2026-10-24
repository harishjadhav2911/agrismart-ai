"use client";

import React, { useState, useMemo } from "react";
import {
  MapPin,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Table as TableIcon,
  Map as MapIcon,
  CheckCircle2,
  FileText,
  Clock,
  Droplets,
  Calendar
} from "lucide-react";
import {
  MAHARASHTRA_DISTRICTS_DATA,
  DistrictDroughtStatus,
  DroughtSeasonYear,
  getFilteredDistricts,
  getMaharashtraDroughtSummary
} from "@/data/maharashtraDistrictsGeo";
import { useLanguage } from "@/context/LanguageContext";

interface MaharashtraDroughtMapProps {
  onSelectTaluka?: (talukaName: string, districtName: string) => void;
  className?: string;
}

function MaharashtraDroughtMapComponent({
  onSelectTaluka,
  className = ""
}: MaharashtraDroughtMapProps) {
  const { language } = useLanguage();

  // Season / Year Selector: Kharif 2026 (Default) vs Historical 2023-24
  const [seasonYear, setSeasonYear] = useState<DroughtSeasonYear>("kharif_2026");

  // UI state
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("chhatrapati-sambhajinagar");
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<DistrictDroughtStatus | "all">("all");
  const [viewMode, setViewMode] = useState<"map" | "table">("map");

  const summary = useMemo(() => getMaharashtraDroughtSummary(seasonYear), [seasonYear]);

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    return getFilteredDistricts(searchQuery, statusFilter, seasonYear);
  }, [searchQuery, statusFilter, seasonYear]);

  // Active selected district
  const selectedDistrict = useMemo(() => {
    return (
      MAHARASHTRA_DISTRICTS_DATA.find((d) => d.id === selectedDistrictId) ||
      MAHARASHTRA_DISTRICTS_DATA[0]
    );
  }, [selectedDistrictId]);

  // Active district season details
  const activeSeasonDetails = useMemo(() => {
    return seasonYear === "kharif_2026"
      ? selectedDistrict.season2026
      : selectedDistrict.historical2023;
  }, [selectedDistrict, seasonYear]);

  // Color mapping by drought status
  const getStatusColor = (status: DistrictDroughtStatus, isSelected: boolean, isHovered: boolean) => {
    if (isSelected) {
      return {
        fill: "#dc2626", // Bold Crimson when selected
        stroke: "#ffffff",
        strokeWidth: 3.5,
        filter: "drop-shadow(0 4px 12px rgba(220, 38, 38, 0.6))"
      };
    }
    if (isHovered) {
      return {
        fill: "#ea580c", // Bright Amber-Orange when hovered
        stroke: "#fef08a",
        strokeWidth: 2.8,
        filter: "drop-shadow(0 2px 8px rgba(234, 88, 12, 0.5))"
      };
    }

    switch (status) {
      case "officially_declared":
        return { fill: "#b45309", stroke: "#78350f", strokeWidth: 1.5 }; // Deep Amber/Rust
      case "partially_declared":
        return { fill: "url(#partialDroughtHatch)", stroke: "#b45309", strokeWidth: 1.6 }; // Distinct diagonal hatch for partial
      case "concession_circles":
        return { fill: "#d97706", stroke: "#92400e", strokeWidth: 1.5 }; // Gold-Amber
      case "under_assessment":
        return { fill: "#7c3aed", stroke: "#4c1d95", strokeWidth: 1.5 }; // Violet
      case "baseline_monitored":
      default:
        return { fill: "#334155", stroke: "#1e293b", strokeWidth: 1.2 }; // Slate Gray
    }
  };

  return (
    <div id="drought-map" className={`space-y-6 ${className}`}>
      
      {/* SECTION HEADER & CONTROL BAR */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        
        {/* Top bar: Title + Season/Year Selector + View Mode */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                <MapPin size={13} className="text-emerald-600" />
                <span>
                  {seasonYear === "kharif_2026"
                    ? language === "mr"
                      ? "खरीप २०२६ चालू दुष्काळ नकाशा (३०४ तालुके अधिसूचित)"
                      : "Kharif 2026 Current Drought Map (304 Talukas Notified)"
                    : language === "mr"
                      ? "ऐतिहासिक दुष्काळ अभिलेख — २०२३–२४ (४० तालुके / १०२१ मंडळे)"
                      : "Historical Drought Archive — 2023–24 (40 Talukas / 1,021 Circles)"}
                </span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[11px] font-semibold border border-blue-500/20">
                <Clock size={11} />
                <span>{language === "mr" ? "अद्यतन: २३ ऑक्टोबर २०२६" : "Updated: 23 Oct 2026"}</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {seasonYear === "kharif_2026"
                ? language === "mr"
                  ? "महाराष्ट्र खरीप २०२६ अधिकृत दुष्काळग्रस्त जिल्हे व तालुके नकाशा"
                  : language === "hi"
                  ? "महाराष्ट्र खरीफ 2026 आधिकारिक सूखाग्रस्त जिले व तहसीलें मैप"
                  : "Maharashtra Kharif 2026 Drought-Affected Districts & Talukas Official Map"
                : language === "mr"
                  ? "ऐतिहासिक दुष्काळ संदर्भ नकाशा (२०२३–२४)"
                  : language === "hi"
                  ? "ऐतिहासिक सूखा संदर्भ मानचित्र (2023–24)"
                  : "Historical Drought Reference Map (2023–24)"}
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
              {seasonYear === "kharif_2026"
                ? language === "mr"
                  ? "१४ ऑक्टोबर २०२६ च्या सुधारित अधिसूचनेनुसार ३०४ तालुक्यांची यादी व २२ ऑक्टोबर २०२६ च्या अन्न व नागरी पुरवठा GR क्र. २०२६१०२२१६५५४८२५०६ नुसार १२ शासकीय सवलती."
                  : language === "hi"
                  ? "14 अक्टूबर 2026 अधिसूचना अनुसार 304 तहसीलों की सूची एवं 22 अक्टूबर खाद्य विभाग GR अनुसार 12 वैधानिक रियायतें।"
                  : "Interactive territorial map detailing the 304 officially notified drought-hit talukas (14 Oct 2026 corrigendum & 22 Oct Food Dept GR No. 202610221655482506) with 12 statutory concessions."
                : language === "mr"
                  ? "३१ ऑक्टोबर २०२३ च्या शासन निर्णयानुसार ४० घोषित तालुके आणि १० नोव्हेंबर २०२३ च्या आदेशानुसार १०२१ महसूल मंडळांना लागू दुष्काळ सवलतींचा ऐतिहासिक नकाशा."
                  : "Historical 2023 archive displaying the 40 officially declared talukas (GR 202310311805175519) and 1,021 revenue circles."}
            </p>
          </div>

          {/* Controls: Season/Year Selector + Map/Table Toggle */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            
            {/* Season/Year Switcher */}
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 p-1 rounded-2xl border border-amber-300 dark:border-amber-800">
              <button
                type="button"
                onClick={() => setSeasonYear("kharif_2026")}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                  seasonYear === "kharif_2026"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-amber-900 dark:text-amber-200 hover:bg-amber-200/50 dark:hover:bg-amber-900/50"
                }`}
              >
                <Calendar size={13} />
                <span>{language === "mr" ? "खरीप २०२६ (चालू)" : "Kharif 2026 (Live)"}</span>
              </button>
              <button
                type="button"
                onClick={() => setSeasonYear("historical_2023_24")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  seasonYear === "historical_2023_24"
                    ? "bg-gray-800 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                <Layers size={13} />
                <span>{language === "mr" ? "२०२३–२४ (ऐतिहासिक)" : "2023–24 (Archive)"}</span>
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl border border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  viewMode === "map"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <MapIcon size={13} />
                <span>{language === "mr" ? "नकाशा" : "Map"}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  viewMode === "table"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <TableIcon size={13} />
                <span>{language === "mr" ? "तक्ता" : "Table"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* SUMMARY STATS BANNER */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-center">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <span className="block text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">
              {language === "mr" ? "घोषित तालुके" : "Declared Talukas"}
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-900 dark:text-amber-100">
              {summary.declaredTalukasTotal} <span className="text-xs font-medium text-gray-500">/ 358</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
            <span className="block text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase">
              {language === "mr" ? "व्याप्त जिल्हे" : "Districts Covered"}
            </span>
            <span className="text-xl sm:text-2xl font-black text-blue-900 dark:text-blue-100">
              {summary.totalDistrictsCovered} <span className="text-xs font-medium text-gray-500">/ 36</span>
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800">
            <span className="block text-[10px] font-bold text-orange-800 dark:text-orange-300 uppercase">
              {language === "mr" ? "अंशतः घोषित जिल्हे" : "Partially Declared"}
            </span>
            <span className="text-xl sm:text-2xl font-black text-orange-900 dark:text-orange-100">
              {summary.partialDistrictsCount}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800">
            <span className="block text-[10px] font-bold text-cyan-800 dark:text-cyan-300 uppercase flex items-center justify-center gap-1">
              <Droplets size={11} className="text-cyan-600" />
              <span>{language === "mr" ? "सक्रिय टँकर (राज्यात)" : "Statewide Tankers"}</span>
            </span>
            <span className="text-xl sm:text-2xl font-black text-cyan-900 dark:text-cyan-100">
              886
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="relative flex-grow max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === "mr"
                  ? "जिल्हा किंवा तालुक्याचे नाव शोधा (उदा. बीड, बारामती, श्रीवर्धन, हिंगोली)..."
                  : language === "hi"
                  ? "जिला या तहसील का नाम खोजें (उदा. बीड, बारामती, श्रीवर्धन, हिंगोली)..."
                  : "Search district or taluka (e.g. Beed, Baramati, Shrivardhan)..."
              }
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { id: "all", label: language === "mr" ? "सर्व (३६)" : "All (36)" },
              { id: "officially_declared", label: language === "mr" ? "पूर्ण घोषित (२४)" : "Fully Declared (24)" },
              { id: "partially_declared", label: language === "mr" ? "अंशतः घोषित (८)" : "Partially Declared (8)" },
              { id: "baseline_monitored", label: language === "mr" ? "सामान्य (४)" : "Baseline / Urban (4)" }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id as DistrictDroughtStatus | "all")}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  statusFilter === f.id
                    ? "bg-amber-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DISCREPANCY RECONCILIATION NOTICE (Resolving 304 vs 305 vs 306) */}
      <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400/80 dark:border-amber-700/80 shadow-sm text-xs sm:text-sm text-amber-950 dark:text-amber-100 space-y-3">
        <div className="flex items-start gap-3">
          <AlertTriangle size={22} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2 flex-grow">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong className="text-sm sm:text-base font-black uppercase tracking-wide text-amber-900 dark:text-amber-200">
                {language === "mr"
                  ? "अधिकृत आकडेवारी पडताळणी: ३०४ विरुद्ध ३०५ विरुद्ध ३०६ तालुक्यांचा वाद निराकरण"
                  : language === "hi"
                  ? "आधिकारिक संख्या सत्यापन: 304 बनाम 305 बनाम 306 तहसीलों का तथ्य विश्लेषण"
                  : "Official Count Audit Notice: Resolving 304 vs 305 vs 306 Taluka Discrepancy"}
              </strong>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-red-100 dark:bg-red-900/80 text-red-800 dark:text-red-200 border border-red-300">
                {language === "mr" ? "ऑक्टोबर २०२६ लेखापरीक्षण" : "October 2026 Audit"}
              </span>
            </div>

            {/* MANDATORY PROMINENT DISCLAIMER */}
            <div className="p-3 rounded-2xl bg-white dark:bg-gray-900 border-2 border-red-500/60 text-red-950 dark:text-red-200 font-extrabold text-sm sm:text-base">
              {language === "mr"
                ? "“२०२६ मधील दुष्काळग्रस्त तालुक्यांची अंतिम संख्या पडताळणीअधीन आहे.”"
                : language === "hi"
                ? "“2026 में सूखाग्रस्त तहसीलों की अंतिम संख्या सत्यापन के अधीन है।”"
                : "“The final count of drought-affected talukas in 2026 remains under official verification across conflicting orders.”"}
            </div>

            <div className="space-y-1.5 text-xs text-gray-700 dark:text-amber-200/90 leading-relaxed">
              <p>
                <strong>{language === "mr" ? "१. २५ सप्टेंबर २०२६ शासन निर्णय:" : "1. 25 Sept 2026 GR:"}</strong>{" "}
                {language === "mr"
                  ? "मदत व पुनर्वसन विभागाच्या शासन निर्णय क्र. संकीर्ण-२०२६/प्र.क्र.८२/म-२ द्वारे २१ दिवसांपेक्षा अधिक पावसाचा खंड पडलेल्या २६५ तालुक्यांमध्ये ट्रिगर-१ लागू करण्यात आला."
                  : "Department of Relief & Rehabilitation GR applied Trigger-1 criteria across 265 talukas facing over 21 days of continuous dry spells."}
              </p>
              <p>
                <strong>{language === "mr" ? "२. १४ ऑक्टोबर २०२६ विस्तार व शुद्धिपत्रक:" : "2. 14 Oct 2026 Corrigendum:"}</strong>{" "}
                {language === "mr"
                  ? "मंत्रिमंडळाने ट्रिगर-२ चे निकष तपासून अतिरिक्त तालुक्यांचा समावेश केला. तोंडी पत्रकार परिषदेत ४० तालुके वाढल्याचे (२६५ + ४० = ३०५) सांगण्यात आले; मात्र अधिकृत परिशिष्टात पर्जन्यमान निर्देशांकांच्या अंतिम मोजणीनुसार अचूक ३०४ तालुके अधिसूचित करण्यात आले. वृत्तसंस्थेच्या दुबार महसूल मंडळ मोजणीमुळे ३०६ आकडा प्रसिद्ध झाला."
                  : "Cabinet Sub-Committee evaluated Trigger-2. Verbal press briefings cited 40 additional talukas (265 + 40 = 305). However, the gazetted corrigendum annexure formally counts exactly 304 talukas after index reconciliation in Kolhapur/Hatkanangale circles. Syndicated wire services erroneously published 306 due to double-counting an administrative sub-circle."}
              </p>
              <p>
                <strong>{language === "mr" ? "३. २२ ऑक्टोबर २०२६ अन्न व नागरी पुरवठा GR:" : "3. 22 Oct 2026 Food Dept GR:"}</strong>{" "}
                {language === "mr"
                  ? "अन्न, नागरी पुरवठा व ग्राहक संरक्षण विभागाने GR क्र. २०२६१०२२१६५५४८२५०६ द्वारे ३३ जिल्ह्यांतील सर्व ३०४ दुष्काळग्रस्त तालुक्यांतील शेतकरी कुटुंबांना अन्नधान्य सवलती लागू केल्या आहेत."
                  : "Food, Civil Supplies & Consumer Protection Dept GR No. 202610221655482506 formally notified grain concessions across all 304 talukas in 33 districts."}
              </p>
            </div>

            {/* Source Evidence Links */}
            <div className="pt-2 border-t border-amber-300 dark:border-amber-800/80 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-bold">
              <span className="text-gray-500 dark:text-gray-400">{language === "mr" ? "तपासलेले पुरावे:" : "Audited Evidence:"}</span>
              <a
                href="https://mymaharashtra.in/en/sheti/maharashtra-drought-aid-2026-304-talukas-rs-5000-advance-concessions-crop-loss-10416"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1"
              >
                <span>{language === "mr" ? "२३ ऑक्टोबर वृत्तांत (३०४ तालुके)" : "23 Oct Report (304 Talukas)"}</span>
                <ExternalLink size={10} />
              </a>
              <a
                href="https://www.indiatoday.in/india/story/maharashtra-water-shortage-village-action-plans-nagpur-amravati-konkan-ptag-3022199-2026-10-21"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1"
              >
                <span>{language === "mr" ? "२१ ऑक्टोबर टंचाई वृत्तांत" : "21 Oct Scarcity Report"}</span>
                <ExternalLink size={10} />
              </a>
              <a
                href="https://www.newindianexpress.com/states/maharashtra/2026/Oct/17/farmer-sends-money-order-of-rs-5000-to-maharashtra-cm-fadnavis-over-paltry-interim-aid-by-government"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1"
              >
                <span>{language === "mr" ? "१७ ऑक्टोबर वृत्तांत" : "17 Oct Ground Report"}</span>
                <ExternalLink size={10} />
              </a>
              <a
                href="https://gr.maharashtra.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 dark:text-blue-300 hover:underline flex items-center gap-1"
              >
                <span>{language === "mr" ? "महाराष्ट्र GR पोर्टल" : "Maharashtra GR Portal"}</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE MAP & SELECTED DISTRICT CARD */}
      {viewMode === "map" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: SVG MAP CONTAINER (Col 7) */}
          <div className="lg:col-span-7 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            
            {/* Legend & Instructions */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800 pb-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-sm bg-[#b45309] border border-amber-900 inline-block" />
                  <span className="text-gray-300 font-semibold">{language === "mr" ? "१००% घोषित" : "Fully Declared"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-3.5 h-3.5 rounded-sm border border-amber-600 inline-block"
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, #b45309, #b45309 2px, #475569 2px, #475569 4px)"
                    }}
                  />
                  <span className="text-gray-300 font-semibold">{language === "mr" ? "अंशतः घोषित" : "Partially Declared"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-sm bg-[#334155] border border-slate-700 inline-block" />
                  <span className="text-gray-300 font-semibold">{language === "mr" ? "सामान्य / शहरी" : "Baseline"}</span>
                </div>
              </div>
              <span className="text-[11px] text-amber-400 font-medium">
                {language === "mr" ? "जिल्ह्यावर क्लिक करून तपशील पहा" : "Click district to view talukas"}
              </span>
            </div>

            {/* Interactive SVG Map */}
            <div className="relative w-full aspect-[800/680] max-h-[580px] flex items-center justify-center overflow-hidden">
              
              {/* Tooltip on hover */}
              {hoveredDistrictId && (
                <div className="absolute top-2 left-2 z-20 pointer-events-none px-3 py-1.5 rounded-xl bg-gray-950/90 text-white text-xs border border-amber-500/40 shadow-xl backdrop-blur-md">
                  <div className="flex flex-col">
                    <strong className="font-extrabold text-amber-400">
                      {MAHARASHTRA_DISTRICTS_DATA.find((d) => d.id === hoveredDistrictId)?.name} (
                      {language === "mr"
                        ? MAHARASHTRA_DISTRICTS_DATA.find((d) => d.id === hoveredDistrictId)?.nameMr
                        : MAHARASHTRA_DISTRICTS_DATA.find((d) => d.id === hoveredDistrictId)?.nameHi}
                      )
                    </strong>
                    <span className="text-[10px] text-gray-300">
                      {seasonYear === "kharif_2026"
                        ? `${MAHARASHTRA_DISTRICTS_DATA.find((d) => d.id === hoveredDistrictId)?.season2026.declaredTalukasCount || 0} / ${MAHARASHTRA_DISTRICTS_DATA.find((d) => d.id === hoveredDistrictId)?.totalTalukas} ${language === "mr" ? "घोषित तालुके" : "Declared Talukas"}`
                        : `${MAHARASHTRA_DISTRICTS_DATA.find((d) => d.id === hoveredDistrictId)?.historical2023.declaredTalukasCount || 0} ${language === "mr" ? "घोषित तालुके" : "Talukas"} | ${MAHARASHTRA_DISTRICTS_DATA.find((d) => d.id === hoveredDistrictId)?.historical2023.declaredCirclesCount || 0} ${language === "mr" ? "मंडळे" : "Circles"}`}
                    </span>
                  </div>
                </div>
              )}

              <svg
                viewBox="0 0 800 680"
                className="w-full h-full select-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Partial Drought Diagonal Hatch Pattern */}
                  <pattern
                    id="partialDroughtHatch"
                    patternUnits="userSpaceOnUse"
                    width="8"
                    height="8"
                    patternTransform="rotate(45)"
                  >
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#d97706" strokeWidth="3.5" />
                    <line x1="4" y1="0" x2="4" y2="8" stroke="#334155" strokeWidth="4.5" />
                  </pattern>

                  {/* Drop Shadow filter */}
                  <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
                  </filter>
                </defs>

                {/* State district vector polygons */}
                <g filter="url(#shadow)">
                  {MAHARASHTRA_DISTRICTS_DATA.map((district) => {
                    const isSelected = selectedDistrictId === district.id;
                    const isHovered = hoveredDistrictId === district.id;
                    const details = seasonYear === "kharif_2026" ? district.season2026 : district.historical2023;
                    const style = getStatusColor(details.status, isSelected, isHovered);

                    return (
                      <path
                        key={district.id}
                        d={district.svgPath}
                        fill={style.fill}
                        stroke={style.stroke}
                        strokeWidth={style.strokeWidth}
                        style={{
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out"
                        }}
                        onMouseEnter={() => setHoveredDistrictId(district.id)}
                        onMouseLeave={() => setHoveredDistrictId(null)}
                        onClick={() => setSelectedDistrictId(district.id)}
                        role="button"
                        tabIndex={0}
                        aria-label={`${district.name} District - ${details.status}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setSelectedDistrictId(district.id);
                          }
                        }}
                      />
                    );
                  })}
                </g>

                {/* District Label Markers */}
                {MAHARASHTRA_DISTRICTS_DATA.map((district) => {
                  const isSelected = selectedDistrictId === district.id;
                  const details = seasonYear === "kharif_2026" ? district.season2026 : district.historical2023;
                  return (
                    <g
                      key={`label-${district.id}`}
                      pointerEvents="none"
                      className="transition-opacity"
                    >
                      <text
                        x={district.labelX}
                        y={district.labelY}
                        fill={isSelected ? "#ffffff" : "#f1f5f9"}
                        fontSize={isSelected ? "13" : "10"}
                        fontWeight={isSelected ? "900" : "700"}
                        textAnchor="middle"
                        filter="drop-shadow(0 1px 2px rgba(0,0,0,0.9))"
                      >
                        {district.code}
                      </text>
                      {details.declaredTalukasCount > 0 && (
                        <circle
                          cx={district.labelX + 14}
                          cy={district.labelY - 5}
                          r="4"
                          fill={details.status === "partially_declared" ? "#f59e0b" : "#ef4444"}
                          stroke="#ffffff"
                          strokeWidth="1"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-slate-800">
              <span>{language === "mr" ? "स्रोत: महसूल व वन विभाग, महाराष्ट्र शासन" : "Source: Revenue & Forest Department, GoM"}</span>
              <span>{language === "mr" ? "पडताळणी: २३ ऑक्टोबर २०२६" : "Verified: 23 October 2026"}</span>
            </div>
          </div>

          {/* RIGHT: SELECTED DISTRICT PROFILE CARD (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border-2 border-amber-500/50 dark:border-amber-500/40 shadow-lg space-y-4">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      {selectedDistrict.code}
                    </span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {language === "mr" ? selectedDistrict.divisionMr : language === "hi" ? selectedDistrict.divisionHi : selectedDistrict.division} {language === "mr" ? "विभाग" : "Division"}
                    </span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mt-1">
                    {selectedDistrict.name}
                  </h4>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {language === "mr" ? selectedDistrict.nameMr : selectedDistrict.nameHi}
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
                    activeSeasonDetails.status === "officially_declared"
                      ? "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300"
                      : activeSeasonDetails.status === "partially_declared"
                      ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300"
                      : activeSeasonDetails.status === "concession_circles"
                      ? "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300"
                      : "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900 dark:text-gray-300"
                  }`}
                >
                  {activeSeasonDetails.status === "officially_declared"
                    ? language === "mr"
                      ? "पूर्ण घोषित"
                      : "Fully Declared"
                    : activeSeasonDetails.status === "partially_declared"
                    ? language === "mr"
                      ? "अंशतः घोषित"
                      : "Partially Declared"
                    : activeSeasonDetails.status === "concession_circles"
                    ? language === "mr"
                      ? "मंडळ सवलती"
                      : "Circle Concessions"
                    : language === "mr"
                    ? "सामान्य पर्जन्यमान"
                    : "Normal Baseline"}
                </span>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                  <span className="block text-[10px] text-gray-500 font-bold uppercase">{language === "mr" ? "एकूण तालुके" : "Total Talukas"}</span>
                  <span className="text-base font-black text-gray-900 dark:text-white">{selectedDistrict.totalTalukas}</span>
                </div>
                <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200">
                  <span className="block text-[10px] font-bold uppercase">{language === "mr" ? "घोषित तालुके" : "Declared Talukas"}</span>
                  <span className="text-base font-black">
                    {activeSeasonDetails.declaredTalukasCount}
                    {activeSeasonDetails.status === "partially_declared" && (
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-300"> / {selectedDistrict.totalTalukas}</span>
                    )}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                  <span className="block text-[10px] font-bold uppercase">
                    {seasonYear === "kharif_2026"
                      ? language === "mr" ? "सक्रिय टँकर" : "Tankers"
                      : language === "mr" ? "बाधित मंडळे" : "Circles"}
                  </span>
                  <span className="text-base font-black">
                    {seasonYear === "kharif_2026"
                      ? selectedDistrict.id === "beed" ? "205" : selectedDistrict.id === "ahilyanagar" ? "196" : selectedDistrict.id === "chhatrapati-sambhajinagar" ? "179" : selectedDistrict.id === "solapur" ? "140" : "सक्रिय"
                      : activeSeasonDetails.declaredCirclesCount || 0}
                  </span>
                </div>
              </div>

              {/* Declared Talukas List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                  <span>
                    {language === "mr"
                      ? "अधिकृत घोषित तालुके व महसूल मंडळे:"
                      : "Officially Declared Talukas:"}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {activeSeasonDetails.declaredTalukas.length} {language === "mr" ? "नोंदी" : "listed"}
                  </span>
                </div>

                {activeSeasonDetails.declaredTalukas.length > 0 ? (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {activeSeasonDetails.declaredTalukas.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2 hover:border-amber-500/50 transition"
                      >
                        <div>
                          <strong className="text-xs font-extrabold text-gray-900 dark:text-white block">
                            {t.name} ({language === "mr" ? t.nameMr : t.nameHi})
                          </strong>
                          <span className="text-[10px] text-gray-500">
                            {t.grNumber} • {t.grDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              t.severity === "severe"
                                ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                                : t.severity === "moderate"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                : "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                            }`}
                          >
                            {t.severity}
                          </span>
                          {onSelectTaluka && (
                            <button
                              type="button"
                              onClick={() => onSelectTaluka(t.name, selectedDistrict.name)}
                              className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-600 hover:bg-amber-500 text-white cursor-pointer"
                            >
                              {language === "mr" ? "निवडा" : "Select"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500">
                    <CheckCircle2 size={16} className="text-emerald-500 mx-auto mb-1" />
                    <span>
                      {language === "mr"
                        ? "या जिल्ह्यात पूर्ण तालुका पातळीवर तीव्र दुष्काळ घोषित नाही. समाधानकारक पाऊस किंवा नागरी क्षेत्र."
                        : "No severe drought declared at the full taluka level in this district. Monitored under standard agricultural norms."}
                    </span>
                  </div>
                )}
              </div>

              {/* Official Government Order Reference */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                  <FileText size={14} className="text-amber-600" />
                  <span>{language === "mr" ? "संबधित शासन निर्णय व पुरावा:" : "Official Resolution (GR) Reference:"}</span>
                </div>
                <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-snug">
                  {activeSeasonDetails.officialGrRef}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-amber-200 dark:border-amber-900/60 text-[10px] text-gray-500">
                  <span>
                    <strong>{language === "mr" ? "दिनांक:" : "Order Date:"}</strong> {activeSeasonDetails.grDate}
                  </span>
                  <a
                    href={activeSeasonDetails.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 dark:text-amber-400 font-extrabold hover:underline flex items-center gap-1"
                  >
                    <span>{language === "mr" ? "GR पोर्टल पहा" : "Verify on GR Portal"}</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>

              {/* Verification Audit Note */}
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 text-[11px] text-gray-600 dark:text-gray-300 flex items-start gap-2">
                <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <p>
                  {language === "mr"
                    ? activeSeasonDetails.verificationNote.mr
                    : language === "hi"
                    ? activeSeasonDetails.verificationNote.hi
                    : activeSeasonDetails.verificationNote.en}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: ACCESSIBLE DISTRICT DIRECTORY TABLE VIEW */}
      {viewMode === "table" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
            <div>
              <h4 className="text-base font-extrabold text-gray-900 dark:text-white">
                {seasonYear === "kharif_2026"
                  ? language === "mr"
                    ? "महाराष्ट्र खरीप २०२६ अधिकृत दुष्काळ तक्ता (३०४ तालुके)"
                    : "Maharashtra Kharif 2026 Official Drought Directory (304 Talukas)"
                  : language === "mr"
                    ? "ऐतिहासिक २०२३–२४ दुष्काळ तक्ता (४० तालुके)"
                    : "Historical 2023–24 Drought Directory (40 Talukas)"}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {language === "mr"
                  ? "स्क्रीन रीडर आणि मोबाइल वापरकर्त्यांसाठी संपूर्ण पडताळणी यादी."
                  : "Accessible tabular directory with verified order references and taluka lists."}
              </p>
            </div>
            <span className="text-xs font-bold text-gray-500">
              {filteredDistricts.length} {language === "mr" ? "जिल्हे" : "Districts"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-3 px-4">{language === "mr" ? "जिल्हा" : "District"}</th>
                  <th className="py-3 px-3">{language === "mr" ? "विभाग" : "Division"}</th>
                  <th className="py-3 px-3">{language === "mr" ? "स्थिती" : "Status"}</th>
                  <th className="py-3 px-3 text-center">{language === "mr" ? "घोषित तालुके" : "Declared Talukas"}</th>
                  <th className="py-3 px-3 text-center">
                    {seasonYear === "kharif_2026"
                      ? language === "mr" ? "पाणी टंचाई / टँकर" : "Tankers / Scarcity"
                      : language === "mr" ? "बाधित मंडळे" : "Drought Circles"}
                  </th>
                  <th className="py-3 px-4">{language === "mr" ? "शासन निर्णय व दिनांक" : "Resolution (GR) & Date"}</th>
                  <th className="py-3 px-3 text-center">{language === "mr" ? "कृती" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredDistricts.map((d) => {
                  const details = seasonYear === "kharif_2026" ? d.season2026 : d.historical2023;
                  return (
                    <tr
                      key={d.id}
                      className="hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition"
                    >
                      <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                        <div>
                          <span>{d.name}</span>
                          <span className="text-gray-400 block text-[11px] font-normal">
                            {language === "mr" ? d.nameMr : d.nameHi}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-gray-600 dark:text-gray-300 font-medium">
                        {language === "mr" ? d.divisionMr : d.division}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            details.status === "officially_declared"
                              ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                              : details.status === "partially_declared"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : details.status === "concession_circles"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                          }`}
                        >
                          {details.status === "officially_declared"
                            ? language === "mr" ? "पूर्ण घोषित" : "Declared"
                            : details.status === "partially_declared"
                            ? language === "mr" ? "अंशतः घोषित" : "Partially Declared"
                            : details.status === "concession_circles"
                            ? language === "mr" ? "मंडळ सवलती" : "Circles"
                            : language === "mr" ? "सामान्य" : "Baseline"}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-gray-900 dark:text-white">
                        {details.declaredTalukasCount > 0 ? (
                          <span className="text-red-600 dark:text-red-400 font-extrabold">
                            {details.declaredTalukasCount} / {d.totalTalukas}
                          </span>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-gray-900 dark:text-white">
                        {seasonYear === "kharif_2026" ? (
                          d.id === "beed" ? (
                            <span className="text-cyan-600 font-black">205 टँकर</span>
                          ) : d.id === "ahilyanagar" ? (
                            <span className="text-cyan-600 font-black">196 टँकर</span>
                          ) : d.id === "chhatrapati-sambhajinagar" ? (
                            <span className="text-cyan-600 font-black">179 टँकर</span>
                          ) : d.id === "solapur" ? (
                            <span className="text-cyan-600 font-black">140 टँकर</span>
                          ) : details.declaredTalukasCount > 0 ? (
                            <span className="text-amber-600 font-bold">आराखडा लागू</span>
                          ) : (
                            <span className="text-gray-400">संतोषजनक</span>
                          )
                        ) : details.declaredCirclesCount && details.declaredCirclesCount > 0 ? (
                          <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                            {details.declaredCirclesCount}
                          </span>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-gray-600 dark:text-gray-300">
                        <div className="truncate max-w-xs">{details.officialGrRef}</div>
                        <span className="text-gray-400 text-[10px]">{details.grDate}</span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDistrictId(d.id);
                            setViewMode("map");
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-600 hover:bg-amber-500 text-white transition cursor-pointer"
                        >
                          {language === "mr" ? "नकाशावर पहा" : "View Map"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const MaharashtraDroughtMap = React.memo(MaharashtraDroughtMapComponent);
export default MaharashtraDroughtMap;
