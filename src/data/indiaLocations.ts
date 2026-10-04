/**
 * Complete Official Indian States (28), Union Territories (8), Districts and Talukas/Tehsils/Mandals
 * Sources: Ministry of Panchayati Raj / Census of India / State Revenue & Land Records Portals
 */

export interface StateDistrictMap {
  [state: string]: string[];
}

export interface DistrictTalukaMap {
  [district: string]: string[];
}

export const ALL_INDIAN_STATES_UTS: string[] = [
  // 28 States
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  // 8 Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

// Alias for backwards compatibility
export const INDIAN_STATES = ALL_INDIAN_STATES_UTS;

export const STATE_DISTRICTS: StateDistrictMap = {
  // 28 States
  "Maharashtra": [
    "Ahmednagar", "Akola", "Amravati", "Chhatrapati Sambhajinagar (Aurangabad)", "Beed", "Bhandara", "Buldhana",
    "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna",
    "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded",
    "Nandurbar", "Nashik", "Dharashiv (Osmanabad)", "Palghar", "Parbhani", "Pune",
    "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane",
    "Wardha", "Washim", "Yavatmal"
  ],
  "Gujarat": [
    "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar",
    "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhumi Dwarka", "Gandhinagar",
    "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana",
    "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot",
    "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"
  ],
  "Karnataka": [
    "Bagalkot", "Ballari (Bellary)", "Belagavi (Belgaum)", "Bengaluru Rural", "Bengaluru Urban",
    "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga",
    "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri",
    "Kalaburagi (Gulbarga)", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru (Mysore)",
    "Raichur", "Ramanagara", "Shivamogga (Shimoga)", "Tumakuru (Tumkur)", "Udupi",
    "Uttara Kannada", "Vijayanagara", "Vijayapura (Bijapur)", "Yadgir"
  ],
  "Madhya Pradesh": [
    "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani",
    "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh",
    "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Narmadapuram (Hoshangabad)",
    "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla",
    "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Niwari", "Panna", "Raisen",
    "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol",
    "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain",
    "Umaria", "Vidisha"
  ],
  "Punjab": [
    "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka",
    "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana",
    "Malerkotla", "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar",
    "Sahibzada Ajit Singh Nagar (Mohali)", "Sangrur", "Shahid Bhagat Singh Nagar (Nawanshahr)",
    "Tarn Taran"
  ],
  "Haryana": [
    "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram",
    "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh",
    "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa",
    "Sonipat", "Yamunanagar"
  ],
  "Rajasthan": [
    "Ajmer", "Alwar", "Anupgarh", "Balotra", "Banswara", "Baran", "Barmer", "Beawar",
    "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa",
    "Deeg", "Didwana-Kuchaman", "Dholpur", "Dungarpur", "Ganganagar", "Gangapurcity",
    "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur",
    "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur",
    "Sikar", "Sirohi", "Tonk", "Udaipur"
  ],
  "Uttar Pradesh": [
    "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya",
    "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki",
    "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli",
    "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad",
    "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur",
    "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat",
    "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow",
    "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur",
    "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli",
    "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli",
    "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
  ],
  "Tamil Nadu": [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
    "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur",
    "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris",
    "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga",
    "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
    "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
    "Viluppuram", "Virudhunagar"
  ],
  "Andhra Pradesh": [
    "Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya", "Bapatla",
    "Chittoor", "Dr. B.R. Ambedkar Konaseema", "East Godavari", "Eluru", "Guntur",
    "Kakinada", "Krishna", "Kurnool", "Nandyal", "NTR", "Palnadu", "Parvathipuram Manyam",
    "Prakasam", "Sri Potti Sriramulu Nellore", "Sri Sathya Sai", "Srikakulam",
    "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"
  ],
  "Telangana": [
    "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally",
    "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem Asifabad",
    "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu",
    "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli",
    "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad",
    "Wanaparthy", "Warangal", "Hanamkonda", "Yadadri Bhuvanagiri"
  ],
  "Bihar": [
    "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur",
    "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad",
    "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura",
    "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia",
    "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi",
    "Siwan", "Supaul", "Vaishali", "West Champaran"
  ],
  "West Bengal": [
    "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling",
    "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda",
    "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur",
    "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"
  ],
  "Odisha": [
    "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh",
    "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi",
    "Kandhamal", "Kendrapara", "Kendujhar (Keonjhar)", "Khordha", "Koraput", "Malkangiri",
    "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur",
    "Subarnapur (Sonepur)", "Sundargarh"
  ],
  "Kerala": [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam",
    "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram",
    "Thrissur", "Wayanad"
  ],
  "Chhattisgarh": [
    "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur",
    "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa",
    "Jashpur", "Kabirdham (Kawardha)", "Kanker", "Khairagarh", "Kondagaon", "Korba",
    "Koriya", "Mahasamund", "Manendragarh", "Mohla-Manpur", "Mungeli", "Narayanpur",
    "Raigarh", "Raipur", "Rajnandgaon", "Sarangarh-Bilaigarh", "Sakti", "Sukma",
    "Surajpur", "Surguja"
  ],
  "Jharkhand": [
    "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa",
    "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma",
    "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahebganj",
    "Seraikela Kharsawan", "Simdega", "West Singhbhum"
  ],
  "Assam": [
    "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang",
    "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat",
    "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong",
    "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari",
    "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"
  ],
  "Himachal Pradesh": [
    "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti",
    "Mandi", "Shimla", "Sirmaur", "Solan", "Una"
  ],
  "Uttarakhand": [
    "Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital",
    "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar",
    "Uttarkashi"
  ],
  "Goa": [
    "North Goa", "South Goa"
  ],
  "Arunachal Pradesh": [
    "Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Kra Daadi",
    "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang",
    "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang",
    "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"
  ],
  "Manipur": [
    "Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam",
    "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong",
    "Tengnoupal", "Thoubal", "Ukhrul"
  ],
  "Meghalaya": [
    "East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "Eastern West Khasi Hills",
    "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills",
    "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"
  ],
  "Mizoram": [
    "Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei",
    "Mamit", "Saitual", "Serchhip", "Siaha"
  ],
  "Nagaland": [
    "Chümoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon",
    "Niuland", "Noklak", "Peren", "Phek", "Shamator", "Tseminyü", "Tuensang", "Wokha", "Zünheboto"
  ],
  "Sikkim": [
    "Gangtok", "Gyalshing", "Mangan", "Namchi", "Pakyong", "Soreng"
  ],
  "Tripura": [
    "Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"
  ],

  // 8 Union Territories
  "Andaman and Nicobar Islands": [
    "Nicobar", "North and Middle Andaman", "South Andaman"
  ],
  "Chandigarh": [
    "Chandigarh"
  ],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Dadra and Nagar Haveli", "Daman", "Diu"
  ],
  "Delhi": [
    "Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi",
    "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi",
    "West Delhi"
  ],
  "Jammu and Kashmir": [
    "Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu",
    "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri",
    "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"
  ],
  "Ladakh": [
    "Kargil", "Leh"
  ],
  "Lakshadweep": [
    "Lakshadweep"
  ],
  "Puducherry": [
    "Karaikal", "Mahe", "Puducherry", "Yanam"
  ]
};

