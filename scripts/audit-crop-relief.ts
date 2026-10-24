import {
  calculateEstimatedRelief,
  convertAreaToHectare,
  convertHectareToOtherUnits,
  OFFICIAL_SDRF_RATES,
  DISASTER_TYPES,
  PANCHANAMA_DOCUMENTS,
  VERIFIED_OFFICIAL_PORTALS
} from "../src/data/cropRelief";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passedCount++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failedCount++;
  }
}

console.log("==================================================================");
console.log("CROP RELIEF FUNCTIONAL & FACTUAL AUDIT TEST SUITE");
console.log("==================================================================");

// ==================================================================
// TEST 1: User Scenario - 5 acres, 50% damage, rainfed, Maharashtra, Nagpur
// ==================================================================
console.log("\n--- TEST 1: User Scenario (5 acres, 50% damage, rainfed, Maharashtra, Nagpur) ---");
const result5Acres = calculateEstimatedRelief({
  landCategory: "rainfed",
  areaAmount: 5,
  areaUnit: "acre",
  damagePercentage: 50,
  disasterType: "unseasonal_rain",
  selectedState: "Maharashtra"
});

console.log("Result output:", {
  normalizedHectares: result5Acres.normalizedHectares,
  effectiveCentralHectares: result5Acres.effectiveCentralHectares,
  effectiveStateHectares: result5Acres.effectiveStateHectares,
  centralAssistance: result5Acres.centralEstimatedAssistance,
  stateAssistance: result5Acres.stateEnhancedEstimatedAssistance,
  isEligibleDamage: result5Acres.isEligibleDamage,
  isStateEnhancedVerified: result5Acres.isStateEnhancedVerified
});

assert(result5Acres.isEligibleDamage === true, "50% damage is eligible (>= 33% threshold)");
assert(Math.abs(result5Acres.normalizedHectares - 2.0234) < 0.001, "5 acres converts to ~2.0234 hectares");
assert(result5Acres.effectiveCentralHectares === 2, "Central SDRF effective area is capped at statutory 2.0 ha ceiling");
assert(result5Acres.centralEstimatedAssistance === 17000, "Central assistance is exactly 2 ha * ₹8,500 = ₹17,000");
assert(Math.abs(result5Acres.effectiveStateHectares - 2.0234) < 0.001, "State effective area is 2.0234 ha (within 3 ha ceiling)");
assert(result5Acres.stateEnhancedEstimatedAssistance === 27519, "State assistance is 2.02343 * ₹13,600 = ₹27,519");
assert(result5Acres.isStateEnhancedVerified === true, "Maharashtra enhanced rate is marked verified under official GR");
assert(result5Acres.ratePerHectareCentral === 8500, "Rainfed Central base rate is ₹8,500/ha");
assert(result5Acres.ratePerHectareState === 13600, "Rainfed Maharashtra enhanced rate is ₹13,600/ha");

// ==================================================================
// TEST 2: Statutory Damage Threshold (32% vs 33% vs 34%)
// ==================================================================
console.log("\n--- TEST 2: Statutory Damage Threshold (32%, 33%, 34%) ---");
const res32 = calculateEstimatedRelief({
  landCategory: "rainfed",
  areaAmount: 2,
  areaUnit: "hectare",
  damagePercentage: 32,
  disasterType: "unseasonal_rain"
});
assert(res32.isEligibleDamage === false, "32% damage is ineligible (< 33% statutory threshold)");
assert(res32.centralEstimatedAssistance === 0, "Ineligible damage results in ₹0 central assistance");
assert(res32.stateEnhancedEstimatedAssistance === 0, "Ineligible damage results in ₹0 state assistance");

const res33 = calculateEstimatedRelief({
  landCategory: "rainfed",
  areaAmount: 2,
  areaUnit: "hectare",
  damagePercentage: 33,
  disasterType: "unseasonal_rain"
});
assert(res33.isEligibleDamage === true, "33% damage is exactly on statutory threshold and eligible");
assert(res33.centralEstimatedAssistance === 17000, "33% damage triggers full assistance for 2 ha (₹17,000)");

const res34 = calculateEstimatedRelief({
  landCategory: "rainfed",
  areaAmount: 2,
  areaUnit: "hectare",
  damagePercentage: 34,
  disasterType: "unseasonal_rain"
});
assert(res34.isEligibleDamage === true, "34% damage is eligible");

// ==================================================================
// TEST 3: Land Categories & Statutory Rate Slabs
// ==================================================================
console.log("\n--- TEST 3: Land Category Rate Verification ---");
// Irrigated
const resIrrigated = calculateEstimatedRelief({
  landCategory: "irrigated",
  areaAmount: 3,
  areaUnit: "hectare",
  damagePercentage: 50,
  disasterType: "flood"
});
assert(resIrrigated.ratePerHectareCentral === 17000, "Irrigated central rate is ₹17,000/ha");
assert(resIrrigated.ratePerHectareState === 27000, "Irrigated state enhanced rate is ₹27,000/ha");
assert(resIrrigated.centralEstimatedAssistance === 34000, "Irrigated central capped at 2 ha = ₹34,000");
assert(resIrrigated.stateEnhancedEstimatedAssistance === 81000, "Irrigated state capped at 3 ha = ₹81,000");

