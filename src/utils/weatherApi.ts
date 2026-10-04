/**
 * Live Open-Meteo Weather and Air Quality API Service
 * Sourced directly from Open-Meteo High-Resolution Numerical Weather Prediction API (No API Key Required)
 */

export interface LiveWeatherData {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    precipitation: number;
    weatherCode: number;
    weatherCondition: {
      en: string;
      mr: string;
      hi: string;
    };
    uvIndex: number;
    aqi: number;
    aqiLabel: {
      en: string;
      mr: string;
      hi: string;
    };
    sunriseTime: string;
    sunsetTime: string;
  };
  forecast: Array<{
    date: string;
    dayKey: string;
    dayEn: string;
    dayMr: string;
    dayHi: string;
    tempMax: number;
    tempMin: number;
    rainProb: number;
    weatherCode: number;
  }>;
  advisory: {
    irrigation: {
      en: string;
      mr: string;
      hi: string;
    };
    spraying: {
      en: string;
      mr: string;
      hi: string;
    };
    protection: {
      en: string;
      mr: string;
      hi: string;
    };
  };
}

/**
 * Maps WMO weather code to multilingual descriptions
 */
export function getWmoCondition(code: number): { en: string; mr: string; hi: string } {
  if (code === 0) {
    return { en: "Clear Sky", mr: "स्वच्छ निरभ्र आकाश", hi: "साफ आसमान" };
  }
  if (code === 1) {
    return { en: "Mainly Clear", mr: "प्रामुख्याने निरभ्र", hi: "मुख्यतः साफ" };
  }
  if (code === 2) {
    return { en: "Partly Cloudy", mr: "अंशतः ढगाळ", hi: "आंशिक रूप से बादल" };
  }
  if (code === 3) {
    return { en: "Overcast", mr: "ढगाळ वातावरण", hi: "घने बादल" };
  }
  if (code === 45 || code === 48) {
    return { en: "Foggy / Mist", mr: "धुके", hi: "कोहरा व धुंध" };
  }
  if (code >= 51 && code <= 55) {
    return { en: "Light Drizzle", mr: "हलकी रिमझिम", hi: "हल्की बूंदाबांदी" };
  }
  if (code >= 61 && code <= 65) {
    return { en: "Moderate Rain", mr: "मध्यम पाऊस", hi: "मध्यम बारिश" };
  }
  if (code >= 71 && code <= 77) {
    return { en: "Snowfall", mr: "बर्फवृष्टी", hi: "बर्फबारी" };
  }
  if (code >= 80 && code <= 82) {
    return { en: "Rain Showers", mr: "पावसाच्या सरी", hi: "बारिश की बौछारें" };
  }
  if (code >= 95) {
    return { en: "Thunderstorm", mr: "वादळी पाऊस व विजा", hi: "आंधी-तूफान के साथ बारिश" };
  }
  return { en: "Partly Cloudy", mr: "अंशतः ढगाळ", hi: "आंशिक रूप से बादल" };
}

/**
 * Returns AQI label based on European Air Quality Index / US AQI
 */
export function getAqiLabel(aqi: number): { en: string; mr: string; hi: string } {
  if (aqi <= 50) {
    return { en: "Good", mr: "उत्तम", hi: "अच्छा" };
  }
  if (aqi <= 100) {
    return { en: "Moderate", mr: "मध्यम", hi: "संतोषजनक" };
  }
  if (aqi <= 150) {
    return { en: "Unhealthy for Sensitive", mr: "संवेदनशील घटकांसाठी अहितकारक", hi: "मध्यम प्रदूषित" };
  }
  if (aqi <= 200) {
    return { en: "Unhealthy", mr: "अस्वस्थ", hi: "खराब" };
  }
  return { en: "Very Unhealthy", mr: "अत्यंत घातक", hi: "अत्यंत खराब" };
}

