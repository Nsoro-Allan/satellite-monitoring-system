const BASE_URL = 'https://api.n2yo.com/rest/v1/satellite';

export interface SatelliteInfo {
  satid: number;
  satname: string;
  transactionscount: number;
}

export interface TLEResponse {
  info: SatelliteInfo;
  tle: string;
}

export interface Position {
  satlatitude: number;
  satlongitude: number;
  sataltitude: number;
  azimuth: number;
  elevation: number;
  ra: number;
  dec: number;
  timestamp: number;
}

export interface PositionsResponse {
  info: SatelliteInfo;
  positions: Position[];
}

export interface VisualPass {
  startAz: number;
  startAzCompass: string;
  startEl: number;
  startUTC: number;
  maxAz: number;
  maxAzCompass: string;
  maxEl: number;
  maxUTC: number;
  endAz: number;
  endAzCompass: string;
  endEl: number;
  endUTC: number;
  mag: number;
  duration: number;
}

export interface VisualPassesResponse {
  info: SatelliteInfo & { passescount: number };
  passes: VisualPass[];
}

export interface RadioPass {
  startAz: number;
  startAzCompass: string;
  startUTC: number;
  maxAz: number;
  maxAzCompass: string;
  maxEl: number;
  maxUTC: number;
  endAz: number;
  endAzCompass: string;
  endUTC: number;
}

export interface RadioPassesResponse {
  info: SatelliteInfo & { passescount: number };
  passes: RadioPass[];
}

export interface SatelliteAbove {
  satid: number;
  satname: string;
  intDesignator: string;
  launchDate: string;
  satlat: number;
  satlng: number;
  satalt: number;
}

export interface AboveResponse {
  info: {
    category: string;
    transactionscount: number;
    satcount: number;
  };
  above: SatelliteAbove[];
}

export const SATELLITE_CATEGORIES: Record<number, string> = {
  0: 'All',
  1: 'Brightest',
  2: 'ISS',
  3: 'Weather',
  4: 'NOAA',
  5: 'GOES',
  6: 'Earth Resources',
  7: 'Search & Rescue',
  8: 'Disaster Monitoring',
  10: 'Geostationary',
  11: 'Intelsat',
  12: 'Gorizont',
  13: 'Raduga',
  14: 'Molniya',
  15: 'Iridium',
  16: 'Orbcomm',
  17: 'Globalstar',
  18: 'Amateur Radio',
  20: 'GPS Operational',
  21: 'Glonass Operational',
  22: 'Galileo',
  23: 'Beidou',
  25: 'Satellite-Based Augmentation System',
  26: 'Navy Navigation Satellite System',
  27: 'Russian LEO Navigation',
  28: 'Space & Earth Science',
  29: 'Engineering',
  30: 'Military',
  32: 'CubeSats',
  33: 'XM and Sirius',
  34: 'TV',
  35: 'Radar Calibration',
  36: 'Geodetic',
  37: 'Tracking and Data Relay Satellite System',
  52: 'Starlink',
  53: 'OneWeb',
};

export const POPULAR_SATELLITES = [
  { id: 25544, name: 'ISS (ZARYA)' },
  { id: 20580, name: 'Hubble Space Telescope' },
  { id: 48274, name: 'Starlink-1007' },
  { id: 43013, name: 'Tiangong' },
  { id: 25994, name: 'Terra' },
  { id: 27424, name: 'Aqua' },
];

export async function getTLE(satId: number, apiKey: string): Promise<TLEResponse> {
  const res = await fetch(`${BASE_URL}/tle/${satId}&apiKey=${apiKey}`);
  if (!res.ok) throw new Error('Failed to fetch TLE');
  return res.json();
}

export async function getPositions(
  satId: number,
  lat: number,
  lng: number,
  alt: number,
  seconds: number,
  apiKey: string
): Promise<PositionsResponse> {
  const res = await fetch(
    `${BASE_URL}/positions/${satId}/${lat}/${lng}/${alt}/${seconds}/&apiKey=${apiKey}`
  );
  if (!res.ok) throw new Error('Failed to fetch positions');
  return res.json();
}

export async function getVisualPasses(
  satId: number,
  lat: number,
  lng: number,
  alt: number,
  days: number,
  minVisibility: number,
  apiKey: string
): Promise<VisualPassesResponse> {
  const res = await fetch(
    `${BASE_URL}/visualpasses/${satId}/${lat}/${lng}/${alt}/${days}/${minVisibility}/&apiKey=${apiKey}`
  );
  if (!res.ok) throw new Error('Failed to fetch visual passes');
  return res.json();
}

export async function getRadioPasses(
  satId: number,
  lat: number,
  lng: number,
  alt: number,
  days: number,
  minElevation: number,
  apiKey: string
): Promise<RadioPassesResponse> {
  const res = await fetch(
    `${BASE_URL}/radiopasses/${satId}/${lat}/${lng}/${alt}/${days}/${minElevation}/&apiKey=${apiKey}`
  );
  if (!res.ok) throw new Error('Failed to fetch radio passes');
  return res.json();
}

export async function getSatellitesAbove(
  lat: number,
  lng: number,
  alt: number,
  searchRadius: number,
  categoryId: number,
  apiKey: string
): Promise<AboveResponse> {
  const res = await fetch(
    `${BASE_URL}/above/${lat}/${lng}/${alt}/${searchRadius}/${categoryId}/&apiKey=${apiKey}`
  );
  if (!res.ok) throw new Error('Failed to fetch satellites above');
  return res.json();
}