// Perennial Orchards
const resPerennial = calculateEstimatedRelief({
  landCategory: "perennial",
  areaAmount: 3,
  areaUnit: "hectare",
  damagePercentage: 50,
  disasterType: "hailstorm"
});
assert(resPerennial.ratePerHectareCentral === 22500, "Perennial central rate is ₹22,500/ha");
assert(resPerennial.ratePerHectareState === 36000, "Perennial state enhanced rate is ₹36,000/ha");
assert(resPerennial.centralEstimatedAssistance === 45000, "Perennial central capped at 2 ha = ₹45,000");
assert(resPerennial.stateEnhancedEstimatedAssistance === 108000, "Perennial state capped at 3 ha = ₹1,08,000");

// ==================================================================
// TEST 4: Area Converter Edge Cases (Zero, Negative, Large, Conversions)
// ==================================================================
console.log("\n--- TEST 4: Area Converter & Edge Cases ---");
// Zero input
assert(convertAreaToHectare(0, "acre") === 0, "0 acres converts to 0 hectares");
assert(convertAreaToHectare(0, "guntha") === 0, "0 gunthas converts to 0 hectares");
assert(convertAreaToHectare(0, "hectare") === 0, "0 hectares converts to 0 hectares");

// Negative input
assert(convertAreaToHectare(-5, "acre") === 0, "-5 acres safely returns 0 hectares");
assert(convertAreaToHectare(-100, "guntha") === 0, "-100 gunthas safely returns 0 hectares");

// NaN and Infinity
assert(convertAreaToHectare(NaN, "acre") === 0, "NaN safely returns 0 hectares");
assert(convertAreaToHectare(Infinity, "acre") === 0, "Infinity safely returns 0 hectares");

// Conversion accuracy
const conv1Ha = convertHectareToOtherUnits(1);
assert(conv1Ha.hectares === 1, "1 ha = 1 ha");
assert(conv1Ha.acres === 2.47, "1 ha = 2.47 acres");
assert(conv1Ha.gunthas === 100, "1 ha = 100 gunthas");

const conv40GunthasInHa = convertAreaToHectare(40, "guntha");
assert(conv40GunthasInHa === 0.4, "40 gunthas = 0.40 hectares");

const conv1AcreInHa = convertAreaToHectare(1, "acre");
assert(Math.abs(conv1AcreInHa - 0.404686) < 0.0001, "1 acre = 0.404686 hectares");

// Unusually Large Input (10,000 acres)
const resLarge = calculateEstimatedRelief({
  landCategory: "rainfed",
  areaAmount: 10000,
  areaUnit: "acre",
  damagePercentage: 50,
  disasterType: "unseasonal_rain"
});
assert(resLarge.effectiveCentralHectares === 2, "10,000 acres is safely capped at 2 ha central ceiling");
assert(resLarge.effectiveStateHectares === 3, "10,000 acres is safely capped at 3 ha state ceiling");
assert(resLarge.centralEstimatedAssistance === 17000, "Central cap strictly maintained at ₹17,000");
assert(resLarge.stateEnhancedEstimatedAssistance === 40800, "State cap strictly maintained at 3 * 13,600 = ₹40,800");

// ==================================================================
// TEST 5: State Delineation & Resolution Tracing
// ==================================================================
console.log("\n--- TEST 5: State Delineation & Resolution Tracing ---");
const resGujarat = calculateEstimatedRelief({
  landCategory: "rainfed",
  areaAmount: 2,
  areaUnit: "hectare",
  damagePercentage: 50,
  disasterType: "flood",
  selectedState: "Gujarat"
});
assert(resGujarat.isStateEnhancedVerified === false, "Non-Maharashtra state (Gujarat) is flagged as unverified state top-up");
assert(resGujarat.stateResolutionRef.includes("Unverified"), "State resolution reference clearly specifies unverified status");
assert(resGujarat.centralResolutionRef.includes("33-01/2022-NDM-I"), "Central SDRF resolution is verified under MHA Order No. 33-01/2022-NDM-I");

// ==================================================================
// TEST 6: 72-Hour Intimation & Portals Verification
// ==================================================================
console.log("\n--- TEST 6: Official Portals, Helplines & 72-Hr Calamity Classification ---");
const helpline14447 = VERIFIED_OFFICIAL_PORTALS.find((p) => p.helpline === "14447");
assert(Boolean(helpline14447), "Official National PMFBY Helpline 14447 is present in verified portals");
assert(helpline14447?.url === "tel:14447", "Helpline URL is formatted for one-touch dialing (tel:14447)");

const kccHelpline = VERIFIED_OFFICIAL_PORTALS.find((p) => p.helpline === "1800-180-1551");
assert(Boolean(kccHelpline), "National Kisan Call Center (1800-180-1551) is present in verified portals");

// Verify localized calamity vs widespread drought
const hailstorm = DISASTER_TYPES.find((d) => d.id === "hailstorm");
assert(hailstorm?.coveredUnderPmfbyLocalized === true, "Hailstorm is marked as covered under 72-hr localized intimation");

const flood = DISASTER_TYPES.find((d) => d.id === "flood");
assert(flood?.coveredUnderPmfbyLocalized === true, "Flood / Inundation is marked as covered under 72-hr localized intimation");

const drought = DISASTER_TYPES.find((d) => d.id === "drought");
assert(drought?.coveredUnderPmfbyLocalized === false, "Drought is correctly NOT marked as individual 72-hr notice (widespread government declaration)");

console.log("\n==================================================================");
console.log(`TEST SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED`);
console.log("==================================================================");

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log("All calculation and factual verification tests passed successfully!");
}
