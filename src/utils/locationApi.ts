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

// Mock dataset for states and districts since a full reliable public API without keys is hard to guarantee.
const indiaData: Record<string, string[]> = {
  "Maharashtra": ["Pune", "Mumbai", "Nagpur", "Nashik", "Aurangabad"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "Punjab": ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"]
};

export async function fetchStates(): Promise<string[]> {
  return Object.keys(indiaData).sort();
}

export async function fetchDistricts(state: string): Promise<string[]> {
  if (!state) return [];
  return (indiaData[state] || []).sort();
}

/**
 * Mocks fetching Talukas based on the district. 
 * In a real-world scenario with a dedicated backend, this would query a geographic database.
 */
export async function fetchTalukas(district: string): Promise<string[]> {
  if (!district) return [];
  const cacheKey = `talukas_${district}`;
  if (cache[cacheKey]) return cache[cacheKey];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Generate some realistic-looking mock talukas based on the district name
  const mockTalukas = [
    `${district} City`,
    `${district} Rural`,
    `${district} North`,
    `${district} South`,
    `New ${district} Area`
  ];
  
  cache[cacheKey] = mockTalukas;
  return mockTalukas;
}

export async function fetchVillages(taluka: string): Promise<string[]> {
  if (!taluka) return [];
  const cacheKey = `villages_${taluka}`;
  if (cache[cacheKey]) return cache[cacheKey];

  await new Promise(resolve => setTimeout(resolve, 300));
  
  const mockVillages = [
    `${taluka} Central`,
    `${taluka} East`,
    `${taluka} West`,
    `Old ${taluka}`,
    `New ${taluka} Village`
  ];
  
  cache[cacheKey] = mockVillages;
  return mockVillages;
}
