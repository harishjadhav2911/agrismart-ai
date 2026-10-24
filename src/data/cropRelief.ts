// Official Verified Crop Relief & Disaster Compensation Data
// Sources: 
// 1. Ministry of Home Affairs (MHA), Disaster Management Division, GoI - SDRF/NDRF Norms (Letter No. 33-01/2022-NDM-I)
// 2. Relief and Rehabilitation Department, Government of Maharashtra - Kharif 2026 Drought Declarations (GR No. Samiti-2026/PK 82/Madat-2 & Corrigendum 14 Oct 2026)
// 3. Food, Civil Supplies and Consumer Protection Dept GR No. 202610221655482506 (Dated 22 Oct 2026 - 304 Talukas across 33 Districts)
// 4. Higher and Technical Education Dept & SPPU Examination Fee Exemption (Zero-Challan) Directives (October 2026)
// 5. Water Supply and Sanitation Department, GoM - Water Scarcity Action Directives & Tanker Report (886 Active Tankers, Oct 2026)
// 6. Historical Reference: GR No. 202310311805175519 (Dated 31 Oct 2023 - 40 Talukas) & 202311101905338119 (1,021 Circles)
// Last Verified & Audited: 23 October 2026

import { MAHARASHTRA_DISTRICTS_DATA } from "./maharashtraDistrictsGeo";

export type LandCategory = "rainfed" | "irrigated" | "perennial";
export type DisasterType = 
  | "unseasonal_rain" 
  | "hailstorm" 
  | "flood" 
  | "drought" 
  | "pest_attack" 
  | "cyclone"
  | "frost";

export interface OfficialRateItem {
  id: LandCategory;
  centralSdrfPerHectare: number; // In INR (Base Central SDRF/NDRF)
  maharashtraEnhancedPerHectare: number; // In INR (Special state top-up under declared GRs)
  centralMaxAreaHectares: number; // 2 ha
  stateMaxAreaHectares: number; // 3 ha under specific state GRs
  minDamageThresholdPercent: number; // 33%
  officialSourceUrl: string;
  officialResolutionRef: string;
  effectiveDate: string;
  applicableDisasterTypes: DisasterType[];
  eligibilityConditions: {
    en: string[];
    mr: string[];
    hi: string[];
  };
  en: {
    categoryName: string;
    description: string;
    exampleCrops: string[];
    normNote: string;
  };
  mr: {
    categoryName: string;
    description: string;
    exampleCrops: string[];
    normNote: string;
  };
  hi: {
    categoryName: string;
    description: string;
    exampleCrops: string[];
    normNote: string;
  };
}

export interface DisasterInfo {
  id: DisasterType;
  iconName: string;
  coveredUnderSdrf: boolean;
  coveredUnderPmfbyLocalized: boolean; // Does 72-hr rule apply?
  en: {
    name: string;
    description: string;
    reportingUrgency: string;
  };
  mr: {
    name: string;
    description: string;
    reportingUrgency: string;
  };
  hi: {
    name: string;
    description: string;
    reportingUrgency: string;
  };
}

export interface PanchanamaDocItem {
  id: string;
  required: boolean;
  en: {
    title: string;
    authority: string;
    whyNeeded: string;
    tip: string;
  };
  mr: {
    title: string;
    authority: string;
    whyNeeded: string;
    tip: string;
  };
  hi: {
    title: string;
    authority: string;
    whyNeeded: string;
    tip: string;
  };
}

export interface VerifiedOfficialPortal {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  url: string;
  category: "pmfby" | "sdrf" | "grievance" | "app";
  helpline?: string;
  officialSource: string;
  lastVerifiedDate: string;
}

// 1. Official SDRF/NDRF Compensation Rates
export const OFFICIAL_SDRF_RATES: Record<LandCategory, OfficialRateItem> = {
  rainfed: {
    id: "rainfed",
    centralSdrfPerHectare: 8500,
    maharashtraEnhancedPerHectare: 13600,
    centralMaxAreaHectares: 2,
    stateMaxAreaHectares: 3,
    minDamageThresholdPercent: 33,
    officialSourceUrl: "https://ndmindia.mha.gov.in",
    officialResolutionRef: "MHA Order No. 33-01/2022-NDM-I & Maharashtra Revenue & Forest Dept Calamity GRs",
    effectiveDate: "2022-23 to 2025-26 (Verified October 2026)",
    applicableDisasterTypes: ["unseasonal_rain", "hailstorm", "flood", "drought", "pest_attack", "cyclone", "frost"],
    eligibilityConditions: {
      en: [
        "Crop damage must be 33% or higher as assessed by official Joint Panchanama survey.",
        "Landholding must be recorded in e-Pik Pahani digital crop survey for current season.",
        "Assistance ceiling capped at 2.0 hectares under Central SDRF and up to 3.0 hectares under notified State Calamity GRs.",
        "Disbursement is made directly into farmer's Aadhaar-linked bank account (DBT) upon district calamity notification."
      ],
      mr: [
        "महसूल, कृषी व विमा प्रतिनिधींच्या संयुक्त पंचनाम्यात पिकाचे नुकसान किमान ३३% किंवा त्याहून अधिक नोंदवले पाहिजे.",
        "चालू हंगामात पिकाची नोंद डिजिटल ई-पीक पाहणीमध्ये असणे आवश्यक आहे.",
        "मदत मर्यादा केंद्र नियमानुसार कमाल २.० हेक्टर आणि विशेष शासन निर्णयानुसार कमाल ३.० हेक्टरपर्यंत लागू.",
        "जिल्हा प्रशासनाने नैसर्गिक आपत्ती जाहीर केल्यानंतर निधी थेट आधार संलग्न बँक खात्यात (DBT) जमा होतो."
      ],
      hi: [
        "संयुक्त स्थलीय पंचनामा सर्वेक्षण में फसल क्षति कम से कम 33% या अधिक प्रमाणित होनी चाहिए।",
        "वर्तमान मौसम में संबंधित फसल की प्रविष्टि ई-पड़ताल / डिजिटल गिरदावरी में दर्ज होनी चाहिए।",
        "सहायता की अधिकतम सीमा केंद्रीय SDRF में 2 हेक्टेयर तथा विशेष राज्य शासनादेश में 3 हेक्टेयर निर्धारित है।",
        "आपदा अधिसूचना जारी होने के बाद मुआवजा सीधे आधार लिंक बैंक खाते में डीबीटी द्वारा भेजा जाता है।"
      ]
    },
    en: {
      categoryName: "Rainfed / Dryland Land (जिरायत जमीन)",
      description: "Non-irrigated farmland fully dependent on monsoon rainfall (e.g. Kharif pulses, soybean, jowar, bajra, rainfed cotton).",
      exampleCrops: ["Soybean", "Cotton (Rainfed)", "Pigeon Pea (Tur)", "Green Gram (Moong)", "Black Gram (Urad)", "Pearl Millet (Bajra)"],
      normNote: "Base central SDRF/NDRF norm is ₹8,500/ha up to 2 ha. Special Maharashtra GRs provide enhanced top-up of ₹13,600/ha up to 3 ha in declared calamity zones."
    },
    mr: {
      categoryName: "जिरायत जमीन (Rainfed / Dryland)",
      description: "पावसाच्या पाण्यावर अवलंबून असलेली असिंचित शेतजमीन (उदा. खरीप कडधान्ये, सोयाबीन, ज्वारी, बाजरी, जिरायती कापूस).",
      exampleCrops: ["सोयाबीन", "कापूस (जिरायती)", "तूर", "मूग", "उडीद", "बाजरी", "ज्वारी"],
      normNote: "केंद्र शासनाचा मूळ SDRF/NDRF दर ₹८,५०० प्रति हेक्टर (कमाल २ हेक्टर). महाराष्ट्र शासनाच्या विशेष शासन निर्णयानुसार घोषित आपत्तीत ₹१३,६०० प्रति हेक्टर (कमाल ३ हेक्टर)."
    },
    hi: {
      categoryName: "असिंचित / बारानी भूमि (Rainfed Land)",
      description: "पूर्णतः मानसूनी वर्षा पर निर्भर असिंचित भूमि (जैसे खरीफ दलहन, सोयाबीन, ज्वार, बाजरा, असिंचित कपास)।",
      exampleCrops: ["सोयाबीन", "कपास (असिंचित)", "अरहर (तूर)", "मूंग", "उड़द", "बाजरा", "ज्वार"],
      normNote: "केंद्रीय SDRF/NDRF मूल दर ₹8,500 प्रति हेक्टेयर (अधिकतम 2 हेक्टेयर)। महाराष्ट्र सरकार के विशेष शासनादेश में ₹13,600 प्रति हेक्टेयर (अधिकतम 3 हेक्टेयर) का प्रावधान।"
    }
  },
  irrigated: {
    id: "irrigated",
    centralSdrfPerHectare: 17000,
    maharashtraEnhancedPerHectare: 27000,
    centralMaxAreaHectares: 2,
    stateMaxAreaHectares: 3,
    minDamageThresholdPercent: 33,
    officialSourceUrl: "https://ndmindia.mha.gov.in",
    officialResolutionRef: "MHA Order No. 33-01/2022-NDM-I & Maharashtra Revenue & Forest Dept Calamity GRs",
    effectiveDate: "2022-23 to 2025-26 (Verified October 2026)",
    applicableDisasterTypes: ["unseasonal_rain", "hailstorm", "flood", "drought", "pest_attack", "cyclone", "frost"],
    eligibilityConditions: {
      en: [
        "Applies to farmland with assured irrigation facilities (wells, canals, borewells, or micro-irrigation).",
        "Crop damage must be 33% or higher verified in official field Panchanama.",
        "Cultivation of irrigated crop must be reflected in seasonal e-Pik Pahani entries.",
        "Capped at 2 ha (Central SDRF) and up to 3 ha under special state calamity GRs."
      ],
      mr: [
        "विहीर, कालवा, बोअरवेल किंवा ठिबक/तुषार सिंचनाची सोय असणाऱ्या बागायती शेतीसाठी लागू.",
        "नुकसान किमान ३३% किंवा त्याहून अधिक असणे आणि प्रत्यक्ष संयुक्त पंचनाम्यात नोंद असणे आवश्यक.",
        "ई-पीक पाहणीमध्ये बागायती पिकाची अधिकृत नोंद असणे आवश्यक.",
        "कमाल २ हेक्टर (केंद्र SDRF) व विशेष शासन निर्णयानुसार ३ हेक्टरपर्यंत देय."
      ],
      hi: [
        "कुआं, नहर, नलकूप अथवा ड्रिप/स्प्रिंकलर सिंचाई सुविधा युक्त कृषि भूमि हेतु मान्य।",
        "संयुक्त स्थलीय निरीक्षण में न्यूनतम 33% फसल बर्बादी प्रमाणित होनी आवश्यक।",
        "ई-पड़ताल / गिरदावरी में सिंचित फसल का इंद्राज होना अनिवार्य।",
        "अधिकतम 2 हेक्टेयर (केंद्रीय) व विशेष शासनादेश में 3 हेक्टेयर तक सीमा।"
      ]
    },
    en: {
      categoryName: "Assured Irrigated Land (बागायत जमीन)",
      description: "Farmland with assured source of irrigation such as wells, canals, borewells, or drip/sprinkler systems (e.g. sugarcane, wheat, vegetables, seasonal onions).",
      exampleCrops: ["Sugarcane", "Wheat", "Onion (Seasonal)", "Gram / Chana", "Vegetables", "Maize", "Groundnut"],
      normNote: "Base central SDRF/NDRF norm is ₹17,000/ha up to 2 ha. Special Maharashtra GRs provide enhanced top-up of ₹27,000/ha up to 3 ha in declared calamity zones."
    },
    mr: {
      categoryName: "बागायत जमीन (Assured Irrigated)",
      description: "विहीर, कालवा, बोअरवेल किंवा ठिबक सिंचनाची सोय असलेली बागायती शेती (उदा. ऊस, गहू, हरभरा, कांदा, भाजीपाला).",
      exampleCrops: ["ऊस", "गहू", "कांदा", "हरभरा", "भाजीपाला", "मका", "भुईमूग"],
      normNote: "केंद्र शासनाचा मूळ SDRF दर ₹१७,००० प्रति हेक्टर (कमाल २ हेक्टर). महाराष्ट्र शासनाच्या विशेष शासन निर्णयानुसार घोषित आपत्तीत ₹२७,००० प्रति हेक्टर (कमाल ३ हेक्टर)."
    },
    hi: {
      categoryName: "सिंचित भूमि (Assured Irrigated)",
      description: "कुआं, नहर, बोरवेल या ड्रिप प्रणाली युक्त सिंचित कृषि भूमि (जैसे गन्ना, गेहूं, चना, प्याज, मौसमी सब्जियां)।",
      exampleCrops: ["गन्ना", "गेहूं", "प्याज", "चना", "सब्जियां", "मक्का", "मूंगफली"],
      normNote: "केंद्रीय SDRF मूल दर ₹17,000 प्रति हेक्टेयर (अधिकतम 2 हेक्टेयर)। महाराष्ट्र सरकार के विशेष शासनादेश में ₹27,000 प्रति हेक्टेयर (अधिकतम 3 हेक्टेयर) तक देय।"
    }
  },
  perennial: {
    id: "perennial",
    centralSdrfPerHectare: 22500,
    maharashtraEnhancedPerHectare: 36000,
    centralMaxAreaHectares: 2,
    stateMaxAreaHectares: 3,
    minDamageThresholdPercent: 33,
    officialSourceUrl: "https://ndmindia.mha.gov.in",
    officialResolutionRef: "MHA Order No. 33-01/2022-NDM-I & Maharashtra Revenue & Forest Dept Calamity GRs",
    effectiveDate: "2022-23 to 2025-26 (Verified October 2026)",
    applicableDisasterTypes: ["unseasonal_rain", "hailstorm", "flood", "cyclone", "frost"],
    eligibilityConditions: {
      en: [
        "Applicable to multi-year fruit orchards and plantations (grapes, pomegranate, citrus, mango, banana, guava).",
        "Severe tree damage, flower/fruit dropping, or canopy breakdown of ≥ 33% verified by Horticulture/Agriculture officers.",
        "Orchard must be recorded in land records (7/12 & e-Pik Pahani).",
        "Capped at 2 ha (Central SDRF) and up to 3 ha under special state calamity GRs."
      ],
      mr: [
        "दीर्घकालीन फळबागांसाठी (उदा. द्राक्षे, डाळिंब, संत्रा/मोसंबी, आंबा, केळी, पेरू, चिकू) लागू.",
        "फळगळती, झाडे उन्मळून पडणे किंवा फांद्या मोडल्याने ३३% पेक्षा जास्त नुकसान झाल्याचे कृषी/फलोत्पादन अधिकाऱ्यांकडून प्रमाणित असणे आवश्यक.",
        "७/१२ आणि ई-पीक पाहणीमध्ये फळबागेची नोंद असणे अनिवार्य.",
        "कमाल २ हेक्टर (केंद्र SDRF) व विशेष शासन निर्णयानुसार ३ हेक्टरपर्यंत देय."
      ],
      hi: [
        "बहुवर्षीय फलदार वृक्षों व बागवानी फसलों (अंगूर, अनार, संतरा/मौसंबी, आम, केला, अमरूद) हेतु लागू।",
        "फूल/फल झड़ने अथवा पेड़ों के क्षतिग्रस्त होने से 33% या अधिक नुकसान उद्यान/कृषि अधिकारियों द्वारा सत्यापित होना जरूरी।",
        "खतौनी एवं ई-पड़ताल में फलोद्यान की प्रविष्टि अनिवार्य।",
        "अधिकतम 2 हेक्टेयर (केंद्रीय) व विशेष शासनादेश में 3 हेक्टेयर तक सीमा।"
      ]
    },
    en: {
      categoryName: "Perennial / Horticultural Orchards (बहुवार्षिक फळबागा)",
      description: "Multi-year fruit orchards and plantations requiring multi-year capital investment (e.g. grapes, pomegranate, orange, sweet lime, mango, banana, guava, papaya).",
      exampleCrops: ["Grape (द्राक्ष)", "Pomegranate (डाळिंब)", "Orange / Mosambi (संत्रा/मोसंबी)", "Mango (आंबा)", "Banana (केळी)", "Guava (पेरू)"],
      normNote: "Base central SDRF/NDRF norm is ₹22,500/ha up to 2 ha. Special Maharashtra GRs provide enhanced top-up of ₹36,000/ha up to 3 ha in declared calamity zones."
    },
    mr: {
      categoryName: "बहुवार्षिक फळबागा (Perennial Horticulture)",
      description: "दीर्घकालीन फळबागा व लागवड ज्यामध्ये बहुवर्षीय भांडवली गुंतवणूक असते (उदा. द्राक्षे, डाळिंब, संत्रा, मोसंबी, आंबा, केळी, पेरू).",
      exampleCrops: ["द्राक्ष", "डाळिंब", "संत्रा / मोसंबी", "आंबा (हापूस/इतर)", "केळी", "पेरू", "चिकू"],
      normNote: "केंद्र शासनाचा मूळ SDRF दर ₹२२,५०० प्रति हेक्टर (कमाल २ हेक्टर). महाराष्ट्र शासनाच्या विशेष शासन निर्णयानुसार घोषित आपत्तीत ₹३६,००० प्रति हेक्टर (कमाल ३ हेक्टर)."
    },
    hi: {
      categoryName: "बहुवर्षीय बागवानी / फलदार पौधे (Perennial Horticulture)",
      description: "बहुवर्षीय फलदार वृक्ष व बागवानी फसलें (जैसे अंगूर, अनार, संतरा, मौसंबी, आम, केला, अमरूद)।",
      exampleCrops: ["अंगूर", "अनार", "संतरा / मौसंबी", "आम", "केला", "अमरूद", "चीकू"],
      normNote: "केंद्रीय SDRF मूल दर ₹22,500 प्रति हेक्टेयर (अधिकतम 2 हेक्टेयर)। महाराष्ट्र सरकार के विशेष शासनादेश में ₹36,000 प्रति हेक्टेयर (अधिकतम 3 हेक्टेयर) तक देय।"
    }
  }
};

