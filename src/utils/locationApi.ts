import { ALL_INDIAN_STATES_UTS, STATE_DISTRICTS, getTalukasForDistrict } from "@/data/indiaLocations";

export interface LocationData {
  state: string;
  district: string;
  taluka: string;
  village: string;
  pincode: string;
  lat?: number;
  lon?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cache: Record<string, any> = {};

/**
 * Reverse geocodes coordinates using OpenStreetMap Nominatim API
 */
export async function reverseGeocode(lat: number, lon: number): Promise<Partial<LocationData>> {
  const cacheKey = `geocode_${lat.toFixed(3)}_${lon.toFixed(3)}`;
  if (cache[cacheKey]) return cache[cacheKey];

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`);
    if (!response.ok) throw new Error("Failed to fetch location");
    
    const data = await response.json();
    const address = data.address;

    const result = {
      state: address.state || "",
      district: address.state_district || address.county || "",
      taluka: address.county || address.suburb || "",
      village: address.village || address.town || address.city || address.hamlet || "",
      pincode: address.postcode || "",
      lat,
      lon
    };

    cache[cacheKey] = result;
    return result;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    throw error;
  }
}

/**
 * Fetch all 28 States & 8 Union Territories
 */
export async function fetchStates(): Promise<string[]> {
  return ALL_INDIAN_STATES_UTS;
}

/**
 * Fetch all official districts for a State or UT
 */
export async function fetchDistricts(state: string): Promise<string[]> {
  if (!state) return [];
  return STATE_DISTRICTS[state] || [];
}

/**
 * Fetch Talukas / Tehsils / Mandals for a District
 */
export async function fetchTalukas(district: string): Promise<string[]> {
  if (!district) return [];
  const cacheKey = `talukas_${district}`;
  if (cache[cacheKey]) return cache[cacheKey];

  const talukas = getTalukasForDistrict(district);
  cache[cacheKey] = talukas;
  return talukas;
}

export async function fetchVillages(taluka: string): Promise<string[]> {
  if (!taluka) return [];
  const cacheKey = `villages_${taluka}`;
  if (cache[cacheKey]) return cache[cacheKey];

  const mockVillages = [
    `${taluka} Gaon`,
    `${taluka} Rural`,
    `${taluka} North`,
    `${taluka} South`,
    `${taluka} East`
  ];
  
  cache[cacheKey] = mockVillages;
  return mockVillages;
}
