/**
 * Authoritative Indian Agricultural Knowledge Base for Crop Cultivation
 * Sources: ICAR institutes (CICR, IISR, IIWBR, IIHR, IIMR), State Agricultural Universities 
 * (MPKV Rahuri, VNMKV, PDKV, PAU, TNAU), CACP (Commission for Agricultural Costs and Prices),
 * and CIBRC (Central Insecticides Board & Registration Committee).
 */

export interface CultivationStep {
  title: string;
  subtitle: string;
  details: string[];
  tips?: string[];
  timing?: string;
}

export interface PestDiseaseItem {
  name: string;
  marathiName?: string;
  hindiName?: string;
  type: 'pest' | 'disease';
  symptoms: string;
  organicRemedy: string;
  chemicalRemedy: string;
  dosage: string;
  cibrcNotes?: string;
}

export interface NutrientDoseInfo {
  rdfKgPerHa: string;
  rdfKgPerAcre: string;
  basalDose: string;
  topDressingSplits: string[];
  micronutrients: string;
}

export interface AuthoritativeReference {
  title: string;
  institution: string;
  publicationType: string;
  notes?: string;
}

export interface CropGuideData {
  id: string;
  cropName: string;
  marathiName: string;
  hindiName: string;
  scientificName: string;
  category: string;
  idealSeason: string;
  durationDays: string;
  expectedYieldRange: {
    rainfed?: string;
    irrigated: string;
    dripOptimal?: string;
  };
  mspBenchmark: {
    price: string;
    seasonYear: string;
    category?: string;
    note: string;
  };
  soilType: string;
  optimalPh: string;
  waterRequirementMm: string;
  climateTemp: string;
  overview: string;
  soilPreparation: CultivationStep;
  sowingGuide: CultivationStep;
  irrigationSchedule: CultivationStep;
  fertilizerPlan: CultivationStep & { nutrientDose?: NutrientDoseInfo };
  pestAndDisease: PestDiseaseItem[];
  harvestingGuide: CultivationStep;
  precautions: string[];
  references: AuthoritativeReference[];
  disclaimer: string;
}

