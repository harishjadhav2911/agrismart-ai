"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Droplets, CloudRain, Clock, MapPin, 
  Wind, Thermometer, ShieldAlert, CheckCircle2,
  Sparkles, Bot, X, ArrowRight, Loader2, Compass, Waves,
  Layers, Gauge, Sprout, AlertTriangle, ShieldCheck, Sliders
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLocation } from "@/context/LocationContext";
import { useLanguage } from "@/context/LanguageContext";
import { fetchLiveWeatherData, getCoordinatesForLocation, LiveWeatherData } from "@/utils/weatherApi";
import { fetchStates, fetchDistricts } from "@/utils/locationApi";
import { getLocalizedState, getLocalizedDistrict } from "@/data/indiaLocations";
import { useGeminiChat } from "@/hooks/useGeminiChat";
import { FormattedChatMessage } from "@/components/chat/FormattedChatMessage";

const CROPS_LIST = [
  { id: "Cotton", en: "Cotton (कापूस / कपास)", mr: "कापूस (Cotton)", hi: "कपास (Cotton)", factor: "Medium" },
  { id: "Soybean", en: "Soybean (सोयाबीन)", mr: "सोयाबीन (Soybean)", hi: "सोयाबीन (Soybean)", factor: "Medium" },
  { id: "Wheat", en: "Wheat (गहू / गेहूं)", mr: "गहू (Wheat)", hi: "गेहूं (Wheat)", factor: "Medium-High" },
  { id: "Sugarcane", en: "Sugarcane (ऊस / गन्ना)", mr: "ऊस (Sugarcane)", hi: "गन्ना (Sugarcane)", factor: "High" },
  { id: "Onion", en: "Onion (कांदा / प्याज)", mr: "कांदा (Onion)", hi: "प्याज (Onion)", factor: "Sensitive / High" },
  { id: "Tomato", en: "Tomato (टोमॅटो / टमाटर)", mr: "टोमॅटो (Tomato)", hi: "टमाटर (Tomato)", factor: "Regular / Medium" },
  { id: "Maize", en: "Maize (मका / मक्का)", mr: "मका (Maize)", hi: "मक्का (Maize)", factor: "Medium" },
  { id: "Gram", en: "Gram / Chickpea (हरभरा / चना)", mr: "हरभरा (Gram/Chana)", hi: "चना (Chickpea)", factor: "Low" },
  { id: "Paddy", en: "Paddy / Rice (भात / धान)", mr: "भात / धान (Paddy)", hi: "धान (Paddy)", factor: "High" },
  { id: "Grapes", en: "Grapes (द्राक्षे / अंगूर)", mr: "द्राक्षे (Grapes)", hi: "अंगूर (Grapes)", factor: "Controlled Drip" },
  { id: "Banana", en: "Banana (केळी / केला)", mr: "केळी (Banana)", hi: "केला (Banana)", factor: "High" },
  { id: "Chilli", en: "Chilli (मिरची / मिर्च)", mr: "मिरची (Chilli)", hi: "मिर्च (Chilli)", factor: "Sensitive" },
  { id: "Vegetables", en: "Vegetables (भाजीपाला / सब्जियां)", mr: "भाजीपाला (Vegetables)", hi: "सब्जियां (Vegetables)", factor: "Frequent Light" }
];

const SOIL_TYPES = [
  { id: "black", en: "Black Cotton Soil (काळी कसदार जमीन / Vertisol)", mr: "काळी कसदार जमीन (Black Soil)", hi: "काली मिट्टी (Black Soil)", fc: 40, wp: 22 },
  { id: "loam", en: "Loam / Alluvial Soil (गाळाची सुपीक जमीन)", mr: "गाळाची जमीन (Loamy Soil)", hi: "दोमट मिट्टी (Loamy Soil)", fc: 28, wp: 13 },
  { id: "clay", en: "Clayey Soil (चिकणमाती जमीन)", mr: "चिकणमाती (Clay Soil)", hi: "चिकनी मिट्टी (Clay Soil)", fc: 38, wp: 20 },
  { id: "red", en: "Red Soil (तांबडी जमीन / Alfisol)", mr: "तांबडी जमीन (Red Soil)", hi: "लाल मिट्टी (Red Soil)", fc: 24, wp: 10 },
  { id: "sandy", en: "Sandy Loam Soil (रेतीयुक्त वाळूची जमीन)", mr: "रेतीयुक्त जमीन (Sandy Soil)", hi: "बलुई मिट्टी (Sandy Soil)", fc: 16, wp: 6 }
];

const GROWTH_STAGES = [
  { id: "germination", en: "Germination / Initial Stage (अंकुरण / रोपावस्था)", mr: "अंकुरण / रोपावस्था (Initial)", hi: "अंकुरण / आरंभिक अवस्था", factor: 0.5 },
  { id: "vegetative", en: "Vegetative Growth (शाकीय वाढीची अवस्था)", mr: "शाकीय वाढ (Vegetative)", hi: "वानस्पतिक बढ़वार", factor: 0.85 },
  { id: "flowering", en: "Flowering / Reproductive (फुलधारणा — अतिसंवेदनशील)", mr: "फुलधारणा / पुनरुत्पादक (Flowering - Critical)", hi: "फूल आने की अवस्था (महत्वपूर्ण)", factor: 1.2 },
  { id: "maturity", en: "Yield Formation / Maturity (फळ / दाणे भरणे व परिपक्वता)", mr: "दाणे/फळ भरणे व परिपक्वता (Maturity)", hi: "दाना भराव व परिपक्वता", factor: 0.65 }
];