/**
 * Authentic District to Talukas / Tehsils / Mandals Mapping
 */
export const DISTRICT_TALUKAS: DistrictTalukaMap = {
  // Maharashtra Key Districts
  "Nashik": [
    "Nashik", "Niphad", "Dindori", "Sinnar", "Malegaon", "Yeola", "Kalwan",
    "Baglan (Satana)", "Chandwad", "Deola", "Igatpuri", "Nandgaon", "Peth",
    "Surgana", "Trimbakeshwar"
  ],
  "Pune": [
    "Haveli", "Pune City", "Baramati", "Junnar", "Khed", "Ambegaon", "Shirur",
    "Maval", "Mulshi", "Bhor", "Velhe", "Purandar", "Daund", "Indapur"
  ],
  "Ahmednagar": [
    "Nagar", "Rahata", "Sangamner", "Shrirampur", "Nevasa", "Shevgaon", "Kopargaon",
    "Akole", "Parner", "Pathardi", "Jamkhed", "Karjat", "Rahuri", "Shrigonda"
  ],
  "Chhatrapati Sambhajinagar (Aurangabad)": [
    "Aurangabad", "Paithan", "Gangapur", "Vaijapur", "Kannad", "Khuldabad",
    "Sillod", "Soegaon", "Phulambri"
  ],
  "Nagpur": [
    "Nagpur Urban", "Nagpur Rural", "Kamptee", "Hingna", "Katol", "Narkhed",
    "Savner", "Kalmeshwar", "Ramtek", "Parseoni", "Mouda", "Umred", "Bhiwapur", "Kuhi"
  ],
  "Solapur": [
    "Solapur North", "Solapur South", "Barshi", "Pandharpur", "Madha", "Karmala",
    "Mohol", "Malshiras", "Sangola", "Mangalwedha", "Akkalkot"
  ],
  "Kolhapur": [
    "Karveer", "Hatkangale", "Shirol", "Kagal", "Radhanagari", "Bhudargad",
    "Ajra", "Gadhinglaj", "Chandgad", "Shahuwadi", "Panhala", "Gaganbawda"
  ],
  "Satara": [
    "Satara", "Karad", "Wai", "Mahabaleshwar", "Phaltan", "Koregaon", "Khatav",
    "Maan", "Patan", "Jaoli", "Khandala"
  ],
  "Sangli": [
    "Miraj", "Tasgaon", "Walwa (Islampur)", "Shirala", "Khanapur (Vita)", "Atpadi",
    "Jat", "Kavathe Mahankal", "Palus", "Kadegaon"
  ],
  "Jalgaon": [
    "Jalgaon", "Bhusawal", "Chalisgaon", "Jamner", "Raver", "Yawal", "Erandol",
    "Dharangaon", "Parola", "Amalner", "Chopda", "Pachora", "Bhadgaon", "Bodwad", "Muktainagar"
  ],
  "Amravati": [
    "Amravati", "Achalpur", "Chandur Bazar", "Morshi", "Warud", "Daryapur", "Anjangaon Surji",
    "Teosa", "Nandgaon Khandeshwar", "Chandur Railway", "Dhamangaon Railway", "Bhatkuli", "Dharni", "Chikhaldara"
  ],
  "Yavatmal": [
    "Yavatmal", "Pusad", "Umarkhed", "Digras", "Darwha", "Arni", "Ghatanji", "Pandharkawada (Kelapur)",
    "Wani", "Maregaon", "Ralegaon", "Babhulgaon", "Kalamb", "Mahagaon", "Zari Jamani", "Ner"
  ],
  "Nanded": [
    "Nanded", "Mukhed", "Degloor", "Biloli", "Loha", "Hadgaon", "Kinwat", "Bhokar",
    "Mudkhed", "Ardhapur", "Himayatnagar", "Mahoor", "Umri", "Dharmabad", "Naigaon", "Kandhar"
  ],
  "Latur": [
    "Latur", "Ausa", "Nilanga", "Udgir", "Ahmedpur", "Chakur", "Renapur", "Deoni", "Shirur Anantpal", "Jalkot"
  ],
  "Jalna": [
    "Jalna", "Ambad", "Bhokardan", "Jafrabad", "Partur", "Mantha", "Badnapur", "Ghansawangi"
  ],
  "Beed": [
    "Beed", "Georai", "Majalgaon", "Ambejogai", "Parli", "Kaij", "Ashti", "Patoda", "Shirur Kasar", "Wadwani", "Dharur"
  ],
  "Dharashiv (Osmanabad)": [
    "Osmanabad", "Tuljapur", "Omerga", "Lohara", "Kalamb", "Bhum", "Paranda", "Washi"
  ],
  "Buldhana": [
    "Buldhana", "Chikhli", "Deulgaon Raja", "Mehkar", "Sindkhed Raja", "Lonar", "Khamgaon", "Shegaon",
    "Malkapur", "Motala", "Nandura", "Jalgaon Jamod", "Sangrampur"
  ],
  "Akola": [
    "Akola", "Akot", "Telhara", "Balapur", "Patur", "Murtizapur", "Barshitakli"
  ],
  "Washim": [
    "Washim", "Risod", "Malegaon", "Mangrulpir", "Karanja", "Manora"
  ],
  "Wardha": [
    "Wardha", "Deoli", "Seloo", "Arvi", "Ashti", "Karanja", "Hinganghat", "Samudrapur"
  ],
  "Chandrapur": [
    "Chandrapur", "Bhadravati", "Warora", "Chimur", "Nagbhid", "Brahmapuri", "Sindewahi",
    "Mul", "Saoli", "Gondpipri", "Korpurna", "Rajura", "Jivati", "Ballarpur", "Pombhurna"
  ],
  "Gadchiroli": [
    "Gadchiroli", "Dhanora", "Chamorshi", "Armori", "Kurkheda", "Korchi", "Aheri",
    "Etapalli", "Bhamragad", "Sironcha", "Mulchera", "Desaiganj (Wadsa)"
  ],
  "Bhandara": [
    "Bhandara", "Tumsar", "Mohadi", "Pauni", "Sakoli", "Lakhani", "Lakhandur"
  ],
  "Gondia": [
    "Gondia", "Tirora", "Goregaon", "Amgaon", "Salekasa", "Sadak Arjuni", "Arjuni Morgaon", "Deori"
  ],
  "Hingoli": [
    "Hingoli", "Kalamnuri", "Basmath", "Aundha Nagnath", "Sengaon"
  ],
  "Parbhani": [
    "Parbhani", "Gangakhed", "Pathri", "Jintur", "Purna", "Palam", "Sailu", "Sonpeth", "Manwath"
  ],
  "Dhule": [
    "Dhule", "Sakri", "Shirpur", "Sindkheda"
  ],
  "Nandurbar": [
    "Nandurbar", "Navapur", "Shahada", "Taloda", "Akkalkuwa", "Akrani (Dhadgaon)"
  ],
  "Raigad": [
    "Alibag", "Pen", "Panvel", "Karjat", "Khalapur", "Roha", "Mangaon", "Mahad",
    "Poladpur", "Mhasla", "Shrivardhan", "Murud", "Tala", "Uran", "Sudhagad (Pali)"
  ],
  "Ratnagiri": [
    "Ratnagiri", "Chiplun", "Khed", "Guhagar", "Dapoli", "Mandangad", "Sangameshwar", "Rajapur", "Lanja"
  ],
  "Sindhudurg": [
    "Kudal", "Kankavli", "Sawantwadi", "Malvan", "Vengurla", "Devgad", "Vaibhavwadi", "Dodamarg"
  ],
  "Thane": [
    "Thane", "Kalyan", "Murbad", "Bhiwandi", "Shahapur", "Ulhasnagar", "Ambarnath"
  ],
  "Palghar": [
    "Palghar", "Vasai", "Dahanu", "Talasari", "Jawhar", "Mokhada", "Vada", "Vikramgad"
  ],
  "Mumbai City": [
    "Colaba", "Fort", "Byculla", "Dadar", "Parel", "Malabar Hill"
  ],
  "Mumbai Suburban": [
    "Andheri", "Bandra", "Borivali", "Kurla", "Ghatkopar", "Mulund"
  ],

  // Gujarat Sample Districts
  "Ahmedabad": ["Ahmedabad City", "Daskroi", "Sanand", "Bavla", "Dholka", "Viramgam", "Mandal", "Detroj-Rampura", "Dhandhuka", "Dholera"],
  "Surat": ["Surat City", "Choryasi", "Olpad", "Kamrej", "Mangrol", "Umarpada", "Mandvi", "Bardoli", "Mahuva", "Palsana"],
  "Rajkot": ["Rajkot", "Gondal", "Jetpur", "Dhoraji", "Upleta", "Jasdan", "Kotda Sangani", "Lodhika", "Paddhari", "Vinchhiya", "Jamkandorna"],
  "Vadodara": ["Vadodara", "Padra", "Karjan", "Shinor", "Dabhoi", "Waghodia", "Savli", "Desar"],

  // Karnataka Sample Districts
  "Bengaluru Urban": ["Bengaluru North", "Bengaluru South", "Bengaluru East", "Anekal", "Yelahanka"],
  "Belagavi (Belgaum)": ["Belagavi", "Gokak", "Chikkodi", "Athani", "Bailhongal", "Hukkeri", "Ramdurg", "Saundatti", "Khanapur", "Raybag", "Mudalgi", "Nipani", "Kagawad", "Kittur"],
  "Mysuru (Mysore)": ["Mysuru", "Hunsur", "Nanjangud", "T. Narasipura", "K.R. Nagar", "Piriyapatna", "H.D. Kote", "Saragur", "Saligrama"],

  // MP Sample Districts
  "Indore": ["Indore", "Mhow (Dr. Ambedkar Nagar)", "Sanwer", "Depalpur", "Hatod", "Rau"],
  "Bhopal": ["Huzur", "Berasia", "Kolar"],
  "Ujjain": ["Ujjain", "Nagda", "Mahidpur", "Tarana", "Khachrod", "Badnagar", "Ghatiya"],

  // Punjab Sample Districts
  "Ludhiana": ["Ludhiana East", "Ludhiana West", "Jagraon", "Khanna", "Samrala", "Payal", "Raikot"],
  "Amritsar": ["Amritsar-I", "Amritsar-II", "Ajnala", "Baba Bakala", "Majitha"],

  // Haryana Sample Districts
  "Karnal": ["Karnal", "Indri", "Nilokheri", "Gharaunda", "Assandh"],
  "Hisar": ["Hisar", "Hansi", "Adampur", "Barwala", "Narnaund", "Uklana"],

  // Rajasthan Sample Districts
  "Jaipur": ["Jaipur", "Amer", "Sanganer", "Chaksu", "Kotputli", "Shahpura", "Chomu", "Phulera", "Bassai", "Jamwa Ramgarh"],
  "Jodhpur": ["Jodhpur", "Luni", "Bilara", "Bhopalgarh", "Osian", "Phalodi", "Shergarh", "Balesar"]
};

