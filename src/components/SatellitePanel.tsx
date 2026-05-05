'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSatelliteStore } from '@/store/satellite-store';
import { VisualPass, RadioPass } from '@/lib/n2yo';
import { X, Eye, Radio, FileText, Loader2, Clock, Compass, Satellite, Globe } from 'lucide-react';

// Helper function to determine country from international designator
function getCountryFromDesignator(designator: string): string {
  if (!designator) return 'Unknown';
  const year = designator.substring(0, 4);
  const launchSite = designator.substring(5, 8);
  
  // Common launch site codes
  const launchSites: Record<string, string> = {
    'A': '🇷🇺 Russia (Baikonur)',
    'B': '🇷🇺 Russia (Plesetsk)',
    'C': '🇨🇳 China',
    'D': '🇮🇳 India',
    'E': '🇷🇺 Russia (Svobodny)',
    'F': '🇷🇺 Russia',
    'J': '🇯🇵 Japan',
    'K': '🇰🇵 North Korea',
    'L': '🇫🇷 France (Kourou)',
    'M': '🇮🇱 Israel',
    'N': '🇳🇿 New Zealand',
    'P': '🇮🇷 Iran',
    'S': '🇺🇸 United States',
    'T': '🇺🇸 United States (Vandenberg)',
    'U': '🇺🇸 United States',
    'V': '🇺🇸 United States',
    'W': '🇺🇸 United States',
  };
  
  const code = launchSite.charAt(0);
  return launchSites[code] || `Launch: ${year}`;
}

// Helper function to determine satellite type
function getSatelliteType(name: string): string {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('starlink')) return '🛰️ Communications (Starlink)';
  if (nameLower.includes('oneweb')) return '🛰️ Communications (OneWeb)';
  if (nameLower.includes('iss') || nameLower.includes('zarya')) return '🏠 Space Station';
  if (nameLower.includes('hubble')) return '🔭 Space Telescope';
  if (nameLower.includes('gps') || nameLower.includes('navstar')) return '📍 Navigation (GPS)';
  if (nameLower.includes('glonass')) return '📍 Navigation (GLONASS)';
  if (nameLower.includes('galileo')) return '📍 Navigation (Galileo)';
  if (nameLower.includes('beidou')) return '📍 Navigation (BeiDou)';
  if (nameLower.includes('weather') || nameLower.includes('noaa') || nameLower.includes('goes')) return '🌦️ Weather';
  if (nameLower.includes('terra') || nameLower.includes('aqua') || nameLower.includes('landsat')) return '🌍 Earth Observation';
  if (nameLower.includes('iridium')) return '📞 Communications (Iridium)';
  if (nameLower.includes('globalstar')) return '📞 Communications (Globalstar)';
  if (nameLower.includes('intelsat')) return '📡 Communications (Intelsat)';
  if (nameLower.includes('tiangong') || nameLower.includes('tianhe')) return '🏠 Space Station (Chinese)';
  if (nameLower.includes('cubesat')) return '📦 CubeSat';
  if (nameLower.includes('cosmos')) return '🛰️ Military/Research (Russia)';
  
  return '🛰️ Satellite';
}

// Helper function to determine satellite owner
function getSatelliteOwner(name: string): string {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('starlink')) return 'Operator: SpaceX (USA)';
  if (nameLower.includes('oneweb')) return 'Operator: OneWeb (UK/India)';
  if (nameLower.includes('iss') || nameLower.includes('zarya')) return 'Operator: International (NASA, Roscosmos, ESA, JAXA, CSA)';
  if (nameLower.includes('hubble')) return 'Operator: NASA/ESA (USA/Europe)';
  if (nameLower.includes('gps') || nameLower.includes('navstar')) return 'Operator: US Space Force';
  if (nameLower.includes('glonass')) return 'Operator: Russian Space Forces';
  if (nameLower.includes('galileo')) return 'Operator: European Union';
  if (nameLower.includes('beidou')) return 'Operator: China National Space Administration';
  if (nameLower.includes('noaa')) return 'Operator: NOAA (USA)';
  if (nameLower.includes('goes')) return 'Operator: NOAA (USA)';
  if (nameLower.includes('terra') || nameLower.includes('aqua')) return 'Operator: NASA (USA)';
  if (nameLower.includes('landsat')) return 'Operator: NASA/USGS (USA)';
  if (nameLower.includes('iridium')) return 'Operator: Iridium Communications (USA)';
  if (nameLower.includes('globalstar')) return 'Operator: Globalstar Inc. (USA)';
  if (nameLower.includes('intelsat')) return 'Operator: Intelsat (Luxembourg)';
  if (nameLower.includes('tiangong') || nameLower.includes('tianhe')) return 'Operator: CNSA (China)';
  if (nameLower.includes('cosmos')) return 'Operator: Roscosmos (Russia)';
  
  return 'Operator: Various';
}