export default function SmartIrrigationPage() {
  const { t, language } = useLanguage();
  const { location } = useLocation();

  // Location State
  const [statesList, setStatesList] = useState<string[]>([]);
  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState(location?.state || "Maharashtra");
  const [selectedDistrict, setSelectedDistrict] = useState(location?.district || "Pune");

  // Farm & Soil Inputs
  const [selectedCrop, setSelectedCrop] = useState("Cotton");
  const [selectedSoilType, setSelectedSoilType] = useState("black");
  const [selectedGrowthStage, setSelectedGrowthStage] = useState("flowering");
  const [soilMoisture, setSoilMoisture] = useState<number>(28); // Soil moisture % (Manual / Simulated input)
  const [selectedMethod, setSelectedMethod] = useState("drip"); // drip, sprinkler, flood

  // Weather State
  const [weatherData, setWeatherData] = useState<LiveWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const { messages, isLoading: isChatLoading, sendMessage } = useGeminiChat("Soil & Weather-Based Irrigation Advisor", "irrig_title");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatOpen) {
      chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatLoading, isChatOpen]);

  // Load dropdown lists
  useEffect(() => {
    fetchStates().then(setStatesList);
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchDistricts(selectedState).then(dList => {
        setDistrictsList(dList);
        if (dList.length > 0 && !dList.includes(selectedDistrict)) {
          setSelectedDistrict(dList[0]);
        }
      });
    }
  }, [selectedState]);

  // Fetch real live meteorological data
  const loadWeatherData = async () => {
    if (!selectedState || !selectedDistrict) return;
    setIsLoading(true);
    setError(null);
    try {
      const coords = await getCoordinatesForLocation(selectedState, selectedDistrict);
      const data = await fetchLiveWeatherData(coords.lat, coords.lon);
      setWeatherData(data);
    } catch (err: unknown) {
      console.error("Failed to load meteorological data:", err);
      setError((err as Error)?.message || "Unable to fetch live weather data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, selectedDistrict]);

  // Active crop, soil, and growth stage objects
  const activeCropObj = useMemo(() => {
    return CROPS_LIST.find(c => c.id === selectedCrop) || CROPS_LIST[0];
  }, [selectedCrop]);

  const activeSoilObj = useMemo(() => {
    return SOIL_TYPES.find(s => s.id === selectedSoilType) || SOIL_TYPES[0];
  }, [selectedSoilType]);

  const activeStageObj = useMemo(() => {
    return GROWTH_STAGES.find(g => g.id === selectedGrowthStage) || GROWTH_STAGES[2];
  }, [selectedGrowthStage]);

  const activeCropLabel = useMemo(() => {
    if (language === 'mr') return activeCropObj.mr;
    if (language === 'hi') return activeCropObj.hi;
    return activeCropObj.en;
  }, [activeCropObj, language]);

  const activeSoilLabel = useMemo(() => {
    if (language === 'mr') return activeSoilObj.mr;
    if (language === 'hi') return activeSoilObj.hi;
    return activeSoilObj.en;
  }, [activeSoilObj, language]);

  const activeStageLabel = useMemo(() => {
    if (language === 'mr') return activeStageObj.mr;
    if (language === 'hi') return activeStageObj.hi;
    return activeStageObj.en;
  }, [activeStageObj, language]);

  // ==========================================
  // SOIL & WEATHER-BASED SCIENTIFIC IRRIGATION ENGINE
  // ==========================================
  const irrigationAnalysis = useMemo(() => {
    if (!weatherData) return null;

    const current = weatherData.current;
    const forecast = weatherData.forecast;

    const rainProbNext3Days = forecast.slice(0, 3).map(f => f.rainProb);
    const maxRainProb = Math.max(...rainProbNext3Days, 0);
    const rainToday = current.precipitation;
    const tempMaxToday = forecast[0]?.tempMax ?? current.temp;

    const { fc, wp } = activeSoilObj;
    const stageMultiplier = activeStageObj.factor;

    // 1. Determine Soil Status
    let soilStatusText = "";
    let soilStatusCode: "critical" | "low" | "optimal" | "saturated" = "optimal";
    let soilBadgeColor = "";

    if (soilMoisture <= wp + 3) {
      soilStatusCode = "critical";
      soilStatusText = language === "mr" 
        ? `तीव्र कोरडी जमीन (${soilMoisture}% ओलावा — पिकाला पाण्याचा तीव्र ताण)` 
        : language === "hi" 
        ? `अत्यधिक सूखी मिट्टी (${soilMoisture}% नमी — गंभीर जल तनाव)` 
        : `Critically Dry Soil (${soilMoisture}% Moisture — severe water stress)`;
      soilBadgeColor = "bg-red-500 text-white";
    } else if (soilMoisture < fc - 6) {
      soilStatusCode = "low";
      soilStatusText = language === "mr" 
        ? `कमी ओलावा (${soilMoisture}% ओलावा — सिंचनाची गरज)` 
        : language === "hi" 
        ? `कम नमी (${soilMoisture}% नमी — सिंचाई आवश्यक)` 
        : `Low Moisture (${soilMoisture}% Moisture — irrigation required)`;
      soilBadgeColor = "bg-amber-500 text-white";
    } else if (soilMoisture <= fc + 10) {
      soilStatusCode = "optimal";
      soilStatusText = language === "mr" 
        ? `योग्य व संतुलित ओलावा (${soilMoisture}% ओलावा — उत्तम स्थिती)` 
        : language === "hi" 
        ? `पर्याप्त व संतुलित नमी (${soilMoisture}% नमी — अनुकूल स्थिति)` 
        : `Adequate / Optimal Moisture (${soilMoisture}% Moisture)`;
      soilBadgeColor = "bg-emerald-500 text-white";
    } else {
      soilStatusCode = "saturated";
      soilStatusText = language === "mr" 
        ? `जास्त ओलावा / पाणी साचलेले (${soilMoisture}% ओलावा)` 
        : language === "hi" 
        ? `अत्यधिक नमी / जलभराव (${soilMoisture}% नमी)` 
        : `Saturated / Waterlogged Soil (${soilMoisture}% Moisture)`;
      soilBadgeColor = "bg-blue-600 text-white";
    }

    // 2. Decision Logic considering Soil + Rain + Crop Stage + Temperature
    // Rule A: Expected Significant Rain OR Saturated Soil -> POSTPONE / HOLD
    if ((maxRainProb >= 50 && soilMoisture >= wp + 5) || soilStatusCode === "saturated" || rainToday >= 5) {
      return {
        soilStatus: soilStatusText,
        soilStatusCode,
        soilBadgeColor,
        isIrrigationRequired: language === "mr" ? "नाही — पाणी देणे थांबवा (Hold / No)" : language === "hi" ? "नहीं — सिंचाई स्थगित रखें (Hold / No)" : "No — Postpone / Hold Irrigation",
        requiredBadge: "HOLD / NO",
        badgeColor: "bg-amber-500 text-white shadow-amber-500/30",
        cardBg: "bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900",
        icon: <CloudRain size={28} className="text-amber-200" />,
        recommendedWaterLevel: language === "mr" ? "शून्य (० मिमी / ० तास ठिबक)" : language === "hi" ? "शून्य (0 मिमी / 0 घंटा ड्रिप)" : "None (0 Liters / Acre)",
        waterQuantityLiters: "0 Liters / Acre",
        dripHours: "0 Hours",
        reason: language === "mr"
          ? `मातीतील सध्याचा ओलावा (${soilMoisture}%) पुरेशा पातळीवर आहे आणि पुढील ४८-७२ तासांत ${maxRainProb}% पावसाचा अंदाज आहे. सिंचन पुढे ढकलल्याने मुळांभोवती हवा खेळती राहील, जलभराव टळेल व वीज/पाणी वाचेल.`
          : language === "hi"
          ? `मिट्टी में वर्तमान नमी (${soilMoisture}%) पर्याप्त है एवं अगले 48-72 घंटों में ${maxRainProb}% वर्षा की संभावना है। सिंचाई रोकने से जलभराव से बचाव होगा और बिजली-पानी की बचत होगी।`
          : `Current soil moisture (${soilMoisture}%) is adequate and rainfall is forecast (${maxRainProb}% probability). Postponing irrigation prevents waterlogging, protects root respiration, and saves pumping costs.`,
        weatherForecastSummary: `${maxRainProb}% ${language === "mr" ? "पावसाची शक्यता" : language === "hi" ? "बारिश का अनुमान" : "Rain Prob"} | ${tempMaxToday}°C ${language === "mr" ? "कमाल तापमान" : language === "hi" ? "अधिकतम तापमान" : "Max Temp"} | ${current.humidity}% ${language === "mr" ? "आर्द्रता" : language === "hi" ? "आर्द्रता" : "Humidity"}`,
        cropStageSummary: `${activeCropLabel} — ${activeStageLabel}`,
        tip: language === "mr"
          ? "शेतातील अतिरिक्त पावसाचे पाणी वाहून जाण्यासाठी जलनिस्सारण चर (Drainage lines) मोकळे ठेवा."
          : language === "hi"
          ? "खेत में उचित जल निकासी की व्यवस्था बनाए रखें ताकि जड़ों में पानी न रुके।"
          : "Keep farm drainage trenches open to discharge excess runoff during the expected rainfall."
      };
    }

    // Rule B: Low Moisture + High Demand Stage (Flowering / High Evaporation) -> HEAVY / IMMEDIATE
    if (soilStatusCode === "critical" || (soilStatusCode === "low" && (activeStageObj.id === "flowering" || tempMaxToday >= 34))) {
      const approxLiters = Math.round(18000 * stageMultiplier);
      const approxHours = (2.5 * stageMultiplier).toFixed(1);

      return {
        soilStatus: soilStatusText,
        soilStatusCode,
        soilBadgeColor,
        isIrrigationRequired: language === "mr" ? "होय — त्वरित सिंचन करा (Immediate)" : language === "hi" ? "हाँ — तत्काल सिंचाई करें (Immediate)" : "Yes — Immediate Irrigation Required",
        requiredBadge: "IMMEDIATE",
        badgeColor: "bg-red-500 text-white shadow-red-500/30",
        cardBg: "bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900",
        icon: <Droplets size={28} className="text-emerald-200" />,
        recommendedWaterLevel: language === "mr" ? `भरपूर सिंचन (~${approxLiters.toLocaleString()} लिटर/एकर)` : language === "hi" ? `गहरी सिंचाई (~${approxLiters.toLocaleString()} लीटर/एकड़)` : `Deep Irrigation (~${approxLiters.toLocaleString()} L/Acre)`,
        waterQuantityLiters: `~${approxLiters.toLocaleString()} Liters / Acre (25-30 mm)`,
        dripHours: `${approxHours} Hours (Drip @ 4 LPH)`,
        reason: language === "mr"
          ? `मातीतील ओलावा (${soilMoisture}%) जलधारण क्षमतेपेक्षा खाली गेला असून ${activeCropLabel} पीक '${activeStageLabel}' या अतिसंवेदनशील अवस्थेत आहे. पाऊस नगण्य (${maxRainProb}%) असल्याने पिकाचे फुलगळ व नुकसान टाळण्यासाठी सकाळी तातडीने पाणी द्यावे.`
          : language === "hi"
          ? `मिट्टी की नमी (${soilMoisture}%) क्रांतिक स्तर से कम है और ${activeCropLabel} फसल '${activeStageLabel}' अवस्था में है। वर्षा की संभावना केवल ${maxRainProb}% है, अतः तत्काल सिंचाई आवश्यक है।`
          : `Soil moisture (${soilMoisture}%) has dropped below critical threshold while ${activeCropLabel} is in '${activeStageLabel}'. With zero rain forecast (${maxRainProb}%), immediate deep irrigation is required to avoid flower/fruit drop.`,
        weatherForecastSummary: `${maxRainProb}% ${language === "mr" ? "पावसाची शक्यता" : language === "hi" ? "बारिश का अनुमान" : "Rain Prob"} | ${tempMaxToday}°C ${language === "mr" ? "कमाल तापमान" : language === "hi" ? "अधिकतम तापमान" : "Max Temp"} | ${current.humidity}% ${language === "mr" ? "आर्द्रता" : language === "hi" ? "आर्द्रता" : "Humidity"}`,
        cropStageSummary: `${activeCropLabel} — ${activeStageLabel}`,
        tip: language === "mr"
          ? "कडक उन्हात बाष्पीभवन टाळण्यासाठी सकाळी ६ ते ९ दरम्यान ठिबक सिंचन चालवावे."
          : language === "hi"
          ? "कड़ी धूप में वाष्पीकरण से बचने के लिए सुबह 6 से 9 बजे के बीच ड्रिप चलाएं।"
          : "Run drip systems early morning (06:00 AM - 09:00 AM) to maximize deep root absorption."
      };
    }

    // Rule C: Low to Moderate Moisture -> MODERATE WATERING
    if (soilStatusCode === "low") {
      const approxLiters = Math.round(12000 * stageMultiplier);
      const approxHours = (1.8 * stageMultiplier).toFixed(1);

      return {
        soilStatus: soilStatusText,
        soilStatusCode,
        soilBadgeColor,
        isIrrigationRequired: language === "mr" ? "होय — मध्यम पाणी द्या (Moderate)" : language === "hi" ? "हाँ — मध्यम सिंचाई करें (Moderate)" : "Yes — Moderate Watering Required",
        requiredBadge: "MODERATE",
        badgeColor: "bg-emerald-500 text-white shadow-emerald-500/30",
        cardBg: "bg-gradient-to-br from-teal-600 via-emerald-700 to-teal-900",
        icon: <Droplets size={28} className="text-teal-200" />,
        recommendedWaterLevel: language === "mr" ? `मध्यम सिंचन (~${approxLiters.toLocaleString()} लिटर/एकर)` : language === "hi" ? `मध्यम सिंचाई (~${approxLiters.toLocaleString()} लीटर/एकड़)` : `Moderate (~${approxLiters.toLocaleString()} L/Acre)`,
        waterQuantityLiters: `~${approxLiters.toLocaleString()} Liters / Acre (15-20 mm)`,
        dripHours: `${approxHours} Hours (Drip @ 4 LPH)`,
        reason: language === "mr"
          ? `मातीचा ओलावा (${soilMoisture}%) मध्यम पातळीवर आहे. ${activeSoilLabel} प्रकारात पाणी टिकवण्यासाठी हलकी ते मध्यम पाळी द्यावी.`
          : language === "hi"
          ? `मिट्टी की नमी (${soilMoisture}%) मध्यम स्तर पर है। ${activeSoilLabel} में नमी संतुलन हेतु मध्यम सिंचाई करें।`
          : `Soil moisture (${soilMoisture}%) is moderate. Provide moderate supplemental irrigation suited to ${activeSoilLabel} water retention rate.`,
        weatherForecastSummary: `${maxRainProb}% ${language === "mr" ? "पावसाची शक्यता" : language === "hi" ? "बारिश का अनुमान" : "Rain Prob"} | ${tempMaxToday}°C ${language === "mr" ? "कमाल तापमान" : language === "hi" ? "अधिकतम तापमान" : "Max Temp"} | ${current.humidity}% ${language === "mr" ? "आर्द्रता" : language === "hi" ? "आर्द्रता" : "Humidity"}`,
        cropStageSummary: `${activeCropLabel} — ${activeStageLabel}`,
        tip: language === "mr"
          ? "ठिबक सिंचनाने पाणी दिल्यास मुळांपाशी समप्रमाणात ओलावा टिकून राहतो."
          : language === "hi"
          ? "ड्रिप सिंचाई से जड़ों के पास समान रूप से नमी बनी रहती है।"
          : "Drip irrigation ensures uniform root-zone hydration without wasting water."
      };
    }

    // Rule D: Optimal Moisture -> LIGHT / MAINTAIN
    const approxLiters = Math.round(6000 * stageMultiplier);
    const approxHours = (1.0 * stageMultiplier).toFixed(1);

    return {
      soilStatus: soilStatusText,
      soilStatusCode,
      soilBadgeColor,
      isIrrigationRequired: language === "mr" ? "सध्या गरज नाही / हलके पाणी (Optimal)" : language === "hi" ? "फिलहाल आवश्यकता नहीं / हल्की सिंचाई (Optimal)" : "Not Urgent / Light Maintenance Only",
      requiredBadge: "OPTIMAL",
      badgeColor: "bg-blue-500 text-white shadow-blue-500/30",
      cardBg: "bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-950",
      icon: <Waves size={28} className="text-blue-200" />,
      recommendedWaterLevel: language === "mr" ? `किमान / हलके पाणी (~${approxLiters.toLocaleString()} लिटर/एकर)` : language === "hi" ? `हल्की सिंचाई (~${approxLiters.toLocaleString()} लीटर/एकड़)` : `Light / Minimal (~${approxLiters.toLocaleString()} L/Acre)`,
      waterQuantityLiters: `~${approxLiters.toLocaleString()} Liters / Acre (8-10 mm)`,
      dripHours: `${approxHours} Hours (Drip @ 4 LPH)`,
      reason: language === "mr"
        ? `जमिनीतील ओलावा (${soilMoisture}%) पिकासाठी अनुकूल व संतुलित आहे. पुढील २४ ते ४८ तास पाणी देण्याची तातडीची आवश्यकता नाही.`
        : language === "hi"
        ? `मिट्टी में नमी (${soilMoisture}%) फसल के लिए अनुकूल है। अगले 24-48 घंटों तक तत्काल सिंचाई की आवश्यकता नहीं है।`
        : `Soil moisture (${soilMoisture}%) is in the optimal range. No urgent irrigation required for the next 24-48 hours.`,
      weatherForecastSummary: `${maxRainProb}% ${language === "mr" ? "पावसाची शक्यता" : language === "hi" ? "बारिश का अनुमान" : "Rain Prob"} | ${tempMaxToday}°C ${language === "mr" ? "कमाल तापमान" : language === "hi" ? "अधिकतम तापमान" : "Max Temp"} | ${current.humidity}% ${language === "mr" ? "आर्द्रता" : language === "hi" ? "आर्द्रता" : "Humidity"}`,
      cropStageSummary: `${activeCropLabel} — ${activeStageLabel}`,
      tip: language === "mr"
        ? "जमिनीचा वरचा २ इंचाचा थर कोरडा वाटल्यासच पुढील पाळीचे पाणी सुरू करावे."
        : language === "hi"
        ? "मिट्टी की ऊपरी 2 इंच परत सूखने पर ही अगली सिंचाई की योजना बनाएं।"
        : "Inspect upper topsoil feel before triggering the next watering cycle."
    };

  }, [weatherData, activeSoilObj, activeStageObj, activeCropLabel, activeSoilLabel, activeStageLabel, soilMoisture, language]);

  // Chart data from real forecast
  const chartData = useMemo(() => {
    if (!weatherData) return [];
    return weatherData.forecast.map(f => ({
      day: language === 'mr' ? f.dayMr : language === 'hi' ? f.dayHi : f.dayEn,
      rainProb: f.rainProb,
      tempMax: f.tempMax,
      tempMin: f.tempMin,
    }));
  }, [weatherData, language]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 font-sans transition-colors">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold mb-3 border border-blue-200 dark:border-blue-800">
              <Sparkles size={14} />
              <span>{t("irrig_tagline", "Soil & Weather-Driven Precision Irrigation")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Droplets className="text-primary-500" size={36} />
              {t("irrig_title", "Soil-Based Smart Irrigation Advisor")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-3xl text-base md:text-lg">
              {language === "mr"
                ? "मातीतील ओलावा, मातीचा प्रकार, पिकाची वाढीची अवस्था आणि थेट हवामान अंदाजानुसार अचूक सिंचन वेळापत्रक."
                : language === "hi"
                ? "मिट्टी की नमी, मिट्टी का प्रकार, फसल की विकास अवस्था एवं मौसम पूर्वानुमान पर आधारित सटीक सिंचाई प्रणाली।"
                : "Real-time irrigation recommendations calculated from soil moisture, soil texture, crop growth stage, and atmospheric demand."}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-4 py-2.5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <MapPin size={16} className="text-primary-500" />
            <span>{getLocalizedDistrict(selectedDistrict, language)}, {getLocalizedState(selectedState, language)}</span>
          </div>
        </div>

        {/* Search & Farm Selector Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 md:p-7 shadow-sm border border-gray-200 dark:border-gray-800 mb-8">
          
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <Sliders size={16} className="text-emerald-500" />
            <span>{language === "mr" ? "शेती, माती व हवामान इनपुट" : language === "hi" ? "खेत, मिट्टी व मौसम इनपुट" : "Farm, Soil & Crop Parameters"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            
            {/* State Select */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                {t("croprec_state", "State")}
              </label>
              <select 
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-sm"
              >
                {statesList.map(s => (
                  <option key={s} value={s}>
                    {getLocalizedState(s, language)}
                  </option>
                ))}
              </select>
            </div>

            {/* District Select */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                {t("croprec_district", "District")}
              </label>
              <select 
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-sm"
              >
                {districtsList.map(d => (
                  <option key={d} value={d}>
                    {getLocalizedDistrict(d, language)}
                  </option>
                ))}
              </select>
            </div>

            {/* Crop Select */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                {t("irrig_select_crop", "Select Crop")}
              </label>
              <select 
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-sm"
              >
                {CROPS_LIST.map(c => (
                  <option key={c.id} value={c.id}>
                    {language === 'mr' ? c.mr : language === 'hi' ? c.hi : c.en}
                  </option>
                ))}
              </select>
            </div>

            {/* Growth Stage Select */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                {language === "mr" ? "पिकाची अवस्था (Growth Stage)" : language === "hi" ? "फसल की अवस्था (Growth Stage)" : "Crop Growth Stage"}
              </label>
              <select 
                value={selectedGrowthStage}
                onChange={(e) => setSelectedGrowthStage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-sm"
              >
                {GROWTH_STAGES.map(g => (
                  <option key={g.id} value={g.id}>
                    {language === 'mr' ? g.mr : language === 'hi' ? g.hi : g.en}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Row 2: Soil Type & Interactive Soil Moisture (Field / Demo Input) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            
            {/* Soil Type */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                {language === "mr" ? "मातीचा प्रकार (Soil Type)" : language === "hi" ? "मिट्टी का प्रकार (Soil Type)" : "Soil Type"}
              </label>
              <select 
                value={selectedSoilType}
                onChange={(e) => setSelectedSoilType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-sm"
              >
                {SOIL_TYPES.map(s => (
                  <option key={s.id} value={s.id}>
                    {language === 'mr' ? s.mr : language === 'hi' ? s.hi : s.en}
                  </option>
                ))}
              </select>
            </div>

            {/* Soil Moisture Slider / Simulated Mechanism */}
            <div className="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Gauge size={15} className="text-emerald-500" />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                    {language === "mr" ? "मातीतील ओलावा (Field Reading / Demo)" : language === "hi" ? "मिट्टी की नमी (Field Reading / Demo)" : "Soil Moisture (Field Reading / Demo)"}
                  </span>
                </div>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-800">
                  {soilMoisture}%
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="5"
                max="95"
                step="1"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600 mb-2"
              />

              {/* Quick Preset Buttons */}
              <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500">
                <button
                  type="button"
                  onClick={() => setSoilMoisture(16)}
                  className={`px-2 py-0.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${soilMoisture <= 20 ? 'text-red-600 font-bold' : ''}`}
                >
                  Dry (16%)
                </button>
                <button
                  type="button"
                  onClick={() => setSoilMoisture(28)}
                  className={`px-2 py-0.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${soilMoisture > 20 && soilMoisture <= 35 ? 'text-amber-600 font-bold' : ''}`}
                >
                  Low (28%)
                </button>
                <button
                  type="button"
                  onClick={() => setSoilMoisture(52)}
                  className={`px-2 py-0.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${soilMoisture > 35 && soilMoisture <= 65 ? 'text-emerald-600 font-bold' : ''}`}
                >
                  Optimal (52%)
                </button>
                <button
                  type="button"
                  onClick={() => setSoilMoisture(82)}
                  className={`px-2 py-0.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${soilMoisture > 65 ? 'text-blue-600 font-bold' : ''}`}
                >
                  Wet (82%)
                </button>
              </div>
            </div>

          </div>

          <div className="mt-3 text-[11px] text-gray-400 flex items-center gap-1">
            <ShieldCheck size={13} className="text-emerald-500 flex-shrink-0" />
            <span>
              {language === "mr" 
                ? "टीप: सेन्सर नसताना शेतातील प्रत्यक्ष निरीक्षणानुसार ओलावा स्लाइडर समायोजित करा." 
                : language === "hi" 
                ? "नोट: सेंसर अनुपलब्ध होने पर खेत के प्रत्यक्ष अवलोकन अनुसार नमी स्लाइडर सेट करें।" 
                : "Note: Adjust slider to match physical field soil inspection or demo readings."}
            </span>
          </div>

        </div>

        {/* Loading / Error States */}
        {isLoading ? (
          <div className="py-24 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
            <Loader2 size={40} className="animate-spin text-primary-500 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-300 font-medium">{t("irrig_fetching", "Fetching live agrometeorological data...")}</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center bg-white dark:bg-gray-900 rounded-3xl border border-red-200 dark:border-red-900/50 p-6">
            <ShieldAlert size={40} className="text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t("irrig_error_title", "Weather Connection Error")}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
            <button 
              onClick={loadWeatherData}
              className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-colors"
            >
              {t("irrig_retry", "Retry")}
            </button>
          </div>
        ) : weatherData && irrigationAnalysis ? (
          <>
            {/* Top 4 Meteorological & Soil Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              {/* 1. Soil Moisture Status */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {language === "mr" ? "मातीतील ओलावा" : language === "hi" ? "मिट्टी की नमी" : "Soil Moisture"}
                  </span>
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <Gauge size={20} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-gray-900 dark:text-white">
                    {soilMoisture}%
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">{activeSoilObj.en.split(" ")[0]}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium truncate">
                  {irrigationAnalysis.soilStatus.split("(")[0]}
                </p>
              </motion.div>

              {/* 2. Rain Forecast 48h */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t("irrig_rain_forecast", "Rainfall (48h - 72h)")}</span>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                    <CloudRain size={20} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-gray-900 dark:text-white">
                    {Math.max(...weatherData.forecast.slice(0, 3).map(f => f.rainProb), 0)}%
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">{t("irrig_max_prob", "Max Prob")}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  {weatherData.current.precipitation > 0 
                    ? `${weatherData.current.precipitation} mm rain recorded today` 
                    : t("irrig_no_active_rain", "No active rain recorded today")}
                </p>
              </motion.div>

              {/* 3. Ambient Temperature */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t("irrig_ambient_temp", "Current Temp")}</span>
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
                    <Thermometer size={20} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-gray-900 dark:text-white">
                    {weatherData.current.temp}°C
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">
                    ({t("irrig_max_temp_label", "Max")}: {weatherData.forecast[0]?.tempMax}°C)
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  {language === 'mr' ? weatherData.current.weatherCondition.mr : language === 'hi' ? weatherData.current.weatherCondition.hi : weatherData.current.weatherCondition.en}
                </p>
              </motion.div>

              {/* 4. Relative Humidity */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t("irrig_humidity", "Air Humidity")}</span>
                  <div className="p-2 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl">
                    <Droplets size={20} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-gray-900 dark:text-white">
                    {weatherData.current.humidity}%
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">{t("irrig_atmospheric_label", "Atmospheric")}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  {weatherData.current.humidity < 40 
                    ? (language === 'mr' ? "कमी आर्द्रता — तीव्र बाष्पीभवन" : language === 'hi' ? "कम आर्द्रता — तीव्र वाष्पीकरण" : "High evaporation rate") 
                    : (language === 'mr' ? "मध्यम ते योग्य आर्द्रता" : language === 'hi' ? "संतुलित आर्द्रता" : "Optimal atmospheric moisture")}
                </p>
              </motion.div>

            </div>

            {/* MAIN 2-COLUMN SECTION: Soil Decision Card + 7-Day Rainfall Outlook */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
              
              {/* PRIMARY FARMER-FRIENDLY SOIL-BASED DECISION CARD (6 Columns) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className={`lg:col-span-6 rounded-3xl p-6 sm:p-8 shadow-xl text-white flex flex-col justify-between ${irrigationAnalysis.cardBg}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider border border-white/20">
                      <Sparkles size={14} />
                      <span>{language === "mr" ? "माती व हवामान आधारित निर्णय" : language === "hi" ? "मिट्टी व मौसम आधारित निर्णय" : "Soil-Based Irrigation Decision"}</span>
                    </div>
                    {irrigationAnalysis.icon}
                  </div>

                  {/* Clean Structured Farmer-Friendly Card */}
                  <div className="space-y-4 mb-6">
                    
                    {/* 1. Soil Status */}
                    <div className="bg-black/20 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
                      <div className="text-[11px] font-bold text-white/75 uppercase tracking-wider">
                        {language === "mr" ? "मातीची स्थिती (Soil Status):" : language === "hi" ? "मिट्टी की स्थिति (Soil Status):" : "Soil Status:"}
                      </div>
                      <div className="text-base font-black text-white mt-0.5 flex items-center gap-2">
                        <span>{irrigationAnalysis.soilStatus}</span>
                      </div>
                    </div>

                    {/* 2. Irrigation Required */}
                    <div className="bg-black/20 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
                      <div className="text-[11px] font-bold text-white/75 uppercase tracking-wider">
                        {language === "mr" ? "सिंचनाची गरज (Irrigation Required):" : language === "hi" ? "सिंचाई की आवश्यकता (Irrigation Required):" : "Irrigation Required:"}
                      </div>
                      <div className="text-lg font-black text-white mt-0.5">
                        {irrigationAnalysis.isIrrigationRequired}
                      </div>
                    </div>

                    {/* 3. Recommended Water Level & Duration */}
                    <div className="bg-black/20 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
                      <div className="text-[11px] font-bold text-white/75 uppercase tracking-wider">
                        {language === "mr" ? "शिफारस केलेले पाण्याचे प्रमाण (Recommended Water Level):" : language === "hi" ? "अनुशंसित जल स्तर (Recommended Water Level):" : "Recommended Water Level:"}
                      </div>
                      <div className="text-base font-black text-white mt-0.5">
                        {irrigationAnalysis.recommendedWaterLevel}
                      </div>
                      <div className="text-xs text-white/80 font-medium mt-1">
                        {irrigationAnalysis.dripHours} | {irrigationAnalysis.waterQuantityLiters}
                      </div>
                    </div>

                    {/* 4. Reason for Recommendation */}
                    <div className="bg-black/20 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
                      <div className="text-[11px] font-bold text-white/75 uppercase tracking-wider">
                        {language === "mr" ? "सल्ल्याचे कारण (Reason):" : language === "hi" ? "परामर्श का कारण (Reason):" : "Reason:"}
                      </div>
                      <p className="text-xs sm:text-sm text-white/95 leading-relaxed mt-1 font-medium">
                        {irrigationAnalysis.reason}
                      </p>
                    </div>

                    {/* 5. Weather/Rain Forecast & Crop & Growth Stage */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-black/20 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                        <div className="text-[10px] font-bold text-white/75 uppercase">
                          {language === "mr" ? "हवामान / पाऊस अंदाज:" : language === "hi" ? "मौसम / बारिश पूर्वानुमान:" : "Weather/Rain Forecast:"}
                        </div>
                        <div className="text-xs font-bold text-white mt-0.5">
                          {irrigationAnalysis.weatherForecastSummary}
                        </div>
                      </div>
                      <div className="bg-black/20 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                        <div className="text-[10px] font-bold text-white/75 uppercase">
                          {language === "mr" ? "पीक व वाढीची अवस्था:" : language === "hi" ? "फसल व विकास अवस्था:" : "Crop & Growth Stage:"}
                        </div>
                        <div className="text-xs font-bold text-white mt-0.5">
                          {irrigationAnalysis.cropStageSummary}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <div className="text-xs font-bold uppercase text-white/75 mb-1 flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-emerald-300" />
                    <span>{t("irrig_water_saving_tip", "Water Conservation & Soil Tip")}</span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {irrigationAnalysis.tip}
                  </p>
                </div>
              </motion.div>

              {/* 7-Day Rainfall & Numerical Weather Chart (6 Columns) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="lg:col-span-6 bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                        <CloudRain className="text-primary-500" size={20} />
                        <span>{t("irrig_chart_title", "7-Day Weather & Rain Probability Outlook")}</span>
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t("irrig_chart_sub", "High-Resolution Agrometeorological Forecast from Open-Meteo")}
                      </p>
                    </div>
                  </div>

                  <div className="h-60 w-full mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRainProb" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '8px 12px' }}
                          formatter={(val: any, name: any) => {
                            if (name === "rainProb") return [`${val}%`, t("irrig_rain_prob_label", "Rain Probability")];
                            return [`${val}°C`, name === 'tempMax' ? t("irrig_max_temp_label", "Max") : t("irrig_min_temp_label", "Min")];
                          }}
                        />
                        <Area type="monotone" dataKey="rainProb" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRainProb)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
                  {weatherData.forecast.slice(0, 7).map((f, i) => (
                    <div key={i} className="p-1.5 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                      <div className="text-[11px] font-bold text-gray-600 dark:text-gray-300 truncate">
                        {language === 'mr' ? f.dayMr : language === 'hi' ? f.dayHi : f.dayEn}
                      </div>
                      <div className="text-[11px] font-black text-blue-600 dark:text-blue-400 mt-0.5">
                        {f.rainProb}%
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {f.tempMax}° / {f.tempMin}°
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </>
        ) : null}

      </main>

      {/* Floating AI Assistant Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
              style={{ height: '500px' }}
            >
              <div className="bg-primary-600 text-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bot size={20} />
                  <span className="font-bold">
                    {t("irrig_chat_bot_title", "Irrigation Advisor Bot")}
                  </span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-primary-100 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              {/* Chat Body */}
              <div className="flex-grow p-4 bg-gray-50 dark:bg-gray-950 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary-600' : 'bg-primary-100 dark:bg-primary-900/50'}`}>
                      {msg.role === 'user' ? <span className="text-white text-xs">{t("market_chat_me", "Me")}</span> : <Bot size={16} className="text-primary-600 dark:text-primary-400" />}
                    </div>
                    <div className={`border p-3 rounded-2xl text-sm shadow-sm max-w-[85%] ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none border-primary-600' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-tl-none'}`}>
                      <FormattedChatMessage content={msg.text} isUser={msg.role === 'user'} />
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
                <div ref={chatScrollRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if(chatInput.trim() && !isChatLoading) {
                      sendMessage(chatInput);
                      setChatInput("");
                    }
                  }} 
                  className="flex gap-2"
                >
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={t("irrig_chat_placeholder", "Ask: How many hours to irrigate Cotton?")}
                    className="flex-grow px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 caret-primary-600 dark:caret-primary-400 text-sm focus:outline-none focus:border-primary-500" 
                  />
                  <button type="submit" disabled={isChatLoading || !chatInput.trim()} className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white p-2 rounded-xl transition-colors flex-shrink-0">
                    <ArrowRight size={20} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30 hover:scale-105 transition-transform"
        >
          {isChatOpen ? <X size={24} /> : <Bot size={28} />}
        </button>
      </div>

    </div>
  );
}