/**
 * Multilingual Translations for All 36 Indian States and Union Territories
 */
export const STATE_TRANSLATIONS: Record<string, { mr: string; hi: string }> = {
  // 28 States
  "Andhra Pradesh": { mr: "आंध्र प्रदेश", hi: "आंध्र प्रदेश" },
  "Arunachal Pradesh": { mr: "अरुणाचल प्रदेश", hi: "अरुणाचल प्रदेश" },
  "Assam": { mr: "आसाम", hi: "असम" },
  "Bihar": { mr: "बिहार", hi: "बिहार" },
  "Chhattisgarh": { mr: "छत्तीसगढ", hi: "छत्तीसगढ़" },
  "Goa": { mr: "गोवा", hi: "गोवा" },
  "Gujarat": { mr: "गुजरात", hi: "गुजरात" },
  "Haryana": { mr: "हरियाणा", hi: "हरियाणा" },
  "Himachal Pradesh": { mr: "हिमाचल प्रदेश", hi: "हिमाचल प्रदेश" },
  "Jharkhand": { mr: "झारखंड", hi: "झारखंड" },
  "Karnataka": { mr: "कर्नाटक", hi: "कर्नाटक" },
  "Kerala": { mr: "केरळ", hi: "केरल" },
  "Madhya Pradesh": { mr: "मध्य प्रदेश", hi: "मध्य प्रदेश" },
  "Maharashtra": { mr: "महाराष्ट्र", hi: "महाराष्ट्र" },
  "Manipur": { mr: "मणिपूर", hi: "मणिपुर" },
  "Meghalaya": { mr: "मेघालय", hi: "मेघालय" },
  "Mizoram": { mr: "मिझोराम", hi: "मिजोरम" },
  "Nagaland": { mr: "नागालँड", hi: "नागालैंड" },
  "Odisha": { mr: "ओडिशा", hi: "ओडिशा" },
  "Punjab": { mr: "पंजाब", hi: "पंजाब" },
  "Rajasthan": { mr: "राजस्थान", hi: "राजस्थान" },
  "Sikkim": { mr: "सिक्कीम", hi: "सिक्किम" },
  "Tamil Nadu": { mr: "तमिळनाडू", hi: "तमिलनाडु" },
  "Telangana": { mr: "तेलंगणा", hi: "तेलंगाना" },
  "Tripura": { mr: "त्रिपुरा", hi: "त्रिपुरा" },
  "Uttar Pradesh": { mr: "उत्तर प्रदेश", hi: "उत्तर प्रदेश" },
  "Uttarakhand": { mr: "उत्तराखंड", hi: "उत्तराखंड" },
  "West Bengal": { mr: "पश्चिम बंगाल", hi: "पश्चिम बंगाल" },

  // 8 Union Territories
  "Andaman and Nicobar Islands": { mr: "अंदमान आणि निकोबार बेटे", hi: "अंडमान और निकोबार द्वीप समूह" },
  "Chandigarh": { mr: "चंदिगढ", hi: "चंडीगढ़" },
  "Dadra and Nagar Haveli and Daman and Diu": { mr: "दादरा आणि नगर हवेली आणि दमण आणि दीव", hi: "दादरा और नगर हवेली और दमन और दीव" },
  "Delhi": { mr: "दिल्ली", hi: "दिल्ली" },
  "Jammu and Kashmir": { mr: "जम्मू आणि काश्मीर", hi: "जम्मू और कश्मीर" },
  "Ladakh": { mr: "लडाख", hi: "लद्दाख" },
  "Lakshadweep": { mr: "लक्षद्वीप", hi: "लक्षद्वीप" },
  "Puducherry": { mr: "पुडुचेरी", hi: "पुदुचेरी" }
};

