// Region and country definitions with sampling points for accurate satellite tracking

export interface SamplingPoint {
  city: string;
  lat: number;
  lng: number;
}

export interface Region {
  id: string;
  name: string;
  type: 'continent' | 'country';
  samplingPoints: SamplingPoint[];
}

// Continents with major sampling points
export const CONTINENTS: Region[] = [
  {
    id: 'africa',
    name: 'Africa',
    type: 'continent',
    samplingPoints: [
      { city: 'Cairo', lat: 30.0444, lng: 31.2357 },
      { city: 'Lagos', lat: 6.5244, lng: 3.3792 },
      { city: 'Johannesburg', lat: -26.2041, lng: 28.0473 },
      { city: 'Nairobi', lat: -1.2864, lng: 36.8172 },
      { city: 'Casablanca', lat: 33.5731, lng: -7.5898 },
    ],
  },
  {
    id: 'asia',
    name: 'Asia',
    type: 'continent',
    samplingPoints: [
      { city: 'Tokyo', lat: 35.6762, lng: 139.6503 },
      { city: 'Beijing', lat: 39.9042, lng: 116.4074 },
      { city: 'Mumbai', lat: 19.076, lng: 72.8777 },
      { city: 'Bangkok', lat: 13.7563, lng: 100.5018 },
      { city: 'Seoul', lat: 37.5665, lng: 126.978 },
      { city: 'Singapore', lat: 1.3521, lng: 103.8198 },
      { city: 'Dubai', lat: 25.2048, lng: 55.2708 },
    ],
  },
  {
    id: 'europe',
    name: 'Europe',
    type: 'continent',
    samplingPoints: [
      { city: 'London', lat: 51.5074, lng: -0.1278 },
      { city: 'Paris', lat: 48.8566, lng: 2.3522 },
      { city: 'Berlin', lat: 52.52, lng: 13.405 },
      { city: 'Madrid', lat: 40.4168, lng: -3.7038 },
      { city: 'Rome', lat: 41.9028, lng: 12.4964 },
      { city: 'Moscow', lat: 55.7558, lng: 37.6173 },
    ],
  },
  {
    id: 'north-america',
    name: 'North America',
    type: 'continent',
    samplingPoints: [
      { city: 'New York', lat: 40.7128, lng: -74.006 },
      { city: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
      { city: 'Mexico City', lat: 19.4326, lng: -99.1332 },
      { city: 'Toronto', lat: 43.6532, lng: -79.3832 },
      { city: 'Chicago', lat: 41.8781, lng: -87.6298 },
      { city: 'Vancouver', lat: 49.2827, lng: -123.1207 },
    ],
  },
  {
    id: 'south-america',
    name: 'South America',
    type: 'continent',
    samplingPoints: [
      { city: 'São Paulo', lat: -23.5505, lng: -46.6333 },
      { city: 'Buenos Aires', lat: -34.6037, lng: -58.3816 },
      { city: 'Lima', lat: -12.0464, lng: -77.0428 },
      { city: 'Bogotá', lat: 4.711, lng: -74.0721 },
      { city: 'Santiago', lat: -33.4489, lng: -70.6693 },
    ],
  },
  {
    id: 'oceania',
    name: 'Oceania',
    type: 'continent',
    samplingPoints: [
      { city: 'Sydney', lat: -33.8688, lng: 151.2093 },
      { city: 'Melbourne', lat: -37.8136, lng: 144.9631 },
      { city: 'Auckland', lat: -36.8485, lng: 174.7633 },
      { city: 'Perth', lat: -31.9505, lng: 115.8605 },
    ],
  },
  {
    id: 'antarctica',
    name: 'Antarctica',
    type: 'continent',
    samplingPoints: [
      { city: 'McMurdo Station', lat: -77.8419, lng: 166.6863 },
      { city: 'South Pole', lat: -90, lng: 0 },
      { city: 'Palmer Station', lat: -64.7744, lng: -64.0489 },
    ],
  },
];

// All 195 countries in alphabetical order
export const COUNTRIES: Region[] = [
  {
    id: 'afghanistan',
    name: 'Afghanistan',
    type: 'country',
    samplingPoints: [
      { city: 'Kabul', lat: 34.5553, lng: 69.2075 },
    ],
  },
  {
    id: 'albania',
    name: 'Albania',
    type: 'country',
    samplingPoints: [
      { city: 'Tirana', lat: 41.3275, lng: 19.8187 },
    ],
  },
  {
    id: 'algeria',
    name: 'Algeria',
    type: 'country',
    samplingPoints: [
      { city: 'Algiers', lat: 36.7538, lng: 3.0588 },
    ],
  },
  {
    id: 'andorra',
    name: 'Andorra',
    type: 'country',
    samplingPoints: [
      { city: 'Andorra la Vella', lat: 42.5063, lng: 1.5218 },
    ],
  },
  {
    id: 'angola',
    name: 'Angola',
    type: 'country',
    samplingPoints: [
      { city: 'Luanda', lat: -8.8383, lng: 13.2344 },
    ],
  },
  {
    id: 'antigua-barbuda',
    name: 'Antigua and Barbuda',
    type: 'country',
    samplingPoints: [
      { city: "St. John's", lat: 17.1274, lng: -61.8468 },
    ],
  },
  {
    id: 'argentina',
    name: 'Argentina',
    type: 'country',
    samplingPoints: [
      { city: 'Buenos Aires', lat: -34.6037, lng: -58.3816 },
      { city: 'Córdoba', lat: -31.4201, lng: -64.1888 },
    ],
  },
  {
    id: 'armenia',
    name: 'Armenia',
    type: 'country',
    samplingPoints: [
      { city: 'Yerevan', lat: 40.1792, lng: 44.4991 },
    ],
  },
  {
    id: 'australia',
    name: 'Australia',
    type: 'country',
    samplingPoints: [
      { city: 'Sydney', lat: -33.8688, lng: 151.2093 },
      { city: 'Melbourne', lat: -37.8136, lng: 144.9631 },
      { city: 'Brisbane', lat: -27.4698, lng: 153.0251 },
    ],
  },
  {
    id: 'austria',
    name: 'Austria',
    type: 'country',
    samplingPoints: [
      { city: 'Vienna', lat: 48.2082, lng: 16.3738 },
    ],
  },
  {
    id: 'azerbaijan',
    name: 'Azerbaijan',
    type: 'country',
    samplingPoints: [
      { city: 'Baku', lat: 40.4093, lng: 49.8671 },
    ],
  },
  {
    id: 'bahamas',
    name: 'Bahamas',
    type: 'country',
    samplingPoints: [
      { city: 'Nassau', lat: 25.0443, lng: -77.3504 },
    ],
  },
  {
    id: 'bahrain',
    name: 'Bahrain',
    type: 'country',
    samplingPoints: [
      { city: 'Manama', lat: 26.2285, lng: 50.5860 },
    ],
  },
  {
    id: 'bangladesh',
    name: 'Bangladesh',
    type: 'country',
    samplingPoints: [
      { city: 'Dhaka', lat: 23.8103, lng: 90.4125 },
    ],
  },
  {
    id: 'barbados',
    name: 'Barbados',
    type: 'country',
    samplingPoints: [
      { city: 'Bridgetown', lat: 13.0969, lng: -59.6145 },
    ],
  },
  {
    id: 'belarus',
    name: 'Belarus',
    type: 'country',
    samplingPoints: [
      { city: 'Minsk', lat: 53.9045, lng: 27.5615 },
    ],
  },
  {
    id: 'belgium',
    name: 'Belgium',
    type: 'country',
    samplingPoints: [
      { city: 'Brussels', lat: 50.8503, lng: 4.3517 },
    ],
  },
  {
    id: 'belize',
    name: 'Belize',
    type: 'country',
    samplingPoints: [
      { city: 'Belmopan', lat: 17.2510, lng: -88.7590 },
    ],
  },
  {
    id: 'benin',
    name: 'Benin',
    type: 'country',
    samplingPoints: [
      { city: 'Porto-Novo', lat: 6.4969, lng: 2.6289 },
    ],
  },
  {
    id: 'bhutan',
    name: 'Bhutan',
    type: 'country',
    samplingPoints: [
      { city: 'Thimphu', lat: 27.4728, lng: 89.6393 },
    ],
  },
  {
    id: 'bolivia',
    name: 'Bolivia',
    type: 'country',
    samplingPoints: [
      { city: 'La Paz', lat: -16.5000, lng: -68.1500 },
    ],
  },
  {
    id: 'bosnia-herzegovina',
    name: 'Bosnia and Herzegovina',
    type: 'country',
    samplingPoints: [
      { city: 'Sarajevo', lat: 43.8563, lng: 18.4131 },
    ],
  },
  {
    id: 'botswana',
    name: 'Botswana',
    type: 'country',
    samplingPoints: [
      { city: 'Gaborone', lat: -24.6282, lng: 25.9231 },
    ],
  },
  {
    id: 'brazil',
    name: 'Brazil',
    type: 'country',
    samplingPoints: [
      { city: 'São Paulo', lat: -23.5505, lng: -46.6333 },
      { city: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
      { city: 'Brasília', lat: -15.8267, lng: -47.9218 },
    ],
  },
  {
    id: 'brunei',
    name: 'Brunei',
    type: 'country',
    samplingPoints: [
      { city: 'Bandar Seri Begawan', lat: 4.9031, lng: 114.9398 },
    ],
  },
  {
    id: 'bulgaria',
    name: 'Bulgaria',
    type: 'country',
    samplingPoints: [
      { city: 'Sofia', lat: 42.6977, lng: 23.3219 },
    ],
  },
  {
    id: 'burkina-faso',
    name: 'Burkina Faso',
    type: 'country',
    samplingPoints: [
      { city: 'Ouagadougou', lat: 12.3714, lng: -1.5197 },
    ],
  },
  {
    id: 'burundi',
    name: 'Burundi',
    type: 'country',
    samplingPoints: [
      { city: 'Gitega', lat: -3.4271, lng: 29.9246 },
    ],
  },
  {
    id: 'cabo-verde',
    name: 'Cabo Verde',
    type: 'country',
    samplingPoints: [
      { city: 'Praia', lat: 14.9177, lng: -23.5092 },
    ],
  },
  {
    id: 'cambodia',
    name: 'Cambodia',
    type: 'country',
    samplingPoints: [
      { city: 'Phnom Penh', lat: 11.5564, lng: 104.9282 },
    ],
  },
  {
    id: 'cameroon',
    name: 'Cameroon',
    type: 'country',
    samplingPoints: [
      { city: 'Yaoundé', lat: 3.8480, lng: 11.5021 },
    ],
  },
  {
    id: 'canada',
    name: 'Canada',
    type: 'country',
    samplingPoints: [
      { city: 'Toronto', lat: 43.6532, lng: -79.3832 },
      { city: 'Vancouver', lat: 49.2827, lng: -123.1207 },
      { city: 'Montreal', lat: 45.5017, lng: -73.5673 },
    ],
  },
  {
    id: 'central-african-republic',
    name: 'Central African Republic',
    type: 'country',
    samplingPoints: [
      { city: 'Bangui', lat: 4.3947, lng: 18.5582 },
    ],
  },
  {
    id: 'chad',
    name: 'Chad',
    type: 'country',
    samplingPoints: [
      { city: "N'Djamena", lat: 12.1348, lng: 15.0557 },
    ],
  },
  {
    id: 'chile',
    name: 'Chile',
    type: 'country',
    samplingPoints: [
      { city: 'Santiago', lat: -33.4489, lng: -70.6693 },
    ],
  },
  {
    id: 'china',
    name: 'China',
    type: 'country',
    samplingPoints: [
      { city: 'Beijing', lat: 39.9042, lng: 116.4074 },
      { city: 'Shanghai', lat: 31.2304, lng: 121.4737 },
      { city: 'Guangzhou', lat: 23.1291, lng: 113.2644 },
    ],
  },
  {
    id: 'colombia',
    name: 'Colombia',
    type: 'country',
    samplingPoints: [
      { city: 'Bogotá', lat: 4.711, lng: -74.0721 },
    ],
  },
  {
    id: 'comoros',
    name: 'Comoros',
    type: 'country',
    samplingPoints: [
      { city: 'Moroni', lat: -11.7172, lng: 43.2473 },
    ],
  },
  {
    id: 'congo-brazzaville',
    name: 'Congo (Brazzaville)',
    type: 'country',
    samplingPoints: [
      { city: 'Brazzaville', lat: -4.2634, lng: 15.2429 },
    ],
  },
  {
    id: 'congo-kinshasa',
    name: 'Congo (Kinshasa)',
    type: 'country',
    samplingPoints: [
      { city: 'Kinshasa', lat: -4.4419, lng: 15.2663 },
    ],
  },
  {
    id: 'costa-rica',
    name: 'Costa Rica',
    type: 'country',
    samplingPoints: [
      { city: 'San José', lat: 9.9281, lng: -84.0907 },
    ],
  },
  {
    id: 'cote-divoire',
    name: "Côte d'Ivoire",
    type: 'country',
    samplingPoints: [
      { city: 'Yamoussoukro', lat: 6.8276, lng: -5.2893 },
    ],
  },
  {
    id: 'croatia',
    name: 'Croatia',
    type: 'country',
    samplingPoints: [
      { city: 'Zagreb', lat: 45.8150, lng: 15.9819 },
    ],
  },
  {
    id: 'cuba',
    name: 'Cuba',
    type: 'country',
    samplingPoints: [
      { city: 'Havana', lat: 23.1136, lng: -82.3666 },
    ],
  },
  {
    id: 'cyprus',
    name: 'Cyprus',
    type: 'country',
    samplingPoints: [
      { city: 'Nicosia', lat: 35.1856, lng: 33.3823 },
    ],
  },
  {
    id: 'czech-republic',
    name: 'Czech Republic',
    type: 'country',
    samplingPoints: [
      { city: 'Prague', lat: 50.0755, lng: 14.4378 },
    ],
  },
  {
    id: 'denmark',
    name: 'Denmark',
    type: 'country',
    samplingPoints: [
      { city: 'Copenhagen', lat: 55.6761, lng: 12.5683 },
    ],
  },
  {
    id: 'djibouti',
    name: 'Djibouti',
    type: 'country',
    samplingPoints: [
      { city: 'Djibouti', lat: 11.8251, lng: 42.5903 },
    ],
  },
  {
    id: 'dominica',
    name: 'Dominica',
    type: 'country',
    samplingPoints: [
      { city: 'Roseau', lat: 15.3010, lng: -61.3880 },
    ],
  },
  {
    id: 'dominican-republic',
    name: 'Dominican Republic',
    type: 'country',
    samplingPoints: [
      { city: 'Santo Domingo', lat: 18.4861, lng: -69.9312 },
    ],
  },
  {
    id: 'ecuador',
    name: 'Ecuador',
    type: 'country',
    samplingPoints: [
      { city: 'Quito', lat: -0.1807, lng: -78.4678 },
    ],
  },
  {
    id: 'egypt',
    name: 'Egypt',
    type: 'country',
    samplingPoints: [
      { city: 'Cairo', lat: 30.0444, lng: 31.2357 },
    ],
  },
  {
    id: 'el-salvador',
    name: 'El Salvador',
    type: 'country',
    samplingPoints: [
      { city: 'San Salvador', lat: 13.6929, lng: -89.2182 },
    ],
  },
  {
    id: 'equatorial-guinea',
    name: 'Equatorial Guinea',
    type: 'country',
    samplingPoints: [
      { city: 'Malabo', lat: 3.7504, lng: 8.7371 },
    ],
  },
  {
    id: 'eritrea',
    name: 'Eritrea',
    type: 'country',
    samplingPoints: [
      { city: 'Asmara', lat: 15.3229, lng: 38.9251 },
    ],
  },
  {
    id: 'estonia',
    name: 'Estonia',
    type: 'country',
    samplingPoints: [
      { city: 'Tallinn', lat: 59.4370, lng: 24.7536 },
    ],
  },
  {
    id: 'eswatini',
    name: 'Eswatini',
    type: 'country',
    samplingPoints: [
      { city: 'Mbabane', lat: -26.3054, lng: 31.1367 },
    ],
  },
  {
    id: 'ethiopia',
    name: 'Ethiopia',
    type: 'country',
    samplingPoints: [
      { city: 'Addis Ababa', lat: 9.0320, lng: 38.7469 },
    ],
  },
  {
    id: 'fiji',
    name: 'Fiji',
    type: 'country',
    samplingPoints: [
      { city: 'Suva', lat: -18.1416, lng: 178.4419 },
    ],
  },
  {
    id: 'finland',
    name: 'Finland',
    type: 'country',
    samplingPoints: [
      { city: 'Helsinki', lat: 60.1699, lng: 24.9384 },
    ],
  },
  {
    id: 'france',
    name: 'France',
    type: 'country',
    samplingPoints: [
      { city: 'Paris', lat: 48.8566, lng: 2.3522 },
    ],
  },
  {
    id: 'gabon',
    name: 'Gabon',
    type: 'country',
    samplingPoints: [
      { city: 'Libreville', lat: 0.4162, lng: 9.4673 },
    ],
  },
  {
    id: 'gambia',
    name: 'Gambia',
    type: 'country',
    samplingPoints: [
      { city: 'Banjul', lat: 13.4549, lng: -16.5790 },
    ],
  },
  {
    id: 'georgia',
    name: 'Georgia',
    type: 'country',
    samplingPoints: [
      { city: 'Tbilisi', lat: 41.7151, lng: 44.8271 },
    ],
  },
  {
    id: 'germany',
    name: 'Germany',
    type: 'country',
    samplingPoints: [
      { city: 'Berlin', lat: 52.52, lng: 13.405 },
    ],
  },
  {
    id: 'ghana',
    name: 'Ghana',
    type: 'country',
    samplingPoints: [
      { city: 'Accra', lat: 5.6037, lng: -0.1870 },
    ],
  },
  {
    id: 'greece',
    name: 'Greece',
    type: 'country',
    samplingPoints: [
      { city: 'Athens', lat: 37.9838, lng: 23.7275 },
    ],
  },
  {
    id: 'grenada',
    name: 'Grenada',
    type: 'country',
    samplingPoints: [
      { city: "St. George's", lat: 12.0561, lng: -61.7488 },
    ],
  },
  {
    id: 'guatemala',
    name: 'Guatemala',
    type: 'country',
    samplingPoints: [
      { city: 'Guatemala City', lat: 14.6349, lng: -90.5069 },
    ],
  },
  {
    id: 'guinea',
    name: 'Guinea',
    type: 'country',
    samplingPoints: [
      { city: 'Conakry', lat: 9.6412, lng: -13.5784 },
    ],
  },
  {
    id: 'guinea-bissau',
    name: 'Guinea-Bissau',
    type: 'country',
    samplingPoints: [
      { city: 'Bissau', lat: 11.8636, lng: -15.5982 },
    ],
  },
  {
    id: 'guyana',
    name: 'Guyana',
    type: 'country',
    samplingPoints: [
      { city: 'Georgetown', lat: 6.8013, lng: -58.1551 },
    ],
  },
  {
    id: 'haiti',
    name: 'Haiti',
    type: 'country',
    samplingPoints: [
      { city: 'Port-au-Prince', lat: 18.5944, lng: -72.3074 },
    ],
  },
  {
    id: 'honduras',
    name: 'Honduras',
    type: 'country',
    samplingPoints: [
      { city: 'Tegucigalpa', lat: 14.0723, lng: -87.1921 },
    ],
  },
  {
    id: 'hungary',
    name: 'Hungary',
    type: 'country',
    samplingPoints: [
      { city: 'Budapest', lat: 47.4979, lng: 19.0402 },
    ],
  },
  {
    id: 'iceland',
    name: 'Iceland',
    type: 'country',
    samplingPoints: [
      { city: 'Reykjavik', lat: 64.1466, lng: -21.9426 },
    ],
  },
  {
    id: 'india',
    name: 'India',
    type: 'country',
    samplingPoints: [
      { city: 'Mumbai', lat: 19.076, lng: 72.8777 },
      { city: 'Delhi', lat: 28.7041, lng: 77.1025 },
      { city: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    ],
  },
  {
    id: 'indonesia',
    name: 'Indonesia',
    type: 'country',
    samplingPoints: [
      { city: 'Jakarta', lat: -6.2088, lng: 106.8456 },
    ],
  },
  {
    id: 'iran',
    name: 'Iran',
    type: 'country',
    samplingPoints: [
      { city: 'Tehran', lat: 35.6892, lng: 51.3890 },
    ],
  },
  {
    id: 'iraq',
    name: 'Iraq',
    type: 'country',
    samplingPoints: [
      { city: 'Baghdad', lat: 33.3152, lng: 44.3661 },
    ],
  },
  {
    id: 'ireland',
    name: 'Ireland',
    type: 'country',
    samplingPoints: [
      { city: 'Dublin', lat: 53.3498, lng: -6.2603 },
    ],
  },
  {
    id: 'israel',
    name: 'Israel',
    type: 'country',
    samplingPoints: [
      { city: 'Tel Aviv', lat: 32.0853, lng: 34.7818 },
    ],
  },
  {
    id: 'italy',
    name: 'Italy',
    type: 'country',
    samplingPoints: [
      { city: 'Rome', lat: 41.9028, lng: 12.4964 },
    ],
  },
  {
    id: 'jamaica',
    name: 'Jamaica',
    type: 'country',
    samplingPoints: [
      { city: 'Kingston', lat: 17.9714, lng: -76.7931 },
    ],
  },
  {
    id: 'japan',
    name: 'Japan',
    type: 'country',
    samplingPoints: [
      { city: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    ],
  },
  {
    id: 'jordan',
    name: 'Jordan',
    type: 'country',
    samplingPoints: [
      { city: 'Amman', lat: 31.9454, lng: 35.9284 },
    ],
  },
  {
    id: 'kazakhstan',
    name: 'Kazakhstan',
    type: 'country',
    samplingPoints: [
      { city: 'Almaty', lat: 43.2220, lng: 76.8512 },
    ],
  },
  {
    id: 'kenya',
    name: 'Kenya',
    type: 'country',
    samplingPoints: [
      { city: 'Nairobi', lat: -1.2864, lng: 36.8172 },
    ],
  },
  {
    id: 'kiribati',
    name: 'Kiribati',
    type: 'country',
    samplingPoints: [
      { city: 'Tarawa', lat: 1.3382, lng: 173.0176 },
    ],
  },
  {
    id: 'kosovo',
    name: 'Kosovo',
    type: 'country',
    samplingPoints: [
      { city: 'Pristina', lat: 42.6629, lng: 21.1655 },
    ],
  },
  {
    id: 'kuwait',
    name: 'Kuwait',
    type: 'country',
    samplingPoints: [
      { city: 'Kuwait City', lat: 29.3759, lng: 47.9774 },
    ],
  },
  {
    id: 'kyrgyzstan',
    name: 'Kyrgyzstan',
    type: 'country',
    samplingPoints: [
      { city: 'Bishkek', lat: 42.8746, lng: 74.5698 },
    ],
  },
  {
    id: 'laos',
    name: 'Laos',
    type: 'country',
    samplingPoints: [
      { city: 'Vientiane', lat: 17.9757, lng: 102.6331 },
    ],
  },
  {
    id: 'latvia',
    name: 'Latvia',
    type: 'country',
    samplingPoints: [
      { city: 'Riga', lat: 56.9496, lng: 24.1052 },
    ],
  },
  {
    id: 'lebanon',
    name: 'Lebanon',
    type: 'country',
    samplingPoints: [
      { city: 'Beirut', lat: 33.8886, lng: 35.4955 },
    ],
  },
  {
    id: 'lesotho',
    name: 'Lesotho',
    type: 'country',
    samplingPoints: [
      { city: 'Maseru', lat: -29.3167, lng: 27.4833 },
    ],
  },
  {
    id: 'liberia',
    name: 'Liberia',
    type: 'country',
    samplingPoints: [
      { city: 'Monrovia', lat: 6.3156, lng: -10.8074 },
    ],
  },
  {
    id: 'libya',
    name: 'Libya',
    type: 'country',
    samplingPoints: [
      { city: 'Tripoli', lat: 32.8872, lng: 13.1913 },
    ],
  },
  {
    id: 'liechtenstein',
    name: 'Liechtenstein',
    type: 'country',
    samplingPoints: [
      { city: 'Vaduz', lat: 47.1410, lng: 9.5209 },
    ],
  },
  {
    id: 'lithuania',
    name: 'Lithuania',
    type: 'country',
    samplingPoints: [
      { city: 'Vilnius', lat: 54.6872, lng: 25.2797 },
    ],
  },
  {
    id: 'luxembourg',
    name: 'Luxembourg',
    type: 'country',
    samplingPoints: [
      { city: 'Luxembourg City', lat: 49.6116, lng: 6.1319 },
    ],
  },
  {
    id: 'madagascar',
    name: 'Madagascar',
    type: 'country',
    samplingPoints: [
      { city: 'Antananarivo', lat: -18.8792, lng: 47.5079 },
    ],
  },
  {
    id: 'malawi',
    name: 'Malawi',
    type: 'country',
    samplingPoints: [
      { city: 'Lilongwe', lat: -13.9626, lng: 33.7741 },
    ],
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    type: 'country',
    samplingPoints: [
      { city: 'Kuala Lumpur', lat: 3.139, lng: 101.6869 },
    ],
  },
  {
    id: 'maldives',
    name: 'Maldives',
    type: 'country',
    samplingPoints: [
      { city: 'Malé', lat: 4.1755, lng: 73.5093 },
    ],
  },
  {
    id: 'mali',
    name: 'Mali',
    type: 'country',
    samplingPoints: [
      { city: 'Bamako', lat: 12.6392, lng: -8.0029 },
    ],
  },
  {
    id: 'malta',
    name: 'Malta',
    type: 'country',
    samplingPoints: [
      { city: 'Valletta', lat: 35.8989, lng: 14.5146 },
    ],
  },
  {
    id: 'marshall-islands',
    name: 'Marshall Islands',
    type: 'country',
    samplingPoints: [
      { city: 'Majuro', lat: 7.1315, lng: 171.1845 },
    ],
  },
  {
    id: 'mauritania',
    name: 'Mauritania',
    type: 'country',
    samplingPoints: [
      { city: 'Nouakchott', lat: 18.0735, lng: -15.9582 },
    ],
  },
  {
    id: 'mauritius',
    name: 'Mauritius',
    type: 'country',
    samplingPoints: [
      { city: 'Port Louis', lat: -20.1609, lng: 57.5012 },
    ],
  },
  {
    id: 'mexico',
    name: 'Mexico',
    type: 'country',
    samplingPoints: [
      { city: 'Mexico City', lat: 19.4326, lng: -99.1332 },
    ],
  },
  {
    id: 'micronesia',
    name: 'Micronesia',
    type: 'country',
    samplingPoints: [
      { city: 'Palikir', lat: 6.9248, lng: 158.1610 },
    ],
  },
  {
    id: 'moldova',
    name: 'Moldova',
    type: 'country',
    samplingPoints: [
      { city: 'Chisinau', lat: 47.0105, lng: 28.8638 },
    ],
  },
  {
    id: 'monaco',
    name: 'Monaco',
    type: 'country',
    samplingPoints: [
      { city: 'Monaco', lat: 43.7384, lng: 7.4246 },
    ],
  },
  {
    id: 'mongolia',
    name: 'Mongolia',
    type: 'country',
    samplingPoints: [
      { city: 'Ulaanbaatar', lat: 47.8864, lng: 106.9057 },
    ],
  },
  {
    id: 'montenegro',
    name: 'Montenegro',
    type: 'country',
    samplingPoints: [
      { city: 'Podgorica', lat: 42.4304, lng: 19.2594 },
    ],
  },
  {
    id: 'morocco',
    name: 'Morocco',
    type: 'country',
    samplingPoints: [
      { city: 'Casablanca', lat: 33.5731, lng: -7.5898 },
    ],
  },
  {
    id: 'mozambique',
    name: 'Mozambique',
    type: 'country',
    samplingPoints: [
      { city: 'Maputo', lat: -25.9655, lng: 32.5832 },
    ],
  },
  {
    id: 'myanmar',
    name: 'Myanmar',
    type: 'country',
    samplingPoints: [
      { city: 'Yangon', lat: 16.8661, lng: 96.1951 },
    ],
  },
  {
    id: 'namibia',
    name: 'Namibia',
    type: 'country',
    samplingPoints: [
      { city: 'Windhoek', lat: -22.5597, lng: 17.0832 },
    ],
  },
  {
    id: 'nauru',
    name: 'Nauru',
    type: 'country',
    samplingPoints: [
      { city: 'Yaren', lat: -0.5477, lng: 166.9209 },
    ],
  },
  {
    id: 'nepal',
    name: 'Nepal',
    type: 'country',
    samplingPoints: [
      { city: 'Kathmandu', lat: 27.7172, lng: 85.3240 },
    ],
  },
  {
    id: 'netherlands',
    name: 'Netherlands',
    type: 'country',
    samplingPoints: [
      { city: 'Amsterdam', lat: 52.3676, lng: 4.9041 },
    ],
  },
  {
    id: 'new-zealand',
    name: 'New Zealand',
    type: 'country',
    samplingPoints: [
      { city: 'Auckland', lat: -36.8485, lng: 174.7633 },
    ],
  },
  {
    id: 'nicaragua',
    name: 'Nicaragua',
    type: 'country',
    samplingPoints: [
      { city: 'Managua', lat: 12.1150, lng: -86.2362 },
    ],
  },
  {
    id: 'niger',
    name: 'Niger',
    type: 'country',
    samplingPoints: [
      { city: 'Niamey', lat: 13.5127, lng: 2.1128 },
    ],
  },
  {
    id: 'nigeria',
    name: 'Nigeria',
    type: 'country',
    samplingPoints: [
      { city: 'Lagos', lat: 6.5244, lng: 3.3792 },
    ],
  },
  {
    id: 'north-korea',
    name: 'North Korea',
    type: 'country',
    samplingPoints: [
      { city: 'Pyongyang', lat: 39.0392, lng: 125.7625 },
    ],
  },
  {
    id: 'north-macedonia',
    name: 'North Macedonia',
    type: 'country',
    samplingPoints: [
      { city: 'Skopje', lat: 41.9973, lng: 21.4280 },
    ],
  },
  {
    id: 'norway',
    name: 'Norway',
    type: 'country',
    samplingPoints: [
      { city: 'Oslo', lat: 59.9139, lng: 10.7522 },
    ],
  },
  {
    id: 'oman',
    name: 'Oman',
    type: 'country',
    samplingPoints: [
      { city: 'Muscat', lat: 23.5880, lng: 58.3829 },
    ],
  },
  {
    id: 'pakistan',
    name: 'Pakistan',
    type: 'country',
    samplingPoints: [
      { city: 'Karachi', lat: 24.8607, lng: 67.0011 },
    ],
  },
  {
    id: 'palau',
    name: 'Palau',
    type: 'country',
    samplingPoints: [
      { city: 'Ngerulmud', lat: 7.5007, lng: 134.6242 },
    ],
  },
  {
    id: 'palestine',
    name: 'Palestine',
    type: 'country',
    samplingPoints: [
      { city: 'Ramallah', lat: 31.9038, lng: 35.2034 },
    ],
  },
  {
    id: 'panama',
    name: 'Panama',
    type: 'country',
    samplingPoints: [
      { city: 'Panama City', lat: 8.9824, lng: -79.5199 },
    ],
  },
  {
    id: 'papua-new-guinea',
    name: 'Papua New Guinea',
    type: 'country',
    samplingPoints: [
      { city: 'Port Moresby', lat: -9.4438, lng: 147.1803 },
    ],
  },
  {
    id: 'paraguay',
    name: 'Paraguay',
    type: 'country',
    samplingPoints: [
      { city: 'Asunción', lat: -25.2637, lng: -57.5759 },
    ],
  },
  {
    id: 'peru',
    name: 'Peru',
    type: 'country',
    samplingPoints: [
      { city: 'Lima', lat: -12.0464, lng: -77.0428 },
    ],
  },
  {
    id: 'philippines',
    name: 'Philippines',
    type: 'country',
    samplingPoints: [
      { city: 'Manila', lat: 14.5995, lng: 120.9842 },
    ],
  },
  {
    id: 'poland',
    name: 'Poland',
    type: 'country',
    samplingPoints: [
      { city: 'Warsaw', lat: 52.2297, lng: 21.0122 },
    ],
  },
  {
    id: 'portugal',
    name: 'Portugal',
    type: 'country',
    samplingPoints: [
      { city: 'Lisbon', lat: 38.7223, lng: -9.1393 },
    ],
  },
  {
    id: 'qatar',
    name: 'Qatar',
    type: 'country',
    samplingPoints: [
      { city: 'Doha', lat: 25.2854, lng: 51.5310 },
    ],
  },
  {
    id: 'romania',
    name: 'Romania',
    type: 'country',
    samplingPoints: [
      { city: 'Bucharest', lat: 44.4268, lng: 26.1025 },
    ],
  },
  {
    id: 'russia',
    name: 'Russia',
    type: 'country',
    samplingPoints: [
      { city: 'Moscow', lat: 55.7558, lng: 37.6173 },
    ],
  },
  {
    id: 'rwanda',
    name: 'Rwanda',
    type: 'country',
    samplingPoints: [
      { city: 'Kigali', lat: -1.9403, lng: 29.8739 },
    ],
  },
  {
    id: 'saint-kitts-nevis',
    name: 'Saint Kitts and Nevis',
    type: 'country',
    samplingPoints: [
      { city: 'Basseterre', lat: 17.3026, lng: -62.7177 },
    ],
  },
  {
    id: 'saint-lucia',
    name: 'Saint Lucia',
    type: 'country',
    samplingPoints: [
      { city: 'Castries', lat: 14.0101, lng: -60.9875 },
    ],
  },
  {
    id: 'saint-vincent-grenadines',
    name: 'Saint Vincent and the Grenadines',
    type: 'country',
    samplingPoints: [
      { city: 'Kingstown', lat: 13.1579, lng: -61.2248 },
    ],
  },
  {
    id: 'samoa',
    name: 'Samoa',
    type: 'country',
    samplingPoints: [
      { city: 'Apia', lat: -13.8333, lng: -171.7667 },
    ],
  },
  {
    id: 'san-marino',
    name: 'San Marino',
    type: 'country',
    samplingPoints: [
      { city: 'San Marino', lat: 43.9424, lng: 12.4578 },
    ],
  },
  {
    id: 'sao-tome-principe',
    name: 'Sao Tome and Principe',
    type: 'country',
    samplingPoints: [
      { city: 'São Tomé', lat: 0.3365, lng: 6.7273 },
    ],
  },
  {
    id: 'saudi-arabia',
    name: 'Saudi Arabia',
    type: 'country',
    samplingPoints: [
      { city: 'Riyadh', lat: 24.7136, lng: 46.6753 },
    ],
  },
  {
    id: 'senegal',
    name: 'Senegal',
    type: 'country',
    samplingPoints: [
      { city: 'Dakar', lat: 14.7167, lng: -17.4677 },
    ],
  },
  {
    id: 'serbia',
    name: 'Serbia',
    type: 'country',
    samplingPoints: [
      { city: 'Belgrade', lat: 44.7866, lng: 20.4489 },
    ],
  },
  {
    id: 'seychelles',
    name: 'Seychelles',
    type: 'country',
    samplingPoints: [
      { city: 'Victoria', lat: -4.6191, lng: 55.4513 },
    ],
  },
  {
    id: 'sierra-leone',
    name: 'Sierra Leone',
    type: 'country',
    samplingPoints: [
      { city: 'Freetown', lat: 8.4657, lng: -13.2317 },
    ],
  },
  {
    id: 'singapore',
    name: 'Singapore',
    type: 'country',
    samplingPoints: [
      { city: 'Singapore', lat: 1.3521, lng: 103.8198 },
    ],
  },
  {
    id: 'slovakia',
    name: 'Slovakia',
    type: 'country',
    samplingPoints: [
      { city: 'Bratislava', lat: 48.1486, lng: 17.1077 },
    ],
  },
  {
    id: 'slovenia',
    name: 'Slovenia',
    type: 'country',
    samplingPoints: [
      { city: 'Ljubljana', lat: 46.0569, lng: 14.5058 },
    ],
  },
  {
    id: 'solomon-islands',
    name: 'Solomon Islands',
    type: 'country',
    samplingPoints: [
      { city: 'Honiara', lat: -9.4456, lng: 159.9729 },
    ],
  },
  {
    id: 'somalia',
    name: 'Somalia',
    type: 'country',
    samplingPoints: [
      { city: 'Mogadishu', lat: 2.0469, lng: 45.3182 },
    ],
  },
  {
    id: 'south-africa',
    name: 'South Africa',
    type: 'country',
    samplingPoints: [
      { city: 'Johannesburg', lat: -26.2041, lng: 28.0473 },
    ],
  },
  {
    id: 'south-korea',
    name: 'South Korea',
    type: 'country',
    samplingPoints: [
      { city: 'Seoul', lat: 37.5665, lng: 126.978 },
    ],
  },
  {
    id: 'south-sudan',
    name: 'South Sudan',
    type: 'country',
    samplingPoints: [
      { city: 'Juba', lat: 4.8517, lng: 31.5825 },
    ],
  },
  {
    id: 'spain',
    name: 'Spain',
    type: 'country',
    samplingPoints: [
      { city: 'Madrid', lat: 40.4168, lng: -3.7038 },
    ],
  },
  {
    id: 'sri-lanka',
    name: 'Sri Lanka',
    type: 'country',
    samplingPoints: [
      { city: 'Colombo', lat: 6.9271, lng: 79.8612 },
    ],
  },
  {
    id: 'sudan',
    name: 'Sudan',
    type: 'country',
    samplingPoints: [
      { city: 'Khartoum', lat: 15.5007, lng: 32.5599 },
    ],
  },
  {
    id: 'suriname',
    name: 'Suriname',
    type: 'country',
    samplingPoints: [
      { city: 'Paramaribo', lat: 5.8520, lng: -55.2038 },
    ],
  },
  {
    id: 'sweden',
    name: 'Sweden',
    type: 'country',
    samplingPoints: [
      { city: 'Stockholm', lat: 59.3293, lng: 18.0686 },
    ],
  },
  {
    id: 'switzerland',
    name: 'Switzerland',
    type: 'country',
    samplingPoints: [
      { city: 'Zurich', lat: 47.3769, lng: 8.5417 },
    ],
  },
  {
    id: 'syria',
    name: 'Syria',
    type: 'country',
    samplingPoints: [
      { city: 'Damascus', lat: 33.5138, lng: 36.2765 },
    ],
  },
  {
    id: 'taiwan',
    name: 'Taiwan',
    type: 'country',
    samplingPoints: [
      { city: 'Taipei', lat: 25.0330, lng: 121.5654 },
    ],
  },
  {
    id: 'tajikistan',
    name: 'Tajikistan',
    type: 'country',
    samplingPoints: [
      { city: 'Dushanbe', lat: 38.5598, lng: 68.7738 },
    ],
  },
  {
    id: 'tanzania',
    name: 'Tanzania',
    type: 'country',
    samplingPoints: [
      { city: 'Dar es Salaam', lat: -6.7924, lng: 39.2083 },
    ],
  },
  {
    id: 'thailand',
    name: 'Thailand',
    type: 'country',
    samplingPoints: [
      { city: 'Bangkok', lat: 13.7563, lng: 100.5018 },
    ],
  },
  {
    id: 'timor-leste',
    name: 'Timor-Leste',
    type: 'country',
    samplingPoints: [
      { city: 'Dili', lat: -8.5569, lng: 125.5603 },
    ],
  },
  {
    id: 'togo',
    name: 'Togo',
    type: 'country',
    samplingPoints: [
      { city: 'Lomé', lat: 6.1256, lng: 1.2254 },
    ],
  },
  {
    id: 'tonga',
    name: 'Tonga',
    type: 'country',
    samplingPoints: [
      { city: "Nuku'alofa", lat: -21.1393, lng: -175.2018 },
    ],
  },
  {
    id: 'trinidad-tobago',
    name: 'Trinidad and Tobago',
    type: 'country',
    samplingPoints: [
      { city: 'Port of Spain', lat: 10.6918, lng: -61.2225 },
    ],
  },
  {
    id: 'tunisia',
    name: 'Tunisia',
    type: 'country',
    samplingPoints: [
      { city: 'Tunis', lat: 36.8065, lng: 10.1815 },
    ],
  },
  {
    id: 'turkey',
    name: 'Turkey',
    type: 'country',
    samplingPoints: [
      { city: 'Istanbul', lat: 41.0082, lng: 28.9784 },
    ],
  },
  {
    id: 'turkmenistan',
    name: 'Turkmenistan',
    type: 'country',
    samplingPoints: [
      { city: 'Ashgabat', lat: 37.9601, lng: 58.3261 },
    ],
  },
  {
    id: 'tuvalu',
    name: 'Tuvalu',
    type: 'country',
    samplingPoints: [
      { city: 'Funafuti', lat: -8.5211, lng: 179.1962 },
    ],
  },
  {
    id: 'uganda',
    name: 'Uganda',
    type: 'country',
    samplingPoints: [
      { city: 'Kampala', lat: 0.3476, lng: 32.5825 },
    ],
  },
  {
    id: 'ukraine',
    name: 'Ukraine',
    type: 'country',
    samplingPoints: [
      { city: 'Kyiv', lat: 50.4501, lng: 30.5234 },
    ],
  },
  {
    id: 'united-arab-emirates',
    name: 'United Arab Emirates',
    type: 'country',
    samplingPoints: [
      { city: 'Dubai', lat: 25.2048, lng: 55.2708 },
    ],
  },
  {
    id: 'united-kingdom',
    name: 'United Kingdom',
    type: 'country',
    samplingPoints: [
      { city: 'London', lat: 51.5074, lng: -0.1278 },
    ],
  },
  {
    id: 'united-states',
    name: 'United States',
    type: 'country',
    samplingPoints: [
      { city: 'New York', lat: 40.7128, lng: -74.006 },
      { city: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
      { city: 'Chicago', lat: 41.8781, lng: -87.6298 },
    ],
  },
  {
    id: 'uruguay',
    name: 'Uruguay',
    type: 'country',
    samplingPoints: [
      { city: 'Montevideo', lat: -34.9011, lng: -56.1645 },
    ],
  },
  {
    id: 'uzbekistan',
    name: 'Uzbekistan',
    type: 'country',
    samplingPoints: [
      { city: 'Tashkent', lat: 41.2995, lng: 69.2401 },
    ],
  },
  {
    id: 'vanuatu',
    name: 'Vanuatu',
    type: 'country',
    samplingPoints: [
      { city: 'Port Vila', lat: -17.7333, lng: 168.3273 },
    ],
  },
  {
    id: 'vatican-city',
    name: 'Vatican City',
    type: 'country',
    samplingPoints: [
      { city: 'Vatican City', lat: 41.9029, lng: 12.4534 },
    ],
  },
  {
    id: 'venezuela',
    name: 'Venezuela',
    type: 'country',
    samplingPoints: [
      { city: 'Caracas', lat: 10.4806, lng: -66.9036 },
    ],
  },
  {
    id: 'vietnam',
    name: 'Vietnam',
    type: 'country',
    samplingPoints: [
      { city: 'Hanoi', lat: 21.0285, lng: 105.8542 },
    ],
  },
  {
    id: 'yemen',
    name: 'Yemen',
    type: 'country',
    samplingPoints: [
      { city: 'Sanaa', lat: 15.3694, lng: 44.1910 },
    ],
  },
  {
    id: 'zambia',
    name: 'Zambia',
    type: 'country',
    samplingPoints: [
      { city: 'Lusaka', lat: -15.3875, lng: 28.3228 },
    ],
  },
  {
    id: 'zimbabwe',
    name: 'Zimbabwe',
    type: 'country',
    samplingPoints: [
      { city: 'Harare', lat: -17.8252, lng: 31.0335 },
    ],
  },
];

// Get all regions (continents + countries)
export function getAllRegions(): Region[] {
  return [...CONTINENTS, ...COUNTRIES];
}

// Get region by ID
export function getRegionById(id: string): Region | undefined {
  return getAllRegions().find(r => r.id === id);
}

// Group regions by type
export function getRegionsByType() {
  return {
    continents: CONTINENTS,
    countries: COUNTRIES,
  };
}
