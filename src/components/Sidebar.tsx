'use client';

import { useState, useEffect } from 'react';
import { useSatelliteStore } from '@/store/satellite-store';
import { SATELLITE_CATEGORIES, POPULAR_SATELLITES } from '@/lib/n2yo';
import { getAllRegions, getRegionsByType, Region } from '@/lib/regions';
import { 
  Search, 
  MapPin, 
  Settings, 
  X, 
  Loader2,
  Eye,
  EyeOff,
  Satellite,
  ChevronDown,
  ChevronUp,
  Radio,
  Trash2,
  Star,
  LucideIcon,
  Globe2,
  Map,
  Activity,
  RefreshCw,
  Download,
  AlertCircle,
  CheckCircle2,
  Filter,
  Bell,
  Clock,
  Info,
  TrendingUp
} from 'lucide-react';

// Collapsible Section Component
function Section({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = true,
  badge,
  variant = 'default'
}: { 
  title: string; 
  icon: LucideIcon; 
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: number;
  variant?: 'default' | 'primary' | 'warning';
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const variantStyles = {
    default: 'border-gray-700/50',
    primary: 'border-cyan-600/30 bg-cyan-950/20',
    warning: 'border-amber-600/30 bg-amber-950/20'
  };
  
  return (
    <div className={`border-b ${variantStyles[variant]}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
          <Icon size={16} className="text-cyan-400" />
          {title}
          {badge !== undefined && badge > 0 && (
            <span className="bg-cyan-600 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">{badge}</span>
          )}
        </div>
        {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {isOpen && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}

// System Status Dashboard
function SystemStatusSection() {
  const { apiKey, observer, trackedSatellites, satellitesAbove, isLoading } = useSatelliteStore();
  
  const statusItems = [
    {
      label: 'API Status',
      value: apiKey ? 'Connected' : 'Not Configured',
      status: apiKey ? 'success' : 'error',
      icon: apiKey ? CheckCircle2 : AlertCircle
    },
    {
      label: 'Observer Location',
      value: `${observer.lat.toFixed(2)}°, ${observer.lng.toFixed(2)}°`,
      status: 'success',
      icon: MapPin
    },
    {
      label: 'Tracked',
      value: trackedSatellites.length.toString(),
      status: trackedSatellites.length > 0 ? 'success' : 'neutral',
      icon: Satellite
    },
    {
      label: 'Detected',
      value: satellitesAbove.length.toString(),
      status: satellitesAbove.length > 0 ? 'success' : 'neutral',
      icon: Radio
    }
  ];
  
  return (
    <Section title="System Status" icon={Activity} defaultOpen={false} variant="primary">
      <div className="space-y-2">
        {statusItems.map((item) => {
          const Icon = item.icon;
          const statusColor = item.status === 'success' ? 'text-green-400' : 
                             item.status === 'error' ? 'text-red-400' : 'text-gray-400';
          
          return (
            <div key={item.label} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon size={14} className={statusColor} />
                <span className="text-xs text-gray-400">{item.label}</span>
              </div>
              <span className={`text-xs font-medium ${statusColor}`}>{item.value}</span>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex items-center justify-center gap-2 p-2 bg-cyan-900/20 rounded-lg">
            <Loader2 size={14} className="animate-spin text-cyan-400" />
            <span className="text-xs text-cyan-400">Processing...</span>
          </div>
        )}
      </div>
    </Section>
  );
}

// Operational Controls
function OperationalControlsSection({ onSearch }: { onSearch: () => void }) {
  const { 
    trackedSatellites, 
    satellitesAbove, 
    setSatellitesAbove,
    setSelectedSatellite,
    apiKey,
    isLoading,
    regionFilterEnabled,
    setRegionFilterEnabled,
    setSelectedRegion
  } = useSatelliteStore();
  
  const handleClearAll = () => {
    setSatellitesAbove([]);
    setSelectedSatellite(null);
    if (regionFilterEnabled) {
      setRegionFilterEnabled(false);
      setSelectedRegion(null);
    }
  };
  
  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      tracked: trackedSatellites.map(s => ({
        id: s.id,
        name: s.name,
        color: s.color,
        positions: s.positions.length
      })),
      detected: satellitesAbove.map(s => ({
        id: s.satid,
        name: s.satname,
        lat: s.satlat,
        lng: s.satlng,
        alt: s.satalt
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `satellite-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <Section title="Operations" icon={Settings} defaultOpen={false}>
      <div className="space-y-2">
        <button
          onClick={onSearch}
          disabled={isLoading || !apiKey || regionFilterEnabled}
          className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-600/20"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          {isLoading ? 'Scanning...' : 'Scan Area'}
        </button>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleClearAll}
            disabled={satellitesAbove.length === 0 && !regionFilterEnabled}
            className="py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <X size={14} />
            Clear Results
          </button>
          
          <button
            onClick={handleExport}
            disabled={trackedSatellites.length === 0 && satellitesAbove.length === 0}
            className="py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download size={14} />
            Export Data
          </button>
        </div>
        
        {regionFilterEnabled && (
          <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-2 text-xs text-amber-400 flex items-center gap-2">
            <AlertCircle size={14} />
            Region filter active - Disable to scan your area
          </div>
        )}
      </div>
    </Section>
  );
}

// API Key Section
function ApiKeySection() {
  const { apiKey, setApiKey } = useSatelliteStore();
  const [input, setInput] = useState('');
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setInput(apiKey);
    // Set initial open state based on whether API key exists
    setIsOpen(!apiKey);
  }, [apiKey]);

  const handleSave = () => {
    setApiKey(input);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setIsOpen(false); // Close after saving
    }, 2000);
  };

  return (
    <div className={`border-b ${!apiKey ? 'border-amber-600/30 bg-amber-950/20' : 'border-gray-700/50'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
          <Settings size={16} className="text-cyan-400" />
          API Configuration
        </div>
        {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {isOpen && (
        <div className="px-3 pb-3">
          <div className="space-y-2">
            {!apiKey && (
              <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-2 text-xs text-amber-400 flex items-start gap-2">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>API key required for satellite tracking</span>
              </div>
            )}
            
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter N2YO API key"
                className="w-full bg-gray-800 text-white px-3 py-2 pr-10 rounded-lg text-sm border border-gray-700 focus:border-cyan-500 focus:outline-none"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            
            <button
              onClick={handleSave}
              disabled={!input.trim()}
              className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                saved 
                  ? 'bg-green-600 text-white' 
                  : 'bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:text-gray-500 text-white'
              }`}
            >
              {saved ? '✓ Saved Successfully' : 'Save API Key'}
            </button>
            
            {apiKey ? (
              <div className="flex items-center gap-2 text-xs text-green-400 bg-green-900/20 p-2 rounded">
                <CheckCircle2 size={12} />
                API key configured
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                Get your free API key at{' '}
                <a 
                  href="https://www.n2yo.com/api/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  n2yo.com/api
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// View Configuration Section (merged Observer Location + Display Settings)
function ViewConfigurationSection() {
  const { observer, setObserver, showObserver, setShowObserver, mapView, setMapView } = useSatelliteStore();
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [hasAskedPermission, setHasAskedPermission] = useState(false);

  useEffect(() => {
    setLat(observer.lat.toFixed(4));
    setLng(observer.lng.toFixed(4));
  }, [observer.lat, observer.lng]);

  useEffect(() => {
    if (hasAskedPermission) return;
    
    const isDefaultLocation = observer.lat === 40.7128 && observer.lng === -74.006;
    
    if (isDefaultLocation && navigator.geolocation) {
      setHasAskedPermission(true);
      const timer = setTimeout(() => {
        handleGetLocation(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasAskedPermission, observer.lat, observer.lng]);

  const handleGetLocation = (silent = false) => {
    if (!navigator.geolocation) {
      if (!silent) setLocationError('Geolocation not supported');
      return;
    }
    
    setLoading(true);
    setLocationError(null);
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setObserver({ 
          lat: pos.coords.latitude, 
          lng: pos.coords.longitude, 
          alt: pos.coords.altitude || 0 
        });
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        if (!silent) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError('Location permission denied');
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError('Location unavailable');
              break;
            case error.TIMEOUT:
              setLocationError('Location request timed out');
              break;
            default:
              setLocationError('Could not get location');
          }
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <Section title="View Configuration" icon={Eye} defaultOpen={false}>
      <div className="space-y-4">
        {/* Map Style */}
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block font-medium">Map Style</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMapView('street')}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${
                mapView === 'street'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              🗺️ Street
            </button>
            <button
              onClick={() => setMapView('satellite')}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${
                mapView === 'satellite'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              🛰️ Satellite
            </button>
          </div>
        </div>

        {/* Observer Location */}
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block font-medium">Observer Location</label>
          
          <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg mb-2">
            <span className="text-xs text-gray-400 font-medium">Show on Globe</span>
            <button
              onClick={() => setShowObserver(!showObserver)}
              className={`p-1.5 rounded-lg transition-all ${
                showObserver 
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30' 
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {showObserver ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Latitude</label>
              <input
                type="number"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                onBlur={() => setObserver({ ...observer, lat: parseFloat(lat) || 0 })}
                step="0.0001"
                className="w-full bg-gray-800 text-white px-2 py-1.5 rounded text-xs border border-gray-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Longitude</label>
              <input
                type="number"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                onBlur={() => setObserver({ ...observer, lng: parseFloat(lng) || 0 })}
                step="0.0001"
                className="w-full bg-gray-800 text-white px-2 py-1.5 rounded text-xs border border-gray-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
          
          {locationError && (
            <div className="text-xs text-red-400 bg-red-900/20 border border-red-700/30 p-2 rounded flex items-start gap-2 mb-2">
              <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
              <span>{locationError}</span>
            </div>
          )}
          
          <button
            onClick={() => handleGetLocation(false)}
            disabled={loading}
            className="w-full py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded-lg text-xs flex items-center justify-center gap-2 transition-colors font-medium"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
            {loading ? 'Locating...' : 'Use Current Location'}
          </button>
        </div>
      </div>
    </Section>
  );
}

// Search by Name Section
function SearchByNameSection() {
  const { apiKey, observer, addTrackedSatellite } = useSatelliteStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ satid: number; satname: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Known satellites for direct lookup
  const KNOWN_SATELLITES: Record<string, { id: number; name: string }[]> = {
    'iss': [{ id: 25544, name: 'ISS (ZARYA)' }],
    'zarya': [{ id: 25544, name: 'ISS (ZARYA)' }],
    'space station': [{ id: 25544, name: 'ISS (ZARYA)' }],
    'hubble': [{ id: 20580, name: 'Hubble Space Telescope' }],
    'tiangong': [{ id: 48274, name: 'CSS (TIANHE)' }],
    'tianhe': [{ id: 48274, name: 'CSS (TIANHE)' }],
    'terra': [{ id: 25994, name: 'Terra' }],
    'aqua': [{ id: 27424, name: 'Aqua' }],
  };

  const searchSatellite = async () => {
    if (!apiKey || !query.trim()) return;
    setLoading(true);
    setSearched(true);
    
    try {
      const queryLower = query.toLowerCase().trim();
      const allResults: Array<{ satid: number; satname: string }> = [];
      
      // Check known satellites first
      for (const [keyword, sats] of Object.entries(KNOWN_SATELLITES)) {
        if (keyword.includes(queryLower) || queryLower.includes(keyword)) {
          allResults.push(...sats.map(s => ({ satid: s.id, satname: s.name })));
        }
      }
      
      // Search in categories
      if (allResults.length < 5) {
        const categories = [0, 52, 2, 18, 32];
        
        for (const cat of categories) {
          try {
            const res = await fetch(
              `/api/satellite/above?lat=${observer.lat}&lng=${observer.lng}&alt=0&radius=90&category=${cat}&apiKey=${apiKey}`
            );
            const data = await res.json();
            if (data.above) {
              const matches = data.above.filter((s: { satname: string }) => 
                s.satname.toLowerCase().includes(queryLower)
              );
              allResults.push(...matches);
            }
          } catch (e) {
            console.error('Category search failed:', e);
          }
          if (allResults.length >= 10) break;
        }
      }
      
      // Remove duplicates
      const unique = allResults.filter((v, i, a) => a.findIndex(t => t.satid === v.satid) === i);
      setResults(unique.slice(0, 10));
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackSatellite = async (satid: number, satname: string) => {
    if (!apiKey) return;
    
    try {
      const url = `/api/satellite/positions?satId=${satid}&lat=${observer.lat}&lng=${observer.lng}&alt=0&seconds=300&apiKey=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.positions && data.positions.length > 0) {
        addTrackedSatellite({
          id: satid,
          name: satname,
          positions: data.positions,
          color: '',
        });
        setQuery('');
        setResults([]);
        setSearched(false);
      } else {
        alert(`Unable to track ${satname}. Try adjusting your location or try again later.`);
      }
    } catch (error) {
      console.error('Failed to track:', error);
      alert(`Failed to track ${satname}. Please check your API key and try again.`);
    }
  };

  return (
    <Section title="Satellite Search" icon={Search} defaultOpen={false}>
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchSatellite()}
            placeholder="Search by name (e.g., ISS, Hubble)..."
            disabled={!apiKey}
            className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm border border-gray-700 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={searchSatellite}
            disabled={loading || !query.trim() || !apiKey}
            className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 text-white rounded-lg transition-colors"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          </button>
        </div>
        
        {results.length > 0 && (
          <div className="bg-gray-800 rounded-lg max-h-48 overflow-y-auto border border-gray-700">
            {results.map((sat) => (
              <button
                key={sat.satid}
                onClick={() => trackSatellite(sat.satid, sat.satname)}
                className="w-full text-left px-3 py-2.5 hover:bg-gray-700 border-b border-gray-700/50 last:border-0 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-white block">{sat.satname}</span>
                    <span className="text-xs text-gray-500">ID: {sat.satid}</span>
                  </div>
                  <Satellite size={14} className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        )}
        
        {searched && results.length === 0 && !loading && (
          <p className="text-xs text-gray-500 text-center py-2 bg-gray-800 rounded">No satellites found</p>
        )}

        {/* Quick Track Popular Satellites */}
        <div>
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <Star size={12} className="text-amber-400" /> Quick Track
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {POPULAR_SATELLITES.map((sat) => (
              <button
                key={sat.id}
                onClick={() => trackSatellite(sat.id, sat.name)}
                disabled={!apiKey}
                className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-2.5 py-2 rounded text-xs transition-colors font-medium"
              >
                {sat.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

// Scan Configuration Section (merged Area Scan + Region Filter)
function ScanConfigurationSection({ onRegionSearch }: { onRegionSearch: (region: Region) => void }) {
  const { 
    categoryId, 
    setCategoryId, 
    searchRadius, 
    setSearchRadius, 
    apiKey,
    selectedRegion, 
    setSelectedRegion, 
    regionFilterEnabled, 
    setRegionFilterEnabled,
    isLoading,
    setSatellitesAbove
  } = useSatelliteStore();
  
  const [scanMode, setScanMode] = useState<'area' | 'region'>('area');
  const [filterType, setFilterType] = useState<'continent' | 'country'>('continent');
  const regions = getRegionsByType();

  const handleRegionChange = (regionId: string) => {
    const allRegions = getAllRegions();
    const region = allRegions.find(r => r.id === regionId);
    setSelectedRegion(region || null);
  };

  const handleRegionSearch = () => {
    if (selectedRegion) {
      setRegionFilterEnabled(true);
      onRegionSearch(selectedRegion);
    }
  };

  const handleDisableRegion = () => {
    setRegionFilterEnabled(false);
    setSelectedRegion(null);
    setSatellitesAbove([]);
  };

  return (
    <Section title="Scan Configuration" icon={Filter} defaultOpen={false}>
      <div className="space-y-3">
        {/* Scan Mode Toggle */}
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block font-medium">Scan Mode</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setScanMode('area')}
              disabled={regionFilterEnabled}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${
                scanMode === 'area'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50'
              }`}
            >
              📍 Area Scan
            </button>
            <button
              onClick={() => setScanMode('region')}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${
                scanMode === 'region'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              🌍 Region Scan
            </button>
          </div>
        </div>

        {/* Area Scan Settings */}
        {scanMode === 'area' && (
          <>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block font-medium">Satellite Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(parseInt(e.target.value))}
                disabled={!apiKey}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-xs border border-gray-700 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
              >
                {Object.entries(SATELLITE_CATEGORIES).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-500 font-medium">Search Radius</span>
                <span className="text-cyan-400 font-semibold">{searchRadius}°</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={searchRadius}
                onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                disabled={!apiKey}
                className="w-full accent-cyan-600 disabled:opacity-50"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>10° Local</span>
                <span>90° Hemisphere</span>
              </div>
            </div>
          </>
        )}

        {/* Region Scan Settings */}
        {scanMode === 'region' && (
          <>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('continent')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterType === 'continent'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Continents
              </button>
              <button
                onClick={() => setFilterType('country')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterType === 'country'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Countries
              </button>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block font-medium">
                Select {filterType === 'continent' ? 'Continent' : 'Country'}
              </label>
              <select
                value={selectedRegion?.id || ''}
                onChange={(e) => handleRegionChange(e.target.value)}
                disabled={regionFilterEnabled}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-xs border border-gray-700 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
              >
                <option value="">Choose...</option>
                {(filterType === 'continent' ? regions.continents : regions.countries).map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedRegion && !regionFilterEnabled && (
              <div className="bg-gray-800 rounded-lg p-2 text-xs text-gray-400">
                <p className="mb-1">
                  <span className="text-cyan-400">{selectedRegion.samplingPoints.length}</span> sampling points
                </p>
              </div>
            )}

            {regionFilterEnabled && selectedRegion && (
              <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-2 text-xs">
                <p className="text-green-400 font-medium mb-1">✓ Active Filter</p>
                <p className="text-gray-300">{selectedRegion.name}</p>
              </div>
            )}

            {!regionFilterEnabled ? (
              <button
                onClick={handleRegionSearch}
                disabled={!selectedRegion || isLoading || !apiKey}
                className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Globe2 size={14} />}
                Search Region
              </button>
            ) : (
              <button
                onClick={handleDisableRegion}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all"
              >
                <X size={14} />
                Clear Region Filter
              </button>
            )}
          </>
        )}
      </div>
    </Section>
  );
}

// Satellite Details Section
function SatelliteDetailsSection() {
  const { selectedSatellite, apiKey, observer } = useSatelliteStore();
  const [tleData, setTleData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedSatellite && apiKey) {
      fetchTleData();
    } else {
      setTleData(null);
    }
  }, [selectedSatellite?.satid]);

  const fetchTleData = async () => {
    if (!selectedSatellite || !apiKey) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/satellite/tle?satId=${selectedSatellite.satid}&apiKey=${apiKey}`);
      const data = await res.json();
      setTleData(data);
    } catch (error) {
      console.error('Failed to fetch TLE data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedSatellite) {
    return (
      <Section title="Satellite Details" icon={Info} defaultOpen={false}>
        <div className="text-center py-4">
          <Info size={32} className="mx-auto text-gray-600 mb-2" />
          <p className="text-xs text-gray-500">No satellite selected</p>
          <p className="text-xs text-gray-600 mt-1">Click on a satellite to view details</p>
        </div>
      </Section>
    );
  }

  return (
    <Section title="Satellite Details" icon={Info} defaultOpen={false}>
      <div className="space-y-3">
        <div className="bg-cyan-900/20 border border-cyan-600/30 rounded-lg p-2">
          <h4 className="text-sm font-semibold text-white mb-2">{selectedSatellite.satname}</h4>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">NORAD ID:</span>
              <span className="text-white font-mono">{selectedSatellite.satid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Latitude:</span>
              <span className="text-white font-mono">{selectedSatellite.satlat.toFixed(4)}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Longitude:</span>
              <span className="text-white font-mono">{selectedSatellite.satlng.toFixed(4)}°</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Altitude:</span>
              <span className="text-white font-mono">{selectedSatellite.satalt.toFixed(2)} km</span>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 p-3 bg-gray-800/50 rounded-lg">
            <Loader2 size={14} className="animate-spin text-cyan-400" />
            <span className="text-xs text-cyan-400">Loading TLE data...</span>
          </div>
        )}

        {tleData && tleData.tle && (
          <div className="bg-gray-800 rounded-lg p-2">
            <p className="text-xs text-gray-400 mb-1 font-medium">TLE Data:</p>
            <div className="bg-gray-900 rounded p-2 font-mono text-xs text-green-400 overflow-x-auto">
              <div>{tleData.tle.split('\r\n')[0]}</div>
              <div>{tleData.tle.split('\r\n')[1]}</div>
            </div>
          </div>
        )}

        {selectedSatellite.intDesignator && (
          <div className="text-xs text-gray-400">
            <span className="font-medium">Launch:</span> {selectedSatellite.launchDate || 'Unknown'}
          </div>
        )}
      </div>
    </Section>
  );
}

// Pass Predictions Section
function PassPredictionsSection() {
  const { selectedSatellite, apiKey, observer } = useSatelliteStore();
  const [passes, setPasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [passType, setPassType] = useState<'visual' | 'radio'>('visual');

  useEffect(() => {
    if (selectedSatellite && apiKey) {
      fetchPasses();
    } else {
      setPasses([]);
    }
  }, [selectedSatellite?.satid, passType]);

  const fetchPasses = async () => {
    if (!selectedSatellite || !apiKey) return;
    
    setLoading(true);
    try {
      const endpoint = passType === 'visual' ? 'visualpasses' : 'radiopasses';
      const res = await fetch(
        `/api/satellite/${endpoint}?satId=${selectedSatellite.satid}&lat=${observer.lat}&lng=${observer.lng}&alt=0&days=10&minVisibility=300&apiKey=${apiKey}`
      );
      const data = await res.json();
      setPasses(data.passes || []);
    } catch (error) {
      console.error('Failed to fetch passes:', error);
      setPasses([]);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedSatellite) {
    return (
      <Section title="Pass Predictions" icon={Clock} defaultOpen={false}>
        <div className="text-center py-4">
          <Clock size={32} className="mx-auto text-gray-600 mb-2" />
          <p className="text-xs text-gray-500">No satellite selected</p>
          <p className="text-xs text-gray-600 mt-1">Select a satellite to view passes</p>
        </div>
      </Section>
    );
  }

  return (
    <Section title="Pass Predictions" icon={Clock} defaultOpen={false}>
      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => setPassType('visual')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              passType === 'visual'
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            👁️ Visual
          </button>
          <button
            onClick={() => setPassType('radio')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              passType === 'radio'
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            📡 Radio
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 p-3 bg-gray-800/50 rounded-lg">
            <Loader2 size={14} className="animate-spin text-cyan-400" />
            <span className="text-xs text-cyan-400">Loading passes...</span>
          </div>
        )}

        {!loading && passes.length === 0 && (
          <div className="text-center py-3 bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-500">No passes in next 10 days</p>
          </div>
        )}

        {!loading && passes.length > 0 && (
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {passes.slice(0, 5).map((pass, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-2 text-xs">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-white font-medium">
                    {new Date(pass.startUTC * 1000).toLocaleDateString()}
                  </span>
                  <span className="text-cyan-400 font-mono">
                    {new Date(pass.startUTC * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Duration: {Math.round(pass.duration / 60)}min</span>
                  {pass.maxEl && <span>Max El: {pass.maxEl}°</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}

// Tracked Satellites Section (Active Monitoring)
function TrackedSection() {
  const { trackedSatellites, removeTrackedSatellite, selectTrackedSatellite } = useSatelliteStore();

  if (trackedSatellites.length === 0) {
    return (
      <Section title="Active Tracking" icon={Satellite} defaultOpen={false} badge={0}>
        <div className="text-center py-4">
          <Satellite size={32} className="mx-auto text-gray-600 mb-2" />
          <p className="text-xs text-gray-500">No satellites being tracked</p>
          <p className="text-xs text-gray-600 mt-1">Search or browse to start tracking</p>
        </div>
      </Section>
    );
  }

  return (
    <Section title="Active Tracking" icon={Satellite} defaultOpen={false} badge={trackedSatellites.length}>
      <div className="space-y-1.5">
        {trackedSatellites.map((sat) => (
          <div
            key={sat.id}
            className="flex items-center justify-between p-2.5 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors group"
          >
            <button
              onClick={() => selectTrackedSatellite(sat.id)}
              className="flex items-center gap-2 flex-1 min-w-0"
            >
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-gray-700" 
                style={{ backgroundColor: sat.color }} 
              />
              <div className="flex-1 min-w-0 text-left">
                <span className="text-sm text-white truncate block">{sat.name}</span>
                <span className="text-xs text-gray-500">ID: {sat.id}</span>
              </div>
            </button>
            <button
              onClick={() => removeTrackedSatellite(sat.id)}
              className="p-1.5 hover:bg-red-900/30 rounded transition-colors text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100"
              title="Stop tracking"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </Section>
  );
}

// Detection Results Section
function ResultsSection() {
  const { satellitesAbove, setSelectedSatellite, selectedSatellite, addTrackedSatellite, apiKey, observer } = useSatelliteStore();

  const trackSatellite = async (sat: typeof satellitesAbove[0]) => {
    try {
      const res = await fetch(
        `/api/satellite/positions?satId=${sat.satid}&lat=${observer.lat}&lng=${observer.lng}&alt=0&seconds=300&apiKey=${apiKey}`
      );
      const data = await res.json();
      addTrackedSatellite({
        id: sat.satid,
        name: sat.satname,
        positions: data.positions || [],
        color: '',
      });
    } catch (error) {
      console.error('Failed to track:', error);
    }
  };

  if (satellitesAbove.length === 0) {
    return (
      <Section title="Detection Results" icon={Radio} defaultOpen={false} badge={0}>
        <div className="text-center py-4">
          <Radio size={32} className="mx-auto text-gray-600 mb-2" />
          <p className="text-xs text-gray-500">No satellites detected</p>
          <p className="text-xs text-gray-600 mt-1">Run a scan to detect satellites</p>
        </div>
      </Section>
    );
  }

  return (
    <Section title="Detection Results" icon={Radio} defaultOpen={false} badge={satellitesAbove.length}>
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {satellitesAbove.map((sat) => (
          <div
            key={sat.satid}
            onClick={() => setSelectedSatellite(sat)}
            className={`p-2.5 rounded-lg cursor-pointer transition-all group ${
              selectedSatellite?.satid === sat.satid 
                ? 'bg-cyan-600/30 border border-cyan-500/50 shadow-lg shadow-cyan-500/10' 
                : 'bg-gray-800 hover:bg-gray-750 border border-transparent'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <span className="text-sm text-white truncate block">{sat.satname}</span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400">Alt: {sat.satalt.toFixed(0)} km</span>
                  <span className="text-xs text-gray-500">ID: {sat.satid}</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  trackSatellite(sat);
                }}
                className="ml-2 p-1.5 hover:bg-cyan-600 rounded text-cyan-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                title="Track this satellite"
              >
                <Satellite size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default function Sidebar({ onSearch, onRegionSearch }: { onSearch: () => void; onRegionSearch: (region: Region) => void }) {
  return (
    <div className="h-full flex flex-col bg-gray-900 border-r border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <Satellite className="text-cyan-400" size={22} />
          Satellite Monitoring System.
        </h1>
        <p className="text-xs text-gray-500 mt-1">Real-time satellite monitoring.</p>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* 1. System Status - Critical overview */}
        <SystemStatusSection />
        
        {/* 2. API Configuration - Required for operation */}
        <ApiKeySection />
        
        {/* 3. Active Tracking - Primary monitoring */}
        <TrackedSection />
        
        {/* 4. Detection Results - Current scan data */}
        <ResultsSection />
        
        {/* 5. Operational Controls - Main actions */}
        <OperationalControlsSection onSearch={onSearch} />
        
        {/* 6. Satellite Details - Selected satellite info */}
        <SatelliteDetailsSection />
        
        {/* 7. Pass Predictions - Visibility forecasts */}
        <PassPredictionsSection />
        
        {/* 8. Satellite Search - Find specific satellites */}
        <SearchByNameSection />
        
        {/* 9. Scan Configuration - Area & region settings */}
        <ScanConfigurationSection onRegionSearch={onRegionSearch} />
        
        {/* 10. View Configuration - Display & location */}
        <ViewConfigurationSection />
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-gray-800 bg-gray-900/50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>v2.0</span>
          <span className="flex items-center gap-1">
            <Activity size={10} className="text-green-400" />
            Online
          </span>
        </div>
      </div>
    </div>
  );
}