// Fallback known coordinates for key Talukas and Districts in India
const KNOWN_COORDINATES: Record<string, { lat: number; lon: number }> = {
  // Maharashtra
  "Nashik": { lat: 19.9975, lon: 73.7898 },
  "Niphad": { lat: 20.0767, lon: 74.1081 },
  "Dindori": { lat: 20.2014, lon: 73.8344 },
  "Sinnar": { lat: 19.8456, lon: 74.0022 },
  "Malegaon": { lat: 20.5539, lon: 74.5294 },
  "Yeola": { lat: 20.0422, lon: 74.4883 },
  "Kalwan": { lat: 20.4883, lon: 73.9667 },
  "Baglan (Satana)": { lat: 20.5911, lon: 74.2008 },
  "Chandwad": { lat: 20.3283, lon: 74.2411 },
  "Deola": { lat: 20.4489, lon: 74.1844 },
  "Igatpuri": { lat: 19.6967, lon: 73.5658 },
  "Nandgaon": { lat: 20.3117, lon: 74.6586 },
  "Peth": { lat: 20.2581, lon: 73.5042 },
  "Surgana": { lat: 20.5756, lon: 73.6264 },
  "Trimbakeshwar": { lat: 19.9325, lon: 73.5306 },

  "Pune": { lat: 18.5204, lon: 73.8567 },
  "Haveli": { lat: 18.4500, lon: 73.8600 },
  "Pune City": { lat: 18.5204, lon: 73.8567 },
  "Baramati": { lat: 18.1517, lon: 74.5767 },
  "Junnar": { lat: 19.2081, lon: 73.8758 },
  "Khed": { lat: 18.8475, lon: 73.8967 },
  "Ambegaon": { lat: 19.0433, lon: 73.8567 },
  "Shirur": { lat: 18.8286, lon: 74.3789 },
  "Maval": { lat: 18.7500, lon: 73.5500 },
  "Mulshi": { lat: 18.5000, lon: 73.5167 },
  "Bhor": { lat: 18.1333, lon: 73.8500 },
  "Purandar": { lat: 18.2800, lon: 73.9700 },
  "Daund": { lat: 18.4667, lon: 74.5833 },
  "Indapur": { lat: 18.1167, lon: 75.0333 },

  "Ahmednagar": { lat: 19.0948, lon: 74.7480 },
  "Nagar": { lat: 19.0948, lon: 74.7480 },
  "Rahata": { lat: 19.6739, lon: 74.4756 },
  "Sangamner": { lat: 19.5761, lon: 74.2089 },
  "Shrirampur": { lat: 19.6178, lon: 74.6589 },
  "Kopargaon": { lat: 19.8889, lon: 74.4828 },
  "Akole": { lat: 19.5447, lon: 73.9939 },

  "Chhatrapati Sambhajinagar (Aurangabad)": { lat: 19.8762, lon: 75.3433 },
  "Nagpur": { lat: 21.1458, lon: 79.0882 },
  "Solapur": { lat: 17.6599, lon: 75.9064 },
  "Kolhapur": { lat: 16.7050, lon: 74.2433 },
  "Satara": { lat: 17.6805, lon: 74.0183 },
  "Sangli": { lat: 16.8524, lon: 74.5815 },
  "Jalgaon": { lat: 21.0077, lon: 75.5626 },
  "Amravati": { lat: 20.9374, lon: 77.7796 },
  "Yavatmal": { lat: 20.3888, lon: 78.1204 },
  "Nanded": { lat: 19.1383, lon: 77.3210 },
  "Latur": { lat: 18.4088, lon: 76.5604 },
  "Jalna": { lat: 19.8347, lon: 75.8816 },
  "Beed": { lat: 18.9891, lon: 75.7601 },
  "Dharashiv (Osmanabad)": { lat: 18.1861, lon: 76.0419 },
  "Buldhana": { lat: 20.5293, lon: 76.1843 },
  "Akola": { lat: 20.7002, lon: 77.0082 },

  // Other Major Indian Cities/Districts
  "Ahmedabad": { lat: 23.0225, lon: 72.5714 },
  "Surat": { lat: 21.1702, lon: 72.8311 },
  "Rajkot": { lat: 22.3039, lon: 70.8022 },
  "Bengaluru Urban": { lat: 12.9716, lon: 77.5946 },
  "Belagavi (Belgaum)": { lat: 15.8497, lon: 74.4977 },
  "Mysuru (Mysore)": { lat: 12.2958, lon: 76.6394 },
  "Indore": { lat: 22.7196, lon: 75.8577 },
  "Bhopal": { lat: 23.2599, lon: 77.4126 },
  "Ujjain": { lat: 23.1765, lon: 75.7885 },
  "Ludhiana": { lat: 30.9010, lon: 75.8573 },
  "Amritsar": { lat: 31.6340, lon: 74.8723 },
  "Karnal": { lat: 29.6857, lon: 76.9905 },
  "Jaipur": { lat: 26.9124, lon: 75.7873 },
  "Jodhpur": { lat: 26.2389, lon: 73.0243 },
  "Hyderabad": { lat: 17.3850, lon: 78.4867 },
  "Chennai": { lat: 13.0827, lon: 80.2707 },
  "Coimbatore": { lat: 11.0168, lon: 76.9558 },
  "Visakhapatnam": { lat: 17.6868, lon: 83.2185 },
  "Vijayawada": { lat: 16.5062, lon: 80.6480 },
  "Patna": { lat: 25.5941, lon: 85.1376 },
  "Kolkata": { lat: 22.5726, lon: 88.3639 },
  "Lucknow": { lat: 26.8467, lon: 80.9462 },
  "Varanasi": { lat: 25.3176, lon: 82.9739 },
  "Bhubaneswar": { lat: 20.2961, lon: 85.8245 },
  "Raipur": { lat: 21.2514, lon: 81.6296 },
  "Ranchi": { lat: 23.3441, lon: 85.3096 },
  "Guwahati": { lat: 26.1445, lon: 91.7362 },
  "Shimla": { lat: 31.1048, lon: 77.1734 },
  "Dehradun": { lat: 30.3165, lon: 78.0322 },
  "Srinagar": { lat: 34.0837, lon: 74.7973 },
  "Delhi": { lat: 28.7041, lon: 77.1025 },
  "Panaji": { lat: 15.4909, lon: 73.8278 }
};