/**
 * Multilingual Translations for Indian Districts
 */
export const DISTRICT_TRANSLATIONS: Record<string, { mr: string; hi: string }> = {
  // Maharashtra
  "Ahmednagar": { mr: "अहमदनगर (अहिल्यानगर)", hi: "अहमदनगर (अहिल्यानगर)" },
  "Akola": { mr: "अकोला", hi: "अकोला" },
  "Amravati": { mr: "अमरावती", hi: "अमरावती" },
  "Chhatrapati Sambhajinagar (Aurangabad)": { mr: "छत्रपती संभाजीनगर (औरंगाबाद)", hi: "छत्रपति संभाजीनगर (औरंगाबाद)" },
  "Beed": { mr: "बीड", hi: "बीड" },
  "Bhandara": { mr: "भंडारा", hi: "भंडारा" },
  "Buldhana": { mr: "बुलढाणा", hi: "बुलढाणा" },
  "Chandrapur": { mr: "चंद्रपूर", hi: "चंद्रपुर" },
  "Dhule": { mr: "धुळे", hi: "धुले" },
  "Gadchiroli": { mr: "गडचिरोली", hi: "गडचिरोली" },
  "Gondia": { mr: "गोंदिया", hi: "गोंदिया" },
  "Hingoli": { mr: "हिंगोली", hi: "हिंगोली" },
  "Jalgaon": { mr: "जळगाव", hi: "जलगांव" },
  "Jalna": { mr: "जालना", hi: "जालना" },
  "Kolhapur": { mr: "कोल्हापूर", hi: "कोल्हापुर" },
  "Latur": { mr: "लातूर", hi: "लातूर" },
  "Mumbai City": { mr: "मुंबई शहर", hi: "मुंबई शहर" },
  "Mumbai Suburban": { mr: "मुंबई उपनगर", hi: "मुंबई उपनगर" },
  "Nagpur": { mr: "नागपूर", hi: "नागपुर" },
  "Nanded": { mr: "नांदेड", hi: "नांदेड़" },
  "Nandurbar": { mr: "नंदुरबार", hi: "नंदुरबार" },
  "Nashik": { mr: "नाशिक", hi: "नासिक" },
  "Dharashiv (Osmanabad)": { mr: "धाराशिव (उस्मानाबाद)", hi: "धाराशिव (उस्मानाबाद)" },
  "Palghar": { mr: "पालघर", hi: "पालघर" },
  "Parbhani": { mr: "परभणी", hi: "परभणी" },
  "Pune": { mr: "पुणे", hi: "पुणे" },
  "Raigad": { mr: "रायगड", hi: "रायगढ़" },
  "Ratnagiri": { mr: "रत्नागिरी", hi: "रत्नागिरी" },
  "Sangli": { mr: "सांगली", hi: "सांगली" },
  "Satara": { mr: "सातारा", hi: "सतारा" },
  "Sindhudurg": { mr: "सिंधुदुर्ग", hi: "सिंधुदुर्ग" },
  "Solapur": { mr: "सोलापूर", hi: "सोलापुर" },
  "Thane": { mr: "ठाणे", hi: "ठाणे" },
  "Wardha": { mr: "वर्धा", hi: "वर्धा" },
  "Washim": { mr: "वाशीम", hi: "वाशिम" },
  "Yavatmal": { mr: "यवतमाळ", hi: "यवतमाल" },

  // Gujarat
  "Ahmedabad": { mr: "अहमदाबाद", hi: "अहमदाबाद" },
  "Amreli": { mr: "अमरेली", hi: "अमरेली" },
  "Anand": { mr: "आणंद", hi: "आनंद" },
  "Aravalli": { mr: "अरवली", hi: "अरावली" },
  "Banaskantha": { mr: "बनासकांठा", hi: "बनासकांठा" },
  "Bharuch": { mr: "भरूच", hi: "भरूच" },
  "Bhavnagar": { mr: "भावनगर", hi: "भावनगर" },
  "Gandhinagar": { mr: "गांधीनगर", hi: "गांधीनगर" },
  "Rajkot": { mr: "राजकोट", hi: "राजकोट" },
  "Surat": { mr: "सुरत", hi: "सूरत" },
  "Vadodara": { mr: "वडोदरा", hi: "वडोदरा" },

  // Karnataka
  "Bengaluru Urban": { mr: "बंगळूरू शहर", hi: "बेंगलुरु शहरी" },
  "Bengaluru Rural": { mr: "बंगळूरू ग्रामीण", hi: "बेंगलुरु ग्रामीण" },
  "Belagavi (Belgaum)": { mr: "बेळगाव (बेळगावी)", hi: "बेलगावी (बेलगाम)" },
  "Mysuru (Mysore)": { mr: "म्हैसूर", hi: "मैसूर" },
  "Kalaburagi (Gulbarga)": { mr: "कलबुरगी (गुलबर्गा)", hi: "कलबुर्गी (गुलबर्गा)" },

  // Madhya Pradesh
  "Indore": { mr: "इंदूर", hi: "इंदौर" },
  "Bhopal": { mr: "भोपाळ", hi: "भोपाल" },
  "Ujjain": { mr: "उज्जैन", hi: "उज्जैन" },
  "Gwalior": { mr: "ग्वाल्हेर", hi: "ग्वालियर" },
  "Jabalpur": { mr: "जबलपूर", hi: "जबलपुर" },

  // Punjab
  "Amritsar": { mr: "अमृतसर", hi: "अमृतसर" },
  "Ludhiana": { mr: "लुधियाना", hi: "लुधियाना" },
  "Jalandhar": { mr: "जालंधर", hi: "जालंधर" },
  "Patiala": { mr: "पटियाला", hi: "पटियाला" },

  // Haryana
  "Gurugram": { mr: "गुरुग्राम", hi: "गुरुग्राम" },
  "Faridabad": { mr: "फरीदाबाद", hi: "फरीदाबाद" },
  "Karnal": { mr: "कर्नाल", hi: "करनाल" },
  "Hisar": { mr: "हिसार", hi: "हिसार" },

  // Rajasthan
  "Jaipur": { mr: "जयपूर", hi: "जयपुर" },
  "Jodhpur": { mr: "जोधपूर", hi: "जोधपुर" },
  "Kota": { mr: "कोटा", hi: "कोटा" },
  "Udaipur": { mr: "उदयपूर", hi: "उदयपुर" },
  "Bikaner": { mr: "बिकानेर", hi: "बीकानेर" }
};

