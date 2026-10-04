// Authoritative Agronomic Guidance Engine for Indian Farmers
// Cross-references crop physiological standards (ICAR / SAUs) and live Open-Meteo weather forecasts.

import { cropGuidesData, CropGuideData } from "./cropGuides";
import { LiveWeatherData } from "@/utils/weatherApi";

export interface GeneratedGuidanceReport {
  cropName: string;
  localizedCropName: string;
  farmSize: number;
  season: string;
  soilType: string;
  suitabilityScore: number;
  suitabilityStatus: {
    en: string;
    mr: string;
    hi: string;
  };
  alternatives: Array<{
    name: string;
    localizedName: string;
    matchScore: number;
    reason: { en: string; mr: string; hi: string };
  }>;
  summary: {
    durationDays: string;
    waterRequirement: string;
    seedRateForFarm: string;
    expectedYieldForFarm: string;
    weatherRiskStatus: { en: string; mr: string; hi: string };
  };
  timeline: {
    today: { en: string; mr: string; hi: string };
    next7Days: { en: string; mr: string; hi: string };
    precautions: { en: string; mr: string; hi: string };
  };
  sowing: {
    title: { en: string; mr: string; hi: string };
    seedRateText: { en: string; mr: string; hi: string };
    spacing: { en: string; mr: string; hi: string };
    treatment: { en: string; mr: string; hi: string };
  };
  irrigation: {
    title: { en: string; mr: string; hi: string };
    liveAdvice: { en: string; mr: string; hi: string };
    criticalStages: { en: string; mr: string; hi: string };
  };
  fertilizer: {
    title: { en: string; mr: string; hi: string };
    basalDose: { en: string; mr: string; hi: string };
    topDressing: { en: string; mr: string; hi: string };
    micronutrients: { en: string; mr: string; hi: string };
    npkChartData: Array<{ name: string; value: number }>;
  };
  pestDisease: {
    title: { en: string; mr: string; hi: string };
    keyRisks: Array<{
      name: string;
      localizedName: string;
      symptoms: string;
      remedy: string;
      dosage: string;
    }>;
  };
  harvest: {
    title: { en: string; mr: string; hi: string };
    maturitySigns: { en: string; mr: string; hi: string };
    harvestTips: { en: string; mr: string; hi: string };
  };
  dosAndDonts: {
    dos: Array<{ en: string; mr: string; hi: string }>;
    donts: Array<{ en: string; mr: string; hi: string }>;
  };
  yieldChartData: Array<{
    stage: string;
    stageMr: string;
    stageHi: string;
    standard: number;
    optimal: number;
  }>;
}

// Helper to find closest crop guide from input string
export function findCropGuide(inputCrop: string): CropGuideData {
  const normalized = (inputCrop || "").toLowerCase().trim();

  // Direct key lookup
  if (cropGuidesData[normalized]) {
    return cropGuidesData[normalized];
  }

  // Alias lookup
  for (const key of Object.keys(cropGuidesData)) {
    const guide = cropGuidesData[key];
    if (
      normalized.includes(key) ||
      guide.cropName.toLowerCase().includes(normalized) ||
      guide.marathiName.toLowerCase().includes(normalized) ||
      guide.hindiName.toLowerCase().includes(normalized)
    ) {
      return guide;
    }
  }

  // Common crop aliases
  if (normalized.includes("kapas") || normalized.includes("kapus") || normalized.includes("cotton")) return cropGuidesData.cotton;
  if (normalized.includes("soy") || normalized.includes("soya")) return cropGuidesData.soybean;
  if (normalized.includes("gehu") || normalized.includes("gahu") || normalized.includes("wheat")) return cropGuidesData.wheat;
  if (normalized.includes("kanda") || normalized.includes("pyaj") || normalized.includes("onion")) return cropGuidesData.onion;
  if (normalized.includes("tamatar") || normalized.includes("tomato")) return cropGuidesData.tomato;
  if (normalized.includes("makka") || normalized.includes("maka") || normalized.includes("corn") || normalized.includes("maize")) return cropGuidesData.maize;
  if (normalized.includes("chana") || normalized.includes("harbhara") || normalized.includes("gram")) return cropGuidesData.gram;
  if (normalized.includes("bhat") || normalized.includes("dhan") || normalized.includes("chawal") || normalized.includes("rice") || normalized.includes("paddy")) return cropGuidesData.paddy;
  if (normalized.includes("draksh") || normalized.includes("angoor") || normalized.includes("grape")) return cropGuidesData.grapes;
  if (normalized.includes("keli") || normalized.includes("kela") || normalized.includes("banana")) return cropGuidesData.banana;
  if (normalized.includes("bhuimug") || normalized.includes("mungfali") || normalized.includes("groundnut") || normalized.includes("peanut")) return cropGuidesData.groundnut;
  if (normalized.includes("us") || normalized.includes("ganna") || normalized.includes("sugarcane")) return cropGuidesData.sugarcane;

  // Fallback to Cotton
  return cropGuidesData.cotton;
}