// 2. Disaster Types & 72-Hour Intimation Applicability
export const DISASTER_TYPES: DisasterInfo[] = [
  {
    id: "unseasonal_rain",
    iconName: "CloudRain",
    coveredUnderSdrf: true,
    coveredUnderPmfbyLocalized: true,
    en: {
      name: "Unseasonal Rain (अवकाळी पाऊस)",
      description: "Heavy unexpected rain outside normal monsoon periods causing lodged crops or grain discoloration.",
      reportingUrgency: "72-Hour Rule Applies under PMFBY if localized flooding or post-harvest cut crop soaking occurs."
    },
    mr: {
      name: "अवकाळी पाऊस (Unseasonal Rain)",
      description: "हंगाम नसताना अचानक झालेला मुसळधार पाऊस, ज्यामुळे उभे पीक आडवे झाले किंवा मळणीचे नुकसान झाले.",
      reportingUrgency: "पीक विमा (PMFBY) स्थानिक आपत्ती किंवा काढणीनंतरच्या नुकसानीसाठी ७२ तासांच्या आत पूर्वसूचना अनिवार्य आहे."
    },
    hi: {
      name: "बेमौसम बारिश (Unseasonal Rain)",
      description: "असामयिक भारी बारिश से फसल का गिरना या कटी हुई फसल का भीग जाना।",
      reportingUrgency: "पीएमएफबीवाई में स्थानीय आपदा व कटाई उपरांत नुकसान हेतु 72 घंटे के भीतर पूर्व-सूचना अनिवार्य है।"
    }
  },
  {
    id: "hailstorm",
    iconName: "CloudHail",
    coveredUnderSdrf: true,
    coveredUnderPmfbyLocalized: true,
    en: {
      name: "Hailstorm (गारपीट)",
      description: "Severe ice pellets causing mechanical destruction of leaves, flower dropping, and fruit scarring.",
      reportingUrgency: "Strict 72-Hour rule applies under PMFBY Localized Calamity. Individual crop survey is mandated."
    },
    mr: {
      name: "गारपीट (Hailstorm)",
      description: "गारांचा मारा होऊन पिकांची पाने, फुले व फळे गळून जाणे व फांद्या मोडणे.",
      reportingUrgency: "पीक विम्यात (PMFBY) गारपीट ही 'स्थानिक आपत्ती' असल्याने ७२ तासांच्या आत नोंदणी करणे बंधनकारक आहे."
    },
    hi: {
      name: "ओलावृष्टि (Hailstorm)",
      description: "ओले गिरने से पत्तियों, फूलों और फलों का झड़ना व डालियों का टूटना।",
      reportingUrgency: "पीएमएफबीवाई के तहत ओलावृष्टि स्थानीय आपदा में आती है, अतः 72 घंटे के अंदर सूचना देना अनिवार्य है।"
    }
  },
  {
    id: "flood",
    iconName: "Waves",
    coveredUnderSdrf: true,
    coveredUnderPmfbyLocalized: true,
    en: {
      name: "Flooding / Inundation (अतिवृष्टी व जलप्लावन)",
      description: "Excess river overflow or stagnant water submersion suffocating root systems for over 48 hours.",
      reportingUrgency: "72-Hour intimation required for isolated field inundation under PMFBY."
    },
    mr: {
      name: "अतिवृष्टी व जलप्लावन (Flood / Inundation)",
      description: "नदी-नाले दुथडी भरून शेतात पाणी शिरणे किंवा ४८ तासांपेक्षा जास्त वेळ पाणी साचून मुळे सडणे.",
      reportingUrgency: "वैयक्तिक शेतातील जलप्लावन (Inundation) साठी पीक विमा ॲपवर ७२ तासांच्या आत नोंदणी करावी लागते."
    },
    hi: {
      name: "बाढ़ एवं जलभराव (Flood / Inundation)",
      description: "अतिवृष्टि से खेत में पानी भर जाना और फसलों की जड़ें सड़ जाना।",
      reportingUrgency: "व्यक्तिगत खेत में जलभराव के लिए फसल बीमा ऐप पर 72 घंटे के अंदर सूचना दर्ज कराएं।"
    }
  },
  {
    id: "drought",
    iconName: "SunDim",
    coveredUnderSdrf: true,
    coveredUnderPmfbyLocalized: false, // Widespread, not individual 72-hr notice
    en: {
      name: "Drought / Prolonged Dry Spell (दुष्काळ / पावसाचा खंड)",
      description: "Continuous dry spell of 21+ days during critical growth stages causing crop wilting.",
      reportingUrgency: "Widespread Calamity: Individual 72-hr notice is NOT required; evaluated by District Committee via satellite index and rainfall deficit."
    },
    mr: {
      name: "दुष्काळ / पावसाचा मोठा खंड (Drought)",
      description: "पिकाच्या संवेदनशील अवस्थेत २१ पेक्षा अधिक दिवस पावसाचा खंड पडल्याने पिके सुकणे.",
      reportingUrgency: "ही 'सर्वव्यापी आपत्ती' (Widespread) असल्याने ७२ तासांची वैयक्तिक सूचना लागू नाही; शासन पातळीवर नजरअंदाज व पीक कापणी प्रयोगाने ठरवले जाते."
    },
    hi: {
      name: "सूखा / वर्षा का अंतराल (Drought)",
      description: "महत्वपूर्ण अवस्था में लगातार 21 दिनों से अधिक बारिश न होना।",
      reportingUrgency: "व्यापक आपदा होने के कारण 72 घंटे की व्यक्तिगत पूर्व-सूचना आवश्यक नहीं है; जिला प्रशासन व सैटेलाइट डेटा से तय होता है।"
    }
  },
  {
    id: "pest_attack",
    iconName: "Bug",
    coveredUnderSdrf: true,
    coveredUnderPmfbyLocalized: false,
    en: {
      name: "Severe Pest / Disease Epidemic (मोठ्या प्रमाणावर कीड प्रादुर्भाव)",
      description: "Widespread outbreak (e.g. Pink Bollworm, Fall Armyworm, Locust, White Grub) exceeding economic injury level.",
      reportingUrgency: "Covered under SDRF and PMFBY localized post-declaration protocols. Contact Taluka Agriculture Officer immediately."
    },
    mr: {
      name: "मोठ्या प्रमाणावर कीड / रोग प्रादुर्भाव (Pest Outbreak)",
      description: "आर्थिक नुकसान पातळी ओलांडणारा व्यापक कीड हल्ला (उदा. बोंडअळी, लष्करी अळी, हुमणी कीड, टोळधाड).",
      reportingUrgency: "SDRF व विमा नियमानुसार तालुका कृषी अधिकाऱ्यांकडे त्वरित सामुदायिक अर्ज दाखल करावा."
    },
    hi: {
      name: "गंभीर कीट व व्याधि प्रकोप (Severe Pest Epidemic)",
      description: "गुलाबी सुंडी, फॉल आर्मीवर्म या सफेद लट का व्यापक प्रकोप जो आर्थिक सीमा को पार कर जाए।",
      reportingUrgency: "तुरंत तालुका कृषि अधिकारी या कृषि विज्ञान केंद्र को सूचित कर संयुक्त सर्वेक्षण करवाएं।"
    }
  },
  {
    id: "cyclone",
    iconName: "Wind",
    coveredUnderSdrf: true,
    coveredUnderPmfbyLocalized: true,
    en: {
      name: "Cyclone & High Velocity Gale (चक्रीवादळ व वादळी वारे)",
      description: "Extreme wind speeds snapping horticulture tree canopies, uprooting banana/papaya, and lodging tall crops.",
      reportingUrgency: "72-Hour intimation applies for localized storm damage under PMFBY."
    },
    mr: {
      name: "चक्रीवादळ व वादळी वारे (Cyclone & Storm)",
      description: "वेगवान वाऱ्यामुळे फळझाडांच्या फांद्या तुटणे, केळी/पपई भुईसपाट होणे आणि पिके आडवी पडणे.",
      reportingUrgency: "स्थानिक वादळ नुकसानीसाठी पीक विम्यात ७२ तासांच्या आत विमा कंपनी व ॲपवर नोंद करावी."
    },
    hi: {
      name: "चक्रवात व तूफानी हवाएं (Cyclone & Gales)",
      description: "तेज आंधी से फलों के पेड़ों का टूटना, केले की फसल का गिरना।",
      reportingUrgency: "फसल बीमा योजना में 72 घंटे के अंदर पूर्व-सूचना दर्ज कराना आवश्यक है।"
    }
  }
];