/**
 * Common Taluka Multilingual Name Mapping
 */
export const TALUKA_TRANSLATIONS: Record<string, { mr: string; hi: string }> = {
  // Nashik Talukas
  "Nashik": { mr: "नाशिक", hi: "नासिक" },
  "Niphad": { mr: "निफाड", hi: "निफाड़" },
  "Dindori": { mr: "दिंडोरी", hi: "दिंडोरी" },
  "Sinnar": { mr: "सिन्नर", hi: "सिन्नर" },
  "Malegaon": { mr: "मालेगाव", hi: "मालेगांव" },
  "Yeola": { mr: "येवला", hi: "येवला" },
  "Kalwan": { mr: "कळवण", hi: "कलवण" },
  "Baglan (Satana)": { mr: "बागलाण (सटाणा)", hi: "बागलाण (सटाणा)" },
  "Chandwad": { mr: "चांदवड", hi: "चांदवड़" },
  "Deola": { mr: "देवळा", hi: "देवला" },
  "Igatpuri": { mr: "इगतपुरी", hi: "इगतपुरी" },
  "Nandgaon": { mr: "नांदगाव", hi: "नांदगांव" },
  "Peth": { mr: "पेठ", hi: "पेठ" },
  "Surgana": { mr: "सुरगाणा", hi: "सुरगाणा" },
  "Trimbakeshwar": { mr: "त्र्यंबकेश्वर", hi: "त्र्यंबकेश्वर" },

  // Pune Talukas
  "Haveli": { mr: "हवेली", hi: "हवेली" },
  "Pune City": { mr: "पुणे शहर", hi: "पुणे शहर" },
  "Baramati": { mr: "बारामती", hi: "बारामती" },
  "Junnar": { mr: "जुन्नर", hi: "जुन्नर" },
  "Khed": { mr: "खेड", hi: "खेड" },
  "Ambegaon": { mr: "आंबेगाव", hi: "आंबेगांव" },
  "Shirur": { mr: "शिरूर", hi: "शिरूर" },
  "Maval": { mr: "मावळ", hi: "मावल" },
  "Mulshi": { mr: "मुळशी", hi: "मुलशी" },
  "Bhor": { mr: "भोर", hi: "भोर" },
  "Velhe": { mr: "वेल्हे", hi: "वेल्हे" },
  "Purandar": { mr: "पुरंदर", hi: "पुरंदर" },
  "Daund": { mr: "दौंड", hi: "दौंड" },
  "Indapur": { mr: "इंदापूर", hi: "इंदापुर" },

  // Ahmednagar Talukas
  "Nagar": { mr: "अहमदनगर", hi: "अहमदनगर" },
  "Rahata": { mr: "राहाता", hi: "राहाता" },
  "Sangamner": { mr: "संगमनेर", hi: "संगमनेर" },
  "Shrirampur": { mr: "श्रीरामपूर", hi: "श्रीरामपुर" },
  "Nevasa": { mr: "नेवासा", hi: "नेवासा" },
  "Shevgaon": { mr: "शेवगाव", hi: "शेवगांव" },
  "Kopargaon": { mr: "कोपरगाव", hi: "कोपरगांव" },
  "Akole": { mr: "अकोले", hi: "अकोले" },
  "Parner": { mr: "पारनेर", hi: "पारनेर" },
  "Pathardi": { mr: "पाथर्डी", hi: "पाथर्डी" },
  "Jamkhed": { mr: "जामखेड", hi: "जामखेड" },
  "Karjat": { mr: "कर्जत", hi: "कर्जत" },
  "Rahuri": { mr: "राहुरी", hi: "राहुरी" },
  "Shrigonda": { mr: "श्रीगोंदा", hi: "श्रीगोंदा" }
};