export function generatePersonalizedGuidance(
  cropInput: string,
  soilType: string,
  farmSizeAcres: number,
  season: string,
  weatherData: LiveWeatherData | null,
  district: string = "Maharashtra"
): GeneratedGuidanceReport {
  const guide = findCropGuide(cropInput);
  const acres = farmSizeAcres > 0 ? farmSizeAcres : 1;

  // Real weather metrics from Open-Meteo
  const currentTemp = weatherData?.current?.temp ?? 28;
  const maxTemp = weatherData?.forecast?.[0]?.tempMax ?? 32;
  const humidity = weatherData?.current?.humidity ?? 55;
  const rainProb3Days = weatherData ? Math.max(...weatherData.forecast.slice(0, 3).map(f => f.rainProb), 0) : 0;
  const rainToday = weatherData?.current?.precipitation ?? 0;

  // Suitability Calculation
  let suitabilityScore = 92;
  const soilLower = (soilType || "").toLowerCase();
  const seasonLower = (season || "").toLowerCase();

  if (guide.id === "cotton") {
    if (soilLower.includes("black") || soilLower.includes("alluvial")) suitabilityScore = 95;
    else if (soilLower.includes("sandy") || soilLower.includes("laterite")) suitabilityScore = 78;
    if (seasonLower.includes("rabi") || seasonLower.includes("zaid")) suitabilityScore -= 12;
  } else if (guide.id === "soybean") {
    if (soilLower.includes("black") || soilLower.includes("alluvial") || soilLower.includes("red")) suitabilityScore = 96;
    if (seasonLower.includes("rabi")) suitabilityScore -= 20;
  } else if (guide.id === "wheat") {
    if (seasonLower.includes("rabi") || seasonLower.includes("winter")) suitabilityScore = 96;
    else suitabilityScore = 70;
  } else if (guide.id === "onion") {
    if (soilLower.includes("alluvial") || soilLower.includes("red") || soilLower.includes("black")) suitabilityScore = 94;
  }

  // Dynamic Weather Risk
  let weatherRiskEn = "Normal Seasonal Conditions";
  let weatherRiskMr = "हवामान अनुकूल व सामान्य";
  let weatherRiskHi = "मौसम अनुकूल व सामान्य";

  if (rainProb3Days >= 50 || rainToday >= 3) {
    weatherRiskEn = `Rain Alert: ${rainProb3Days}% probability in next 48-72h`;
    weatherRiskMr = `पावसाचा इशारा: पुढील ४८-७२ तासांत ${rainProb3Days}% पाऊस शक्यता`;
    weatherRiskHi = `बारिश का अलर्ट: अगले 48-72 घंटों में ${rainProb3Days}% संभावना`;
  } else if (maxTemp >= 35 && humidity < 40) {
    weatherRiskEn = `Heat & Moisture Stress: Max Temp ${maxTemp}°C`;
    weatherRiskMr = `उष्णता व बाष्पीभवन ताण: कमाल ${maxTemp}°C`;
    weatherRiskHi = `गर्मी व वाष्पीकरण तनाव: अधिकतम ${maxTemp}°C`;
  }

  // Dynamic Action Plan Timelines
  let todayEn = `Inspect field drainage and prepare seed bed. Current temp is ${currentTemp}°C with ${humidity}% humidity.`;
  let todayMr = `शेतातील स्वच्छता व मशागत तपासा. सध्याचे तापमान ${currentTemp}°C व आर्द्रता ${humidity}% आहे.`;
  let todayHi = `खेत की तैयारी और जल निकासी जांचें। वर्तमान तापमान ${currentTemp}°C और आर्द्रता ${humidity}% है।`;

  if (rainProb3Days >= 50) {
    todayEn = `Hold irrigation and delay any foliar sprays. Clear field trenches to prevent water stagnation from upcoming rain (${rainProb3Days}%).`;
    todayMr = `पावसाची शक्यता (${rainProb3Days}%) असल्याने फवारणी आणि सिंचन थांबवा. शेतात पाणी साचू नये म्हणून चर मोकळे करा.`;
    todayHi = `बारिश के अनुमान (${rainProb3Days}%) के कारण छिड़काव व सिंचाई रोकें। जल निकासी के नाले साफ रखें।`;
  } else if (humidity < 40 && maxTemp >= 33) {
    todayEn = `Plan light evening drip irrigation to avoid heat stress. Complete Trichoderma seed treatment before sowing.`;
    todayMr = `उष्णतेचा ताण टाळण्यासाठी सायंकाळी हलके पाणी द्या. पेरणीपूर्वी ट्रायकोडर्मा बियाणे प्रक्रिया पूर्ण करा.`;
    todayHi = `तापमान के कारण शाम के समय हल्की सिंचाई करें। बुआई से पूर्व ट्राइकोडर्मा बीज उपचार सुनिश्चित करें।`;
  }

  let weekEn = `Apply recommended basal fertilizer dose during sowing. Install 4-5 pheromone traps per acre at 20 days after germination.`;
  let weekMr = `पेरणीच्या वेळी शिफारस केलेला बेसल खत डोस द्या. उगवणीनंतर २० दिवसांनी एकरी ४-५ कामगंध सापळे (Pheromone Traps) लावा.`;
  let weekHi = `बुआई के समय बेसल उर्वरक दें। अंकुरण के 20 दिन बाद प्रति एकड़ 4-5 फेरोमोन ट्रैप लगाएं।`;

  let precautionsEn = `Avoid spraying during high wind speed. Never mix calcium fertilizers with phosphate fertilizers in the same tank.`;
  let precautionsMr = `वाऱ्याचा वेग जास्त असताना फवारणी टाळा. कॅल्शियम आणि फॉस्फेटयुक्त खते एकाच पंपात मिसळू नका.`;
  let precautionsHi = `तेज हवा में कीटनाशक छिड़काव न करें। कैल्शियम व फास्फेट युक्त उर्वरकों को एक साथ न मिलाएं।`;

  // Dynamic NPK split data
  let npkSplits = [
    { name: "Nitrogen (N)", value: 50 },
    { name: "Phosphorus (P)", value: 25 },
    { name: "Potassium (K)", value: 25 }
  ];

  if (guide.id === "soybean") {
    npkSplits = [
      { name: "Nitrogen (N)", value: 25 },
      { name: "Phosphorus (P)", value: 50 },
      { name: "Potassium (K)", value: 25 }
    ];
  } else if (guide.id === "wheat") {
    npkSplits = [
      { name: "Nitrogen (N)", value: 55 },
      { name: "Phosphorus (P)", value: 27 },
      { name: "Potassium (K)", value: 18 }
    ];
  } else if (guide.id === "onion" || guide.id === "tomato") {
    npkSplits = [
      { name: "Nitrogen (N)", value: 40 },
      { name: "Phosphorus (P)", value: 30 },
      { name: "Potassium (K)", value: 30 }
    ];
  }

  // Growth & Yield Progression Timeline
  const yieldChartData = [
    { stage: "Month 1 (Sowing)", stageMr: "महिना १ (पेरणी व उगवण)", stageHi: "माह 1 (बुआई व अंकुरण)", standard: 0, optimal: 0 },
    { stage: "Month 2 (Vegetative)", stageMr: "महिना २ (शाकीय वाढ)", stageHi: "माह 2 (वानस्पतिक वृद्धि)", standard: 15, optimal: 20 },
    { stage: "Month 3 (Flowering)", stageMr: "महिना ३ (फुलोरा व बोंडे/दाणे)", stageHi: "माह 3 (फूल व दाना भराव)", standard: 50, optimal: 60 },
    { stage: "Month 4 (Maturation)", stageMr: "महिना ४ (पक्वता)", stageHi: "माह 4 (परिपक्वता)", standard: 85, optimal: 95 },
    { stage: "Month 5 (Harvest)", stageMr: "काढणी हंगाम (Harvest)", stageHi: "कटाई अवस्था (Harvest)", standard: 100, optimal: 115 }
  ];

  // Alternatives mapping
  const alternatives = [
    {
      name: "Soybean",
      localizedName: "सोयाबीन (Soybean)",
      matchScore: 94,
      reason: {
        en: "Excellent soil fertility restorer and ideal intercrop/rotation crop.",
        mr: "जमिनीतील नत्र वाढवण्यासाठी आणि फेरपालटीसाठी उत्कृष्ट पीक.",
        hi: "मिट्टी की उर्वरता सुधारने और फसल चक्र के लिए सर्वोत्तम विकल्प।"
      }
    },
    {
      name: "Gram / Chickpea",
      localizedName: "हरभरा / चना (Gram)",
      matchScore: 88,
      reason: {
        en: "Low water requirement crop highly suited for winter residual moisture.",
        mr: "कमी पाण्यावर उत्तम उत्पादन देणारे रब्बीतील फायदेशीर पीक.",
        hi: "कम पानी में अच्छी पैदावार देने वाली दलहनी फसल।"
      }
    }
  ];

  return {
    cropName: guide.cropName,
    localizedCropName: guide.marathiName,
    farmSize: acres,
    season,
    soilType,
    suitabilityScore,
    suitabilityStatus: {
      en: suitabilityScore >= 90 ? "Highly Recommended / Optimal Fit" : "Suitable with Soil Amendments",
      mr: suitabilityScore >= 90 ? "अत्यंत अनुकूल व शिफारसपात्र" : "जमीन सुधारणांसह लागवडीयोग्य",
      hi: suitabilityScore >= 90 ? "अत्यंत उपयुक्त एवं अनुशंसित" : "मिट्टी सुधार के साथ उपयुक्त"
    },
    alternatives,
    summary: {
      durationDays: guide.durationDays,
      waterRequirement: guide.waterRequirementMm,
      seedRateForFarm: guide.id === "cotton"
        ? `${(acres * 1.8).toFixed(1)} - ${(acres * 2.2).toFixed(1)} kg (for ${acres} Acres)`
        : guide.id === "soybean"
          ? `${Math.round(acres * 28)} - ${Math.round(acres * 30)} kg (for ${acres} Acres)`
          : guide.id === "wheat"
            ? `${Math.round(acres * 40)} - ${Math.round(acres * 45)} kg (for ${acres} Acres)`
            : `${acres * 2} - ${acres * 4} kg/plants as per variety`,
      expectedYieldForFarm: guide.expectedYieldRange.irrigated,
      weatherRiskStatus: {
        en: weatherRiskEn,
        mr: weatherRiskMr,
        hi: weatherRiskHi
      }
    },
    timeline: {
      today: {
        en: todayEn,
        mr: todayMr,
        hi: todayHi
      },
      next7Days: {
        en: weekEn,
        mr: weekMr,
        hi: weekHi
      },
      precautions: {
        en: precautionsEn,
        mr: precautionsMr,
        hi: precautionsHi
      }
    },
    sowing: {
      title: {
        en: guide.sowingGuide.title,
        mr: "पेरणी, अंतर आणि बियाणे बीजप्रक्रिया",
        hi: "बुआई, दूरी एवं बीज उपचार"
      },
      seedRateText: {
        en: guide.sowingGuide.details[0] || "Use certified seeds at standard seed rate per acre.",
        mr: guide.sowingGuide.details[0] || "प्रमाणित बियाणे योग्य एकरी प्रमाणात वापरावे.",
        hi: guide.sowingGuide.details[0] || "प्रमाणित बीज का उचित प्रति एकड़ दर पर उपयोग करें।"
      },
      spacing: {
        en: guide.sowingGuide.details[2] || "Follow recommended row-to-row and plant-to-plant spacing.",
        mr: guide.sowingGuide.details[2] || "दोन ओळींमधील व दोन झाडांमधील शिफारस केलेले अंतर ठेवा.",
        hi: guide.sowingGuide.details[2] || "पंक्ति से पंक्ति और पौधे से पौधे की अनुशंसित दूरी बनाए रखें।"
      },
      treatment: {
        en: guide.sowingGuide.details[1] || "Treat seeds with bio-fungicide (Trichoderma @ 5g/kg) and bio-fertilizer.",
        mr: guide.sowingGuide.details[1] || "पेरणीपूर्वी ट्रायकोडर्मा ५ ग्रॅम/किलो किंवा जिवाणू संवर्धकाची बीजप्रक्रिया करा.",
        hi: guide.sowingGuide.details[1] || "बुआई से पहले ट्राइकोडर्मा 5 ग्राम/किग्रा व जैव-उर्वरक से बीज उपचार करें।"
      }
    },
    irrigation: {
      title: {
        en: guide.irrigationSchedule.title,
        mr: "हवामान आधारित सिंचन व पाणी व्यवस्थापन",
        hi: "मौसम आधारित सिंचाई एवं जल प्रबंधन"
      },
      liveAdvice: {
        en: rainProb3Days >= 50
          ? `Rain is forecasted in your district (${rainProb3Days}% probability). Hold irrigation to prevent waterlogging.`
          : `Topsoil evaporation is active. Apply recommended irrigation during early morning (6:00 - 8:30 AM).`,
        mr: rainProb3Days >= 50
          ? `पुढील २-३ दिवसांत पावसाची शक्यता (${rainProb3Days}%) असल्याने सिंचन थांबवावे.`
          : `जमिनीतील ओलावा टिकवण्यासाठी पहाटे किंवा सकाळी (६:०० ते ८:३०) हलके सिंचन करावे.`,
        hi: rainProb3Days >= 50
          ? `जिले में बारिश का अनुमान (${rainProb3Days}%) होने के कारण सिंचाई स्थगित रखें।`
          : `नमी संरक्षण हेतु सुबह (6:00 से 8:30 बजे) हल्की सिंचाई करें।`
      },
      criticalStages: {
        en: guide.irrigationSchedule.details.join(" | "),
        mr: guide.irrigationSchedule.details.join(" | "),
        hi: guide.irrigationSchedule.details.join(" | ")
      }
    },
    fertilizer: {
      title: {
        en: guide.fertilizerPlan.title,
        mr: "संतुलित खत आणि पोषण व्यवस्थापन",
        hi: "संतुलित उर्वरक एवं पोषण प्रबंधन"
      },
      basalDose: {
        en: guide.fertilizerPlan.nutrientDose?.basalDose || "Full P & K and 20-30% Nitrogen at sowing.",
        mr: guide.fertilizerPlan.nutrientDose?.basalDose || "पेरणीच्या वेळी संपूर्ण स्फुरद (P), पालाश (K) आणि २०-३०% नत्र (N) द्यावे.",
        hi: guide.fertilizerPlan.nutrientDose?.basalDose || "बुआई के समय पूरी फास्फोरस, पोटाश और 20-30% नाइट्रोजन दें।"
      },
      topDressing: {
        en: (guide.fertilizerPlan.nutrientDose?.topDressingSplits || []).join("; ") || "Apply top dressing Nitrogen in 2 equal splits.",
        mr: (guide.fertilizerPlan.nutrientDose?.topDressingSplits || []).join("; ") || "उर्वरित नत्र दोन समान हप्त्यांमध्ये विभागून द्यावे.",
        hi: (guide.fertilizerPlan.nutrientDose?.topDressingSplits || []).join("; ") || "शेष नाइट्रोजन को दो बराबर भागों में टॉप-ड्रेसिंग करें।"
      },
      micronutrients: {
        en: guide.fertilizerPlan.nutrientDose?.micronutrients || "Zinc Sulphate and Boron spray as per soil test.",
        mr: guide.fertilizerPlan.nutrientDose?.micronutrients || "माती परीक्षणानुसार झिंक सल्फेट व बोरॉनची फवारणी करावी.",
        hi: guide.fertilizerPlan.nutrientDose?.micronutrients || "मृदा परीक्षण अनुसार जिंक सल्फेट व बोरॉन का छिड़काव करें।"
      },
      npkChartData: npkSplits
    },
    pestDisease: {
      title: {
        en: "Key Pest & Disease Precautions",
        mr: "प्रमुख कीड व रोग प्रतिबंधक उपाय",
        hi: "प्रमुख कीट एवं रोग रोकथाम उपाय"
      },
      keyRisks: (guide.pestAndDisease || []).slice(0, 3).map(p => ({
        name: p.name,
        localizedName: p.marathiName || p.name,
        symptoms: p.symptoms,
        remedy: `${p.organicRemedy} | ${p.chemicalRemedy}`,
        dosage: p.dosage
      }))
    },
    harvest: {
      title: {
        en: guide.harvestingGuide.title,
        mr: "काढणी, साठवणूक व विक्री पूर्व व्यवस्थापन",
        hi: "कटाई, भंडारण एवं विपणन मार्गदर्शन"
      },
      maturitySigns: {
        en: guide.harvestingGuide.details[0] || "Harvest when crop achieves physiological maturity and optimal moisture.",
        mr: guide.harvestingGuide.details[0] || "पीक पूर्ण पक्व झाल्यावर कोरड्या हवामानात काढणी करावी.",
        hi: guide.harvestingGuide.details[0] || "फसल पूरी तरह पकने पर सूखे मौसम में कटाई करें।"
      },
      harvestTips: {
        en: guide.harvestingGuide.tips?.[0] || "Dry produce on clean tarpaulin to safe storage moisture level.",
        mr: guide.harvestingGuide.tips?.[0] || "काढणी केलेला शेतीमाल स्वच्छ ताडपत्रीवर वाळवून ओलावा सुरक्षित पातळीवर आणावा.",
        hi: guide.harvestingGuide.tips?.[0] || "फसल को साफ तिरपाल पर सुखाकर सुरक्षित नमी स्तर पर लाएं।"
      }
    },
    dosAndDonts: {
      dos: [
        {
          en: "Perform certified seed treatment with Trichoderma or bio-fertilizers before sowing.",
          mr: "पेरणीपूर्वी ट्रायकोडर्मा किंवा जैविक जिवाणू संवर्धकाची बीजप्रक्रिया अवश्य करा.",
          hi: "बुआई से पहले ट्राइकोडर्मा या जैव उर्वरक से बीज उपचार अवश्य करें।"
        },
        {
          en: "Install pheromone traps early (20-25 DAS) to monitor insect pest population.",
          mr: "कीड नियंत्रणासाठी सुरुवातीपासूनच एकरी ४-५ कामगंध सापळे लावा.",
          hi: "शुरुआत में ही प्रति एकड़ 4-5 फेरोमोन ट्रैप लगाएं।"
        }
      ],
      donts: [
        {
          en: "Do not apply excessive chemical Nitrogen which invites sucking pests.",
          mr: "अवाजवी युरिया (नत्र) खताचा वापर करू नका, यामुळे रसशोषक किडींचा प्रादुर्भाव वाढतो.",
          hi: "अत्यधिक यूरिया का प्रयोग न करें, इससे रस चूसक कीटों का प्रकोप बढ़ता है।"
        },
        {
          en: "Do not spray chemical insecticides during peak afternoon sunshine or high wind.",
          mr: "दुपारच्या कडक उन्हात किंवा वादळी वाऱ्यामध्ये औषध फवारणी करू नका.",
          hi: "दोपहर की तेज धूप या तेज हवा में कीटनाशक छिड़काव न करें।"
        }
      ]
    },
    yieldChartData
  };
}
