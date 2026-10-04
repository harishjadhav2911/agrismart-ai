"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { 
  Sprout, Beaker, MapPin, Search, ArrowRight, AlertCircle, 
  BookOpen, CheckCircle2, Info, Layers, ShieldCheck, 
  Droplets, HelpCircle, FileText, ChevronRight
} from "lucide-react";
import { 
  INDIAN_STATES, 
  STATE_DISTRICTS, 
  getLocalizedState, 
  getLocalizedDistrict 
} from "@/data/indiaLocations";

interface EvaluatedFactors {
  mode: "simple" | "advanced";
  state: string;
  district: string;
  season: string;
  soilType: string;
  irrigation: string;
  landSizeAcres?: number;
  previousCrop?: string;
  nitrogen?: { value: number; status: "Low" | "Medium" | "High" };
  phosphorous?: { value: number; status: "Low" | "Medium" | "High" };
  potassium?: { value: number; status: "Low" | "Medium" | "High" };
  ph?: { value: number; status: "Acidic" | "Optimal" | "Alkaline" };
  rainfallMm?: number;
}

interface CropRecommendationResult {
  crop: string;
  marathiName: string;
  hindiName: string;
  suitabilityStatus: "Highly Suitable" | "Conditionally Suitable";
  suitabilityReason: string;
  evaluatedFactors: EvaluatedFactors;
  expectedYield: {
    range: string;
    condition: string;
  };
  fertilizerPlan: {
    rdfStandard: string;
    soilAdjustment: string;
  };
  mspBenchmark: {
    price: string;
    notificationYear: string;
    authority: string;
    isMspCovered: boolean;
  };
  sourceReferences: {
    institution: string;
    document: string;
  }[];
  warnings?: string[];
}