// 3. Panchanama Mandatory Document Checklist
export const PANCHANAMA_DOCUMENTS: PanchanamaDocItem[] = [
  {
    id: "7_12_extract",
    required: true,
    en: {
      title: "Digital 7/12 Extract (७/१२ उतारा)",
      authority: "Revenue Dept / Mahabhumi Portal (mahabhumi.gov.in)",
      whyNeeded: "Establishes legal land ownership, survey/gat number, and cultivable area.",
      tip: "Ensure current year digital signature (QR code) version is downloaded."
    },
    mr: {
      title: "डिजिटल स्वाक्षरीत ७/१२ उतारा (7/12 Extract)",
      authority: "महसूल विभाग / महाभूमी पोर्टल (mahabhumi.gov.in)",
      whyNeeded: "जमिनीची मालकी, गट क्रमांक व लागवडीयोग्य क्षेत्र सिद्ध करण्यासाठी अत्यावश्यक.",
      tip: "चालू आर्थिक वर्षाचा डिजिटल स्वाक्षरी (QR कोड) असलेला उतारा असणे आवश्यक आहे."
    },
    hi: {
      title: "डिजिटल हस्ताक्षरित खतौनी / 7/12 नकल (Land Record)",
      authority: "राजस्व विभाग / राज्य भूमि पोर्टल",
      whyNeeded: "भूमि स्वामित्व, खसरा/गाटा संख्या व कृषि क्षेत्र प्रमाणित करने हेतु।",
      tip: "चालू वित्तीय वर्ष की डिजिटल प्रति जिसमें क्यूआर कोड अंकित हो, प्रस्तुत करें।"
    }
  },
  {
    id: "e_pik_pahani",
    required: true,
    en: {
      title: "e-Pik Pahani Registration (ई-पीक पाहणी नोंद)",
      authority: "DCM Mobile App / State Revenue Dept",
      whyNeeded: "Confirms actual standing crop registered for the ongoing Kharif/Rabi season in government records.",
      tip: "Government compensation (SDRF) is released strictly based on the crop recorded in e-Pik Pahani."
    },
    mr: {
      title: "ई-पीक पाहणी डिजिटल नोंद (e-Pik Pahani Entry)",
      authority: "ई-पीक पाहणी ॲप / महसूल व कृषी विभाग",
      whyNeeded: "चालू हंगामात प्रत्यक्ष शेतात कोणते पीक उभे होते, याची अधिकृत नोंद सिद्ध करण्यासाठी.",
      tip: "शासकीय नुकसान भरपाई (SDRF) थेट ई-पीक पाहणीमधील पिकाच्या नोंदीनुसारच बँक खात्यात जमा होते."
    },
    hi: {
      title: "ई-पड़ताल / ई-पीक पाहणी में फसल प्रविष्टि",
      authority: "राजस्व व कृषि विभाग ऐप",
      whyNeeded: "वर्तमान मौसम में खेत में वास्तविक बोई गई फसल का सरकारी रिकॉर्ड प्रमाण।",
      tip: "सरकारी मुआवजा केवल उन्हीं फसलों का स्वीकृत होता है जो डिजिटल गिरदावरी/ई-पड़ताल में दर्ज हैं।"
    }
  },
  {
    id: "8_a_extract",
    required: true,
    en: {
      title: "8-A Extract / Landholding Register (८-अ उतारा)",
      authority: "Talathi / Revenue Department",
      whyNeeded: "Proves total holding across all survey numbers to verify the 2 ha / 3 ha ceiling cap.",
      tip: "Required so the administration can check if the farmer is eligible for small/marginal slab."
    },
    mr: {
      title: "८-अ खाते उतारा (8-A Khate Utarn)",
      authority: "तलाठी / महसूल विभाग",
      whyNeeded: "शेतकऱ्याच्या नावावर एकूण किती जमीन आहे हे तपासून कमाल २ किंवा ३ हेक्टर मर्यादा निश्चित करण्यासाठी.",
      tip: "अल्प व अत्यल्प भूधारक पात्रता तपासण्यासाठी सर्व गटांचा एकत्रित ८-अ आवश्यक असतो."
    },
    hi: {
      title: "खाता खतौनी / 8-अ खाता उद्धरण (Total Holding)",
      authority: "पटवारी / लेखपाल / राजस्व विभाग",
      whyNeeded: "किसान के नाम कुल कृषि भूमि की जांच कर 2 से 3 हेक्टेयर की अधिकतम सीमा तय करने हेतु।",
      tip: "लघु एवं सीमांत किसान श्रेणी सत्यापन के लिए यह जरूरी है।"
    }
  },
  {
    id: "aadhaar_bank_passbook",
    required: true,
    en: {
      title: "Aadhaar Card & Bank Passbook (NPCI/DBT Active)",
      authority: "UIDAI & Bank Branch",
      whyNeeded: "Direct Benefit Transfer (DBT) requires Aadhaar seeded in the National Payments Corporation of India (NPCI) mapper.",
      tip: "Make sure your bank account is not frozen and has active Aadhaar seeding (e-KYC verified)."
    },
    mr: {
      title: "आधार कार्ड व बँक पासबुक (NPCI / DBT सक्रिय)",
      authority: "UIDAI आणि संबंधित बँक शाखा",
      whyNeeded: "शासकीय निधी व पीक विमा नुकसान भरपाई थेट आधार संलग्न बँक खात्यात (DBT द्वारे) जमा होण्यासाठी.",
      tip: "बँक खात्याची NPCI मॅपिंग सक्रिय असल्याची खात्री करा जेणेकरून पैसे अडकणार नाहीत."
    },
    hi: {
      title: "आधार कार्ड व बैंक पासबुक (NPCI / DBT सक्रिय)",
      authority: "यूआईडीएआई व बैंक शाखा",
      whyNeeded: "मुआवजा राशि प्रत्यक्ष लाभ अंतरण (DBT) के जरिए सीधे बैंक खाते में पहुंचने के लिए।",
      tip: "बैंक खाते का आधार से लिंक व डीबीटी चालू (Active) होना आवश्यक है।"
    }
  },
  {
    id: "pmfby_receipt",
    required: false,
    en: {
      title: "Crop Insurance Policy Receipt / Application ID (विमा पावती)",
      authority: "CSC / Bank / PMFBY Portal",
      whyNeeded: "Mandatory if claiming insurance compensation under PMFBY (1-Rupee scheme in Maharashtra).",
      tip: "Keep the 15-digit Application Reference Number (ARN) ready when calling 14447."
    },
    mr: {
      title: "पीक विमा भरणा पावती / विमा अर्ज क्रमांक (PMFBY Receipt)",
      authority: "आपले सरकार सेवा केंद्र / बँक / pmfby.gov.in",
      whyNeeded: "प्रधानमंत्री पीक विमा योजनेअंतर्गत (₹१ पीक विमा) दावा दाखल करताना अर्जाचा संदर्भ देण्यासाठी.",
      tip: "१४४४७ हेल्पलाईनवर तक्रार करताना पावतीवरील १५ अंकी अर्ज क्रमांक (Application ID) जवळ ठेवा."
    },
    hi: {
      title: "फसल बीमा रसीद / पॉलिसी संख्या (PMFBY Receipt)",
      authority: "सीएससी / बैंक / पीएमएफबीवाई पोर्टल",
      whyNeeded: "प्रधानमंत्री फसल बीमा योजना के तहत क्षतिपूर्ति का दावा प्रस्तुत करने के लिए।",
      tip: "14447 पर कॉल करते समय बीमा रसीद पर दर्ज एप्लीकेशन आईडी पास रखें।"
    }
  },
  {
    id: "geotagged_photos",
    required: true,
    en: {
      title: "Geotagged Photographs of Damaged Crop (GPS फोटो)",
      authority: "Crop Insurance Mobile App or GPS Camera",
      whyNeeded: "Visual proof capturing GPS latitude, longitude, and date stamp of crop devastation.",
      tip: "Take 3-4 wide photos showing the entire field and 2-3 close-ups showing ruined pods/grains/roots."
    },
    mr: {
      title: "नुकसानीचे जिओटॅग केलेले छायाचित्र (GPS Photos with Date)",
      authority: "क्रॉप इन्शुरन्स ॲप किंवा GPS मॅप कॅमेरा",
      whyNeeded: "शेतातील नुकसानीचे अक्षांश-रेखांश (GPS Location) व तारखेसह डिजिटल पुरावा.",
      tip: "संपूर्ण शेताचे लांबून २-३ फोटो आणि पिकाच्या खराब झालेल्या भागाचे जवळून २ फोटो काढावेत."
    },
    hi: {
      title: "क्षतिग्रस्त फसल के जीपीएस युक्त फोटो (Geotagged Photos)",
      authority: "क्रॉप इंश्योरेंस मोबाइल ऐप अथवा जीपीएस कैमरा",
      whyNeeded: "खेत की अक्षांश-देशांतर स्थिति और तिथि के साथ फसल बर्बादी का डिजिटल साक्ष्य।",
      tip: "पूरे खेत का व्यापक फोटो और खराब बालियों/फलों का स्पष्ट क्लोज-अप फोटो लें।"
    }
  }
];

