export interface Scheme {
  id: string;
  name: string;
  shortDescription: string;
  category: "Financial" | "Insurance" | "Infrastructure" | "Technology" | "Soil Health";
  benefits: string[];
  eligibility: string[];
  documents: string[];
  process: string;
  updatedDate: string;
  website: string;
  stateTags: string[]; // Used for location-based sorting
}

export const schemesData: Scheme[] = [
  {
    id: "pm-kisan",
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    shortDescription: "Direct income support of ₹6,000 per year to all landholding farmer families.",
    category: "Financial",
    benefits: [
      "₹6,000 per year transferred directly to bank accounts",
      "Payable in three equal installments of ₹2,000 each",
      "No intermediaries, direct benefit transfer (DBT)"
    ],
    eligibility: [
      "Must be a landholding farmer family",
      "Must hold a valid Aadhaar card",
      "Professionals, pensioners (>₹10,000), and institutional landholders are excluded"
    ],
    documents: [
      "Aadhaar Card",
      "Land ownership documents (7/12 extract / Khatauni)",
      "Bank Account details (Passbook)"
    ],
    process: "Farmers can register directly via the PM-KISAN portal or visit their local Common Service Centre (CSC) or Patwari/Revenue official.",
    updatedDate: "August 2023",
    website: "https://pmkisan.gov.in/",
    stateTags: ["All", "Maharashtra", "Uttar Pradesh", "Bihar"] // Example tags for demo prioritization
  },
  {
    id: "pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    shortDescription: "Comprehensive crop insurance scheme providing financial support against crop failure.",
    category: "Insurance",
    benefits: [
      "Low premium rates (1.5% - 2% for Kharif/Rabi, 5% for commercial crops)",
      "Full insured amount paid without capping in case of yield loss",
      "Covers pre-sowing to post-harvest losses due to non-preventable natural risks"
    ],
    eligibility: [
      "All farmers growing notified crops in notified areas",
      "Includes sharecroppers and tenant farmers"
    ],
    documents: [
      "Aadhaar Card",
      "Bank Account details",
      "Land agreement (if tenant farmer)",
      "Sowing certificate from Patwari"
    ],
    process: "Apply online through the PMFBY portal, through banks, or via insurance company representatives before the cutoff date for the season.",
    updatedDate: "July 2023",
    website: "https://pmfby.gov.in/",
    stateTags: ["All", "Maharashtra", "Madhya Pradesh", "Rajasthan"]
  },
  {
    id: "kcc",
    name: "Kisan Credit Card (KCC)",
    shortDescription: "Provides farmers with timely access to credit for agricultural expenses at low interest rates.",
    category: "Financial",
    benefits: [
      "Short-term credit limit for crop cultivation and post-harvest expenses",
      "Interest subvention of up to 3% for prompt repayment (effective rate 4%)",
      "Flexible repayment schedule aligned with harvesting season"
    ],
    eligibility: [
      "Individual/Joint borrowers who are owner cultivators",
      "Tenant farmers, oral lessees & sharecroppers",
      "Self Help Groups (SHGs) or Joint Liability Groups (JLGs) of farmers"
    ],
    documents: [
      "ID & Address Proof (Aadhaar, PAN, Voter ID)",
      "Land holding documents",
      "Passport size photographs"
    ],
    process: "Download the simple 1-page form from the PM-KISAN portal or visit your nearest commercial bank, regional rural bank, or cooperative bank.",
    updatedDate: "January 2023",
    website: "https://sbi.co.in/web/agri-rural/agriculture-banking/crop-loan/kisan-credit-card",
    stateTags: ["All", "Punjab", "Haryana", "Andhra Pradesh"]
  },
  {
    id: "shc",
    name: "Soil Health Card Scheme",
    shortDescription: "Provides farmers with information on their soil's nutrient status and fertilizer recommendations.",
    category: "Soil Health",
    benefits: [
      "Detailed report of soil health (N, P, K and micro-nutrients)",
      "Customized fertilizer and dosage recommendations",
      "Helps increase crop yield and save cost on excess fertilizers"
    ],
    eligibility: [
      "All farmers across India are eligible to get their soil tested."
    ],
    documents: [
      "Aadhaar Card",
      "Farm location details"
    ],
    process: "Soil samples are collected by the state agriculture department, tested in a lab, and the card is issued online and physically.",
    updatedDate: "May 2023",
    website: "https://soilhealth.dac.gov.in/",
    stateTags: ["All", "Gujarat", "Karnataka", "Tamil Nadu"]
  },
  {
    id: "enam",
    name: "National Agriculture Market (eNAM)",
    shortDescription: "A pan-India electronic trading portal that networks existing APMC mandis to create a unified national market.",
    category: "Infrastructure",
    benefits: [
      "Transparent online bidding process",
      "Access to a larger national market for better price discovery",
      "Real-time information on commodity prices",
      "Direct online payment to the farmer's bank account"
    ],
    eligibility: [
      "Any farmer, trader, or FPO registered with a connected APMC mandi."
    ],
    documents: [
      "Aadhaar Card",
      "Bank Account details",
      "Mobile number for OTP verification"
    ],
    process: "Register on the eNAM web portal or mobile app as a farmer, or register physically at the nearest eNAM connected APMC mandi.",
    updatedDate: "September 2023",
    website: "https://enam.gov.in/",
    stateTags: ["All", "Haryana", "Telangana", "Madhya Pradesh"]
  },
  {
    id: "pmksy",
    name: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
    shortDescription: "Aims to enhance physical access of water on farm and expand cultivable area under assured irrigation (Har Khet ko Pani).",
    category: "Infrastructure",
    benefits: [
      "Subsidies on drip and sprinkler irrigation systems (Per Drop More Crop)",
      "Creation of new water sources through minor irrigation",
      "Financial assistance for groundwater development in safe zones"
    ],
    eligibility: [
      "Farmers owning agricultural land",
      "Members of Cooperative Societies, FPOs, and SHGs"
    ],
    documents: [
      "Aadhaar Card",
      "Land Ownership papers",
      "Bank Account details"
    ],
    process: "Apply through the State Agriculture/Horticulture Department portals or visit the district agriculture office.",
    updatedDate: "March 2023",
    website: "https://pmksy.gov.in/",
    stateTags: ["All", "Maharashtra", "Gujarat", "Karnataka"]
  },
  {
    id: "agristack",
    name: "AgriStack",
    shortDescription: "A collection of technology-based interventions in agriculture to provide end-to-end digital services to farmers.",
    category: "Technology",
    benefits: [
      "Creation of a unique Farmer ID linked to Aadhaar",
      "Unified access to all government schemes and subsidies",
      "Digital land records and crop surveys for faster loan/insurance processing"
    ],
    eligibility: [
      "All registered farmers in participating states."
    ],
    documents: [
      "Aadhaar Card",
      "Land Records"
    ],
    process: "AgriStack is currently being implemented via state governments. Farmers will be automatically onboarded through their digital land records.",
    updatedDate: "October 2023",
    website: "https://agricoop.gov.in/",
    stateTags: ["All", "Uttar Pradesh", "Maharashtra", "Odisha"]
  },
  {
    id: "dam",
    name: "Digital Agriculture Mission",
    shortDescription: "Promotes the use of modern tech like AI, Block Chain, Remote Sensing, and Drones in Indian agriculture.",
    category: "Technology",
    benefits: [
      "Funding and support for AgTech startups and FPOs",
      "Subsidies for purchasing agricultural drones",
      "Access to satellite data for precision farming advisory"
    ],
    eligibility: [
      "Farmers, FPOs, Agri-entrepreneurs, and Research Institutions."
    ],
    documents: [
      "Project proposal (for grants)",
      "Registration certificates (for FPOs/Startups)"
    ],
    process: "Applications for specific grants and drone subsidies are routed through the SMAM (Sub-Mission on Agricultural Mechanization) portal.",
    updatedDate: "November 2023",
    website: "https://agrimachinery.nic.in/",
    stateTags: ["All", "Andhra Pradesh", "Telangana", "Karnataka"]
  }
];