/**
 * Returns localized State name based on active language
 */
export function getLocalizedState(stateName: string, lang: string): string {
  if (!stateName) return "";
  if (lang === "mr" && STATE_TRANSLATIONS[stateName]?.mr) {
    return STATE_TRANSLATIONS[stateName].mr;
  }
  if (lang === "hi" && STATE_TRANSLATIONS[stateName]?.hi) {
    return STATE_TRANSLATIONS[stateName].hi;
  }
  return stateName;
}

/**
 * Returns localized District name based on active language
 */
export function getLocalizedDistrict(districtName: string, lang: string): string {
  if (!districtName) return "";
  if (lang === "mr" && DISTRICT_TRANSLATIONS[districtName]?.mr) {
    return DISTRICT_TRANSLATIONS[districtName].mr;
  }
  if (lang === "hi" && DISTRICT_TRANSLATIONS[districtName]?.hi) {
    return DISTRICT_TRANSLATIONS[districtName].hi;
  }
  return districtName;
}

/**
 * Returns localized Taluka/Tehsil name based on active language
 */
export function getLocalizedTaluka(talukaName: string, lang: string): string {
  if (!talukaName) return "";
  if (lang === "mr" && TALUKA_TRANSLATIONS[talukaName]?.mr) {
    return TALUKA_TRANSLATIONS[talukaName].mr;
  }
  if (lang === "hi" && TALUKA_TRANSLATIONS[talukaName]?.hi) {
    return TALUKA_TRANSLATIONS[talukaName].hi;
  }
  return talukaName;
}

/**
 * Get Talukas / Tehsils for a given district
 */
export function getTalukasForDistrict(districtName: string): string[] {
  if (!districtName) return [];
  if (DISTRICT_TALUKAS[districtName] && DISTRICT_TALUKAS[districtName].length > 0) {
    return DISTRICT_TALUKAS[districtName];
  }
  // Generic administrative tehsils for any district
  return [
    `${districtName} Central`,
    `${districtName} North`,
    `${districtName} South`,
    `${districtName} East`,
    `${districtName} West`
  ];
}