/**
 * Resolves precise coordinates for Taluka, District, and State
 */
export async function getCoordinatesForLocation(
  state: string,
  district: string,
  taluka?: string,
  village?: string
): Promise<{ lat: number; lon: number }> {
  // Check known taluka/district coordinate cache first for instant resolution
  if (taluka && KNOWN_COORDINATES[taluka]) {
    return KNOWN_COORDINATES[taluka];
  }
  if (district && KNOWN_COORDINATES[district]) {
    return KNOWN_COORDINATES[district];
  }
  if (state && KNOWN_COORDINATES[state]) {
    return KNOWN_COORDINATES[state];
  }

  // Dynamic Geocoding using OpenStreetMap Nominatim
  try {
    const queryParts = [village, taluka, district, state, "India"].filter(Boolean).join(", ");
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryParts)}&limit=1`,
      { headers: { "User-Agent": "AgriSmartAI-Weather/1.0" } }
    );
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        };
      }
    }
  } catch (e) {
    console.warn("Geocoding query fallback:", e);
  }

  // Default coordinate if all lookups fail (Nashik Center)
  return { lat: 19.9975, lon: 73.7898 };
}

/**
 * Fetches Live Meteorological Data and Air Quality from Open-Meteo
 */
export async function fetchLiveWeatherData(lat: number, lon: number): Promise<LiveWeatherData> {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,uv_index_max&timezone=auto`;
  
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm2_5,pm10`;

  const [weatherRes, aqiRes] = await Promise.all([
    fetch(weatherUrl),
    fetch(aqiUrl).catch(() => null)
  ]);

  if (!weatherRes.ok) {
    throw new Error(`Open-Meteo API returned HTTP ${weatherRes.status}`);
  }

  const weatherData = await weatherRes.json();
  let aqiVal = 42;
  if (aqiRes && aqiRes.ok) {
    try {
      const aqiData = await aqiRes.json();
      if (aqiData.current && aqiData.current.european_aqi !== undefined) {
        aqiVal = aqiData.current.european_aqi;
      }
    } catch {
      aqiVal = 45;
    }
  }

  const current = weatherData.current;
  const daily = weatherData.daily;

  const currentTemp = Math.round(current.temperature_2m);
  const feelsLike = Math.round(current.apparent_temperature);
  const humidity = Math.round(current.relative_humidity_2m);
  const windSpeed = Math.round(current.wind_speed_10m);
  const weatherCode = current.weather_code;
  const weatherCondition = getWmoCondition(weatherCode);

  const uvIndex = daily.uv_index_max && daily.uv_index_max[0] !== undefined ? Math.round(daily.uv_index_max[0]) : 6;
  const aqiLabel = getAqiLabel(aqiVal);

  // Format Sunrise and Sunset
  let sunriseStr = "06:15 AM";
  let sunsetStr = "06:45 PM";
  if (daily.sunrise && daily.sunrise[0]) {
    const d = new Date(daily.sunrise[0]);
    sunriseStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  if (daily.sunset && daily.sunset[0]) {
    const d = new Date(daily.sunset[0]);
    sunsetStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  // 7-day forecast parsing
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysMr = ["रवि", "सोम", "मंगळ", "बुध", "गुरु", "शुक्र", "शनि"];
  const daysHi = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];

  const forecast = (daily.time || []).slice(0, 7).map((dateStr: string, idx: number) => {
    const d = new Date(dateStr);
    const dayIdx = d.getDay();
    return {
      date: dateStr,
      dayKey: daysOfWeek[dayIdx],
      dayEn: idx === 0 ? "Today" : daysOfWeek[dayIdx],
      dayMr: idx === 0 ? "आज" : daysMr[dayIdx],
      dayHi: idx === 0 ? "आज" : daysHi[dayIdx],
      tempMax: Math.round(daily.temperature_2m_max[idx] ?? 30),
      tempMin: Math.round(daily.temperature_2m_min[idx] ?? 20),
      rainProb: Math.round(daily.precipitation_probability_max?.[idx] ?? 0),
      weatherCode: daily.weather_code?.[idx] ?? 0
    };
  });

  // Dynamic Agrometeorological Guidance Calculation
  const tempMaxToday = daily.temperature_2m_max?.[0] ?? currentTemp;
  const rainProbToday = daily.precipitation_probability_max?.[0] ?? 0;
  const rainNext3Days = (daily.precipitation_sum || []).slice(0, 3).reduce((acc: number, val: number) => acc + (val || 0), 0);
  const maxRainProbNext3 = Math.max(...(daily.precipitation_probability_max || []).slice(0, 3), 0);
  const isThunderstorm = (daily.weather_code || []).slice(0, 3).some((c: number) => c >= 95);

  // 1. Dynamic Irrigation Advisory
  let irrigEn = `Maintain standard irrigation schedule. Topsoil evaporation is normal.`;
  let irrigMr = `नियमित सिंचन चालू ठेवा. जमिनीतील ओलावा व पिकांच्या गरजेनुसार पाणी द्या.`;
  let irrigHi = `नियमित सिंचाई जारी रखें। खेत में नमी और फसल की आवश्यकता अनुसार पानी दें।`;

  if (maxRainProbNext3 >= 60 || rainNext3Days >= 5) {
    irrigEn = `Hold Irrigation: High rain probability (${maxRainProbNext3}%, ~${rainNext3Days.toFixed(1)} mm) in the next 2-3 days. Delay watering to save power and prevent waterlogging.`;
    irrigMr = `सिंचन पुढे ढकला: पुढील २-३ दिवसांत जोरदार पावसाची शक्यता (${maxRainProbNext3}%, ~${rainNext3Days.toFixed(1)} मिमी) आहे. मुळांमध्ये पाणी साचू नये म्हणून सिंचन थांबवा.`;
    irrigHi = `सिंचाई स्थगित करें: अगले २-३ दिनों में भारी बारिश का अनुमान (${maxRainProbNext3}%, ~${rainNext3Days.toFixed(1)} मिमी) है। बिजली व पानी बचाएं और जलभराव से बचें।`;
  } else if (tempMaxToday >= 35 && humidity < 40) {
    irrigEn = `Moisture Stress Alert: High temperature (${tempMaxToday}°C) and low humidity (${humidity}%). Apply drip irrigation or light frequent watering during morning/evening.`;
    irrigMr = `ओलावा व्यवस्थापन: वाढते तापमान (${tempMaxToday}°C) व कमी हवेतील आर्द्रतेमुळे (${humidity}%) पिकांना ताण बसू नये म्हणून सायंकाळी हलके पाणी किंवा ठिबक सुरू करा.`;
    irrigHi = `नमी प्रबंधन: अत्यधिक तापमान (${tempMaxToday}°C) और कम आर्द्रता (${humidity}%) के कारण सुबह या शाम के समय ड्रिप या हल्की सिंचाई करें।`;
  }

  // 2. Dynamic Spraying Schedule
  let sprayEn = `Optimal Spraying Window: Tomorrow 6:00 AM - 9:30 AM. Wind speed is calm (${windSpeed} km/h) and temperature is conducive for absorption.`;
  let sprayMr = `फवारणीसाठी अनुकूल वेळ: उद्या सकाळी ६:०० ते ९:३० वाजेपर्यंत. वाऱ्याचा वेग शांत (${windSpeed} किमी/तास) असल्याने औषधाचे शोषण उत्तम होईल.`;
  let sprayHi = `छिड़काव का अनुकूल समय: कल सुबह ६:०० से ९:३० बजे तक। हवा की गति शांत (${windSpeed} किमी/घंटा) है जिससे दवा का प्रभाव उत्तम रहेगा।`;

  if (windSpeed > 15 || rainProbToday >= 50) {
    sprayEn = `Avoid Spraying Today: High wind speed (${windSpeed} km/h) or rain probability (${rainProbToday}%). Spraying now will cause chemical drift and pesticide wash-off.`;
    sprayMr = `आज फवारणी टाळा: जोरदार वारा (${windSpeed} किमी/तास) किंवा पावसाचा धोका (${rainProbToday}%) असल्याने औषध उडून जाणे अथवा वाहून जाण्याचा धोका आहे.`;
    sprayHi = `आज छिड़काव न करें: तेज हवा (${windSpeed} किमी/घंटा) या बारिश की संभावना (${rainProbToday}%) के कारण कीटनाशक बहने या उड़ने का खतरा है।`;
  }

  // 3. Dynamic Weather Alert & Crop Protection
  let protectEn = `Normal Weather: Ambient temperature and UV conditions (${uvIndex}) are favorable for seasonal crops.`;
  let protectMr = `हवामान अनुकूल: तापमान व UV निर्देशांक (${uvIndex}) पिकांसाठी सामान्य व वाढीसाठी पोषक आहे.`;
  let protectHi = `मौसम सामान्य: तापमान व UV इंडेक्स (${uvIndex}) फसलों के लिए अनुकूल व सुरक्षित है।`;

  if (isThunderstorm || rainNext3Days >= 25) {
    protectEn = `Storm & Heavy Rain Warning: Severe downpour (~${rainNext3Days.toFixed(1)} mm) and thunderstorm likely. Clear all farm drainage channels to avoid inundation.`;
    protectMr = `वादळ व मुसळधार पाऊस इशारा: जोरदार पाऊस (~${rainNext3Days.toFixed(1)} मिमी) व वादळी वाऱ्याची शक्यता आहे. शेतातील पाणी बाहेर काढण्यासाठी चर व नाले मोकळे करा.`;
    protectHi = `आंधी व भारी बारिश चेतावनी: भारी बारिश (~${rainNext3Days.toFixed(1)} मिमी) का अनुमान है। खेतों से पानी की निकासी के रास्ते तुरंत साफ करें।`;
  } else if (uvIndex >= 7 || tempMaxToday >= 38) {
    protectEn = `High UV & Heat Alert: UV Index is ${uvIndex} and max temp is ${tempMaxToday}°C. Apply temporary shade nets for tender vegetable nurseries and mulch orchards.`;
    protectMr = `तीव्र उष्णता व UV इशारा: UV निर्देशांक ${uvIndex} आणि कमाल तापमान ${tempMaxToday}°C आहे. भाजीपाल्याची रोपे शेडनेटने झाका व बागेत आच्छादन (मल्चिंग) करा.`;
    protectHi = `अत्यधिक गर्मी व UV चेतावनी: UV इंडेक्स ${uvIndex} व अधिकतम तापमान ${tempMaxToday}°C है। सब्जियों की नर्सरी के लिए शेडनेट लगाएं और मल्चिंग करें।`;
  }

  return {
    current: {
      temp: currentTemp,
      feelsLike,
      humidity,
      windSpeed,
      windDirection: current.wind_direction_10m || 0,
      precipitation: current.precipitation || 0,
      weatherCode,
      weatherCondition,
      uvIndex,
      aqi: aqiVal,
      aqiLabel,
      sunriseTime: sunriseStr,
      sunsetTime: sunsetStr
    },
    forecast,
    advisory: {
      irrigation: {
        en: irrigEn,
        mr: irrigMr,
        hi: irrigHi
      },
      spraying: {
        en: sprayEn,
        mr: sprayMr,
        hi: sprayHi
      },
      protection: {
        en: protectEn,
        mr: protectMr,
        hi: protectHi
      }
    }
  };
}