// 4. Verified Government Portals & Emergency Helplines
export const VERIFIED_OFFICIAL_PORTALS: VerifiedOfficialPortal[] = [
  {
    id: "pmfby_national_helpline",
    name: "PMFBY National Crop Insurance Toll-Free Helpline",
    nameMr: "प्रधानमंत्री पीक विमा राष्ट्रीय टोल-फ्री हेल्पलाईन (१४४४७)",
    nameHi: "प्रधानमंत्री फसल बीमा राष्ट्रीय टोल-फ्री हेल्पलाइन (14447)",
    url: "tel:14447",
    category: "pmfby",
    helpline: "14447",
    officialSource: "Ministry of Agriculture & Farmers Welfare, GoI (pmfby.gov.in)",
    lastVerifiedDate: "October 2026"
  },
  {
    id: "pmfby_portal",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY) Official Portal",
    nameMr: "प्रधानमंत्री पीक विमा योजना अधिकृत केंद्र पोर्टल",
    nameHi: "प्रधानमंत्री फसल बीमा योजना आधिकारिक पोर्टल",
    url: "https://pmfby.gov.in",
    category: "pmfby",
    officialSource: "Department of Agriculture & Farmers Welfare, GoI",
    lastVerifiedDate: "October 2026"
  },
  {
    id: "crop_insurance_app",
    name: "Crop Insurance Mobile App (Google Play Store)",
    nameMr: "क्रॉप इन्शुरन्स अधिकृत मोबाईल ॲप (गूगल प्ले स्टोअर)",
    nameHi: "क्रॉप इंश्योरेंस मोबाइल ऐप (गूगल प्ले स्टोर)",
    url: "https://play.google.com/store/apps/details?id=in.farmguide.farmerapp",
    category: "app",
    officialSource: "Official GoI Farmer App for 72-Hour Loss Intimation",
    lastVerifiedDate: "October 2026"
  },
  {
    id: "kisan_call_center",
    name: "National Kisan Call Center (KCC) Toll-Free",
    nameMr: "राष्ट्रीय किसान कॉल सेंटर टोल-फ्री (१८००-१८०-१५५१)",
    nameHi: "राष्ट्रीय किसान कॉल सेंटर टोल-फ्री (1800-180-1551)",
    url: "tel:18001801551",
    category: "grievance",
    helpline: "1800-180-1551",
    officialSource: "Ministry of Agriculture & Farmers Welfare, GoI (Open 6 AM - 10 PM)",
    lastVerifiedDate: "October 2026"
  },
  {
    id: "maharashtra_krishi_portal",
    name: "Maharashtra Agriculture Department (कृषी विभाग)",
    nameMr: "महाराष्ट्र शासन कृषी विभाग अधिकृत संकेतस्थळ",
    nameHi: "महाराष्ट्र सरकार कृषि विभाग आधिकारिक वेबसाइट",
    url: "https://krishi.maharashtra.gov.in",
    category: "sdrf",
    helpline: "1800-233-4000",
    officialSource: "Government of Maharashtra (Department of Agriculture)",
    lastVerifiedDate: "October 2026"
  },
  {
    id: "maharashtra_gr_portal",
    name: "Maharashtra Official Government Resolutions (शासन निर्णय शोध)",
    nameMr: "महाराष्ट्र शासन अधिकृत शासन निर्णय (GR) पोर्टल",
    nameHi: "महाराष्ट्र सरकार आधिकारिक शासनादेश (GR) पोर्टल",
    url: "https://gr.maharashtra.gov.in",
    category: "sdrf",
    officialSource: "Government of Maharashtra Official Resolution Repository",
    lastVerifiedDate: "October 2026"
  },
  {
    id: "ndmindia_portal",
    name: "National Disaster Management Portal (MHA Guidelines)",
    nameMr: "राष्ट्रीय आपत्ती व्यवस्थापन प्रभाग (गृह मंत्रालय, भारत सरकार)",
    nameHi: "राष्ट्रीय आपदा प्रबंधन प्रभाग (गृह मंत्रालय, भारत सरकार)",
    url: "https://ndmindia.mha.gov.in",
    category: "sdrf",
    officialSource: "Disaster Management Division, Ministry of Home Affairs, GoI",
    lastVerifiedDate: "October 2026"
  },
  {
    id: "mahabhumi_portal",
    name: "Mahabhumi (Digital 7/12 & 8-A Land Records)",
    nameMr: "महाभूमी अधिकृत पोर्टल (डिजिटल ७/१२ व ८-अ उतारा)",
    nameHi: "महाभूमि आधिकारिक पोर्टल (डिजिटल 7/12 व 8-अ नकल)",
    url: "https://bhulekh.mahabhumi.gov.in",
    category: "sdrf",
    officialSource: "Revenue Department, Government of Maharashtra",
    lastVerifiedDate: "October 2026"
  },
  {
    id: "mahadbt_portal",
    name: "Aaple Sarkar MahaDBT Farmer Portal",
    nameMr: "आपले सरकार महाडीबीटी शेतकरी योजना व साहाय्य",
    nameHi: "आपले सरकार महाडीबीटी किसान योजना व सहायता पोर्टल",
    url: "https://mahadbt.maharashtra.gov.in",
    category: "sdrf",
    helpline: "022-49150800",
    officialSource: "Government of Maharashtra Direct Benefit Transfer",
    lastVerifiedDate: "October 2026"
  }
];

// 5. Unit Conversion Utilities
export type AreaUnit = "guntha" | "acre" | "hectare";

export function convertAreaToHectare(amount: number, unit: AreaUnit): number {
  if (!amount || isNaN(amount) || !isFinite(amount) || amount <= 0) return 0;
  switch (unit) {
    case "guntha":
      // 1 Hectare = 100 Gunthas / Ares (40 Gunthas = 1 Acre)
      return amount / 100;
    case "acre":
      // 1 Hectare = 2.47105 Acres => 1 Acre = 0.404686 Hectares
      return amount * 0.404686;
    case "hectare":
      return amount;
    default:
      return amount;
  }
}

export function convertHectareToOtherUnits(hectares: number): {
  gunthas: number;
  acres: number;
  hectares: number;
} {
  const h = !hectares || isNaN(hectares) || !isFinite(hectares) ? 0 : Math.max(0, hectares);
  return {
    hectares: Number(h.toFixed(4)),
    acres: Number((h * 2.47105).toFixed(2)),
    gunthas: Number((h * 100).toFixed(1))
  };
}

// 6. Transparent Compensation Calculation
export interface CalculationResult {
  isEligibleDamage: boolean; // Must be >= 33%
  damagePercentage: number;
  landCategory: LandCategory;
  enteredArea: number;
  enteredUnit: AreaUnit;
  normalizedHectares: number;
  effectiveCentralHectares: number; // Capped at 2 ha
  effectiveStateHectares: number; // Capped at 3 ha
  centralEstimatedAssistance: number; // In INR
  stateEnhancedEstimatedAssistance: number; // In INR
  statutoryMaxCentralCeilingHectares: number;
  statutoryMaxStateCeilingHectares: number;
  ratePerHectareCentral: number;
  ratePerHectareState: number;
  applicableDisasterId: DisasterType;
  officialSourceUrl: string;
  officialResolutionRef: string;
  centralResolutionRef: string;
  stateResolutionRef: string;
  isStateEnhancedVerified: boolean;
  selectedState: string;
  effectiveDate: string;
  eligibilityConditions: {
    en: string[];
    mr: string[];
    hi: string[];
  };
  disclaimer: {
    en: string;
    mr: string;
    hi: string;
  };
}