export const cropGuidesData: Record<string, CropGuideData> = {
  cotton: {
    id: "cotton",
    cropName: "Cotton",
    marathiName: "कापूस (कपाशी)",
    hindiName: "कपास",
    scientificName: "Gossypium hirsutum (Bt / Hybrid)",
    category: "Commercial Fiber & Cash Crop",
    idealSeason: "Kharif (Mid-June to 1st week of July upon receipt of 75-100 mm monsoon rain)",
    durationDays: "150 - 180 Days (Medium to Late duration hybrids)",
    expectedYieldRange: {
      rainfed: "12 - 18 Quintals / Hectare (approx. 5 - 7.5 Qtl / Acre)",
      irrigated: "22 - 32 Quintals / Hectare (approx. 9 - 13 Qtl / Acre)",
      dripOptimal: "30 - 38 Quintals / Hectare (approx. 12 - 15 Qtl / Acre with fertigation)"
    },
    mspBenchmark: {
      price: "₹7,121 / quintal (Medium Staple) | ₹7,521 / quintal (Long Staple)",
      seasonYear: "Kharif Marketing Season (KMS) 2024-25",
      note: "Official Government of India MSP notified by Ministry of Agriculture & Farmers Welfare / CACP."
    },
    soilType: "Deep black cotton soil (Vertisols), well-drained clayey loam. Avoid waterlogged or shallow saline soils.",
    optimalPh: "6.5 - 8.0 (Tolerates 6.0 to 8.5 with organic amendments)",
    waterRequirementMm: "600 - 800 mm (Critical at squaring, flowering, and boll development)",
    climateTemp: "21°C - 35°C (Warm vegetative phase, clear sunny weather during boll maturation)",
    overview: "Cotton is a premier commercial fiber crop in India, cultivated across Maharashtra, Gujarat, Telangana, Andhra Pradesh, Madhya Pradesh, Punjab, and Haryana. Yield depends heavily on soil profile drainage, balanced NPK + micronutrient management, and integrated pest management (IPM) for pink bollworm and sucking pests.",
    soilPreparation: {
      title: "Soil Preparation & Field Tillage",
      subtitle: "ICAR-CICR recommended deep summer ploughing and ridge-furrow layout",
      details: [
        "Summer Ploughing: Deep ploughing (20-25 cm) in summer using a mouldboard plough to expose resting pupae of Pink Bollworm and weed rhizomes to solar heat.",
        "Manuring: Incorporate 8-10 tonnes of well-decomposed Farm Yard Manure (FYM) or 3-4 tonnes of vermicompost per acre during secondary tillage (harrowing).",
        "Fine Tilth: 2 passes of disc harrow followed by a cultivator/rotavator to achieve a pulverized, clod-free seedbed.",
        "Bed Layout: Form ridges and furrows at 90-120 cm spacing, or Broad Bed Furrows (BBF: 120 cm bed with 30 cm furrow) to prevent root-zone waterlogging during heavy monsoon rains."
      ],
      tips: [
        "In rainfed Vertisols, opening an in-situ moisture conservation furrow in every alternate row 30-35 days after sowing increases soil moisture retention by 20-25%.",
        "Avoid planting in soils with electrical conductivity (EC) > 2.0 dS/m or exchangeable sodium percentage (ESP) > 15%."
      ],
      timing: "May to early June (Pre-monsoon preparation)"
    },
    sowingGuide: {
      title: "Sowing, Spacing & Seed Treatment",
      subtitle: "Optimizing plant population and early seedling vigor",
      details: [
        "Seed Rate: 1.5 to 2.0 kg/acre (approx. 2 packets of Bt hybrid seeds + non-Bt refuge).",
        "Spacing: 90 cm x 60 cm (light/medium soils) or 120 cm x 45 cm / 120 cm x 60 cm (heavy black irrigated soils). Target 7,000 to 9,000 plants/acre.",
        "Seed Treatment: Commercial Bt packets are pre-treated. For untreated seeds: treat with Imidacloprid 70 WS @ 5 g/kg seed for sucking pests, and Trichoderma viride @ 10 g/kg seed for root-rot prevention.",
        "Sowing Depth: Dibble seeds at 3-5 cm depth in moist soil on the side of the ridge (avoid planting in the bottom of furrows where water collects)."
      ],
      tips: [
        "Sow only after the soil has received at least 75-100 mm of cumulative monsoon rainfall and has adequate profile moisture.",
        "Perform gap-filling within 8-10 days of emergence to maintain uniform plant density."
      ],
      timing: "15 June to 10 July (Avoid late sowing beyond July 15 as it increases bollworm susceptibility)"
    },
    irrigationSchedule: {
      title: "Irrigation & Water Management",
      subtitle: "Targeted moisture at 4 critical phenological growth stages",
      details: [
        "Seedling & Vegetative Stage (0 - 35 DAS): Minimal irrigation; encourage deep taproot development. Light moisture only.",
        "Square Initiation Stage (35 - 55 DAS): 1st critical irrigation. Water stress at squaring causes premature square shedding.",
        "Peak Flowering & Boll Setting Stage (60 - 100 DAS): Peak water demand stage. Irrigate every 10-14 days in absence of rain. Prevent moisture stress to stop flower/boll drop.",
        "Boll Development & Bursting (105 - 145 DAS): Light, controlled irrigations. Cease all irrigation 15-20 days before final picking to promote uniform boll opening."
      ],
      tips: [
        "Drip irrigation with 16mm inline laterals at 40-50 cm dripper spacing saves 40-50% water and increases fertilizer use efficiency.",
        "Do not allow standing water in the root zone for more than 24 hours; ensure surface drainage."
      ],
      timing: "Every 10-15 days depending on soil moisture and rainfall intervals"
    },
    fertilizerPlan: {
      title: "Fertilizer & Nutrient Management (ICAR-CICR / SAU Standards)",
      subtitle: "Soil-test-based balanced NPK and micronutrient schedule",
      details: [
        "Recommended Dose of Fertilizer (RDF): 120:60:60 kg N:P2O5:K2O per hectare for Irrigated Bt Cotton (approx. 48:24:24 kg per acre); 80:40:40 kg/ha for Rainfed Cotton.",
        "Basal Application (At Sowing): 20% of Nitrogen (approx. 10 kg N) + 100% of Phosphorus (24 kg P2O5, e.g. 50 kg DAP or 150 kg SSP) + 100% of Potash (24 kg K2O, e.g. 40 kg MOP) + 10 kg Zinc Sulphate (21%) per acre.",
        "1st Top Dressing (30-35 DAS - Square Stage): 40% Nitrogen (approx. 35-40 kg Urea per acre).",
        "2nd Top Dressing (60-65 DAS - Flowering Stage): 40% Nitrogen (approx. 35-40 kg Urea per acre) + 10 kg Magnesium Sulphate if soil is deficient.",
        "Foliar Sprays for Boll Retention: Spray 13:0:45 (Potassium Nitrate) @ 10 g/L + Boron (Solubor) @ 1 g/L at 75 & 90 DAS; Spray 1% Magnesium Sulphate + 1% Urea at 60 & 80 DAS to control physiological leaf reddening (Lalya)."
      ],
      tips: [
        "Apply solid fertilizers in a ring 5-7 cm away from the plant stem and 4-5 cm deep, then cover with moist soil.",
        "Never broadcast urea on dry soil surface under strong sunlight to prevent ammonia volatilization loss."
      ],
      timing: "Basal at sowing, followed by top dressings at 30-35 and 60-65 days"
    },
    pestAndDisease: [
      {
        name: "Pink Bollworm (गुलाबी बोंडअळी - Pectinophora gossypiella)",
        marathiName: "गुलाबी बोंडअळी",
        hindiName: "गुलाबी सुंडी",
        type: "pest",
        symptoms: "Rosetted flowers, larvae feeding on internal boll contents, stained lint, premature locule drop, exit holes on matured green bolls.",
        organicRemedy: "Install 5-8 pheromone traps per acre from 45 DAS for ETL monitoring (ETL: 8 moths/trap/night for 3 consecutive days or 10% damaged green bolls). Release Trichogramma bactrae egg parasitoids @ 60,000/acre weekly from 45 DAS.",
        chemicalRemedy: "Chlorantraniliprole 18.5% SC or Emamectin Benzoate 5% SG or Profenofos 50% EC.",
        dosage: "Chlorantraniliprole 18.5% SC @ 6 ml per 15L water (150 ml/ha) OR Emamectin Benzoate 5% SG @ 8.8 g per 15L water (220 g/ha).",
        cibrcNotes: "CIBRC label approved. Observe a pre-harvest interval (PHI) of at least 15-20 days."
      },
      {
        name: "Sucking Pests: Aphids, Jassids, Thrips, Whitefly (मावा, तुडतुडे, फुलकिडे, पांढरी माशी)",
        marathiName: "रसशोषक किडी",
        hindiName: "रस चूसक कीट",
        type: "pest",
        symptoms: "Downward curling of leaf margins, hopper burn (yellowish-brown margins), silvery patches under leaves, sooty mould on honeydew secretion.",
        organicRemedy: "Install yellow and blue sticky traps (15-20 traps/acre). Spray 5% Neem Seed Kernel Extract (NSKE) or Neem Oil 10,000 ppm @ 3 ml/L water.",
        chemicalRemedy: "Flonicamid 50% WG or Acetamiprid 20% SP or Diafenthiuron 50% WP (for whitefly).",
        dosage: "Flonicamid 50% WG @ 6 g per 15L water (200 g/ha) OR Acetamiprid 20% SP @ 4 g per 15L water (100 g/ha).",
        cibrcNotes: "CIBRC label approved. Rotate chemical classes to prevent insecticide resistance."
      },
      {
        name: "Bacterial Blight / Angular Leaf Spot (जिवाणूजन्य करपा - Xanthomonas citri pv. malvacearum)",
        marathiName: "करपा रोग",
        hindiName: "जीवाणु अंगमारी",
        type: "disease",
        symptoms: "Angular water-soaked dark brown spots bounded by leaf veins, black arm lesions on main stem/branches, rotting bolls.",
        organicRemedy: "Seed treatment with Pseudomonas fluorescens (10 g/kg). Prompt destruction of infected crop residues.",
        chemicalRemedy: "Copper Oxychloride 50% WP + Streptocycline.",
        dosage: "Copper Oxychloride 50% WP @ 35 g + Streptocycline @ 1.5-2 g per 15L water.",
        cibrcNotes: "Standard SAU / KVK recommendation."
      },
      {
        name: "Physiological Leaf Reddening / Lalya (पाने लाल पडणे)",
        marathiName: "लाल पडणे (लाल्या)",
        hindiName: "पत्तियों का लाल होना",
        type: "disease",
        symptoms: "Leaves turn reddish-purple from margins inward due to Magnesium deficiency, sudden night cold, and heavy boll load drawing nitrogen from leaves.",
        organicRemedy: "Maintain soil organic carbon with regular compost application; avoid root-zone waterlogging.",
        chemicalRemedy: "Foliar nutrition: 1% Magnesium Sulphate + 1% 19:19:19 (or 1% Urea).",
        dosage: "100 g Magnesium Sulphate + 100 g 19:19:19 in 10L water.",
        cibrcNotes: "Nutritional corrective spray recommended by MPKV Rahuri / PDKV Akola."
      }
    ],
    harvestingGuide: {
      title: "Harvesting, Picking & Post-Harvest Quality",
      subtitle: "Preserving fiber staple length, micronaire, and trash-free quality",
      details: [
        "Pick cotton when bolls are fully burst and dry (fluffy white locules visible).",
        "Perform picking in the afternoon (11 AM to 4 PM) after morning dew has completely dried.",
        "Conduct 3-4 pickings at 15-20 day intervals; separate clean white cotton from yellow-stained/damaged bolls.",
        "Dry harvested seed-cotton on clean tarpaulins in shade or mild sun until moisture drops to 7-8%."
      ],
      tips: [
        "Avoid mixing dry leaves, bracts, and weeds with lint; cleaner lint fetches 10-15% higher market rates.",
        "Store in breathable cotton/jute bags in moisture-free, raised sheds. Never store in airtight plastic bags."
      ],
      timing: "October to January (130 to 170 days after sowing)"
    },
    precautions: [
      "Practice crop rotation with legumes (Soybean, Gram) or cereals (Wheat, Sorghum) to break pest life-cycles.",
      "Avoid spraying synthetic pyrethroids in the early season (first 60 days) to prevent secondary pest resurgence of whitefly.",
      "Always wear personal protective equipment (PPE) during chemical sprays."
    ],
    references: [
      {
        title: "Cotton Package of Practices & Integrated Pest Management for Bt Cotton",
        institution: "ICAR - Central Institute for Cotton Research (CICR), Nagpur",
        publicationType: "Institutional Technical Bulletin & Farmer Advisory"
      },
      {
        title: "Crop Production Guide & Nutrient Management Guidelines",
        institution: "Mahatma Phule Krishi Vidyapeeth (MPKV), Rahuri / Dr. PDKV Akola",
        publicationType: "State Agricultural University Advisory"
      },
      {
        title: "Price Policy for Kharif Crops: Marketing Season 2024-25",
        institution: "Commission for Agricultural Costs and Prices (CACP), Ministry of Agriculture & Farmers Welfare, Govt. of India",
        publicationType: "Official MSP Notification"
      },
      {
        title: "Major Uses of Pesticides (Insecticides registered under Insecticides Act, 1968)",
        institution: "Central Insecticides Board & Registration Committee (CIBRC), Directorate of Plant Protection, Quarantine & Storage",
        publicationType: "Official Statutory Label Registration"
      }
    ],
    disclaimer: "Yields, market prices, and fertilizer requirements vary based on soil test status, local rainfall, irrigation method, and hybrid variety. Consult your local Krishi Vigyan Kendra (KVK) or State Agriculture Officer for customized block-level recommendations."
  },

  soybean: {
    id: "soybean",
    cropName: "Soybean",
    marathiName: "सोयाबीन",
    hindiName: "सोयाबीन",
    scientificName: "Glycine max (L.) Merr.",
    category: "Grain Legume & Oilseed Crop",
    idealSeason: "Kharif (20 June to 10 July upon receiving 75-100 mm monsoon rainfall)",
    durationDays: "90 - 105 Days (Early to Medium duration varieties like JS-335, JS-9560, JS-2034, NRC-86, Phule Sangam/KDS-726)",
    expectedYieldRange: {
      rainfed: "15 - 22 Quintals / Hectare (approx. 6 - 9 Qtl / Acre)",
      irrigated: "22 - 30 Quintals / Hectare (approx. 9 - 12 Qtl / Acre)",
      dripOptimal: "28 - 35 Quintals / Hectare (approx. 11 - 14 Qtl / Acre with BBF & sprinkler support)"
    },
    mspBenchmark: {
      price: "₹4,892 / quintal (Yellow Soybean)",
      seasonYear: "Kharif Marketing Season (KMS) 2024-25",
      note: "Official Government of India MSP notified by Ministry of Agriculture & Farmers Welfare / CACP."
    },
    soilType: "Well-drained medium to deep clay loam / black Vertisols with good organic matter. Cannot tolerate waterlogging or saline-sodic soils.",
    optimalPh: "6.0 - 7.5 (Neutral to slightly alkaline; sensitive to soil acidity < 5.8)",
    waterRequirementMm: "450 - 650 mm (Critical at flowering and pod filling)",
    climateTemp: "20°C - 32°C (Optimal temperature for nodulation and pod development)",
    overview: "Soybean is a vital protein (40%) and oil (20%) rich leguminous crop widely cultivated in Madhya Pradesh, Maharashtra, Rajasthan, Karnataka, and Telangana. Its biological nitrogen-fixing ability enriches soil fertility for the following Rabi crop.",
    soilPreparation: {
      title: "Soil Preparation & Drainage Layout",
      subtitle: "ICAR-IISR Indore recommended Broad Bed Furrow (BBF) tillage",
      details: [
        "Summer Ploughing: One deep ploughing followed by 2 cross-harrowings to create a well-pulverized seedbed.",
        "Organic Matter: Apply 4-5 tonnes of FYM or 2 tonnes of vermicompost per acre before final harrowing.",
        "Broad Bed Furrow (BBF) / Ridge-Furrow: Prepare BBF (1.5 m bed width with 30 cm furrow) or ridges at 45 cm spacing to ensure smooth drainage during cloudbursts and in-situ moisture conservation during dry spells."
      ],
      tips: [
        "Soybean roots suffer irreversible damage if water stands in the root zone for more than 48 hours.",
        "Do not over-pulverize the soil into fine powder as heavy rain causes soil crusting, impeding seedling emergence."
      ],
      timing: "May - June (Before monsoon onset)"
    },
    sowingGuide: {
      title: "Seed Rate, Spacing & Inoculation",
      subtitle: "Ensuring 70%+ germination and active Rhizobium root nodulation",
      details: [
        "Seed Rate: 25 - 30 kg per acre for bold-seeded varieties; 20 - 25 kg/acre for small/medium seeded varieties (aim for 1.8 to 2.0 lakh plants/acre).",
        "Spacing: 45 cm row-to-row and 5-7 cm plant-to-plant.",
        "Seed Treatment Protocol (FIR order - Fungicide, Insecticide, Rhizobium):",
        "  1. Fungicide: Carboxin 37.5% + Thiram 37.5% WS (Vitavax Power) @ 2.5 g/kg OR Trichoderma viride @ 10 g/kg seed.",
        "  2. Insecticide: Thiamethoxam 30% FS @ 10 ml/kg seed for stem fly and early girdle beetle protection.",
        "  3. Bio-fertilizer: Inoculate with Bradyrhizobium japonicum + PSB @ 20-25 g/kg seed just before sowing in shade.",
        "Sowing Depth: 3 - 4 cm in moist soil (never exceed 5 cm depth)."
      ],
      tips: [
        "Always test seed germination percentage prior to sowing by germinating 100 seeds in a moist gunny bag.",
        "Never drop seed bags from a height; physical shock cracks the delicate seed embryo and reduces germination."
      ],
      timing: "20 June to 10 July (After receipt of 75-100 mm steady rainfall)"
    },
    irrigationSchedule: {
      title: "Irrigation Management during Dry Spells",
      subtitle: "Critical moisture stages to prevent pod abortion",
      details: [
        "Vegetative & Branching Stage (20 - 25 DAS): Light moisture; avoid water stagnation.",
        "Flowering Stage (35 - 45 DAS): Critical Stage 1. Moisture stress causes massive flower abortion.",
        "Pod Formation & Seed Filling Stage (55 - 75 DAS): Critical Stage 2. Adequate moisture ensures bold, heavy seeds with high oil content."
      ],
      tips: [
        "In case of a 15+ day dry spell during flowering or pod development, provide protective sprinkler irrigation of 25-30 mm.",
        "Sprinkler irrigation is vastly superior to flood irrigation for soybean."
      ],
      timing: "Critical interventions during monsoon breaks"
    },
    fertilizerPlan: {
      title: "Fertilizer Schedule (ICAR-IISR Indore Standards)",
      subtitle: "Low Nitrogen, high Phosphorus and Sulphur requirement",
      details: [
        "Recommended Dose of Fertilizer (RDF): 20-30 kg N : 60 kg P2O5 : 40 kg K2O : 20 kg Sulphur per hectare (approx. 10-12 kg N : 24 kg P2O5 : 16 kg K2O : 8-10 kg S per acre).",
        "Basal Application (At Sowing): Apply 100% P, K, and S at sowing using Single Super Phosphate (SSP @ 150 kg/acre) + MOP @ 25 kg/acre + Urea @ 15-20 kg/acre.",
        "Sulphur Importance: Using SSP supplies 16% P2O5 + 11% Sulphur + 19% Calcium, which increases oil content and seed protein.",
        "Foliar Sprays: Spray 19:19:19 @ 5 g/L at 30-35 DAS; Spray 0:52:34 @ 5 g/L at early pod development to maximize 100-seed weight."
      ],
      tips: [
        "Avoid high doses of chemical nitrogen; excess N inhibits natural root nodule formation.",
        "Apply fertilizers 5 cm to the side and 5 cm below the seed using a seed-cum-fertilizer drill."
      ],
      timing: "Full basal dose at sowing; optional foliar sprays at 30 and 55 DAS"
    },
    pestAndDisease: [
      {
        name: "Stem Fly & Girdle Beetle (खोडमाशी व चक्रभुंगा - Melanagromyza sojae / Oberea brevis)",
        marathiName: "खोडमाशी व चक्रभुंगा",
        hindiName: "तना मक्खी और गर्डल बीटल",
        type: "pest",
        symptoms: "Wilting of central seedling shoot, characteristic ring-like girdling on petioles/stems, hollowed pith inside stem, drooping branches.",
        organicRemedy: "Mandatory seed treatment with Thiamethoxam 30 FS (10 ml/kg). Cut and destroy girdled shoots before larvae bore into main stem.",
        chemicalRemedy: "Chlorantraniliprole 18.5% SC or Thiamethoxam 12.6% + Lambda-cyhalothrin 9.5% ZC.",
        dosage: "Chlorantraniliprole 18.5% SC @ 3 ml per 15L water (150 ml/ha) OR Thiamethoxam + Lambda @ 5 ml per 15L water (125 ml/ha).",
        cibrcNotes: "CIBRC label approved for soybean stem fly and girdle beetle."
      },
      {
        name: "Semilooper & Tobacco Caterpillar (उंट अळी व लष्करी अळी - Chrysodeixis acuta / Spodoptera litura)",
        marathiName: "उंट अळी व पाने खाणारी अळी",
        hindiName: "तम्बाकू की इल्ली व सेमीलूपर",
        type: "pest",
        symptoms: "Larvae feeding voraciously on leaves, skeletonizing foliage into net-like veins, defoliating plants.",
        organicRemedy: "Install 5 pheromone traps/acre. Spray Nomuraea rileyi or Bacillus thuringiensis (Bt) @ 2 g/L.",
        chemicalRemedy: "Emamectin Benzoate 5% SG or Novaluron 10% EC.",
        dosage: "Emamectin Benzoate 5% SG @ 6-8 g per 15L water (150-200 g/ha).",
        cibrcNotes: "CIBRC label approved."
      },
      {
        name: "Yellow Mosaic Virus (पिवळा मोझॅक - YMV)",
        marathiName: "पिवळा मोझॅक रोग",
        hindiName: "पीला मोज़ेक वायरस",
        type: "disease",
        symptoms: "Bright yellow mosaic patches on leaves, leaf distortion, stunted plants, unfilled pods. Transmitted by Whitefly (Bemisia tabaci).",
        organicRemedy: "Grow YMV-tolerant varieties (JS-2034, NRC-86, Phule Sangam). Install yellow sticky traps (20/acre). Roguing and burning of infected plants.",
        chemicalRemedy: "Vector Control: Thiamethoxam 25% WG or Acetamiprid 20% SP.",
        dosage: "Thiamethoxam 25% WG @ 4 g per 15L water (100 g/ha).",
        cibrcNotes: "Vector control measure as per ICAR-IISR Package of Practices."
      }
    ],
    harvestingGuide: {
      title: "Harvesting & Threshing Best Practices",
      subtitle: "Preventing pod shattering and seed embryo crack",
      details: [
        "Harvest when 90% leaves turn golden yellow and drop off, and pods turn straw-brown.",
        "Harvest in the early morning hours when pods have slight moisture to avoid pod shattering.",
        "Threshing: Keep thresher cylinder speed low (350 - 400 RPM). High thresher RPM cracks the seed coat, rendering seeds unfit for sowing."
      ],
      tips: [
        "Sun-dry harvested grain to 10-12% moisture before storage.",
        "Do not use metallic hooks on seed bags to prevent seed damage."
      ],
      timing: "September - October (90 to 105 days after sowing)"
    },
    precautions: [
      "Apply pre-emergence herbicide (Diclosulam 84% WDG @ 12.4 g/acre or Pendimethalin 30% EC @ 1.0 L/acre) within 48 hours of sowing in moist soil.",
      "Never store soybean seeds in damp areas or in plastic air-tight bags."
    ],
    references: [
      {
        title: "Soybean Production Technology & Package of Practices",
        institution: "ICAR - Indian Institute of Soybean Research (IISR), Indore",
        publicationType: "Institutional Technical Bulletin"
      },
      {
        title: "Price Policy for Kharif Crops: Marketing Season 2024-25",
        institution: "Commission for Agricultural Costs and Prices (CACP), Govt. of India",
        publicationType: "Official MSP Notification"
      },
      {
        title: "Approved Pesticides List for Soybean",
        institution: "Central Insecticides Board & Registration Committee (CIBRC)",
        publicationType: "Statutory Label Registration"
      }
    ],
    disclaimer: "Yields and input requirements depend on local rainfall distribution, variety selection, and pest pressure. Follow local KVK advisories."
  },

  tomato: {
    id: "tomato",
    cropName: "Tomato",
    marathiName: "टोमॅटो",
    hindiName: "टमाटर",
    scientificName: "Solanum lycopersicum L.",
    category: "High-Value Vegetable & Horticultural Crop",
    idealSeason: "Kharif (June-July), Rabi (Oct-Nov), Summer (Jan-Feb with assured drip irrigation)",
    durationDays: "120 - 150 Days (Transplanting to final picking)",
    expectedYieldRange: {
      rainfed: "20 - 30 Tonnes / Hectare (approx. 8 - 12 Tonnes / Acre)",
      irrigated: "40 - 60 Tonnes / Hectare (approx. 16 - 24 Tonnes / Acre)",
      dripOptimal: "60 - 90 Tonnes / Hectare (approx. 24 - 36 Tonnes / Acre with staking & mulching)"
    },
    mspBenchmark: {
      price: "No Statutory MSP (Perishable Horticultural Produce)",
      seasonYear: "Year-Round Mandi Market Pricing",
      note: "Indicative AGMARKNET Mandi benchmark: ₹1,200 - ₹3,500 / quintal depending on seasonal arrivals and market demand."
    },
    soilType: "Well-drained sandy loam to clay loam rich in organic matter. Avoid poorly drained waterlogged soils.",
    optimalPh: "6.0 - 7.0 (Moderate tolerance: 5.8 to 7.5)",
    waterRequirementMm: "400 - 600 mm (Requires steady, controlled drip irrigation; highly sensitive to water stress & excess moisture)",
    climateTemp: "18°C - 30°C (Night temperature between 15°C-20°C is critical for high fruit set)",
    overview: "Tomato is one of the most widely consumed and profitable horticultural crops in India. Adopting hybrid determinate/indeterminate varieties with pro-tray seedling raising, silver-black plastic mulching, bamboo-GI wire trellising (staking), and drip fertigation delivers exceptional yields and export-grade fruit firmness.",
    soilPreparation: {
      title: "Raised Bed & Plastic Mulch Preparation",
      subtitle: "ICAR-IIHR recommended bed preparation for high productivity",
      details: [
        "Deep Tillage: Deep ploughing followed by 2 passes of rotavator to create a loose, well-aerated seedbed.",
        "Basal Manuring: Incorporate 10-12 tonnes of FYM / well-rotted compost + 2 kg Trichoderma harzianum per acre.",
        "Raised Bed Dimensions: Prepare raised beds 90 cm top width, 30 cm height, with 120-150 cm walking furrow spacing.",
        "Drip & Mulch: Lay 16 mm inline drip lateral (40 cm dripper spacing) and cover with 25-30 micron UV-stabilized silver-black plastic mulch sheet. Punch holes at 45-60 cm spacing."
      ],
      tips: [
        "Silver-black mulch suppresses 95% of weed growth, reduces water requirement by 35-40%, and repels aphids/thrips.",
        "Never plant tomato seedlings in flat waterlogged beds during the monsoon."
      ],
      timing: "2 weeks prior to seedling transplanting"
    },
    sowingGuide: {
      title: "Pro-tray Nursery & Seedling Transplanting",
      subtitle: "Raising disease-free sturdy seedlings",
      details: [
        "Seed Rate: 50 - 60 grams per acre for F1 hybrid seeds (e.g. Abhinav, US-440, Saaho, Arka Rakshak, NS-501).",
        "Nursery Raising: Sow seeds in 98-cavity pro-trays filled with sterilized cocopeat + vermicompost + Trichoderma under 50% agro-shade net.",
        "Transplanting: Transplant 22-25 day-old sturdy seedlings (12-15 cm height, 4-5 true leaves) in late afternoon.",
        "Spacing: 4.5 to 5.0 feet between beds x 1.5 to 2.0 feet plant-to-plant (zigzag arrangement on raised bed).",
        "Root Dip Treatment: Dip seedling roots for 10 minutes in Imidacloprid 17.8% SL (0.5 ml/L) + Carbendazim 50% WP (1 g/L) before planting."
      ],
      tips: [
        "Give light irrigation through drip immediately after transplanting.",
        "Staking with bamboo poles and GI wire at 30-35 DAT keeps foliage off wet soil, reducing fungal blights by 70%."
      ],
      timing: "Transplant in late evening hours to avoid seedling shock"
    },
    irrigationSchedule: {
      title: "Drip Irrigation & Moisture Control",
      subtitle: "Preventing Blossom End Rot and fruit cracking",
      details: [
        "Establishment Phase (1 - 15 DAT): 1-2 hours daily light drip irrigation.",
        "Vegetative Phase (16 - 40 DAT): 2-3 hours on alternate days.",
        "Flowering & Fruit Development Phase (41 - 90 DAT): Peak water requirement (4 to 6 liters per plant/day depending on temperature).",
        "Harvesting Phase: Regular, uniform moisture. Avoid heavy irrigation following a dry spell as sudden cell turgor causes severe fruit cracking."
      ],
      tips: [
        "Irregular moisture combined with Calcium deficiency causes Blossom End Rot (black sunken fruit bottoms).",
        "Maintain uniform soil moisture throughout fruit expansion."
      ],
      timing: "Daily or alternate-day drip cycles based on pan evaporation"
    },
    fertilizerPlan: {
      title: "Fertigation Schedule (ICAR-IIHR Standards)",
      subtitle: "Water-soluble fertilizer application through drip",
      details: [
        "Total Nutrient Requirement (RDF): 150-200 kg N : 100-120 kg P2O5 : 120-150 kg K2O per hectare (approx. 60-80 kg N : 40-50 kg P : 50-60 kg K per acre).",
        "Basal Dose in Bed: 25% N + 100% P (DAP 50 kg) + 30% K (MOP 25 kg) + 25 kg Magnesium Sulphate + 10 kg Zinc Sulphate per acre.",
        "Vegetative Stage (10 - 35 DAT): 19:19:19 @ 3 kg/acre twice weekly + 12:61:0 @ 2 kg/acre once weekly.",
        "Flowering & Fruit Set (36 - 65 DAT): 0:52:34 @ 4 kg/acre twice weekly + Calcium Nitrate @ 3 kg/acre + Boron @ 250 g/acre once weekly.",
        "Fruit Enlargement & Ripening (66 - 110 DAT): 0:0:50 (Potassium Sulphate) @ 4 kg/acre twice weekly + 13:0:45 @ 3 kg/acre."
      ],
      tips: [
        "Foliar spray of Chelated Calcium (1 g/L) + Solubor (1 g/L) at 45 & 60 DAT ensures firm, transport-resistant fruit with no bottom rot.",
        "Do not mix Calcium Nitrate with Phosphorus or Sulphur fertilizers in the same fertigation tank to avoid insoluble precipitation."
      ],
      timing: "Weekly fertigation splits across 12-14 weeks"
    },
    pestAndDisease: [
      {
        name: "Tomato Pinworm & Fruit Borer (Tuta absoluta & Helicoverpa armigera)",
        marathiName: "फळपोखरणारी अळी व तुता",
        hindiName: "फल छेदक व टुटा",
        type: "pest",
        symptoms: "Pin-hole mines in leaves, damaged growing tips, circular holes in green and ripening fruits with larval frass.",
        organicRemedy: "Install 12-16 Pheromone traps/acre for Tuta absoluta and 5 traps/acre for Helicoverpa. Spray Bacillus thuringiensis (Bt) @ 2 g/L.",
        chemicalRemedy: "Chlorantraniliprole 18.5% SC or Spinetoram 11.7% SC or Flubendiamide 39.35% SC.",
        dosage: "Chlorantraniliprole 18.5% SC @ 6 ml per 15L water (150 ml/ha) OR Spinetoram 11.7% SC @ 15 ml per 15L water (400-500 ml/ha).",
        cibrcNotes: "CIBRC registered formulation. Observe a 3-5 day pre-harvest interval (PHI)."
      },
      {
        name: "Early Blight & Late Blight (करपा व तांबेरा - Alternaria solani / Phytophthora infestans)",
        marathiName: "अल्टरनेरिया करपा",
        hindiName: "अगेती व पछेती झुलसा",
        type: "disease",
        symptoms: "Concentric target-board rings on older leaves (Early blight); water-soaked irregular dark brown lesions rotting rapidly during humid cloudy weather (Late blight).",
        organicRemedy: "Remove bottom leaves touching soil. Spray Copper Hydroxide 53.8% DF @ 2 g/L.",
        chemicalRemedy: "Mancozeb 75% WP or Azoxystrobin 18.2% + Difenoconazole 11.4% SC or Metalaxyl 8% + Mancozeb 64% WP.",
        dosage: "Azoxystrobin + Difenoconazole @ 15 ml per 15L water (500 ml/ha) OR Metalaxyl + Mancozeb @ 35 g per 15L water (1.5-2.0 kg/ha).",
        cibrcNotes: "CIBRC label approved."
      },
      {
        name: "Tomato Leaf Curl Virus (चुरडा-मुरडा / पर्णकुंचन)",
        marathiName: "चुरडा मुरडा रोग",
        hindiName: "पर्ण कुंचन रोग",
        type: "disease",
        symptoms: "Upward curling and puckering of leaves, thick leathery texture, extreme stunting and bushy appearance. Transmitted by Whiteflies.",
        organicRemedy: "Use silver-black mulch. Install yellow sticky traps (25/acre). Grow resistant hybrids (Arka Rakshak, US-440).",
        chemicalRemedy: "Vector Control: Cyantraniliprole 10.26% OD or Diafenthiuron 50% WP.",
        dosage: "Cyantraniliprole 10.26% OD @ 18 ml per 15L water (600 ml/ha).",
        cibrcNotes: "CIBRC label approved for sucking vectors in vegetables."
      }
    ],
    harvestingGuide: {
      title: "Harvesting, Grading & Handling",
      subtitle: "Picking at the correct maturity stage for target market",
      details: [
        "Breaker Stage (10% pink at blossom end): For distant markets (3-5 days transport).",
        "Pink to Light Red Stage: For local town markets.",
        "Perform pickings every 3-4 days in cool morning or evening hours.",
        "Grading: Sort tomatoes by size (A, B, C grade) and remove scarred or insect-damaged fruit. Pack in plastic crates (25 kg capacity) with paper lining."
      ],
      tips: [
        "Never drop fruit or stack crates more than 4-5 layers high.",
        "Store at 12°C - 15°C with 85-90% relative humidity for maximum shelf life."
      ],
      timing: "65-70 days after transplanting (pickings continue for 60-75 days)"
    },
    precautions: [
      "Prune bottom suckers up to 20 cm from ground level to promote good aeration and prevent soil-borne fungal splash.",
      "Never spray chemical insecticides during peak daylight when honeybees are pollinating flowers."
    ],
    references: [
      {
        title: "Production Technology of Vegetable Crops (Tomato Production & IPM)",
        institution: "ICAR - Indian Institute of Horticultural Research (IIHR), Bengaluru",
        publicationType: "Technical Bulletin & Farmer Extension Guide"
      },
      {
        title: "Package of Practices for Commercial Vegetable Cultivation",
        institution: "Tamil Nadu Agricultural University (TNAU) / MPKV Rahuri",
        publicationType: "University Extension Manual"
      },
      {
        title: "Daily Market Rates and Agricultural Commodity Arrivals",
        institution: "AGMARKNET, Directorate of Marketing & Inspection (DMI), Ministry of Agriculture",
        publicationType: "Agricultural Mandi Portal Benchmark"
      }
    ],
    disclaimer: "Yields and fertilizer dosages vary by hybrid variety, season, and management practices. Adhere to CIBRC guidelines."
  },

  wheat: {
    id: "wheat",
    cropName: "Wheat",
    marathiName: "गहू",
    hindiName: "गेहूं",
    scientificName: "Triticum aestivum L.",
    category: "Cereal & Food Grain",
    idealSeason: "Rabi (Optimal Sowing: 1st to 3rd week of November)",
    durationDays: "115 - 130 Days (Timely sown varieties like GW-322, HD-2967, DBW-187, HI-1544, HD-3086)",
    expectedYieldRange: {
      rainfed: "20 - 30 Quintals / Hectare (approx. 8 - 12 Qtl / Acre)",
      irrigated: "45 - 55 Quintals / Hectare (approx. 18 - 22 Qtl / Acre)",
      dripOptimal: "55 - 65 Quintals / Hectare (approx. 22 - 26 Qtl / Acre with sprinkler & timely CRI)"
    },
    mspBenchmark: {
      price: "₹2,275 / quintal (RMS 2024-25) | ₹2,425 / quintal (RMS 2025-26)",
      seasonYear: "Rabi Marketing Season (RMS) 2024-25 & 2025-26",
      note: "Official Government of India MSP notified by Ministry of Agriculture & Farmers Welfare / CACP."
    },
    soilType: "Well-drained fertile clay loam to loamy soil. Avoid poorly drained alkaline/saline soils.",
    optimalPh: "6.0 - 7.5 (Tolerates 6.5 to 8.0 with balanced nutrition)",
    waterRequirementMm: "350 - 450 mm (Requires 4-6 timely irrigations at critical stages)",
    climateTemp: "10°C - 15°C during tillering; 20°C - 25°C during grain filling; bright sunny days",
    overview: "Wheat is India's principal Rabi cereal food grain, grown extensively in Uttar Pradesh, Punjab, Haryana, Madhya Pradesh, Rajasthan, and Maharashtra. Cold winter temperatures during tillering and adequate moisture at the Crown Root Initiation (CRI) stage are pivotal for high grain yield.",
    soilPreparation: {
      title: "Land Preparation & Laser Leveling",
      subtitle: "ICAR-IIWBR Karnal recommended seedbed preparation",
      details: [
        "Tillage: 1 deep ploughing after Kharif harvest followed by 2 cultivations and planking.",
        "Laser Land Leveling: Laser leveling ensures uniform water spread, avoids waterlogging in low patches, and saves 25% irrigation water.",
        "Manure: Incorporate 4-5 tonnes of FYM per acre before last planking."
      ],
      tips: ["Laser land leveling enhances crop stand uniformity and raises yield by 8-10%."],
      timing: "October - November"
    },
    sowingGuide: {
      title: "Sowing, Seed Rate & Depth",
      subtitle: "Line sowing with Seed-cum-Fertilizer Drill",
      details: [
        "Seed Rate: 40 kg/acre (Timely sown); 50 kg/acre (Late sown after Dec 1).",
        "Spacing: 20 - 22.5 cm row-to-row spacing.",
        "Seed Treatment: Carboxin 37.5% + Thiram 37.5% WS @ 2.5 g/kg seed (for loose smut and flag smut prevention) + Azotobacter biofertilizer @ 25 g/kg seed.",
        "Sowing Depth: 4 - 5 cm in moist soil (do not sow deeper than 5 cm as it delays coleoptile emergence)."
      ],
      tips: ["Sow between Nov 5 and Nov 25 for maximum tillering and grain size."],
      timing: "1 to 25 November"
    },
    irrigationSchedule: {
      title: "6 Critical Irrigation Stages",
      subtitle: "Vital growth phases determining grain number and weight",
      details: [
        "1. Crown Root Initiation (CRI - 20 to 25 DAS): The MOST critical irrigation. Missing CRI reduces yield by 25-30%.",
        "2. Tillering Stage (40 to 45 DAS)",
        "3. Late Jointing Stage (60 to 65 DAS)",
        "4. Flowering / Heading Stage (80 to 85 DAS)",
        "5. Milking Stage (95 to 100 DAS)",
        "6. Dough / Grain Filling Stage (110 to 115 DAS)"
      ],
      tips: [
        "Never irrigate on strong windy days during the milking/dough stage to avoid crop lodging (falling flat).",
        "If water is limited to 1 irrigation: Give at CRI stage (21 DAS). If 2 irrigations: Give at CRI and Flowering."
      ],
      timing: "Every 18-22 days"
    },
    fertilizerPlan: {
      title: "Fertilizer Schedule (ICAR-IIWBR Standards)",
      subtitle: "Split Nitrogen and Zinc management",
      details: [
        "Recommended Dose of Fertilizer (RDF): 120 kg N : 60 kg P2O5 : 40 kg K2O per hectare (approx. 48 kg N : 24 kg P : 16 kg K per acre).",
        "Basal Application: 50% Nitrogen (Urea 25 kg) + 100% Phosphorus (DAP 50 kg or SSP 150 kg) + 100% Potash (MOP 25 kg) + 10 kg Zinc Sulphate (21%) per acre.",
        "1st Top Dressing (CRI Stage - 21 DAS): 25% Nitrogen (Urea 25-30 kg per acre) just before irrigation.",
        "2nd Top Dressing (Jointing - 45 DAS): Remaining 25% Nitrogen (Urea 25-30 kg per acre).",
        "Foliar Spray: Spray 0:52:34 @ 5 g/L + Micronutrients at flag leaf stage (65-70 DAS) to improve grain weight."
      ],
      tips: ["Avoid excessive nitrogen application after heading to prevent crop lodging."],
      timing: "Basal at sowing, followed by splits at 21 and 45 DAS"
    },
    pestAndDisease: [
      {
        name: "Rusts: Yellow/Stripe Rust & Brown/Leaf Rust (तांबेरा - Puccinia striiformis / P. triticina)",
        marathiName: "तांबेरा रोग",
        hindiName: "गेरुआ / रतुआ",
        type: "disease",
        symptoms: "Yellowish-orange pustules arranged in linear stripes on leaves (Yellow rust) or scattered brown pustules (Brown rust).",
        organicRemedy: "Grow resistant varieties (DBW-187, HD-3086, HI-1544).",
        chemicalRemedy: "Propiconazole 25% EC or Tebuconazole 25.9% EC.",
        dosage: "Propiconazole 25% EC @ 15 ml per 15L water (500 ml/ha) at first appearance.",
        cibrcNotes: "CIBRC label approved for wheat rust management."
      },
      {
        name: "Termites & Aphids (वाळवी व मावा - Odontotermes obesus / Rhopalosiphum padi)",
        marathiName: "वाळवी व मावा",
        hindiName: "दीमक और माहू",
        type: "pest",
        symptoms: "Termites cut roots resulting in dry yellow plants that pull out easily; aphids suck sap from developing earheads.",
        organicRemedy: "Incorporate neem cake @ 100 kg/acre during land prep.",
        chemicalRemedy: "Chlorpyrifos 20% EC (for termites) or Thiamethoxam 25% WG.",
        dosage: "Chlorpyrifos 20% EC @ 1.0 L/acre through irrigation water OR Thiamethoxam @ 4 g/15L water.",
        cibrcNotes: "Standard ICAR-IIWBR recommendation."
      }
    ],
    harvestingGuide: {
      title: "Harvesting & Storage",
      subtitle: "Harvesting at physiological maturity",
      details: [
        "Harvest when straw turns golden yellow, earheads droop slightly, and grains become hard (moisture < 14%).",
        "Harvest using combine harvester or manual sickle followed by power thresher.",
        "Sun-dry grains for 2-3 days until moisture reaches below 10-11% for safe storage."
      ],
      tips: ["Store in cleaned, fumigated galvanized bins or hermetic bags with dry neem leaves."],
      timing: "March - April (115-130 days after sowing)"
    },
    precautions: [
      "Apply post-emergence weedicide (Clodinafop-propargyl 15% WP @ 160 g/acre for grassy weeds or Metsulfuron-methyl 20% WP @ 8 g/acre for broadleaf weeds) at 30-35 DAS in moist soil.",
      "Ensure proper moisture during grain filling to avoid shrivelled grains caused by terminal heat."
    ],
    references: [
      {
        title: "Wheat Production Technology in India",
        institution: "ICAR - Indian Institute of Wheat and Barley Research (IIWBR), Karnal",
        publicationType: "Institutional Technical Advisory"
      },
      {
        title: "Price Policy for Rabi Crops: Marketing Season 2024-25 & 2025-26",
        institution: "Commission for Agricultural Costs and Prices (CACP), Govt. of India",
        publicationType: "Official MSP Notification"
      },
      {
        title: "Approved Agrochemicals for Wheat Protection",
        institution: "Central Insecticides Board & Registration Committee (CIBRC)",
        publicationType: "Official Statutory Label Registration"
      }
    ],
    disclaimer: "Yields depend on timely sowing, winter temperature profile, and irrigation adherence."
  },

  sugarcane: {
    id: "sugarcane",
    cropName: "Sugarcane",
    marathiName: "ऊस",
    hindiName: "गन्ना",
    scientificName: "Saccharum officinarum L.",
    category: "Commercial Sugar & Cash Crop",
    idealSeason: "Adsali (July-August, 15-18 months), Pre-seasonal (Oct-Nov, 13-15 months), Suru (Jan-Feb, 12 months)",
    durationDays: "12 - 16 Months",
    expectedYieldRange: {
      rainfed: "60 - 80 Tonnes / Hectare (approx. 24 - 32 Tonnes / Acre)",
      irrigated: "90 - 120 Tonnes / Hectare (approx. 36 - 48 Tonnes / Acre)",
      dripOptimal: "130 - 170 Tonnes / Hectare (approx. 52 - 68 Tonnes / Acre with paired-row drip fertigation)"
    },
    mspBenchmark: {
      price: "₹340 / quintal (₹3,400 / tonne) at 10.25% sugar recovery",
      seasonYear: "Sugar Season 2024-25 (Oct-Sept)",
      note: "Statutory Fair and Remunerative Price (FRP) fixed by Cabinet Committee on Economic Affairs (CCEA), Govt. of India."
    },
    soilType: "Deep, well-drained loamy to clay loam black soil with high organic carbon (> 0.6%). Avoid waterlogged or saline-alkaline soils.",
    optimalPh: "6.5 - 8.0",
    waterRequirementMm: "1500 - 2200 mm (High water demand; drip irrigation highly recommended)",
    climateTemp: "20°C - 38°C (Warm and humid vegetative period, cool dry winter for sucrose accumulation)",
    overview: "Sugarcane is a long-duration commercial agro-industrial cash crop supporting the sugar, jaggery (gur), and ethanol industries. Adopting single-eye bud or two-bud sett planting with paired-row layout (e.g. 3 ft x 6 ft), trash mulching, subsoiling, and drip fertigation significantly optimizes cane tonnage and sugar recovery.",
    soilPreparation: {
      title: "Deep Tillage, Subsoiling & Furrow Preparation",
      subtitle: "VSI Pune / ICAR-IISR recommended land preparation",
      details: [
        "Deep Tillage: Subsoiler ploughing (40-45 cm) to break the hard sub-surface pan, followed by 2 passes of rotavator.",
        "Organic Manuring: Apply 15-20 tonnes of FYM or press-mud cake + 5 kg Trichoderma per acre.",
        "Furrow Layout: Form deep furrows at 4 to 5 feet row spacing (or paired-row 3 ft x 6 ft) with a ridger."
      ],
      tips: ["Subsoiling improves deep root penetration and cane lodging resistance."],
      timing: "1 month prior to planting"
    },
    sowingGuide: {
      title: "Sett Selection, Treatment & Planting",
      subtitle: "Using healthy 2-bud setts from disease-free seed nurseries",
      details: [
        "Sett Requirement: 25,000 - 30,000 two-bud setts per acre from 9-10 month old healthy cane.",
        "Sett Treatment (Crucial): Dip setts for 10-15 minutes in Carbendazim 50% WP (1 g/L) + Chlorpyrifos 20% EC (2 ml/L) + Acetobacter diazotrophicus (5 g/L).",
        "Planting Method: Place setts end-to-end in furrows with buds facing sideways; cover with 5-7 cm soil and give light irrigation."
      ],
      tips: ["Using single-eye bud seedlings raised in pro-trays saves 70% seed cane and ensures 100% germination."],
      timing: "Oct-Nov (Pre-seasonal) or Jan-Feb (Suru)"
    },
    irrigationSchedule: {
      title: "Drip Irrigation & Trash Mulching",
      subtitle: "Year-round water budgeting",
      details: [
        "Germination Phase (0 - 35 DAP): Light, frequent irrigation every 4-6 days.",
        "Tillering & Formative Phase (36 - 120 DAP): Regular irrigation (drip run 2-3 hours daily).",
        "Grand Growth Phase (121 - 270 DAP): Peak moisture requirement (drip run 3-5 hours daily in summer).",
        "Maturation & Ripening (271+ DAP): Reduce irrigation gradually. Stop all irrigation 15 days before harvest to concentrate sucrose."
      ],
      tips: ["Spreading sugarcane trash mulch (5-8 cm) saves 30% water and keeps weed growth suppressed."],
      timing: "Scheduled drip fertigation"
    },
    fertilizerPlan: {
      title: "Fertilizer Schedule (VSI Pune Standards)",
      subtitle: "Tailored for Suru, Pre-seasonal, and Adsali crops",
      details: [
        "Recommended Dose (Suru Cane): 250 kg N : 115 kg P2O5 : 115 kg K2O per hectare (approx. 100 kg N : 46 kg P : 46 kg K per acre).",
        "Basal Dose: 10% N + 100% P (DAP 100 kg) + 50% K (MOP 40 kg) + 25 kg Magnesium Sulphate + 10 kg Zinc Sulphate + 10 kg Ferrous Sulphate per acre.",
        "Top Dressing 1 (6-8 Weeks): 40% N (Urea 80 kg).",
        "Top Dressing 2 (12-14 Weeks): 10% N (Urea 20 kg).",
        "Big Earthing-Up (120-135 Days): 40% N (Urea 80 kg) + 50% K (MOP 40 kg). Apply at root zone and earth up with soil."
      ],
      tips: ["Earthing-up at 120-135 days provides mechanical support and prevents cane lodging during monsoon storms."],
      timing: "Split across planting, 6 weeks, 12 weeks, and earthing-up"
    },
    pestAndDisease: [
      {
        name: "Early Shoot Borer & White Grub (खोडकिडा व हुमणी - Chilo infuscatellus / Holotrichia serrata)",
        marathiName: "खोडकिडा व हुमणी",
        hindiName: "कंसुआ और सफेद लट",
        type: "pest",
        symptoms: "Dead hearts in young shoots that emit foul odor when pulled; white grub larvae eat roots, causing entire cane clumps to dry up.",
        organicRemedy: "Light traps for adult beetles during first monsoon showers. Soil application of Metarhizium anisopliae @ 5 kg/acre with FYM.",
        chemicalRemedy: "Chlorantraniliprole 0.4% GR (FMC Ferterra @ 7.5 kg/acre) or Fipronil 0.3% GR @ 10 kg/acre.",
        dosage: "Chlorantraniliprole 0.4% GR in furrows at planting or early stage.",
        cibrcNotes: "CIBRC label approved for sugarcane borer."
      },
      {
        name: "Red Rot & Smut (तांबेरा व काणी - Colletotrichum falcatum / Sporisorium scitamineum)",
        marathiName: "लाल कुजव्या व काणी रोग",
        hindiName: "लाल सड़न और कंडुआ",
        type: "disease",
        symptoms: "Third/fourth leaf yellowing and drying, internal cane stalk turns red with white transverse bands, sour alcoholic smell.",
        organicRemedy: "Use certified disease-free seed setts from 3-tier seed program. Practice 2-year crop rotation.",
        chemicalRemedy: "Sett dip in Carbendazim 50% WP @ 1 g/L water.",
        dosage: "100 g Carbendazim in 100L water for 15 min dip.",
        cibrcNotes: "Standard VSI / IISR recommendation."
      }
    ],
    harvestingGuide: {
      title: "Harvesting & Delivery",
      subtitle: "Testing Brix reading and ground-level cutting",
      details: [
        "Harvest when hand-refractometer Brix reading exceeds 18 - 20°.",
        "Cut canes close to ground level (below soil surface) with sharp cane knives.",
        "Transport harvested cane to the sugar factory within 24 hours to avoid sucrose inversion."
      ],
      tips: ["Ground-level cutting gives 2-3 extra tonnes/acre and promotes uniform ratoon sprouting."],
      timing: "12 to 14 months after planting"
    },
    precautions: [
      "Do not burn sugarcane trash in the field; decompose it with bio-decomposer to enrich soil humus.",
      "Control White Grub early as late infestations cause severe root destruction."
    ],
    references: [
      {
        title: "Sugarcane Cultivation & Drip Fertigation Technology",
        institution: "Vasantdada Sugar Institute (VSI), Pune",
        publicationType: "Technical Research Bulletin"
      },
      {
        title: "Package of Practices for Commercial Cane Production",
        institution: "ICAR - Indian Institute of Sugarcane Research (IISR), Lucknow",
        publicationType: "Institutional Advisory"
      },
      {
        title: "Fixation of Fair and Remunerative Price (FRP) of Sugarcane for Sugar Season 2024-25",
        institution: "Cabinet Committee on Economic Affairs (CCEA), Govt. of India",
        publicationType: "Official Statutory FRP Notification"
      }
    ],
    disclaimer: "Sugarcane yield and sugar recovery depend on planting season (Adsali vs Suru), irrigation efficiency, and harvest timing."
  },

  maize: {
    id: "maize",
    cropName: "Maize / Corn",
    marathiName: "मका",
    hindiName: "मक्का",
    scientificName: "Zea mays L.",
    category: "Cereal, Fodder & Feed Crop",
    idealSeason: "Kharif (June-July), Rabi (Oct-Nov), Spring/Summer (Jan-Feb)",
    durationDays: "95 - 115 Days (Single cross hybrids like Pioneer, Dekalb, Syngenta, PAC-751)",
    expectedYieldRange: {
      rainfed: "30 - 40 Quintals / Hectare (approx. 12 - 16 Qtl / Acre)",
      irrigated: "55 - 75 Quintals / Hectare (approx. 22 - 30 Qtl / Acre)",
      dripOptimal: "70 - 85 Quintals / Hectare (approx. 28 - 34 Qtl / Acre in Rabi with fertigation)"
    },
    mspBenchmark: {
      price: "₹2,225 / quintal (Kharif Maize)",
      seasonYear: "Kharif Marketing Season (KMS) 2024-25",
      note: "Official Government of India MSP notified by Ministry of Agriculture & Farmers Welfare / CACP."
    },
    soilType: "Deep well-drained loamy to silty clay loam soil rich in organic matter. Sensitive to waterlogging.",
    optimalPh: "6.0 - 7.5",
    waterRequirementMm: "500 - 650 mm",
    climateTemp: "18°C - 35°C (Warm vegetative growth; cool night temperature in Rabi promotes highest grain weight)",
    overview: "Maize (Queen of Cereals) is an exhaustive crop with high genetic yield potential for poultry feed, starch industry, and human consumption. Effective Fall Armyworm (FAW) management and split Nitrogen-Zinc application are critical.",
    soilPreparation: {
      title: "Land Preparation & Ridging",
      subtitle: "ICAR-IIMR recommended seedbed preparation",
      details: [
        "Tillage: 1 deep ploughing followed by 2 harrowing operations.",
        "Manure: 5 tonnes of FYM per acre before last harrowing.",
        "Ridges: Form ridges and furrows at 60 cm spacing to prevent root waterlogging."
      ],
      tips: ["Ridge planting ensures fast root respiration and drainage."],
      timing: "June or October"
    },
    sowingGuide: {
      title: "Seed Rate, Spacing & Treatment",
      subtitle: "Optimal plant density and seed protection",
      details: [
        "Seed Rate: 7.5 - 8.0 kg/acre for single-cross hybrids (target 26,000 to 28,000 plants/acre).",
        "Spacing: 60 cm row-to-row x 20 cm plant-to-plant (1 seed per hill).",
        "Seed Treatment: Cyantraniliprole 19.8% + Thiamethoxam 19.8% FS (Fortenza Duo @ 4 ml/kg seed) to protect against Fall Armyworm for initial 20 days.",
        "Sowing Depth: 4 - 5 cm on the side of the ridge in moist soil."
      ],
      tips: ["Maintain uniform spacing to prevent thin, barren cobs."],
      timing: "June-July (Kharif) or Oct-Nov (Rabi)"
    },
    irrigationSchedule: {
      title: "Critical Irrigation Stages",
      subtitle: "Essential moisture at vegetative and reproductive phases",
      details: [
        "Knee-High Stage (V6 - 25 to 30 DAS)",
        "Tasseling Stage (VT - 45 to 50 DAS) - Highly Critical!",
        "Silking & Cob Formation (R1 - 55 to 65 DAS) - Highly Critical!",
        "Grain Filling / Dough Stage (R4 - 70 to 80 DAS)"
      ],
      tips: ["Water stress during tasseling and silking leads to poor pollination and missing grain rows."],
      timing: "Every 10-14 days in absence of rainfall"
    },
    fertilizerPlan: {
      title: "Fertilizer Schedule (ICAR-IIMR Standards)",
      subtitle: "High Nitrogen and Zinc requirement",
      details: [
        "Recommended Dose of Fertilizer (RDF): 120-150 kg N : 60 kg P2O5 : 40-60 kg K2O per hectare (approx. 50-60 kg N : 24 kg P : 16-24 kg K per acre).",
        "Basal Application: 20% N + 100% P (DAP 50 kg) + 100% K (MOP 30 kg) + 10 kg Zinc Sulphate (21%) per acre.",
        "1st Top Dressing (Knee-high - 25 DAS): 40% N (Urea 45 kg per acre).",
        "2nd Top Dressing (Tasseling - 45 DAS): 40% N (Urea 45 kg per acre)."
      ],
      tips: ["Zinc deficiency causes 'White Bud' in maize. Never skip basal Zinc Sulphate."],
      timing: "3 splits: Basal, 25 DAS, and 45 DAS"
    },
    pestAndDisease: [
      {
        name: "Fall Armyworm (लष्करी अळी - Spodoptera frugiperda)",
        marathiName: "लष्करी अळी (FAW)",
        hindiName: "फॉल आर्मीवर्म",
        type: "pest",
        symptoms: "Pin-holes and elongated windowing on leaves, heavy sawdust-like fecal matter in the central whorl, damaged growing point.",
        organicRemedy: "Mandatory seed treatment. Apply dry sand + neem cake (9:1) or wood ash into the central whorl @ 10-15 DAS. Spray Metarhizium rileyi @ 3 g/L.",
        chemicalRemedy: "Chlorantraniliprole 18.5% SC or Emamectin Benzoate 5% SG directed into the central whorl.",
        dosage: "Chlorantraniliprole 18.5% SC @ 6 ml per 15L water (150 ml/ha) OR Emamectin Benzoate 5% SG @ 6-8 g per 15L water.",
        cibrcNotes: "CIBRC label approved for FAW in maize."
      }
    ],
    harvestingGuide: {
      title: "Harvesting & Shelling",
      subtitle: "Optimal cob moisture for grain quality",
      details: [
        "Harvest when outer cob sheath dries completely to straw color and grains are hard.",
        "Black layer formation at the tip of the kernel indicates physiological maturity.",
        "Dry de-husked cobs in sun for 3-4 days before machine shelling."
      ],
      tips: ["Store shelled grains at < 12% moisture in dry bins."],
      timing: "95 to 115 days"
    },
    precautions: [
      "Inspect central whorls twice weekly starting 10 days after emergence to detect early FAW egg masses and pinholes.",
      "Apply pre-emergence Atrazine 50% WP @ 500-800 g/acre within 48 hours of sowing in moist soil."
    ],
    references: [
      {
        title: "Hybrid Maize Production Technology & FAW Management",
        institution: "ICAR - Indian Institute of Maize Research (IIMR), Ludhiana",
        publicationType: "Technical Bulletin & Extension Manual"
      },
      {
        title: "Price Policy for Kharif Crops: Marketing Season 2024-25",
        institution: "Commission for Agricultural Costs and Prices (CACP), Govt. of India",
        publicationType: "Official MSP Notification"
      },
      {
        title: "CIBRC Label Claim Formulations for Fall Armyworm",
        institution: "Central Insecticides Board & Registration Committee (CIBRC)",
        publicationType: "Statutory Insecticide Regulation"
      }
    ],
    disclaimer: "Maize productivity depends on hybrid selection, plant density, and timely FAW management."
  }
};