export default function SatellitePanel() {
  const { 
    selectedSatellite, 
    setSelectedSatellite, 
    apiKey, 
    observer, 
    addTrackedSatellite,
    setSelectedOrbitPositions 
  } = useSatelliteStore();
  
  const [activeTab, setActiveTab] = useState<'info' | 'visual' | 'radio' | 'tle'>('info');
  const [visualPasses, setVisualPasses] = useState<VisualPass[]>([]);
  const [radioPasses, setRadioPasses] = useState<RadioPass[]>([]);
  const [tle, setTle] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDetails = useCallback(async () => {
    if (!selectedSatellite || !apiKey) return;
    setLoading(true);

    try {
      // Only fetch TLE, visual passes, and radio passes
      // Don't fetch orbit positions automatically - only when tracking
      const [tleRes, visualRes, radioRes] = await Promise.all([
        fetch(`/api/satellite/tle?satId=${selectedSatellite.satid}&apiKey=${apiKey}`),
        fetch(`/api/satellite/visualpasses?satId=${selectedSatellite.satid}&lat=${observer.lat}&lng=${observer.lng}&alt=${observer.alt}&days=5&minVisibility=60&apiKey=${apiKey}`),
        fetch(`/api/satellite/radiopasses?satId=${selectedSatellite.satid}&lat=${observer.lat}&lng=${observer.lng}&alt=${observer.alt}&days=5&minElevation=20&apiKey=${apiKey}`),
      ]);

      const [tleData, visualData, radioData] = await Promise.all([
        tleRes.json(),
        visualRes.json(),
        radioRes.json(),
      ]);

      setTle(tleData.tle || '');
      setVisualPasses(visualData.passes || []);
      setRadioPasses(radioData.passes || []);
    } catch (error) {
      console.error('Failed to fetch details:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedSatellite, apiKey, observer]);

  useEffect(() => {
    if (selectedSatellite) {
      fetchDetails();
      setActiveTab('info');
    } else {
      setSelectedOrbitPositions([]);
    }
  }, [selectedSatellite, fetchDetails, setSelectedOrbitPositions]);

  const trackSatellite = async () => {
    if (!selectedSatellite) return;
    try {
      // Fetch orbit positions for the green line (300 seconds = 5 minutes of orbit)
      const orbitRes = await fetch(
        `/api/satellite/positions?satId=${selectedSatellite.satid}&lat=${observer.lat}&lng=${observer.lng}&alt=${observer.alt}&seconds=300&apiKey=${apiKey}`
      );
      const orbitData = await orbitRes.json();
      if (orbitData.positions) {
        setSelectedOrbitPositions(orbitData.positions);
      }
      
      // Add to tracked satellites for real-time updates
      const res = await fetch(
        `/api/satellite/positions?satId=${selectedSatellite.satid}&lat=${observer.lat}&lng=${observer.lng}&alt=0&seconds=300&apiKey=${apiKey}`
      );
      const data = await res.json();
      addTrackedSatellite({
        id: selectedSatellite.satid,
        name: selectedSatellite.satname,
        positions: data.positions || [],
        color: '',
      });
    } catch (error) {
      console.error('Failed to track:', error);
    }
  };

  const handleClose = () => {
    setSelectedSatellite(null);
    setSelectedOrbitPositions([]);
  };

  if (!selectedSatellite) return null;

  const formatTime = (utc: number) => new Date(utc * 1000).toLocaleString();

  const tabs = [
    { id: 'info', label: 'Info', icon: Satellite },
    { id: 'visual', label: 'Visual', icon: Eye },
    { id: 'radio', label: 'Radio', icon: Radio },
    { id: 'tle', label: 'TLE', icon: FileText },
  ] as const;

  return (
    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-green-900/30 to-transparent">
        <div>
          <h3 className="font-bold text-white">{selectedSatellite.satname}</h3>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Globe size={10} className="text-green-400" />
            NORAD #{selectedSatellite.satid}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={trackSatellite}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded-lg transition-colors"
          >
            Track
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors text-gray-400"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === tab.id
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-gray-800/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-h-64 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-cyan-400" size={24} />
          </div>
        )}

        {!loading && activeTab === 'info' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-500 text-xs">Latitude</p>
                <p className="text-white font-medium">{selectedSatellite.satlat.toFixed(4)}°</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-500 text-xs">Longitude</p>
                <p className="text-white font-medium">{selectedSatellite.satlng.toFixed(4)}°</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-500 text-xs">Altitude</p>
                <p className="text-white font-medium">{selectedSatellite.satalt.toFixed(1)} km</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-500 text-xs">NORAD ID</p>
                <p className="text-white font-medium">#{selectedSatellite.satid}</p>
              </div>
            </div>
            
            {selectedSatellite.launchDate && (
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-500 text-xs">Launch Date</p>
                <p className="text-white font-medium">{selectedSatellite.launchDate}</p>
              </div>
            )}
            
            {selectedSatellite.intDesignator && (
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-500 text-xs">International Designator</p>
                <p className="text-white font-medium">{selectedSatellite.intDesignator}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {getCountryFromDesignator(selectedSatellite.intDesignator)}
                </p>
              </div>
            )}
            
            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-3 border border-cyan-800/30">
              <p className="text-gray-400 text-xs mb-1">Satellite Type</p>
              <p className="text-white font-medium">{getSatelliteType(selectedSatellite.satname)}</p>
              <p className="text-gray-400 text-xs mt-2">{getSatelliteOwner(selectedSatellite.satname)}</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3">
              <p className="text-gray-500 text-xs mb-2">Real-time Position</p>
              <p className="text-green-400 text-xs">● Live tracking active</p>
            </div>
          </div>
        )}

        {!loading && activeTab === 'visual' && (
          <div className="space-y-2">
            {visualPasses.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No visual passes in the next 5 days</p>
            ) : (
              visualPasses.map((pass, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-3 text-xs">
                  <div className="flex items-center gap-2 text-cyan-400 mb-2">
                    <Clock size={12} />
                    {formatTime(pass.startUTC)}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-gray-300">
                    <div>
                      <p className="text-gray-500">Start</p>
                      <p><Compass size={10} className="inline" /> {pass.startAzCompass}</p>
                      <p>El: {pass.startEl.toFixed(0)}°</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Max</p>
                      <p><Compass size={10} className="inline" /> {pass.maxAzCompass}</p>
                      <p>El: {pass.maxEl.toFixed(0)}°</p>
                    </div>
                    <div>
                      <p className="text-gray-500">End</p>
                      <p><Compass size={10} className="inline" /> {pass.endAzCompass}</p>
                      <p>El: {pass.endEl.toFixed(0)}°</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-700 flex justify-between text-gray-400">
                    <span>Duration: {pass.duration}s</span>
                    <span>Mag: {pass.mag}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {!loading && activeTab === 'radio' && (
          <div className="space-y-2">
            {radioPasses.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No radio passes in the next 5 days</p>
            ) : (
              radioPasses.map((pass, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-3 text-xs">
                  <div className="flex items-center gap-2 text-cyan-400 mb-2">
                    <Clock size={12} />
                    {formatTime(pass.startUTC)}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-gray-300">
                    <div>
                      <p className="text-gray-500">Start</p>
                      <p>{pass.startAzCompass} {pass.startAz.toFixed(0)}°</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Max</p>
                      <p>{pass.maxAzCompass} {pass.maxAz.toFixed(0)}°</p>
                      <p>El: {pass.maxEl.toFixed(0)}°</p>
                    </div>
                    <div>
                      <p className="text-gray-500">End</p>
                      <p>{pass.endAzCompass} {pass.endAz.toFixed(0)}°</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {!loading && activeTab === 'tle' && (
          <div>
            {tle ? (
              <pre className="bg-gray-800 p-3 rounded-lg text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
                {tle.replace(/\\r\\n/g, '\n')}
              </pre>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">TLE data not available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