export function calculateEstimatedRelief(params: {
  landCategory: LandCategory;
  areaAmount: number;
  areaUnit: AreaUnit;
  damagePercentage: number;
  disasterType: DisasterType;
  selectedState?: string;
}): CalculationResult {
  const { landCategory, areaAmount, areaUnit, damagePercentage, disasterType, selectedState = "Maharashtra" } = params;
  const rateItem = OFFICIAL_SDRF_RATES[landCategory];

  const normalizedHectares = convertAreaToHectare(areaAmount, areaUnit);
  const isEligibleDamage = damagePercentage >= rateItem.minDamageThresholdPercent;

  // Maximum eligible area caps
  const effectiveCentralHectares = Math.min(normalizedHectares, rateItem.centralMaxAreaHectares);
  const effectiveStateHectares = Math.min(normalizedHectares, rateItem.stateMaxAreaHectares);

  let centralEstimatedAssistance = 0;
  let stateEnhancedEstimatedAssistance = 0;

  if (isEligibleDamage && normalizedHectares > 0) {
    centralEstimatedAssistance = Math.round(effectiveCentralHectares * rateItem.centralSdrfPerHectare);
    stateEnhancedEstimatedAssistance = Math.round(effectiveStateHectares * rateItem.maharashtraEnhancedPerHectare);
  }

  const isStateEnhancedVerified = selectedState === "Maharashtra";
  const centralResolutionRef = "MHA Order No. 33-01/2022-NDM-I (GoI SDRF/NDRF Norms, effective 2022-23 to 2025-26)";
  const stateResolutionRef = isStateEnhancedVerified
    ? "Revenue & Forest Dept, Govt of Maharashtra GR dated 01/01/2024 (Enhanced Rates & 3 Ha Cap)"
    : `Illustrative & Unverified for ${selectedState} (State-specific calamity top-up GR pending official notification)`;

  return {
    isEligibleDamage,
    damagePercentage,
    landCategory,
    enteredArea: areaAmount,
    enteredUnit: areaUnit,
    normalizedHectares: Number(normalizedHectares.toFixed(4)),
    effectiveCentralHectares: Number(effectiveCentralHectares.toFixed(4)),
    effectiveStateHectares: Number(effectiveStateHectares.toFixed(4)),
    centralEstimatedAssistance,
    stateEnhancedEstimatedAssistance,
    statutoryMaxCentralCeilingHectares: rateItem.centralMaxAreaHectares,
    statutoryMaxStateCeilingHectares: rateItem.stateMaxAreaHectares,
    ratePerHectareCentral: rateItem.centralSdrfPerHectare,
    ratePerHectareState: rateItem.maharashtraEnhancedPerHectare,
    applicableDisasterId: disasterType,
    officialSourceUrl: rateItem.officialSourceUrl,
    officialResolutionRef: `${centralResolutionRef} | ${stateResolutionRef}`,
    centralResolutionRef,
    stateResolutionRef,
    isStateEnhancedVerified,
    selectedState,
    effectiveDate: rateItem.effectiveDate,
    eligibilityConditions: rateItem.eligibilityConditions,
    disclaimer: {
      en: "ILLUSTRATIVE ESTIMATE ONLY: The figures displayed above are illustrative estimates computed from official baseline SDRF/NDRF guidelines (MHA Order No. 33-01/2022-NDM-I) and state resolution slabs. This is NOT a guarantee of payment. Actual assistance depends on the official Joint Panchanama conducted by Revenue & Agriculture officials, notified calamity declarations in your specific taluka/village, and budgetary approvals.",
      mr: "केवळ माहिती व अंदाजासाठी (ILLUSTRATIVE ESTIMATE): वरील रक्कम ही केंद्र सरकारच्या SDRF/NDRF मार्गदर्शक तत्त्वे व राज्य शासनाच्या प्रचलित शासन निर्णयातील दरांवर आधारित केवळ अंदाजित आकडेमोड आहे. ही कोणतीही अधिकृत नुकसान भरपाईची हमी नाही. प्रत्यक्ष मिळणारी मदत ही महसूल व कृषी अधिकाऱ्यांनी केलेल्या प्रत्यक्ष संयुक्त पंचनाम्यावर, आपल्या गावात/मंडळात शासन निर्णय जाहीर झाला आहे की नाही यावर आणि उपलब्ध निधीवर अवलंबून असते.",
      hi: "केवल दृष्टांत व अनुमान हेतु (ILLUSTRATIVE ESTIMATE): प्रदर्शित की गई राशि केंद्रीय SDRF/NDRF दिशानिर्देशों व राज्य शासनादेशों की दरों पर आधारित केवल सांकेतिक अनुमान है। यह किसी भी प्रकार के मुआवजे की गारंटी नहीं है। वास्तविक सहायता राशि राजस्व एवं कृषि विभाग के संयुक्त पंचनामे (फील्ड सर्वे), संबंधित क्षेत्र में आपदा की आधिकारिक अधिसूचना व सरकारी बजट पर निर्भर करती है।"
    }
  };
}

// ============================================================================
// 7. MAHARASHTRA DROUGHT-AFFECTED TALUKA DIRECTORY & CONCESSION STATUS
// Official Sources:
// - Revenue & Forest Department, GoM GR dated 31/10/2023 (शासन निर्णय क्र. संकीर्ण-२०२३/प्र.क्र.२५१/म-३)
// - Revenue & Forest Department, GoM GR dated 10/11/2023 (शासन निर्णय क्र. संकीर्ण-२०२३/प्र.क्र.२५१(भाग-२)/म-३)
// - Cabinet Sub-Committee on Drought Reviews & Disaster Management Guidelines
// ============================================================================

export type DroughtStatus = 
  | "declared_severe" 
  | "declared_moderate" 
  | "drought_like_concession" 
  | "under_assessment" 
  | "verification_pending";

export interface DroughtTalukaItem {
  id: string;
  district: string;
  districtMr: string;
  districtHi: string;
  taluka: string;
  talukaMr: string;
  talukaHi: string;
  status: DroughtStatus;
  grReference: string;
  grDate: string;
  officialSourceUrl: string;
  reliefMeasures: {
    en: string[];
    mr: string[];
    hi: string[];
  };
  lastVerifiedDate: string;
  verificationNote?: {
    en: string;
    mr: string;
    hi: string;
  };
}

export const OFFICIAL_DROUGHT_RELIEF_MEASURES = {
  en: [
    "1. Complete land revenue waiver (जमीन महसुलात संपूर्ण सूट)",
    "2. Agricultural loan restructuring & moratorium on coercive recoveries (पीक कर्ज पुनर्गठन व सक्तीच्या वसुलीस स्थगिती)",
    "3. 33.5% concession on current electricity bills for farm pumps (शेतीपंप वीजबिलात ३३.५% सूट)",
    "4. 100% examination fee waiver for students under Zero-Challan facility (विद्यार्थ्यांना परीक्षा शुल्क १००% माफी)",
    "5. Deployment of drinking water tankers on priority (पिण्याच्या पाण्याचे टँकर मंजुरी)",
    "6. Cattle fodder arrangements & shelter camps where notified (जनावरांच्या चाऱ्याची सोय व चारा छावण्या)",
    "7. MGNREGA employment norm relaxations (रोहयो अंतर्गत मजुरांना रोजगाराची हमी)",
    "8. No disconnection of rural piped water schemes due to electricity arrears (नळ पाणीपुरवठा योजनांची वीज खंडित न करणे)",
    "9. No disconnection of agricultural pump electricity connections (शेतीपंपांची वीज जोडणी खंडित न करणे)",
    "10. Additional foodgrain quotas under Food & Civil Supplies GR 202610221655482506 (अतिरिक्त अन्नधान्य सवलती)",
    "11. Mobile veterinary clinics for drought-hit livestock (फिरती पशुवैद्यकीय पथके)",
    "12. Expedited joint panchanamas and DBT compensation processing (तात्काळ संयुक्त पंचनामे व आर्थिक मदत)"
  ],
  mr: [
    "१. जमीन महसुलात संपूर्ण सूट",
    "२. पीक कर्जाचे पुनर्गठन व सक्तीच्या वसुलीस स्थगिती",
    "३. शेतीपंपाच्या चालू वीजबिलात ३३.५% सूट",
    "४. शेतकऱ्यांच्या पाल्यांचे परीक्षा शुल्क १००% माफी (झिरो-चलन)",
    "५. टंचाईग्रस्त गावांमध्ये पिण्याच्या पाण्यासाठी टँकर मंजुरी",
    "६. जनावरांच्या चाऱ्याची सोय व चारा छावण्यांची मंजुरी",
    "७. रोहयो अंतर्गत मजुरांना अकुशल कामांची हमी",
    "८. नळ पाणीपुरवठा योजनांचे वीज बिल थकबाकीमुळे खंडित न करणे",
    "९. शेतीपंपांची वीज जोडणी खंडित न करणे",
    "१०. अन्न व नागरी पुरवठा GR २०२६१०२२१६५५४८२५०६ नुसार अतिरिक्त अन्नधान्य वाटप",
    "११. आवश्यकतेनुसार जनावरांसाठी फिरती पशुवैद्यकीय पथके",
    "१२. नुकसानग्रस्त शेतकऱ्यांना तात्काळ पंचनामे व आर्थिक भरपाई प्रक्रिया"
  ],
  hi: [
    "1. भू-राजस्व (लगान) में पूर्ण छूट",
    "2. फसल ऋण का पुनर्गठन एवं जबरन वसूली पर रोक",
    "3. कृषि पंपों के चालू बिजली बिल में 33.5% की छूट",
    "4. किसानों के बच्चों की परीक्षा शुल्क 100% माफी (जीरो-चालान)",
    "5. प्रभावित क्षेत्रों में पेयजल टैंकरों की प्राथमिकता पर तैनाती",
    "6. पशुओं के लिए चारा व गौशालाओं में चारे की व्यवस्था",
    "7. मनरेगा के तहत अकुशल रोजगार कार्यों की गारंटी",
    "8. पेयजल आपूर्ति योजनाओं का बिजली कनेक्शन न काटना",
    "9. कृषि पंपों का बिजली कनेक्शन न काटना",
    "10. 22 अक्टूबर खाद्य विभाग GR अनुसार अतिरिक्त खाद्यान्न आवंटन",
    "11. सूखाग्रस्त क्षेत्रों में सचल पशु चिकित्सा दल",
    "12. त्वरित संयुक्त पंचनामा एवं डीबीटी मुआवजा वितरण"
  ]
};