export default function CropRecommendationPage() {
  const { t, language } = useLanguage();
  const router = useRouter();

  // Mode Selection: "simple" (Default for farmers) or "advanced" (Soil Test)
  const [activeMode, setActiveMode] = useState<"simple" | "advanced">("simple");

  // Simple Mode State
  const [simpleData, setSimpleData] = useState({
    state: "Maharashtra",
    district: "Yavatmal",
    season: "Kharif",
    soilType: "Deep Black / Vertisol",
    irrigation: "Assured Drip / Sprinkler",
    landSizeAcres: "5",
    previousCrop: "Soybean",
    hasSoilCard: false,
    optionalN: "",
    optionalP: "",
    optionalK: "",
    optionalPh: "",
  });

  // Advanced Mode State
  const [advancedData, setAdvancedData] = useState({
    state: "Maharashtra",
    district: "Yavatmal",
    season: "Kharif",
    nitrogen: "90",
    phosphorous: "42",
    potassium: "43",
    ph: "7.2",
    rainfall: "650",
    soilType: "Deep Black / Vertisol (Well-drained)",
    irrigation: "Assured Drip / Sprinkler",
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CropRecommendationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle State change and reset District
  const handleStateChange = (newState: string, isSimple: boolean) => {
    const defaultDistrict = STATE_DISTRICTS[newState]?.[0] || "";
    if (isSimple) {
      setSimpleData({ ...simpleData, state: newState, district: defaultDistrict });
    } else {
      setAdvancedData({ ...advancedData, state: newState, district: defaultDistrict });
    }
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setResult(null);
    setErrorMessage(null);

    const isSimple = activeMode === "simple";
    const state = isSimple ? simpleData.state : advancedData.state;
    const district = isSimple ? simpleData.district : advancedData.district;
    const season = isSimple ? simpleData.season : advancedData.season;
    const soilType = isSimple ? simpleData.soilType : advancedData.soilType;
    const irrigation = isSimple ? simpleData.irrigation : advancedData.irrigation;

    if (!state || !district) {
      setIsAnalyzing(false);
      setErrorMessage(t("croprec_error_district", "Please select a district for the chosen state."));
      return;
    }

    if (!isSimple) {
      const n = parseFloat(advancedData.nitrogen);
      const p = parseFloat(advancedData.phosphorous);
      const k = parseFloat(advancedData.potassium);
      const ph = parseFloat(advancedData.ph);
      const rainfall = parseFloat(advancedData.rainfall);

      if (isNaN(n) || isNaN(p) || isNaN(k) || isNaN(ph) || isNaN(rainfall)) {
        setIsAnalyzing(false);
        setErrorMessage("Insufficient data. Please enter valid numeric values for Nitrogen, Phosphorus, Potassium, Soil pH, and Rainfall.");
        return;
      }

      if (ph < 4.5 || ph > 9.0) {
        setIsAnalyzing(false);
        setErrorMessage(`Soil pH (${ph}) is outside the normal agricultural threshold (4.5 - 9.0). Severe acidic or alkaline soils require soil reclamation (Agricultural Lime / Gypsum) before commercial cropping.`);
        return;
      }
    }

    // Process Evaluation
    setTimeout(() => {
      setIsAnalyzing(false);

      const locDistrict = getLocalizedDistrict(district, language);
      const locState = getLocalizedState(state, language);

      if (isSimple) {
        // --- SIMPLE FARMER MODE EVALUATION ---
        const landSize = parseFloat(simpleData.landSizeAcres) || 1;
        const prevCrop = simpleData.previousCrop;
        const isDrip = simpleData.irrigation.includes("Drip");
        const isRainfed = simpleData.irrigation.includes("Rainfed");
        const isClay = simpleData.soilType.includes("Clay");

        const evaluatedFactors: EvaluatedFactors = {
          mode: "simple",
          state,
          district,
          season,
          soilType,
          irrigation,
          landSizeAcres: landSize,
          previousCrop: prevCrop,
        };

        // Decision Tree based on Agro-Climatic Zones & Seasons
        if (season === "Rabi") {
          const isWheatSuited = !isRainfed && !isClay;
          const reason = language === "mr" 
            ? `${locDistrict} (${locState}) मधील रब्बी हंगामासाठी ${prevCrop} पिकाच्या फेरपालटानंतर गहू हे उत्कृष्ट तृणधान्य पीक आहे. मुकुटमुळे फुटण्याच्या वेळी (२१ व्या दिवशी) पाणी देणे अत्यंत गरजेचे आहे.`
            : language === "hi"
            ? `${locDistrict} (${locState}) में रबी मौसम के लिए ${prevCrop} फसल के चक्र के बाद गेहूं सर्वाधिक लाभकारी फसल है। सीआरआई अवस्था (२१ दिन) पर सिंचाई अत्यंत आवश्यक है।`
            : `For ${district} (${state}) in the Rabi winter season, Wheat is the premier cereal crop following ${prevCrop}. Requires 4-6 timely irrigations with focus on Crown Root Initiation (21 DAS).`;

          setResult({
            crop: "Wheat",
            marathiName: "गहू",
            hindiName: "गेहूं",
            suitabilityStatus: isWheatSuited ? "Highly Suitable" : "Conditionally Suitable",
            suitabilityReason: reason,
            evaluatedFactors,
            expectedYield: {
              range: isRainfed ? "20 - 30 Qtl / Hectare (8 - 12 Qtl / Acre)" : "45 - 55 Qtl / Hectare (18 - 22 Qtl / Acre)",
              condition: isRainfed ? "Rainfed / Moisture Constrained" : "Timely Sown with Irrigations"
            },
            fertilizerPlan: {
              rdfStandard: "120 kg N : 60 kg P2O5 : 40 kg K2O / ha (ICAR-IIWBR Standard)",
              soilAdjustment: "Apply 50 kg DAP + 25 kg MOP + 10 kg Zinc Sulphate basal per acre; top dress Urea in 2 equal splits at 21 and 45 days."
            },
            mspBenchmark: {
              price: "₹2,275 / quintal (RMS 2024-25) | ₹2,425 / quintal (RMS 2025-26)",
              notificationYear: "Rabi Marketing Season (RMS) 2024-25 / 2025-26",
              authority: "Commission for Agricultural Costs and Prices (CACP), Govt. of India",
              isMspCovered: true
            },
            sourceReferences: [
              { institution: "ICAR - Indian Institute of Wheat and Barley Research (IIWBR), Karnal", document: "Wheat Production Technology in India" },
              { institution: "CACP, Ministry of Agriculture & Farmers Welfare", document: "Price Policy for Rabi Crops" }
            ],
            warnings: isRainfed ? ["Wheat produces significantly lower yields without irrigation at the Crown Root Initiation (CRI) stage."] : undefined
          });
          return;
        }

        if (season === "Kharif") {
          // Crop Rotation check: If previous crop was Cotton/Soybean, rotate or match soil
          if (prevCrop === "Wheat" || prevCrop === "Gram / Tur / Pulses" || soilType.includes("Black")) {
            // Cotton or Soybean
            if (isDrip || (!isRainfed && !isClay)) {
              const reason = language === "mr"
                ? `${locDistrict} (${locState}) मधील काळ्या कसदार जमिनीत खरीप हंगामात बीटी कापूस वाण जास्त उत्पादन देतो. ${prevCrop} नंतर कापूस लागवडीने जमिनीची सुपीकता टिकून राहते.`
                : language === "hi"
                ? `${locDistrict} (${locState}) की उपजाऊ काली मिट्टी में खरीफ मौसम के दौरान संकर बीटी कपास सर्वाधिक उपयुक्त है। ${prevCrop} के बाद कपास की बुवाई मिट्टी की संरचना बनाए रखती है।`
                : `Deep black soil in ${district} (${state}) during Kharif is ideal for high-yielding Bt Cotton hybrids. Rotating after ${prevCrop} restores soil structure.`;

              setResult({
                crop: "Cotton",
                marathiName: "कापूस (कपाशी)",
                hindiName: "कपास",
                suitabilityStatus: "Highly Suitable",
                suitabilityReason: reason,
                evaluatedFactors,
                expectedYield: {
                  range: isRainfed ? "12 - 18 Qtl / Hectare (5 - 7.5 Qtl / Acre)" : "22 - 32 Qtl / Hectare (9 - 13 Qtl / Acre)",
                  condition: isRainfed ? "Rainfed Vertisols" : "Irrigated / Drip Cultivation"
                },
                fertilizerPlan: {
                  rdfStandard: "120 kg N : 60 kg P2O5 : 60 kg K2O / ha (ICAR-CICR Standard)",
                  soilAdjustment: "Basal 10:26:26 (50 kg/acre) + Zinc Sulphate (10 kg) + Magnesium Sulphate (10 kg); Urea split at 35 and 65 DAS."
                },
                mspBenchmark: {
                  price: "₹7,121 / quintal (Medium Staple) | ₹7,521 / quintal (Long Staple)",
                  notificationYear: "Kharif Marketing Season (KMS) 2024-25",
                  authority: "Commission for Agricultural Costs and Prices (CACP), Govt. of India",
                  isMspCovered: true
                },
                sourceReferences: [
                  { institution: "ICAR - Central Institute for Cotton Research (CICR), Nagpur", document: "Bt Cotton Package of Practices" },
                  { institution: "CACP, Ministry of Agriculture & Farmers Welfare", document: "Price Policy for Kharif Crops: KMS 2024-25" }
                ]
              });
              return;
            } else {
              const reason = language === "mr"
                ? `${locDistrict} मध्ये खरीप हंगामात सोयाबीन पीक कमी कालावधीत उत्तम नफा देते व पुढील रब्बी पिकासाठी जमिनीतील नत्र वाढवते.`
                : language === "hi"
                ? `${locDistrict} में खरीफ मौसम में सोयाबीन कम समय में बेहतर मुनाफा देती है और अगली रबी फसल के लिए मिट्टी में नाइट्रोजन बढ़ाती है।`
                : `For ${district} in Kharif with ${soilType}, Soybean is a premier short-duration oilseed that enriches soil nitrogen for subsequent Rabi crops.`;

              setResult({
                crop: "Soybean",
                marathiName: "सोयाबीन",
                hindiName: "सोयाबीन",
                suitabilityStatus: "Highly Suitable",
                suitabilityReason: reason,
                evaluatedFactors,
                expectedYield: {
                  range: "18 - 25 Quintals / Hectare (7 - 10 Qtl / Acre)",
                  condition: "Broad Bed Furrow (BBF) Layout"
                },
                fertilizerPlan: {
                  rdfStandard: "20-30 kg N : 60 kg P2O5 : 40 kg K2O : 20 kg S / ha (ICAR-IISR Indore)",
                  soilAdjustment: "Apply Single Super Phosphate (SSP @ 150 kg/acre) + MOP @ 25 kg/acre + Urea @ 15 kg/acre basal with Rhizobium seed inoculation."
                },
                mspBenchmark: {
                  price: "₹4,892 / quintal (Yellow Soybean)",
                  notificationYear: "Kharif Marketing Season (KMS) 2024-25",
                  authority: "CACP, Govt. of India",
                  isMspCovered: true
                },
                sourceReferences: [
                  { institution: "ICAR - Indian Institute of Soybean Research (IISR), Indore", document: "Soybean Production Technology Manual" }
                ]
              });
              return;
            }
          } else {
            // General Kharif
            const reason = language === "mr"
              ? `${locDistrict} (${locState}) मध्ये खरीप हंगामात सोयाबीन पीक हवेतील नत्र जमिनीत स्थिर करते आणि कमी खर्चात चांगले उत्पन्न देते.`
              : language === "hi"
              ? `${locDistrict} (${locState}) में खरीफ में सोयाबीन वायुमंडलीय नाइट्रोजन को मिट्टी में स्थिर करता है और कम लागत में अच्छा उत्पादन देता है।`
              : `For ${district} (${state}) in Kharif, Soybean fixes atmospheric nitrogen, offering strong market demand and low initial investment.`;

            setResult({
              crop: "Soybean",
              marathiName: "सोयाबीन",
              hindiName: "सोयाबीन",
              suitabilityStatus: "Highly Suitable",
              suitabilityReason: reason,
              evaluatedFactors,
              expectedYield: {
                range: "18 - 25 Quintals / Hectare (7 - 10 Qtl / Acre)",
                condition: "BBF Sowing with Seed Treatment"
              },
              fertilizerPlan: {
                rdfStandard: "20-30 kg N : 60 kg P2O5 : 40 kg K2O : 20 kg S / ha",
                soilAdjustment: "Basal SSP (150 kg/acre) + MOP (25 kg/acre) + Urea (15 kg/acre) with Bradyrhizobium inoculation."
              },
              mspBenchmark: {
                price: "₹4,892 / quintal (Yellow Soybean)",
                notificationYear: "Kharif Marketing Season (KMS) 2024-25",
                authority: "CACP, Govt. of India",
                isMspCovered: true
              },
              sourceReferences: [
                { institution: "ICAR - Indian Institute of Soybean Research (IISR), Indore", document: "Technical Advisory for Soybean" }
              ]
            });
            return;
          }
        }

        // Summer / All Year
        if (season === "Zaid" || season === "All Year") {
          if (isDrip) {
            const reason = language === "mr"
              ? `${locDistrict} मध्ये ठिबक सिंचन व मल्चिंग पेपरच्या साहाय्याने संकरित टोमॅटोची लागवड अधिक फायदेशीर ठरते.`
              : language === "hi"
              ? `${locDistrict} में ड्रिप सिंचाई और मल्चिंग के साथ संकर टमाटर की खेती अत्यधिक लाभकारी सिद्ध होती है।`
              : `With assured drip irrigation in ${district}, commercial hybrid Tomato cultivation with silver-black mulch sheet and trellising yields premium returns.`;

            setResult({
              crop: "Tomato",
              marathiName: "टोमॅटो",
              hindiName: "टमाटर",
              suitabilityStatus: "Highly Suitable",
              suitabilityReason: reason,
              evaluatedFactors,
              expectedYield: {
                range: "50 - 80 Tonnes / Hectare (20 - 32 Tonnes / Acre)",
                condition: "Staked F1 Hybrids with Drip & Mulch"
              },
              fertilizerPlan: {
                rdfStandard: "150-200 kg N : 100-120 kg P2O5 : 120-150 kg K2O / ha (ICAR-IIHR)",
                soilAdjustment: "Basal DAP + MOP; weekly fertigation with 19:19:19, 0:52:34, 13:0:45 + Calcium Nitrate & Boron."
              },
              mspBenchmark: {
                price: "No Statutory MSP (Perishable Produce)",
                notificationYear: "Market Driven (Indicative Mandi: ₹1,200 - ₹3,500 / qtl)",
                authority: "AGMARKNET / DMI",
                isMspCovered: false
              },
              sourceReferences: [
                { institution: "ICAR - Indian Institute of Horticultural Research (IIHR), Bengaluru", document: "Tomato Production Technology" }
              ]
            });
            return;
          } else {
            const reason = language === "mr"
              ? `${locDistrict} मध्ये मका हे कमी कालावधीत वेगाने वाढणारे आणि चारा व दाण्यांसाठी उत्तम उत्पन्न देणारे पीक आहे.`
              : language === "hi"
              ? `${locDistrict} में मक्का तेजी से बढ़ने वाली और चारा व अनाज के लिए उच्च उत्पादन देने वाली फसल है।`
              : `In ${district}, Maize is a fast-growing, high-yield cereal crop for fodder and feed markets.`;

            setResult({
              crop: "Maize / Corn",
              marathiName: "मका",
              hindiName: "मक्का",
              suitabilityStatus: "Highly Suitable",
              suitabilityReason: reason,
              evaluatedFactors,
              expectedYield: {
                range: "50 - 70 Quintals / Hectare (20 - 28 Qtl / Acre)",
                condition: "Irrigated Hybrid Maize"
              },
              fertilizerPlan: {
                rdfStandard: "120-150 kg N : 60 kg P2O5 : 40-60 kg K2O / ha (ICAR-IIMR)",
                soilAdjustment: "Basal DAP (50 kg) + MOP (30 kg) + Zinc Sulphate (10 kg); Urea split at 25 and 45 DAS."
              },
              mspBenchmark: {
                price: "₹2,225 / quintal (Kharif Maize)",
                notificationYear: "Kharif Marketing Season (KMS) 2024-25",
                authority: "CACP, Govt. of India",
                isMspCovered: true
              },
              sourceReferences: [
                { institution: "ICAR - Indian Institute of Maize Research (IIMR), Ludhiana", document: "Maize Cultivation Guide" }
              ]
            });
            return;
          }
        }
      } else {
        // --- ADVANCED SOIL TEST MODE EVALUATION ---
        const n = parseFloat(advancedData.nitrogen);
        const p = parseFloat(advancedData.phosphorous);
        const k = parseFloat(advancedData.potassium);
        const ph = parseFloat(advancedData.ph);
        const rainfall = parseFloat(advancedData.rainfall);

        const nStatus: "Low" | "Medium" | "High" = n < 50 ? "Low" : n > 120 ? "High" : "Medium";
        const pStatus: "Low" | "Medium" | "High" = p < 20 ? "Low" : p > 55 ? "High" : "Medium";
        const kStatus: "Low" | "Medium" | "High" = k < 30 ? "Low" : k > 70 ? "High" : "Medium";
        const phStatus: "Acidic" | "Optimal" | "Alkaline" = ph < 6.0 ? "Acidic" : ph > 7.8 ? "Alkaline" : "Optimal";

        const evaluatedFactors: EvaluatedFactors = {
          mode: "advanced",
          state,
          district,
          season,
          soilType,
          irrigation,
          nitrogen: { value: n, status: nStatus },
          phosphorous: { value: p, status: pStatus },
          potassium: { value: k, status: kStatus },
          ph: { value: ph, status: phStatus },
          rainfallMm: rainfall,
        };

        const isRainfedOnly = irrigation === "Rainfed Only (Monsoon Dependent)";
        const isWaterloggingProne = soilType.includes("Poor Drainage") || soilType.includes("Heavy Clay");

        if (season === "Rabi") {
          const isHighlySuitable = ph >= 6.0 && ph <= 7.8 && !isRainfedOnly && !isWaterloggingProne;
          const nDose = nStatus === "Low" ? "+20% N (approx. 55 kg Urea/acre)" : nStatus === "High" ? "-20% N basal" : "Standard RDF (120:60:40 kg/ha)";
          const reason = language === "mr"
            ? `${locDistrict} मधील रब्बी हंगामात जमिनीचा सामू (${ph}) आणि पोषण निर्देशांक गहू पिकासाठी अनुकूल आहे.`
            : language === "hi"
            ? `${locDistrict} में रबी मौसम में मिट्टी का पीएच (${ph}) और पोषक तत्व गेहूं की खेती के सर्वथा अनुकूल हैं।`
            : `For ${district} in Rabi, soil pH (${ph}) and nutrient index match Wheat requirements. Irrigation is critical at CRI stage (21 DAS).`;

          setResult({
            crop: "Wheat",
            marathiName: "गहू",
            hindiName: "गेहूं",
            suitabilityStatus: isHighlySuitable ? "Highly Suitable" : "Conditionally Suitable",
            suitabilityReason: reason,
            evaluatedFactors,
            expectedYield: {
              range: isRainfedOnly ? "20 - 30 Qtl / Hectare (8 - 12 Qtl / Acre)" : "45 - 55 Qtl / Hectare (18 - 22 Qtl / Acre)",
              condition: isRainfedOnly ? "Rainfed / Moisture Constrained" : "Timely Sown with 4-6 Irrigations"
            },
            fertilizerPlan: {
              rdfStandard: "120 kg N : 60 kg P2O5 : 40 kg K2O / ha (ICAR-IIWBR Standard)",
              soilAdjustment: `${nDose}; ${pStatus === 'Low' ? 'Apply Single Super Phosphate (SSP @ 150 kg/acre) basal' : 'DAP @ 50 kg/acre basal'}; Zinc Sulphate @ 10 kg/acre once in 2 years.`
            },
            mspBenchmark: {
              price: "₹2,275 / quintal (RMS 2024-25) | ₹2,425 / quintal (RMS 2025-26)",
              notificationYear: "Rabi Marketing Season (RMS) 2024-25 / 2025-26",
              authority: "Commission for Agricultural Costs and Prices (CACP), Ministry of Agriculture & Farmers Welfare",
              isMspCovered: true
            },
            sourceReferences: [
              { institution: "ICAR - Indian Institute of Wheat and Barley Research (IIWBR), Karnal", document: "Wheat Production Technology in India" },
              { institution: "CACP, Ministry of Agriculture & Farmers Welfare, Govt. of India", document: "Price Policy for Rabi Crops: RMS 2024-25 & RMS 2025-26" }
            ],
            warnings: isRainfedOnly ? ["Wheat requires irrigation at CRI (21 DAS) and Flowering (65 DAS) to avoid up to 40% yield drop."] : undefined
          });
          return;
        }

        if (rainfall >= 400 || (season === "All Year" && n >= 70 && !isRainfedOnly)) {
          const isHighlySuitable = ph >= 6.5 && ph <= 8.0 && !isRainfedOnly && !isWaterloggingProne;
          const reason = language === "mr"
            ? `${locDistrict} मधील भरपूर ओलावा (${rainfall} मिमी) आणि कसदार जमीन ऊस पिकाच्या उच्च टनेज उत्पादनासाठी योग्य आहे.`
            : language === "hi"
            ? `${locDistrict} में पर्याप्त नमी (${rainfall} मिमी) और उपजाऊ मिट्टी गन्ने के भारी उत्पादन के लिए उपयुक्त है।`
            : `Abundant moisture (${rainfall} mm) and fertile soil in ${district} support heavy tonnage Sugarcane with paired-row drip fertigation.`;

          setResult({
            crop: "Sugarcane",
            marathiName: "ऊस",
            hindiName: "गन्ना",
            suitabilityStatus: isHighlySuitable ? "Highly Suitable" : "Conditionally Suitable",
            suitabilityReason: reason,
            evaluatedFactors,
            expectedYield: {
              range: isRainfedOnly ? "60 - 80 Tonnes / Hectare (24 - 32 T / Acre)" : "90 - 130 Tonnes / Hectare (36 - 52 T / Acre)",
              condition: isRainfedOnly ? "Rainfed / Moisture Limited" : "Paired-Row Drip / Well-Irrigated"
            },
            fertilizerPlan: {
              rdfStandard: "250 kg N : 115 kg P2O5 : 115 kg K2O / ha (VSI Pune Standard)",
              soilAdjustment: "Basal DAP 100 kg/acre + MOP 40 kg/acre + Micronutrients (Zn, Fe, Mg); 4-split Nitrogen schedule with large earthing-up at 120-135 days."
            },
            mspBenchmark: {
              price: "₹340 / quintal (₹3,400 / tonne) at 10.25% sugar recovery",
              notificationYear: "Sugar Season 2024-25 (Oct-Sept)",
              authority: "Cabinet Committee on Economic Affairs (CCEA), Govt. of India (Statutory FRP)",
              isMspCovered: true
            },
            sourceReferences: [
              { institution: "Vasantdada Sugar Institute (VSI), Pune", document: "Sugarcane Cultivation & Drip Fertigation Package" },
              { institution: "ICAR - Indian Institute of Sugarcane Research (IISR), Lucknow", document: "Commercial Cane Agronomy Guidelines" }
            ],
            warnings: isRainfedOnly ? ["Sugarcane cannot sustain commercial yield on rainfed basis alone. Assured drip or canal irrigation is necessary."] : undefined
          });
          return;
        }

        // Default Cotton in Kharif
        const isCottonHigh = (season === "Kharif" || season === "All Year") && ph >= 6.5 && ph <= 8.2 && !isWaterloggingProne;
        const nDoseText = nStatus === "Low" ? "+20% Nitrogen (approx. 50 kg Urea/acre in split)" : "RDF: 120 kg N : 60 kg P2O5 : 60 kg K2O / ha (48:24:24 kg/acre)";
        const reason = language === "mr"
          ? `${locDistrict} मधील NPK प्रमाण (N:${n}, P:${p}, K:${k}) व मातीचा सामू (${ph}) खरीप बीटी कपाशीसाठी योग्य आहे.`
          : language === "hi"
          ? `${locDistrict} में NPK अनुपात (N:${n}, P:${p}, K:${k}) और मिट्टी का पीएच (${ph}) खरीफ बीटी कपास के लिए अनुकूल है।`
          : `The NPK profile (N:${n}, P:${p}, K:${k}) and soil pH (${ph}) in ${district} are agronomically matched for Bt Cotton hybrid cultivation during Kharif.`;

        setResult({
          crop: "Cotton",
          marathiName: "कापूस (कपाशी)",
          hindiName: "कपास",
          suitabilityStatus: isCottonHigh ? "Highly Suitable" : "Conditionally Suitable",
          suitabilityReason: reason,
          evaluatedFactors,
          expectedYield: {
            range: isRainfedOnly ? "12 - 18 Qtl / Hectare (5 - 7.5 Qtl / Acre)" : "22 - 32 Qtl / Hectare (9 - 13 Qtl / Acre)",
            condition: isRainfedOnly ? "Rainfed Vertisols" : "Irrigated / Drip with Fertigation"
          },
          fertilizerPlan: {
            rdfStandard: "120 kg N : 60 kg P2O5 : 60 kg K2O / ha for Irrigated Bt Cotton (ICAR-CICR Standard)",
            soilAdjustment: `${nDoseText}. Basal 10:26:26 (50 kg/acre) + Zinc Sulphate (10 kg) + Magnesium Sulphate (10 kg); Urea split at squaring (35 DAS) and flowering (65 DAS). Foliar 13:0:45 + Boron for boll retention.`
          },
          mspBenchmark: {
            price: "₹7,121 / quintal (Medium Staple) | ₹7,521 / quintal (Long Staple)",
            notificationYear: "Kharif Marketing Season (KMS) 2024-25",
            authority: "Commission for Agricultural Costs and Prices (CACP), Ministry of Agriculture & Farmers Welfare",
            isMspCovered: true
          },
          sourceReferences: [
            { institution: "ICAR - Central Institute for Cotton Research (CICR), Nagpur", document: "Cotton Package of Practices & IPM for Bt Cotton" },
            { institution: "CACP, Ministry of Agriculture & Farmers Welfare", document: "Price Policy for Kharif Crops: KMS 2024-25" }
          ],
          warnings: isWaterloggingProne ? ["Cotton roots are sensitive to water stagnation. Form ridges and furrows to drain excess water."] : undefined
        });
      }
    }, 1100);
  };

  const handleOpenGuide = () => {
    if (!result) return;
    const crop = encodeURIComponent(result.crop || "Cotton");
    const state = encodeURIComponent(activeMode === "simple" ? simpleData.state : advancedData.state);
    const season = encodeURIComponent(activeMode === "simple" ? simpleData.season : advancedData.season);
    router.push(`/crop-recommendation/guide?crop=${crop}&state=${state}&season=${season}`);
  };

  // Get active districts for state
  const currentSimpleDistricts = STATE_DISTRICTS[simpleData.state] || [];
  const currentAdvancedDistricts = STATE_DISTRICTS[advancedData.state] || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 font-sans transition-colors">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        
        {/* Page Header */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-full mb-4">
            <Sprout size={28} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {t("croprec_title", "AI Crop Recommendation")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            {t("croprec_subtitle", "Get the most profitable, scientific crop recommendation customized for your farm, district, and soil conditions.")}
          </p>
        </div>

        {/* Mode Toggle Tabs (Farmer Simple vs Advanced Soil Test) */}
        <div className="max-w-xl mx-auto mb-8 bg-gray-200 dark:bg-gray-800/80 p-1.5 rounded-2xl flex gap-1 shadow-inner">
          <button
            type="button"
            onClick={() => { setActiveMode("simple"); setResult(null); setErrorMessage(null); }}
            className={`flex-1 py-3 px-4 rounded-xl text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2 ${
              activeMode === "simple"
                ? "bg-white dark:bg-gray-900 text-primary-700 dark:text-primary-400 shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {t("croprec_tab_simple", "🌾 Simple Farmer Mode")}
          </button>

          <button
            type="button"
            onClick={() => { setActiveMode("advanced"); setResult(null); setErrorMessage(null); }}
            className={`flex-1 py-3 px-4 rounded-xl text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2 ${
              activeMode === "advanced"
                ? "bg-white dark:bg-gray-900 text-primary-700 dark:text-primary-400 shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {t("croprec_tab_advanced", "🔬 Advanced Soil Test Mode")}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Form Column */}
          <motion.div 
            key={activeMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {activeMode === "simple" ? (
                  <>
                    <Sprout size={20} className="text-primary-600" />
                    <span>{t("croprec_tab_simple", "🌾 Simple Farmer Mode")}</span>
                  </>
                ) : (
                  <>
                    <Beaker size={20} className="text-primary-600" />
                    <span>{t("croprec_tab_advanced", "🔬 Advanced Soil Test Mode")}</span>
                  </>
                )}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full border border-primary-100 dark:border-primary-800">
                {activeMode === "simple" ? "Farmer Friendly" : "ICAR Soil Test Standards"}
              </span>
            </div>

            <form onSubmit={handlePredict} className="space-y-5">
              
              {/* State & District Dropdowns (Dependent & Multilingual) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1">
                    <MapPin size={14} className="text-primary-500" /> {t("croprec_state", "State")} *
                  </label>
                  <select 
                    value={activeMode === "simple" ? simpleData.state : advancedData.state} 
                    onChange={(e) => handleStateChange(e.target.value, activeMode === "simple")}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white font-medium"
                  >
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {getLocalizedState(state, language)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1">
                    <MapPin size={14} className="text-primary-500" /> {t("croprec_district", "District")} *
                  </label>
                  <select 
                    value={activeMode === "simple" ? simpleData.district : advancedData.district} 
                    onChange={(e) => {
                      if (activeMode === "simple") {
                        setSimpleData({ ...simpleData, district: e.target.value });
                      } else {
                        setAdvancedData({ ...advancedData, district: e.target.value });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white font-medium"
                  >
                    {(activeMode === "simple" ? currentSimpleDistricts : currentAdvancedDistricts).map((dist) => (
                      <option key={dist} value={dist}>
                        {getLocalizedDistrict(dist, language)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cropping Season */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  {t("croprec_season", "Season")} *
                </label>
                <select 
                  value={activeMode === "simple" ? simpleData.season : advancedData.season} 
                  onChange={(e) => {
                    if (activeMode === "simple") {
                      setSimpleData({ ...simpleData, season: e.target.value });
                    } else {
                      setAdvancedData({ ...advancedData, season: e.target.value });
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white font-medium"
                >
                  <option value="Kharif">{t("croprec_season_kharif", "Kharif (Monsoon: June - Oct)")}</option>
                  <option value="Rabi">{t("croprec_season_rabi", "Rabi (Winter: Nov - March)")}</option>
                  <option value="Zaid">{t("croprec_season_zaid", "Summer / Zaid (Feb - May)")}</option>
                  <option value="All Year">{t("croprec_season_all", "All Year / Perennial")}</option>
                </select>
              </div>

              {/* ---------------- SIMPLE MODE SPECIFIC FIELDS ---------------- */}
              {activeMode === "simple" && (
                <>
                  {/* Soil Type & Water Availability */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                        {t("croprec_soil_type", "Soil Type")} *
                      </label>
                      <select 
                        value={simpleData.soilType} 
                        onChange={(e) => setSimpleData({ ...simpleData, soilType: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                      >
                        <option value="Deep Black / Vertisol">{t("croprec_soil_black", "Deep Black Soil / Heavy Vertisol")}</option>
                        <option value="Medium Black / Loam">{t("croprec_soil_medium_black", "Medium Black Soil / Loam")}</option>
                        <option value="Red / Sandy Loam">{t("croprec_soil_red", "Red / Sandy Loam Soil")}</option>
                        <option value="Clay Loam / Heavy Clay">{t("croprec_soil_clay", "Clay Loam / Heavy Clay")}</option>
                        <option value="Alluvial Soil">{t("croprec_soil_alluvial", "Alluvial Soil (River Plains)")}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                        {t("croprec_water", "Water Availability")} *
                      </label>
                      <select 
                        value={simpleData.irrigation} 
                        onChange={(e) => setSimpleData({ ...simpleData, irrigation: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                      >
                        <option value="Assured Drip / Sprinkler">{t("croprec_water_drip", "Assured Drip / Micro-Irrigation")}</option>
                        <option value="Canal / Borewell Flood">{t("croprec_water_canal", "Canal / Borewell (3-5 Irrigations)")}</option>
                        <option value="Open Well / Partial">{t("croprec_water_well", "Open Well / Partial Irrigation (1-2 Irrigations)")}</option>
                        <option value="Rainfed Only (Monsoon Dependent)">{t("croprec_water_rainfed", "Rainfed Only (Monsoon Dependent)")}</option>
                      </select>
                    </div>
                  </div>

                  {/* Land Size & Previous Crop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                        {t("croprec_land_size", "Farm Land Area (in Acres)")}
                      </label>
                      <input 
                        type="number" 
                        min="0.25" 
                        max="500" 
                        step="0.25"
                        placeholder="e.g. 5" 
                        value={simpleData.landSizeAcres} 
                        onChange={(e) => setSimpleData({ ...simpleData, landSizeAcres: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                        {t("croprec_prev_crop", "Previous Crop Grown")}
                      </label>
                      <select 
                        value={simpleData.previousCrop} 
                        onChange={(e) => setSimpleData({ ...simpleData, previousCrop: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                      >
                        <option value="Soybean">{t("croprec_prev_soybean", "Soybean (सोयाबीन)")}</option>
                        <option value="Cotton">{t("croprec_prev_cotton", "Cotton (कापूस / कपास)")}</option>
                        <option value="Wheat">{t("croprec_prev_wheat", "Wheat (गहू / गेहूं)")}</option>
                        <option value="Gram / Tur / Pulses">{t("croprec_prev_pulses", "Gram / Tur / Pulses (डाळी / दालें)")}</option>
                        <option value="Sugarcane">{t("croprec_prev_sugarcane", "Sugarcane (ऊस / गन्ना)")}</option>
                        <option value="Paddy / Rice">{t("croprec_prev_rice", "Paddy / Rice (भात / धान)")}</option>
                        <option value="Maize">{t("croprec_prev_maize", "Maize / Corn (मका / मक्का)")}</option>
                        <option value="Vegetables">{t("croprec_prev_vegetables", "Vegetables / Onion (भाजीपाला / सब्जियां)")}</option>
                        <option value="None">{t("croprec_prev_none", "None / New Fallow Land")}</option>
                      </select>
                    </div>
                  </div>

                  {/* Optional Soil Health Card Accordion */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSimpleData({ ...simpleData, hasSoilCard: !simpleData.hasSoilCard })}
                      className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1.5"
                    >
                      <FileText size={14} />
                      <span>{t("croprec_soil_card_opt", "Add Soil Health Card Data (Optional)")}</span>
                      <ChevronRight size={14} className={`transform transition-transform ${simpleData.hasSoilCard ? 'rotate-90' : ''}`} />
                    </button>

                    {simpleData.hasSoilCard && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 p-4 bg-primary-50/50 dark:bg-primary-950/20 rounded-2xl border border-primary-100 dark:border-primary-900/40 grid grid-cols-2 sm:grid-cols-4 gap-3"
                      >
                        <div>
                          <label className="block text-[11px] text-gray-600 dark:text-gray-400 mb-1">N (kg/ha)</label>
                          <input type="number" placeholder="e.g. 90" value={simpleData.optionalN} onChange={(e) => setSimpleData({ ...simpleData, optionalN: e.target.value })} className="w-full px-2 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-600 dark:text-gray-400 mb-1">P (kg/ha)</label>
                          <input type="number" placeholder="e.g. 42" value={simpleData.optionalP} onChange={(e) => setSimpleData({ ...simpleData, optionalP: e.target.value })} className="w-full px-2 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-600 dark:text-gray-400 mb-1">K (kg/ha)</label>
                          <input type="number" placeholder="e.g. 43" value={simpleData.optionalK} onChange={(e) => setSimpleData({ ...simpleData, optionalK: e.target.value })} className="w-full px-2 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-600 dark:text-gray-400 mb-1">pH</label>
                          <input type="number" step="0.1" placeholder="e.g. 7.2" value={simpleData.optionalPh} onChange={(e) => setSimpleData({ ...simpleData, optionalPh: e.target.value })} className="w-full px-2 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </>
              )}

              {/* ---------------- ADVANCED SOIL TEST MODE FIELDS ---------------- */}
              {activeMode === "advanced" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {t("croprec_n", "Nitrogen (N)")} <span className="text-[10px] text-gray-400">(kg/ha)</span>
                      </label>
                      <input 
                        type="number" 
                        required 
                        min="0"
                        max="1000"
                        placeholder="e.g. 90" 
                        value={advancedData.nitrogen} 
                        onChange={(e) => setAdvancedData({...advancedData, nitrogen: e.target.value})} 
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white" 
                      />
                      <span className="text-[10px] text-gray-400">&lt;50 Low, 50-120 Med</span>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {t("croprec_p", "Phosphorous (P)")} <span className="text-[10px] text-gray-400">(kg/ha)</span>
                      </label>
                      <input 
                        type="number" 
                        required 
                        min="0"
                        max="500"
                        placeholder="e.g. 42" 
                        value={advancedData.phosphorous} 
                        onChange={(e) => setAdvancedData({...advancedData, phosphorous: e.target.value})} 
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white" 
                      />
                      <span className="text-[10px] text-gray-400">&lt;20 Low, 20-55 Med</span>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {t("croprec_k", "Potassium (K)")} <span className="text-[10px] text-gray-400">(kg/ha)</span>
                      </label>
                      <input 
                        type="number" 
                        required 
                        min="0"
                        max="800"
                        placeholder="e.g. 43" 
                        value={advancedData.potassium} 
                        onChange={(e) => setAdvancedData({...advancedData, potassium: e.target.value})} 
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white" 
                      />
                      <span className="text-[10px] text-gray-400">&lt;30 Low, 30-70 Med</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {t("croprec_ph", "Soil pH (Reaction)")} <span className="text-[10px] text-gray-400">(4.5 - 9.0)</span>
                      </label>
                      <input 
                        type="number" 
                        step="0.1" 
                        min="4.5"
                        max="9.0"
                        required 
                        placeholder="e.g. 7.2" 
                        value={advancedData.ph} 
                        onChange={(e) => setAdvancedData({...advancedData, ph: e.target.value})} 
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white" 
                      />
                      <span className="text-[10px] text-gray-400">6.0 - 7.8 Optimal range</span>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {t("croprec_rain", "Seasonal Rainfall (mm)")}
                      </label>
                      <input 
                        type="number" 
                        min="0"
                        max="3500"
                        required 
                        placeholder="e.g. 650" 
                        value={advancedData.rainfall} 
                        onChange={(e) => setAdvancedData({...advancedData, rainfall: e.target.value})} 
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white" 
                      />
                      <span className="text-[10px] text-gray-400">Total seasonal moisture</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {t("croprec_drainage", "Soil Drainage Profile")}
                      </label>
                      <select 
                        value={advancedData.soilType} 
                        onChange={(e) => setAdvancedData({...advancedData, soilType: e.target.value})} 
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                      >
                        <option value="Deep Black / Vertisol (Well-drained)">{t("croprec_drainage_well", "Well Drained (Water drains easily)")}</option>
                        <option value="Medium Black / Loam (Moderate Drainage)">{t("croprec_drainage_moderate", "Moderate Drainage")}</option>
                        <option value="Heavy Clay (Poor Drainage / Waterlogging prone)">{t("croprec_drainage_poor", "Poor Drainage / Waterlogging prone")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {t("croprec_water", "Water Availability")}
                      </label>
                      <select 
                        value={advancedData.irrigation} 
                        onChange={(e) => setAdvancedData({...advancedData, irrigation: e.target.value})} 
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                      >
                        <option value="Assured Drip / Sprinkler">{t("croprec_water_drip", "Assured Drip / Micro-Irrigation")}</option>
                        <option value="Canal / Flood (2-4 Irrigations)">{t("croprec_water_canal", "Canal / Borewell (3-5 Irrigations)")}</option>
                        <option value="Rainfed Only (Monsoon Dependent)">{t("croprec_water_rainfed", "Rainfed Only (Monsoon Dependent)")}</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl flex items-start gap-3">
                  <AlertCircle size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 active:scale-[0.99] text-white font-bold rounded-2xl transition-all shadow-md flex justify-center items-center gap-2 cursor-pointer text-sm sm:text-base"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{t("croprec_evaluating", "Evaluating Farm Conditions...")}</span>
                  </>
                ) : (
                  <>
                    <Search size={18} /> <span>{t("croprec_analyze_btn", "Get Crop Recommendation")}</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Results Column */}
          <div className="relative">
            {/* Empty State */}
            {!isAnalyzing && !result && (
              <div className="h-full min-h-[440px] flex flex-col items-center justify-center bg-gray-100/50 dark:bg-gray-900/30 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-8 text-center">
                <Sprout size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {t("croprec_ready_title", "Ready for Crop Recommendation")}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm">
                  {t("croprec_ready_desc", "Select your state, district, season, and soil type to get a personalized high-yielding crop recommendation.")}
                </p>
              </div>
            )}

            {/* Loading State */}
            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute inset-0 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-8 text-center shadow-lg"
              >
                <div className="relative w-20 h-20 mb-5">
                  <div className="absolute inset-0 border-4 border-primary-100 dark:border-primary-900/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-primary-500">
                    <Beaker size={28} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {t("croprec_evaluating", "Evaluating Farm Conditions...")}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm max-w-md">
                  Analyzing regional agro-climatic curves, crop rotation history, and district soil suitability...
                </p>
              </motion.div>
            )}

            {/* Results Display Card */}
            <AnimatePresence>
              {result && !isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full bg-gradient-to-br from-primary-700 via-primary-800 to-emerald-950 rounded-3xl p-5 sm:p-7 shadow-xl text-white overflow-hidden relative flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Sprout size={160} />
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Header Badges */}
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        result.suitabilityStatus === 'Highly Suitable'
                          ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/30'
                          : 'bg-amber-400/20 text-amber-200 border border-amber-400/30'
                      }`}>
                        <CheckCircle2 size={13} /> {result.suitabilityStatus}
                      </div>
                      <div className="text-[11px] text-primary-200 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                        {getLocalizedDistrict(result.evaluatedFactors.district, language)}, {getLocalizedState(result.evaluatedFactors.state, language)}
                      </div>
                    </div>

                    {/* Localized Crop Title */}
                    <h2 className="text-3xl sm:text-4xl font-extrabold mb-1">
                      {language === 'mr' ? result.marathiName : language === 'hi' ? result.hindiName : result.crop}
                      <span className="text-xl sm:text-2xl font-medium text-primary-200 ml-2">
                        ({language === 'mr' ? result.crop : result.marathiName})
                      </span>
                    </h2>
                    
                    <p className="text-primary-100 text-xs sm:text-sm mb-4 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/10">
                      {result.suitabilityReason}
                    </p>

                    {/* Evaluated Factors Matrix */}
                    <div className="mb-3.5 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                      <div className="text-[11px] font-bold text-primary-200 mb-2 flex items-center gap-1.5">
                        <Layers size={13} /> {t("croprec_res_factors", "Evaluated Factors Summary")}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div>
                          <span className="text-primary-300">Season:</span> <strong className="text-white">{result.evaluatedFactors.season}</strong>
                        </div>
                        <div>
                          <span className="text-primary-300">Soil:</span> <strong className="text-white line-clamp-1">{result.evaluatedFactors.soilType.split('(')[0]}</strong>
                        </div>
                        <div>
                          <span className="text-primary-300">Water:</span> <strong className="text-white line-clamp-1">{result.evaluatedFactors.irrigation.split('(')[0]}</strong>
                        </div>
                        <div>
                          <span className="text-primary-300">Mode:</span> <strong className="text-white capitalize">{result.evaluatedFactors.mode}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Metric Cards */}
                    <div className="space-y-2 flex-grow mb-4">
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                        <div className="text-primary-200 text-[11px] font-medium mb-0.5">
                          {t("croprec_res_yield", "Expected Yield Range")} ({result.expectedYield.condition})
                        </div>
                        <div className="text-sm font-bold text-white">{result.expectedYield.range}</div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                        <div className="text-primary-200 text-[11px] font-medium mb-0.5">
                          {t("croprec_res_fertilizer", "Fertilizer & Nutrient Schedule")}
                        </div>
                        <div className="text-xs font-semibold text-white leading-snug">{result.fertilizerPlan.soilAdjustment}</div>
                        <div className="text-[10px] text-primary-200 mt-1 italic">{result.fertilizerPlan.rdfStandard}</div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-primary-200 text-[11px] font-medium">{t("croprec_res_market", "Price & Govt. Support Benchmark")}</span>
                          <span className="text-[10px] text-emerald-300 font-mono">{result.mspBenchmark.notificationYear}</span>
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-emerald-200">{result.mspBenchmark.price}</div>
                        <div className="text-[10px] text-primary-200 mt-0.5">{result.mspBenchmark.authority}</div>
                      </div>
                    </div>

                    {/* Source References */}
                    <div className="mb-4 p-2.5 bg-black/25 rounded-xl border border-white/10 text-[11px] text-primary-200 space-y-1">
                      <div className="font-bold text-white flex items-center gap-1">
                        <ShieldCheck size={12} className="text-primary-400" /> {t("croprec_res_sources", "Authoritative Reference Sources")}:
                      </div>
                      {result.sourceReferences.map((ref, idx) => (
                        <div key={idx} className="leading-tight">
                          &bull; <span className="text-primary-100">{ref.institution}:</span> <span className="italic text-primary-300">{ref.document}</span>
                        </div>
                      ))}
                    </div>

                    {result.warnings && result.warnings.length > 0 && (
                      <div className="mb-4 p-2.5 bg-amber-500/20 border border-amber-400/30 rounded-xl text-xs text-amber-100 flex items-center gap-2">
                        <Info size={14} className="flex-shrink-0 text-amber-300" />
                        <span>{result.warnings[0]}</span>
                      </div>
                    )}

                    <div className="pt-1">
                      <button 
                        type="button"
                        onClick={handleOpenGuide}
                        id="view-cultivation-guide-btn"
                        className="w-full py-3.5 bg-white text-primary-900 hover:bg-gray-100 active:scale-[0.99] font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl flex justify-center items-center gap-2 cursor-pointer group text-sm sm:text-base"
                      >
                        <BookOpen size={18} className="text-primary-700 group-hover:scale-110 transition-transform" />
                        <span>{t("croprec_guide_btn", "View Detailed Cultivation Guide")} &rarr;</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