/**
 * Returns dynamic cultivation guide data for any crop name.
 */
export function getCropGuide(cropQuery?: string): CropGuideData {
  const normalized = (cropQuery || "cotton").trim().toLowerCase();

  if (normalized.includes("cotton") || normalized.includes("कापूस") || normalized.includes("कपास")) {
    return cropGuidesData.cotton;
  }
  if (normalized.includes("soy") || normalized.includes("सोयाबीन")) {
    return cropGuidesData.soybean;
  }
  if (normalized.includes("wheat") || normalized.includes("गहू") || normalized.includes("गेहूं")) {
    return cropGuidesData.wheat;
  }
  if (normalized.includes("sugar") || normalized.includes("ऊस") || normalized.includes("गन्ना")) {
    return cropGuidesData.sugarcane;
  }
  if (normalized.includes("tomato") || normalized.includes("टोमॅटो") || normalized.includes("टमाटर")) {
    return cropGuidesData.tomato;
  }
  if (normalized.includes("maize") || normalized.includes("corn") || normalized.includes("मका") || normalized.includes("मक्का")) {
    return cropGuidesData.maize;
  }

  // Generic fallback with realistic, non-hallucinated guidelines
  const titleCrop = cropQuery ? (cropQuery.charAt(0).toUpperCase() + cropQuery.slice(1)) : "Recommended Crop";
  
  return {
    id: normalized || "custom",
    cropName: titleCrop,
    marathiName: titleCrop,
    hindiName: titleCrop,
    scientificName: `${titleCrop} spp.`,
    category: "Agricultural Field / Horticultural Crop",
    idealSeason: "Kharif / Rabi Season (Block-specific)",
    durationDays: "100 - 140 Days",
    expectedYieldRange: {
      rainfed: "15 - 25 Quintals / Hectare",
      irrigated: "25 - 45 Quintals / Hectare"
    },
    mspBenchmark: {
      price: "Subject to Government of India / Mandi announcements",
      seasonYear: "Current Agricultural Year",
      note: "Consult local Agricultural Produce Market Committee (APMC) for active rates."
    },
    soilType: "Well-drained fertile loam or medium black soil with adequate organic matter.",
    optimalPh: "6.0 - 7.5",
    waterRequirementMm: "450 - 650 mm",
    climateTemp: "18°C - 32°C",
    overview: `${titleCrop} cultivation requires location-specific agronomic practices. Follow soil-test-based nutrient application, integrated pest management, and certified seed selection for sustainable productivity.`,
    soilPreparation: {
      title: "Soil Preparation & Tillage",
      subtitle: `Standard agronomic tillage for ${titleCrop}`,
      details: [
        "Deep summer ploughing followed by 2 harrowings to achieve a pulverized seedbed.",
        "Incorporate 5-8 tonnes of well-decomposed FYM or compost per acre.",
        "Ensure adequate surface drainage channels to prevent water stagnation."
      ],
      tips: ["Conduct soil testing prior to planting to customize basal fertilizer doses."],
      timing: "Pre-season preparation"
    },
    sowingGuide: {
      title: "Sowing & Seed Treatment",
      subtitle: "Certified seed and recommended spacing",
      details: [
        "Procure certified seeds from authorized government or university seed centers.",
        "Treat seeds with Trichoderma viride @ 10 g/kg seed and crop-specific bio-fertilizers.",
        "Maintain recommended row-to-row and plant-to-plant spacing for proper light interception."
      ],
      tips: ["Sow in moist soil at 3-5 cm depth."],
      timing: "Onset of favorable season"
    },
    irrigationSchedule: {
      title: "Water Management",
      subtitle: "Moisture management at critical growth stages",
      details: [
        "Provide initial light irrigation after sowing if soil moisture is inadequate.",
        "Ensure consistent moisture during flowering and grain/fruit formation.",
        "Avoid prolonged dry spells or standing water in the root zone."
      ],
      tips: ["Drip or micro-sprinklers improve water use efficiency by 30-45%."],
      timing: "As per soil moisture depletion"
    },
    fertilizerPlan: {
      title: "Nutrient Management Plan",
      subtitle: "Soil-test-based nutrient application",
      details: [
        "Apply full dose of Phosphorus (DAP/SSP) and Potash (MOP) as basal at sowing.",
        "Apply Nitrogen (Urea) in 2 to 3 split doses during active vegetative and flowering phases.",
        "Supplement with Zinc and micronutrient foliar sprays if soil analysis shows deficiencies."
      ],
      tips: ["Adjust fertilizer doses by +25% if soil test is low, or -25% if soil test is high."],
      timing: "Split applications at key growth stages"
    },
    pestAndDisease: [
      {
        name: "Common Sucking Pests & Caterpillars",
        type: "pest",
        symptoms: "Leaf curling, yellowing, feeding punctures, holes in leaves or developing shoots.",
        organicRemedy: "Install pheromone and sticky traps. Spray 5% Neem Seed Kernel Extract (NSKE).",
        chemicalRemedy: "Use CIBRC registered selective insecticides as per label recommendations.",
        dosage: "Consult local KVK or agricultural extension officer for approved chemical and exact dose."
      },
      {
        name: "Fungal Leaf Spots & Blights",
        type: "disease",
        symptoms: "Concentric brown spots on foliage, premature leaf yellowing and dropping.",
        organicRemedy: "Remove infected leaves. Spray Copper Oxychloride or Trichoderma.",
        chemicalRemedy: "Mancozeb 75% WP or Azoxystrobin based on approved label claim.",
        dosage: "Mancozeb 75% WP @ 30 g per 15L water."
      }
    ],
    harvestingGuide: {
      title: "Harvesting & Storage",
      subtitle: "Harvesting at physiological maturity",
      details: [
        "Harvest when the crop reaches full maturity (characteristic color change and hardness).",
        "Sun-dry harvested produce to safe storage moisture level (< 10-12%).",
        "Store in clean, moisture-free storage structures."
      ],
      tips: ["Avoid harvesting during rain or high morning humidity."],
      timing: "Upon full maturity"
    },
    precautions: [
      "Follow crop rotation to maintain soil microbial health and break pest cycles.",
      "Always wear protective clothing when applying agrochemicals."
    ],
    references: [
      {
        title: "Handbook of Agriculture: Facts and Figures for Farmers, Students and All Interested in Farming",
        institution: "Indian Council of Agricultural Research (ICAR), New Delhi",
        publicationType: "National Agricultural Reference"
      }
    ],
    disclaimer: "Data represents general agronomic best practices. Consult local State Agricultural University or Krishi Vigyan Kendra for block-specific advisories."
  };
}