// Dynamically build 2026 Kharif officially declared talukas (304 Talukas across 32-33 Districts)
export const DROUGHT_TALUKAS_MAHARASHTRA: DroughtTalukaItem[] = (() => {
  const list: DroughtTalukaItem[] = [];

  for (const d of MAHARASHTRA_DISTRICTS_DATA) {
    for (const t of d.season2026.declaredTalukas) {
      list.push({
        id: `${d.id}_${t.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
        district: d.name,
        districtMr: d.nameMr,
        districtHi: d.nameHi,
        taluka: t.name,
        talukaMr: t.nameMr,
        talukaHi: t.nameHi,
        status: t.severity === "severe" ? "declared_severe" : "declared_moderate",
        grReference: t.grNumber,
        grDate: t.grDate,
        officialSourceUrl: t.sourceUrl,
        reliefMeasures: OFFICIAL_DROUGHT_RELIEF_MEASURES,
        lastVerifiedDate: "23 October 2026",
        verificationNote: {
          en: `Officially declared in Kharif 2026 drought order (GR 14 Oct 2026 & Food Dept GR 22 Oct 2026). Eligible for 12 statutory concessions and SPPU Zero-Challan fee waiver.`,
          mr: `१४ ऑक्टोबर २०२६ चा शासन निर्णय व २२ ऑक्टोबर २०२६ च्या अन्न व नागरी पुरवठा GR क्र. २०२६१०२२१६५५४८२५०६ नुसार अधिकृत घोषित. १२ शासकीय सवलती व परीक्षा शुल्कमाफी लागू.`,
          hi: `14 अक्टूबर 2026 शासनादेश एवं 22 अक्टूबर खाद्य विभाग GR अनुसार आधिकारिक सूखाग्रस्त घोषित। 12 रियायतें लागू।`
        }
      });
    }
  }

  return list;
})();

// Historical 2023-24 Declared Talukas (40 Talukas from 31 Oct 2023 GR)
export const HISTORICAL_2023_TALUKAS_MAHARASHTRA: DroughtTalukaItem[] = (() => {
  const list: DroughtTalukaItem[] = [];

  for (const d of MAHARASHTRA_DISTRICTS_DATA) {
    for (const t of d.historical2023.declaredTalukas) {
      list.push({
        id: `hist_${d.id}_${t.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
        district: d.name,
        districtMr: d.nameMr,
        districtHi: d.nameHi,
        taluka: t.name,
        talukaMr: t.nameMr,
        talukaHi: t.nameHi,
        status: t.severity === "severe" ? "declared_severe" : "declared_moderate",
        grReference: t.grNumber,
        grDate: t.grDate,
        officialSourceUrl: t.sourceUrl,
        reliefMeasures: OFFICIAL_DROUGHT_RELIEF_MEASURES,
        lastVerifiedDate: "31 October 2023",
        verificationNote: {
          en: "Historical Drought Reference: Officially declared Severe/Moderate Drought under GR No. 202310311805175519 (31 Oct 2023).",
          mr: "ऐतिहासिक संदर्भ: ३१ ऑक्टोबर २०२३ च्या शासन निर्णय क्र. २०२३१०३११८०५१७५५१९ नुसार घोषित ४० तालुक्यांपैकी एक.",
          hi: "ऐतिहासिक संदर्भ: 31 अक्टूबर 2023 शासनादेश के तहत घोषित 40 तहसीलों में से एक।"
        }
      });
    }
  }

  return list;
})();

// Helper to search and filter drought talukas
export function searchDroughtTalukas(
  query: string, 
  statusFilter?: DroughtStatus | "all"
): DroughtTalukaItem[] {
  let list = DROUGHT_TALUKAS_MAHARASHTRA;
  if (statusFilter && statusFilter !== "all") {
    list = list.filter((item) => item.status === statusFilter);
  }
  if (!query || !query.trim()) return list;
  const q = query.trim().toLowerCase();
  return list.filter((item) => {
    return (
      item.taluka.toLowerCase().includes(q) ||
      item.talukaMr.toLowerCase().includes(q) ||
      item.talukaHi.toLowerCase().includes(q) ||
      item.district.toLowerCase().includes(q) ||
      item.districtMr.toLowerCase().includes(q) ||
      item.districtHi.toLowerCase().includes(q)
    );
  });
}

// Get drought taluka statistics
export function getDroughtStats() {
  const total = DROUGHT_TALUKAS_MAHARASHTRA.length; // 304
  const severe = DROUGHT_TALUKAS_MAHARASHTRA.filter((t) => t.status === "declared_severe").length;
  const moderate = DROUGHT_TALUKAS_MAHARASHTRA.filter((t) => t.status === "declared_moderate").length;
  const concession = 0; // Concessions now apply directly to all 304 declared talukas
  const assessment = 0;
  return { 
    total, 
    severe, 
    moderate, 
    concession, 
    assessment,
    totalDistrictsCovered: 33, // 33 Districts covered in Food Dept GR (22 Oct 2026) / 32 in Revenue Corrigendum
    stateTotalTalukas: 358,
    historical2023Total: HISTORICAL_2023_TALUKAS_MAHARASHTRA.length, // 40
    historical2023Circles: 1021
  };
}

// ============================================================================
// 8. LATEST MAHARASHTRA GOVERNMENT ANNOUNCEMENTS & OFFICIAL TIMELINE
// ============================================================================

export type AnnouncementStatus = 
  | "announced" 
  | "gr_issued" 
  | "survey_underway" 
  | "applications_open" 
  | "payments_started" 
  | "payment_confirmed"
  | "historical";

export interface GovAnnouncementItem {
  id: string;
  title: { en: string; mr: string; hi: string };
  authority: { en: string; mr: string; hi: string };
  date: string;
  explanation: { en: string; mr: string; hi: string };
  reliefAmount?: { en: string; mr: string; hi: string };
  eligibility: { en: string; mr: string; hi: string };
  affectedAreas: { en: string; mr: string; hi: string };
  status: AnnouncementStatus;
  statusNote: { en: string; mr: string; hi: string };
  grOrSourceUrl: string;
  grReference?: string;
  lastVerifiedDate: string;
}

export const GOVERNMENT_ANNOUNCEMENTS_MAHARASHTRA: GovAnnouncementItem[] = [
  {
    id: "announcement_food_dept_gr_20261022",
    title: {
      en: "Food & Civil Supplies Dept GR (Code 202610221655482506): Grain Subsidies Notified in All 304 Talukas across 33 Districts",
      mr: "अन्न, नागरी पुरवठा व ग्राहक संरक्षण विभाग GR (सांकेतांक २०२६१०२२१६५५४८२५०६): ३३ जिल्ह्यांतील ३०४ दुष्काळग्रस्त तालुक्यांत सवलती लागू",
      hi: "खाद्य एवं नागरिक आपूर्ति विभाग GR (कोड 202610221655482506): 33 जिलों की 304 सूखाग्रस्त तहसीलों में खाद्यान्न रियायतें लागू"
    },
    authority: {
      en: "Food, Civil Supplies and Consumer Protection Department, Government of Maharashtra",
      mr: "अन्न, नागरी पुरवठा व ग्राहक संरक्षण विभाग, महाराष्ट्र शासन",
      hi: "खाद्य, नागरिक आपूर्ति एवं उपभोक्ता संरक्षण विभाग, महाराष्ट्र शासन"
    },
    date: "22 October 2026",
    explanation: {
      en: "Official Government Resolution formally notified on 22 October 2026 granting statutory foodgrain assistance and consumer subsidies to all farming families residing in the 304 officially declared drought-hit talukas across 33 districts.",
      mr: "२२ ऑक्टोबर २०२६ रोजी निर्गमित अधिकृत शासन निर्णयानुसार राज्यातील ३३ जिल्ह्यांमधील सर्व ३०४ दुष्काळग्रस्त तालुक्यांतील शेतकरी कुटुंबांना अन्नधान्य सवलती व रेशन लाभ देण्याचे आदेश जारी करण्यात आले आहेत.",
      hi: "22 अक्टूबर 2026 को जारी आधिकारिक शासनादेश अनुसार राज्य के 33 जिलों की सभी 304 सूखाग्रस्त तहसीलों के किसान परिवारों को खाद्यान्न राहत व राशन रियायतें लागू की गई हैं।"
    },
    reliefAmount: {
      en: "Subsidized foodgrains & NFSA/APL drought rations for farming households in 304 talukas",
      mr: "३०४ तालुक्यांतील शेतकरी कुटुंबांना अनुदानित अन्नधान्य व रेशन सवलती",
      hi: "304 तहसीलों के किसान परिवारों को रियायती खाद्यान्न एवं राशन छूट"
    },
    eligibility: {
      en: "All ration-card holding farmers and agricultural laborers residing in the 304 gazetted drought talukas.",
      mr: "अधिसूचित ३०४ दुष्काळग्रस्त तालुक्यांमधील सर्व शिधापत्रिकाधारक शेतकरी व शेतमजूर कुटुंबे.",
      hi: "अधिसूचित 304 सूखाग्रस्त तहसीलों के सभी राशन कार्ड धारक किसान व खेतिहर मजदूर।"
    },
    affectedAreas: {
      en: "304 officially declared talukas across 33 districts of Maharashtra",
      mr: "महाराष्ट्रातील ३३ जिल्ह्यांमधील सर्व ३०४ अधिकृत दुष्काळग्रस्त तालुके",
      hi: "महाराष्ट्र के 33 जिलों की सभी 304 आधिकारिक सूखाग्रस्त तहसीलें"
    },
    status: "gr_issued",
    statusNote: {
      en: "STATUS: OFFICIAL ORDER VERIFIED (GR ISSUED). Formally published on Government Resolution portal under code 202610221655482506 on 22 October 2026. Authoritative confirmation of 304 talukas across 33 districts.",
      mr: "सद्यस्थिती: अधिकृत शासन निर्णय प्रमाणित (GR निर्गमित). २२ ऑक्टोबर २०२६ रोजी सांकेतांक २०२६१०२२१६५५४८२५०६ अन्वये GR पोर्टलवर उपलब्ध. ३३ जिल्ह्यांतील ३०४ तालुक्यांचा अधिकृत पुरावा.",
      hi: "स्थिति: आधिकारिक शासनादेश सत्यापित। 22 अक्टूबर 2026 को कोड 202610221655482506 द्वारा राजपत्रित। 33 जिलों में 304 तहसीलों की आधिकारिक पुष्टि।"
    },
    grOrSourceUrl: "https://gr.maharashtra.gov.in",
    grReference: "शासन निर्णय सांकेतांक २०२६१०२२१६५५४८२५०६ (२२ ऑक्टोबर २०२६)",
    lastVerifiedDate: "23 October 2026"
  },
  {
    id: "announcement_exam_fee_waiver_sppu_2026",
    title: {
      en: "Historical Record: 2,40,365 Students Benefited from Drought Exam Fee Waiver (AY 2023-24)",
      mr: "ऐतिहासिक नोंद: दुष्काळग्रस्त २,४०,३६५ विद्यार्थ्यांना परीक्षा शुल्कमाफीचा लाभ (शैक्षणिक वर्ष २०२३-२४)",
      hi: "ऐतिहासिक रिकॉर्ड: सूखा प्रभावित 2,40,365 छात्रों को परीक्षा शुल्क माफी का लाभ (शैक्षणिक सत्र 2023-24)"
    },
    authority: {
      en: "Higher & Technical Education Department, GoM & Savitribai Phule Pune University (SPPU)",
      mr: "उच्च व तंत्रशिक्षण विभाग, महाराष्ट्र शासन व सावित्रीबाई फुले पुणे विद्यापीठ",
      hi: "उच्च एवं तकनीकी शिक्षा विभाग, महाराष्ट्र शासन व सावित्रीबाई फुले पुणे विश्वविद्यालय"
    },
    date: "Academic Year 2023-24 (Historical Circular)",
    explanation: {
      en: "Historical drought fee-waiver archive. 2,40,365 students from notified drought talukas across 26 state universities benefited from 100% exam fee exemptions during Academic Year 2023-24 under Circular No. संकीर्ण-२०२३/प्र.क्र.२५१/म-३. At SPPU, 65,200 students registered using the 'Zero-Challan' facility. This record is preserved strictly as historical context and reference.",
      mr: "दुष्काळग्रस्त भागातील विद्यार्थ्यांसाठी परीक्षा शुल्कमाफीची ऐतिहासिक नोंद. शैक्षणिक वर्ष २०२३-२४ मध्ये शासन निर्णय क्र. संकीर्ण-२०२३/प्र.क्र.२५१/म-३ अन्वये २६ विद्यापीठांतील २,४०,३६५ विद्यार्थ्यांना लाभ मिळाला होता. पुणे विद्यापीठात ६५,२०० विद्यार्थ्यांनी 'झिरो चलन' सुविधेद्वारे अर्ज भरले होते. ही केवळ ऐतिहासिक संदर्भासाठी नोंद आहे.",
      hi: "सूखाग्रस्त छात्रों हेतु परीक्षा शुल्क माफी का ऐतिहासिक रिकॉर्ड। सत्र 2023-24 में शासनादेश संकीर्ण-2023/प्र.क्र.251/म-3 के तहत 26 विश्वविद्यालयों के 2,40,365 छात्र लाभान्वित हुए थे। पुणे विवि में 65,200 छात्रों ने 'जीरो चालान' सुविधा ली थी।"
    },
    reliefAmount: {
      en: "100% Examination Fee Waiver (Zero Challan Facility) — Historical 2023-24",
      mr: "१००% परीक्षा शुल्क माफी (झिरो चलन सुविधा) — ऐतिहासिक २०२३-२४",
      hi: "100% परीक्षा शुल्क माफी (जीरो चालान सुविधा) — ऐतिहासिक 2023-24"
    },
    eligibility: {
      en: "Students residing in officially notified drought talukas during Academic Year 2023-24.",
      mr: "शैक्षणिक वर्ष २०२३-२४ मधील अधिसूचित दुष्काळग्रस्त तालुक्यांमधील विद्यार्थी.",
      hi: "शैक्षणिक सत्र 2023-24 के दौरान अधिसूचित सूखाग्रस्त तहसीलों के छात्र।"
    },
    affectedAreas: {
      en: "26 Public Universities covering officially declared 2023-24 drought talukas",
      mr: "२०२३-२४ मधील घोषित दुष्काळग्रस्त तालुक्यांतील २६ सार्वजनिक विद्यापीठे",
      hi: "2023-24 की घोषित सूखा तहसीलों के अंतर्गत 26 विश्वविद्यालय"
    },
    status: "historical",
    statusNote: {
      en: "STATUS: HISTORICAL RECORD (AY 2023-24). Based on Government Circular No. संकीर्ण-२०२३/प्र.क्र.२५१/म-३. Press report archive (Dailyhunt/Sakal) confirms 65,200 SPPU students and 2.40 lakh state-wide students benefited. Not an active 2026 application cycle.",
      mr: "सद्यस्थिती: ऐतिहासिक नोंद (शैक्षणिक वर्ष २०२३-२४). शासन निर्णय क्र. संकीर्ण-२०२३/प्र.क्र.२५१/म-३ व वृत्त संकलन (डेलीहंट/सकाळ). पुणे विद्यापीठातील ६५,२०० व राज्यभरातील २.४० लाख विद्यार्थ्यांना लाभ. २०२६ साठी चालू प्रक्रिया नाही.",
      hi: "स्थिति: ऐतिहासिक रिकॉर्ड (सत्र 2023-24)। शासनादेश संकीर्ण-2023/प्र.क्र.251/म-3 व मीडिया रिपोर्ट पर आधारित। 2026 हेतु सक्रिय आवेदन नहीं।"
    },
    grOrSourceUrl: "https://unipune.ac.in",
    grReference: "शासन निर्णय क्र. संकीर्ण-२०२३/प्र.क्र.२५१/म-३",
    lastVerifiedDate: "23 October 2026"
  },
  {
    id: "announcement_diwali_interim_2026",
    title: {
      en: "Pre-Diwali ₹5,000 Upfront Interim Advance Announcement (Disbursement Pending Finance GR)",
      mr: "दिवाळीपूर्वी ₹५,००० ची तात्काळ अंतरिम आगाऊ मदत — शासकीय घोषणा (निधी वितरण शासन निर्णय प्रतीक्षेत)",
      hi: "दिवाली पूर्व ₹5,000 अग्रिम अंतरिम सहायता की घोषणा (वित्त विभाग शासनादेश प्रतीक्षारत)"
    },
    authority: {
      en: "Office of the Chief Minister, Maharashtra (CM Devendra Fadnavis)",
      mr: "मुख्यमंत्री सचिवालय, महाराष्ट्र शासन (मुख्यमंत्री देवेंद्र फडणवीस)",
      hi: "मुख्यमंत्री कार्यालय, महाराष्ट्र शासन (मुख्यमंत्री देवेंद्र फडणवीस)"
    },
    date: "14 & 17 October 2026",
    explanation: {
      en: "Chief Minister Devendra Fadnavis announced on 14 October (Sahyadri Guest House) and reiterated on 17 October (Wardha visit) that farmers in drought-hit regions would receive an upfront interim cash assistance of ₹5,000 per bank account ahead of Diwali. CRITICAL AUDIT FACT: As of 23 October 2026, no separate implementation Government Resolution (GR) or Finance Department treasury sanction has been gazetted. Zero funds have been credited. On 17 October, farmer Chand Shaikh from Dharashiv returned a ₹5,000 money order to the CM in protest against paltry interim aid. On 22 October, farmer organizations in Nagpur staged a 'Bhik Mango' protest at District Collectorate demanding actual disbursement. Do NOT confuse this ₹5,000 interim advance with the per-hectare statutory crop damage compensation calculator.",
      mr: "मुख्यमंत्री देवेंद्र फडणवीस यांनी १४ ऑक्टोबर (सह्याद्री अतिथीगृह) व १७ ऑक्टोबर (वर्धा दौरा) रोजी दुष्काळग्रस्त शेतकऱ्यांना दिवाळीपूर्वी ₹५,००० ची तात्काळ आगाऊ मदत देण्याची घोषणा केली. महत्त्वाचा पडताळणी शेरा: २३ ऑक्टोबर २०२६ अखेर वित्त विभागाचा कोणताही स्वतंत्र अंमलबजावणी GR किंवा तिजोरी मंजुरी निर्गमित झालेली नाही. शेतकऱ्यांच्या खात्यात एकही रुपया जमा झालेला नाही. १७ ऑक्टोबरला धाराशिवचे शेतकरी चांद शेख यांनी तुटपुंज्या मदतीचा निषेध म्हणून ₹५००० चा मनीऑर्डर मुख्यमंत्र्यांना परत पाठवला; तर २२ ऑक्टोबरला नागपुरात शेतकरी संघटनांनी जिल्हाधिकारी कार्यालयासमोर 'भीक मागो' आंदोलन केले. या ₹५००० च्या आगाऊ मदतीची तुलना प्रति हेक्टर नैसर्गिक आपत्ती भरपाई गणकाशी करू नये.",
      hi: "मुख्यमंत्री देवेंद्र फडणवीस ने 14 अक्टूबर व 17 अक्टूबर (वर्धा) को सूखाग्रस्त किसानों को दिवाली से पहले ₹5,000 की अग्रिम अंतरिम सहायता देने की घोषणा की। ऑडिट तथ्य: 23 अक्टूबर 2026 तक वित्त विभाग का कोई औपचारिक GR या ट्रेजरी आवंटन जारी नहीं हुआ है। खातों में शून्य राशि जमा हुई है। 17 अक्टूबर को धाराशिव के किसान चांद शेख ने विरोध स्वरूप ₹5,000 का मनी ऑर्डर सीएम को लौटा दिया। 22 अक्टूबर को नागपुर में किसान संगठनों ने 'भीक मांगो' प्रदर्शन किया। इसे प्रति-हेक्टेयर फसल नुकसान कैलकुलेटर से भ्रमित न करें।"
    },
    reliefAmount: {
      en: "Reported ₹5,000 per affected farmer account (Interim advance before Diwali - Zero Disbursed)",
      mr: "घोषित ₹५,००० प्रति शेतकरी बँक खाते (दिवाळीपूर्व आगाऊ रक्कम - प्रत्यक्ष वितरण शून्य)",
      hi: "घोषित ₹5,000 प्रति किसान खाता (अग्रिम राशि - प्रत्यक्ष वितरण शून्य)"
    },
    eligibility: {
      en: "Announcement proposed for farmers in officially notified drought talukas with Aadhaar-seeded accounts. Formal eligibility criteria remain unnotified pending Finance GR.",
      mr: "अधिसूचित दुष्काळग्रस्त तालुक्यांतील आधार संलग्न बँक खातेदार शेतकरी प्रस्तावित; मात्र वित्त GR शिवाय निकष अंतिम नाहीत.",
      hi: "अधिसूचित सूखा तहसीलों के किसान प्रस्तावित; औपचारिक पात्रता शासनादेश के अधीन।"
    },
    affectedAreas: {
      en: "Proposed for 304 drought-declared talukas across Maharashtra",
      mr: "महाराष्ट्रातील घोषित ३०४ दुष्काळग्रस्त तालुक्यांसाठी प्रस्तावित",
      hi: "महाराष्ट्र की घोषित 304 तहसीलों हेतु प्रस्तावित"
    },
    status: "announced",
    statusNote: {
      en: "STATUS: ANNOUNCEMENT REPORTED (Official Order Verified: PENDING | Eligibility Confirmed: PENDING | Disbursement Started: NO | Payment Confirmed: NO). Authoritative evidence confirms zero bank credits. Strictly label as unverified announcement.",
      mr: "सद्यस्थिती: केवळ जाहीर आश्वासन (अधिकृत आदेश: प्रतीक्षेत | पात्रता निकष: प्रतीक्षेत | निधी वितरण सुरू: नाही | बँक खात्यात जमा: नाही). अधिकृत पुरावे नसताना निधी जमा झाल्याचा दावा करू नये.",
      hi: "स्थिति: केवल घोषित आश्वासन (शासनादेश: प्रतीक्षारत | पात्रता: प्रतीक्षारत | वितरण: नहीं | भुगतान: नहीं)। खातों में कोई राशि जमा नहीं हुई है।"
    },
    grOrSourceUrl: "https://www.newindianexpress.com/states/maharashtra/2026/Oct/17/farmer-sends-money-order-of-rs-5000-to-maharashtra-cm-fadnavis-over-paltry-interim-aid-by-government",
    lastVerifiedDate: "23 October 2026"
  },
  {
    id: "announcement_water_scarcity_tanker_directives_2026",
    title: {
      en: "Water Scarcity Directives: Village Action Plans Due by 25 Oct for Nagpur, Amravati, Konkan; 886 Active Tankers Statewide",
      mr: "पाणीटंचाई आढावा: नागपूर, अमरावती व कोकण विभागास २५ ऑक्टोबरपर्यंत कृती आराखडा सादर करण्याचे निर्देश; राज्यात ८८६ टँकर सक्रिय",
      hi: "जल संकट समीक्षा: नागपुर, अमरावती व कोंकण संभाग को 25 अक्टूबर तक कार्ययोजना प्रस्तुत करने का निर्देश; राज्य में 886 टैंकर सक्रिय"
    },
    authority: {
      en: "Water Supply and Sanitation Department, Government of Maharashtra (Minister Gulabrao Patil)",
      mr: "पाणीपुरवठा व स्वच्छता विभाग, महाराष्ट्र शासन (मंत्री गुलाबराव पाटील)",
      hi: "पेयजल एवं स्वच्छता विभाग, महाराष्ट्र शासन (मंत्री गुलाबराव पाटिल)"
    },
    date: "21 October 2026 (Audited 23 Oct 2026)",
    explanation: {
      en: "Water Supply & Sanitation Minister Gulabrao Patil held a high-level review on 21 October 2026, ordering district administrations in Nagpur, Amravati, and Konkan divisions to formulate comprehensive village-level water-shortage contingency action plans by 25 October. Critical distinction: These orders prepare action plans despite the absence of severe shortages in these divisions, with drinking water tankers to be deployed strictly as a last resort. Meanwhile, official department tanker reports confirm 886 active drinking water tankers operating across the state, heavily concentrated in Marathwada & Western Maharashtra (Beed: 205, Ahilyanagar: 196, Chhatrapati Sambhajinagar: 179, Solapur: 140). A mandatory 10% urban water rationing cut remains enforced since 16 October.",
      mr: "पाणीपुरवठा व स्वच्छता मंत्री गुलाबराव पाटील यांनी २१ ऑक्टोबर २०२६ रोजी घेतलेल्या आढावा बैठकीत नागपूर, अमरावती व कोकण विभागातील अधिकाऱ्यांना २५ ऑक्टोबरपर्यंत गावनिहाय पाणीटंचाई कृती आराखडे तयार करण्याचे निर्देश दिले. महत्त्वाचा फरक: या तीन विभागांत तीव्र टंचाई नसली तरी आगाऊ खबरदारी म्हणून आराखडा मागवला असून टँकरचा वापर केवळ शेवटचा पर्याय म्हणून करण्याचे आदेश आहेत. दुसरीकडे, अधिकृत टँकर अहवालानुसार राज्यात ८८६ पिण्याचे टँकर सक्रिय आहेत (बीड: २०५, अहिल्यानगर: १९६, छ. संभाजीनगर: १७९, सोलापूर: १४०). १६ ऑक्टोबरपासून १०% शहरी पाणीकपात लागू आहे.",
      hi: "पेयजल मंत्री गुलाबराव पाटिल ने 21 अक्टूबर को समीक्षा बैठक में नागपुर, अमरावती व कोंकण संभाग के अधिकारियों को 25 अक्टूबर तक ग्रामीण जल संकट कार्ययोजना तैयार करने का निर्देश दिया। स्पष्ट भेद: इन संभागों में तीव्र संकट न होने के बावजूद यह एहतियाती योजना है और टैंकर अंतिम विकल्प होंगे। वहीं, आधिकारिक रिपोर्ट अनुसार राज्य में 886 पेयजल टैंकर संचालित हैं (बीड 205, अहिल्यानगर 196, संभाजीनगर 179, सोलापूर 140)। 16 अक्टूबर से 10% शहरी जल कटौती लागू है।"
    },
    reliefAmount: {
      en: "Emergency Drinking Water Tankers (886 Active) & Piped Water Scheme Maintenance Sanctions",
      mr: "आपत्कालीन पिण्याचे पाण्याचे टँकर (८८६ सक्रिय) व ग्रामीण नळ योजना दुरुस्ती निधी",
      hi: "आपातकालीन पेयजल टैंकर (886 सक्रिय) एवं ग्रामीण पाइपलाइन मरम्मत निधि"
    },
    eligibility: {
      en: "Villages and habitations with verified groundwater depletion exceeding 2 meters and depleted borewells.",
      mr: "भूजल पातळी २ मीटरपेक्षा जास्त घटलेली आणि विहिरी/बोअरवेल आटलेली टंचाईग्रस्त गावे व वाड्या.",
      hi: "भूजल स्तर में 2 मीटर से अधिक गिरावट वाले प्रभावित गांव व बस्तियां।"
    },
    affectedAreas: {
      en: "Action Plans: Nagpur, Amravati, Konkan | Active Tankers: Beed (205), Ahilyanagar (196), CSN (179), Solapur (140)",
      mr: "कृती आराखडा: नागपूर, अमरावती, कोकण | सक्रिय टँकर: बीड (२०५), अहिल्यानगर (१९६), छ. संभाजीनगर (१७९), सोलापूर (१४०)",
      hi: "कार्ययोजना: नागपुर, अमरावती, कोंकण | सक्रिय टैंकर: बीड (205), अहिल्यानगर (196), संभाजीनगर (179), सोलापुर (140)"
    },
    status: "survey_underway",
    statusNote: {
      en: "STATUS: OFFICIAL NOTICE VERIFIED & ACTION PLANS IN PROGRESS. Village plans mandated by 25 October. Tanker deployment data verified against official Water Supply Department portal.",
      mr: "सद्यस्थिती: अधिकृत आदेश सत्यापित व कृती आराखडा प्रक्रियेत. २५ ऑक्टोबरपर्यंत आराखडे सादर करण्याची मुदत. ८८६ टँकरची संख्या अधिकृत अहवालावर आधारित.",
      hi: "स्थिति: आधिकारिक आदेश सत्यापित व योजना प्रक्रियाधीन। 25 अक्टूबर तक रिपोर्ट मांगी गई है। 886 टैंकर सक्रिय।"
    },
    grOrSourceUrl: "https://www.indiatoday.in/india/story/maharashtra-water-shortage-village-action-plans-nagpur-amravati-konkan-ptag-3022199-2026-10-21",
    lastVerifiedDate: "23 October 2026"
  },
  {
    id: "announcement_enhanced_gr_2024",
    title: {
      en: "Maharashtra Enhanced Calamity Relief Slabs up to 3 Hectares (GR Issued)",
      mr: "नैसर्गिक आपत्ती नुकसान भरपाई दरात वाढ व मर्यादा ३ हेक्टरपर्यंत लागू (अधिकृत GR)",
      hi: "प्राकृतिक आपदा मुआवजा दरों में वृद्धि एवं सीमा 3 हेक्टेयर तक लागू (आधिकारिक GR)"
    },
    authority: {
      en: "Revenue and Forest Department, Government of Maharashtra",
      mr: "महसूल व वन विभाग, महाराष्ट्र शासन",
      hi: "राजस्व एवं वन विभाग, महाराष्ट्र शासन"
    },
    date: "01 January 2024 (Baseline Calamity Slab)",
    explanation: {
      en: "State Government enhanced natural calamity compensation rates beyond Central SDRF base norms: ₹13,600/ha for rainfed, ₹27,000/ha for irrigated, and ₹36,000/ha for perennial fruit orchards, expanding the statutory assistance cap from 2 hectares to 3 hectares.",
      mr: "महाराष्ट्र शासनाने केंद्र सरकारच्या SDRF मूळ दरांपेक्षा अधिक वाढीव मदत जाहीर केली: जिरायत ₹१३,६००/हेक्टर, बागायत ₹२७,०००/हेक्टर आणि बहुवार्षिक फळबागांसाठी ₹३६,०००/हेक्टर. तसेच क्षेत्र मर्यादा २ हेक्टरवरून ३ हेक्टर करण्यात आली.",
      hi: "महाराष्ट्र सरकार ने केंद्रीय SDRF से अतिरिक्त वृद्धि की: असिंचित ₹13,600/हेक्टेयर, सिंचित ₹27,000/हेक्टेयर तथा बहुवर्षीय बागवानी ₹36,000/हेक्टेयर।"
    },
    reliefAmount: {
      en: "Rainfed: ₹13,600/ha | Irrigated: ₹27,000/ha | Perennial: ₹36,000/ha (Max 3 Ha)",
      mr: "जिरायत: ₹१३,६००/हेक्टर | बागायत: ₹२७,०००/हेक्टर | फळबागा: ₹३६,०००/हेक्टर (कमाल ३ हेक्टर)",
      hi: "असिंचित: ₹13,600/हेक्टेयर | सिंचित: ₹27,000/हेक्टेयर | बागवानी: ₹36,000/हेक्टेयर"
    },
    eligibility: {
      en: "Farmers experiencing ≥ 33% crop loss in notified natural calamities with verified joint panchanama and seasonal e-Pik Pahani.",
      mr: "अधिसूचित नैसर्गिक आपत्तीत किमान ३३% किंवा जास्त नुकसान झालेले शेतकरी ज्यांचा अधिकृत संयुक्त पंचनामा व ई-पीक पाहणी पूर्ण आहे.",
      hi: "अधिसूचित आपदा में न्यूनतम 33% फसल हानि झेलने वाले किसान।"
    },
    affectedAreas: {
      en: "All 36 districts of Maharashtra across declared calamity events",
      mr: "महाराष्ट्रातील सर्व ३६ जिल्हे (घोषित नैसर्गिक आपत्ती प्रसंगी)",
      hi: "महाराष्ट्र के सभी 36 जिले"
    },
    status: "gr_issued",
    statusNote: {
      en: "STATUS: GR ISSUED & FULLY OPERATIONAL. Gazetted under Resolution No. Aapatti-2023/C.R.224/M-3. Validated baseline rule for all calamity compensation calculations in Maharashtra.",
      mr: "स्थिती: शासन निर्णय निर्गमित व पूर्णतः लागू. शासन निर्णय क्र. आपत्ती २०२३/प्र.क्र.२२४/म-३ अन्वये अधिकृतरीत्या अंमलबजावणी सुरू आहे.",
      hi: "स्थिति: शासनादेश जारी व पूर्णतः प्रभावी।"
    },
    grOrSourceUrl: "https://gr.maharashtra.gov.in",
    grReference: "शासन निर्णय क्र. आपत्ती २०२३/प्र.क्र.२२४/म-३",
    lastVerifiedDate: "23 October 2026"
  },
  {
    id: "announcement_historical_2023_archive",
    title: {
      en: "Historical Drought Declarations — 2023–24 (40 Talukas & 1,021 Revenue Circles)",
      mr: "ऐतिहासिक दुष्काळ अभिलेख — २०२३–२४ (४० तालुके व १,०२१ महसूल मंडळे)",
      hi: "ऐतिहासिक सूखा घोषणाएं — 2023–24 (40 तहसीलें एवं 1,021 राजस्व मंडल)"
    },
    authority: {
      en: "Revenue and Forest Department, Government of Maharashtra (Disaster Management Cell)",
      mr: "महसूल व वन विभाग, महाराष्ट्र शासन",
      hi: "राजस्व एवं वन विभाग, महाराष्ट्र शासन"
    },
    date: "31 October 2023 & 10 November 2023 (Historical Archive)",
    explanation: {
      en: "Historical Reference Archive: Under GR dated 31 October 2023, 40 talukas were gazetted as severe/moderate drought-affected. On 10 November 2023, 8 statutory concessions were extended to 1,021 revenue circles. This historical data is retained solely for comparative reference and must NOT be mixed with Kharif 2026 declarations.",
      mr: "ऐतिहासिक संदर्भ अभिलेख: ३१ ऑक्टोबर २०२३ च्या शासन निर्णयानुसार १५ जिल्ह्यांतील ४० तालुके तीव्र/मध्यम दुष्काळग्रस्त घोषित झाले होते आणि १० नोव्हेंबर २०२३ च्या आदेशानुसार १,०२१ महसूल मंडळांना ८ सवलती लागू झाल्या होत्या. ही ऐतिहासिक माहिती केवळ तुलनात्मक अभ्यासासाठी जतन केली असून खरीप २०२६ च्या चालू दुष्काळ परिस्थितीशी ती मिसळू नये.",
      hi: "ऐतिहासिक संदर्भ: 31 अक्टूबर 2023 को 40 तहसीलें और 10 नवंबर 2023 को 1,021 मंडल घोषित किए गए थे। यह ऐतिहासिक अभिलेख है, इसे 2026 खरीफ से अलग रखा गया है।"
    },
    reliefAmount: {
      en: "Historical 2023-24 Concessions & Relief Slabs",
      mr: "ऐतिहासिक २०२३-२४ च्या ८ शासकीय सवलती",
      hi: "ऐतिहासिक 2023-24 की 8 सरकारी रियायतें"
    },
    eligibility: {
      en: "Farmers in 2023 declared talukas/circles for the 2023-24 agricultural year.",
      mr: "२०२३-२४ हंगामातील संबंधित ४० तालुके व १,०२१ मंडळांमधील शेतकरी.",
      hi: "वर्ष 2023-24 की संबंधित तहसीलों के किसान।"
    },
    affectedAreas: {
      en: "Historical 15 districts (40 talukas) and 1,021 revenue circles in 2023-24",
      mr: "ऐतिहासिक १५ जिल्हे (४० तालुके) व १,०२१ महसूल मंडळे",
      hi: "ऐतिहासिक 15 जिले (40 तहसीलें) व 1,021 मंडल"
    },
    status: "payments_started",
    statusNote: {
      en: "STATUS: HISTORICAL ARCHIVE COMPLETED. Disbursed and closed for the 2023-24 season. Archived for statutory transparency.",
      mr: "सद्यस्थिती: ऐतिहासिक अभिलेख. २०२३-२४ हंगामातील मदत प्रक्रिया पूर्ण. केवळ संदर्भासाठी अभिलेखात उपलब्ध.",
      hi: "स्थिति: ऐतिहासिक अभिलेख। 2023-24 सत्र समाप्त।"
    },
    grOrSourceUrl: "https://gr.maharashtra.gov.in",
    grReference: "शासन निर्णय क्र. संकीर्ण-२०२३/प्र.क्र.२५१/म-३ (३१ ऑक्टोबर २०२३)",
    lastVerifiedDate: "23 October 2026"
  }
];
