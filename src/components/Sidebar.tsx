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
  Globe2
} from 'lucide-react';

// Collapsible Section Component
function Section({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = true,
  badge
}: { 
  title: string; 
  icon: LucideIcon; 
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: number;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-gray-700/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
          <Icon size={16} className="text-cyan-400" />
          {title}
          {badge !== undefined && badge > 0 && (
            <span className="bg-cyan-600 text-white text-xs px-1.5 py-0.5 rounded-full">{badge}</span>
          )}
        </div>
        {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {isOpen && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}

// API Key Section
function ApiKeySection() {
  const { apiKey, setApiKey } = useSatelliteStore();
  const [input, setInput] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setInput(apiKey);
  }, [apiKey]);

  const handleSave = () => {
    setApiKey(input);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Section title="API Key" icon={Settings} defaultOpen={false}>
      <div className="space-y-2">
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your N2YO API key"
          className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm border border-gray-700 focus:border-cyan-500 focus:outline-none"
        />
        <button
          onClick={handleSave}
          className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
            saved ? 'bg-green-600 text-white' : 'bg-cyan-600 hover:bg-cyan-700 text-white'
          }`}
        >
          {saved ? '✓ Saved!' : 'Save Key'}
        </button>
        {apiKey ? (
          <p className="text-xs text-green-400">✓ API key configured</p>
        ) : (
          <p className="text-xs text-gray-500">
            Get free key at <a href="https://www.n2yo.com/api/" target="_blank" className="text-cyan-400 hover:underline">n2yo.com/api</a>
          </p>
        )}
      </div>
    </Section>
  );
}

// Location Section
function LocationSection() {
  const { observer, setObserver, showObserver, setShowObserver } = useSatelliteStore();
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [hasAskedPermission, setHasAskedPermission] = useState(false);

  useEffect(() => {
    setLat(observer.lat.toFixed(4));
    setLng(observer.lng.toFixed(4));
  }, [observer.lat, observer.lng]);

  // Auto-prompt for location on first load
  useEffect(() => {
    if (hasAskedPermission) return;
    
    // Check if we have a stored location that's not the default
    const isDefaultLocation = observer.lat === 40.7128 && observer.lng === -74.006;
    
    if (isDefaultLocation && navigator.geolocation) {
      setHasAskedPermission(true);
      // Small delay to let the UI render first
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
              setLocationError('Location permission denied. Please enable it in your browser settings.');
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError('Location unavailable. Try again later.');
              break;
            case error.TIMEOUT:
              setLocationError('Location request timed out. Try again.');
              break;
            default:
              setLocationError('Could not get location.');
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
    <Section title="Your Location" icon={MapPin} defaultOpen={false}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Show on globe</span>
          <button
            onClick={() => setShowObserver(!showObserver)}
            className={`p-1.5 rounded-lg transition-colors ${showObserver ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-400'}`}
          >
            {showObserver ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Latitude</label>
            <input
              type="number"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              onBlur={() => setObserver({ ...observer, lat: parseFloat(lat) || 0 })}
              className="w-full bg-gray-800 text-white px-2 py-1.5 rounded text-sm border border-gray-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Longitude</label>
            <input
              type="number"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              onBlur={() => setObserver({ ...observer, lng: parseFloat(lng) || 0 })}
              className="w-full bg-gray-800 text-white px-2 py-1.5 rounded text-sm border border-gray-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
        
        {locationError && (
          <p className="text-xs text-red-400 bg-red-900/20 p-2 rounded">{locationError}</p>
        )}
        
        <button
          onClick={() => handleGetLocation(false)}
          disabled={loading}
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
          {loading ? 'Getting Location...' : 'Use My Location'}
        </button>
        
        <p className="text-xs text-gray-500 text-center">
          Click the button to pinpoint your exact location on the globe
        </p>
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

  // Known satellites for direct lookup (when not found in "above" results)
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
      
      // First check known satellites for direct match
      for (const [keyword, sats] of Object.entries(KNOWN_SATELLITES)) {
        if (keyword.includes(queryLower) || queryLower.includes(keyword)) {
          allResults.push(...sats.map(s => ({ satid: s.id, satname: s.name })));
        }
      }
      
      // Then search in satellites above (if not enough results)
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
      
      // Remove duplicates by satid
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
      console.log('Tracking satellite:', satname, 'ID:', satid);
      
      const res = await fetch(url);
      const data = await res.json();
      
      console.log('Track response:', data);
      
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
        console.error('No positions returned for satellite:', satname);
        alert(`Unable to track ${satname}. The satellite may be out of range or the API returned no data. Try adjusting your location or try again later.`);
      }
    } catch (error) {
      console.error('Failed to track:', error);
      alert(`Failed to track ${satname}. Please check your API key and try again.`);
    }
  };

  return (
    <Section title="Search Satellite" icon={Search} defaultOpen={false}>
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchSatellite()}
            placeholder="e.g. ISS, Hubble, Starlink..."
            className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm border border-gray-700 focus:border-cyan-500 focus:outline-none"
          />
          <button
            onClick={searchSatellite}
            disabled={loading || !query.trim()}
            className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 text-white rounded-lg transition-colors"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          </button>
        </div>
        
        {results.length > 0 && (
          <div className="bg-gray-800 rounded-lg max-h-40 overflow-y-auto">
            {results.map((sat) => (
              <button
                key={sat.satid}
                onClick={() => trackSatellite(sat.satid, sat.satname)}
                className="w-full text-left px-3 py-2 hover:bg-gray-700 text-sm border-b border-gray-700/50 last:border-0 transition-colors"
              >
                <span className="text-white">{sat.satname}</span>
                <span className="text-gray-500 text-xs ml-2">#{sat.satid}</span>
              </button>
            ))}
          </div>
        )}
        
        {searched && results.length === 0 && !loading && (
          <p className="text-xs text-gray-500 text-center py-2">No satellites found</p>
        )}

        {/* Quick Track Popular Satellites */}
        <div>
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <Star size={12} /> Quick Track
          </p>
          <div className="flex flex-wrap gap-1">
            {POPULAR_SATELLITES.map((sat) => (
              <button
                key={sat.id}
                onClick={() => trackSatellite(sat.id, sat.name)}
                disabled={!apiKey}
                className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-2 py-1 rounded text-xs transition-colors"
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

// Browse by Category Section
function BrowseCategorySection({ onSearch }: { onSearch: () => void }) {
  const { categoryId, setCategoryId, searchRadius, setSearchRadius, isLoading, apiKey, regionFilterEnabled } = useSatelliteStore();

  return (
    <Section title="Browse Above You" icon={Radio} defaultOpen={false}>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(parseInt(e.target.value))}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm border border-gray-700 focus:border-cyan-500 focus:outline-none"
          >
            {Object.entries(SATELLITE_CATEGORIES).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Search Radius</span>
            <span className="text-cyan-400">{searchRadius}°</span>
          </div>
          <input
            type="range"
            min="10"
            max="90"
            value={searchRadius}
            onChange={(e) => setSearchRadius(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <button
          onClick={onSearch}
          disabled={isLoading || !apiKey || regionFilterEnabled}
          className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Satellite size={16} />}
          Find Satellites
        </button>
        {regionFilterEnabled && (
          <p className="text-xs text-amber-400 text-center">Region filter is active</p>
        )}
      </div>
    </Section>
  );
}

// Region Filter Section
function RegionFilterSection({ onRegionSearch }: { onRegionSearch: (region: Region) => void }) {
  const { 
    selectedRegion, 
    setSelectedRegion, 
    regionFilterEnabled, 
    setRegionFilterEnabled,
    isLoading,
    apiKey,
    categoryId,
    searchRadius,
    setSatellitesAbove
  } = useSatelliteStore();
  
  const [filterType, setFilterType] = useState<'continent' | 'country'>('continent');
  const regions = getRegionsByType();

  const handleRegionChange = (regionId: string) => {
    const allRegions = getAllRegions();
    const region = allRegions.find(r => r.id === regionId);
    setSelectedRegion(region || null);
  };

  const handleSearch = () => {
    if (selectedRegion) {
      setRegionFilterEnabled(true);
      onRegionSearch(selectedRegion);
    }
  };

  const handleDisable = () => {
    setRegionFilterEnabled(false);
    setSelectedRegion(null);
    setSatellitesAbove([]); // Clear all satellites
  };

  return (
    <Section title="Region Filter" icon={Globe2} defaultOpen={false}>
      <div className="space-y-3">
        {/* Filter Type Toggle */}
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

        {/* Region Selection */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Select {filterType === 'continent' ? 'Continent' : 'Country'}
          </label>
          <select
            value={selectedRegion?.id || ''}
            onChange={(e) => handleRegionChange(e.target.value)}
            disabled={regionFilterEnabled}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm border border-gray-700 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
          >
            <option value="">Choose a region...</option>
            {(filterType === 'continent' ? regions.continents : regions.countries).map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </div>

        {/* Info about selected region */}
        {selectedRegion && !regionFilterEnabled && (
          <div className="bg-gray-800 rounded-lg p-2 text-xs text-gray-400">
            <p className="mb-1">
              <span className="text-cyan-400">{selectedRegion.samplingPoints.length}</span> sampling points
            </p>
            <p className="text-gray-500">
              Will search from: {selectedRegion.samplingPoints.slice(0, 3).map(p => p.city).join(', ')}
              {selectedRegion.samplingPoints.length > 3 && ` +${selectedRegion.samplingPoints.length - 3} more`}
            </p>
          </div>
        )}

        {/* Active filter info */}
        {regionFilterEnabled && selectedRegion && (
          <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-2 text-xs">
            <p className="text-green-400 font-medium mb-1">✓ Active Filter</p>
            <p className="text-gray-300">{selectedRegion.name}</p>
          </div>
        )}

        {/* Action Buttons */}
        {!regionFilterEnabled ? (
          <button
            onClick={handleSearch}
            disabled={!selectedRegion || isLoading || !apiKey}
            className="w-full py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Globe2 size={16} />}
            Search Region
          </button>
        ) : (
          <button
            onClick={handleDisable}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
          >
            <X size={16} />
            Clear Region Filter
          </button>
        )}

        <p className="text-xs text-gray-500 text-center">
          {regionFilterEnabled 
            ? 'Showing satellites across the selected region'
            : 'Search satellites across an entire continent or country'
          }
        </p>
      </div>
    </Section>
  );
}

// Tracked Satellites Section
function TrackedSection() {
  const { trackedSatellites, removeTrackedSatellite } = useSatelliteStore();

  if (trackedSatellites.length === 0) return null;

  return (
    <Section title={`Tracked (${trackedSatellites.length})`} icon={Satellite} defaultOpen={false}>
      <div className="space-y-1">
        {trackedSatellites.map((sat) => (
          <div
            key={sat.id}
            className="flex items-center justify-between p-2 bg-gray-800 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sat.color }} />
              <span className="text-sm text-white truncate max-w-[140px]">{sat.name}</span>
            </div>
            <button
              onClick={() => removeTrackedSatellite(sat.id)}
              className="p-1 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-red-400"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </Section>
  );
}

// Results Section
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

  if (satellitesAbove.length === 0) return null;

  return (
    <Section title={`Results (${satellitesAbove.length})`} icon={Eye} defaultOpen={false}>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {satellitesAbove.map((sat) => (
          <div
            key={sat.satid}
            onClick={() => setSelectedSatellite(sat)}
            className={`p-2 rounded-lg cursor-pointer transition-colors ${
              selectedSatellite?.satid === sat.satid 
                ? 'bg-cyan-600/30 border border-cyan-500/50' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-white truncate flex-1">{sat.satname}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  trackSatellite(sat);
                }}
                className="ml-2 p-1 hover:bg-gray-600 rounded text-cyan-400"
                title="Track this satellite"
              >
                <Satellite size={12} />
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {sat.satalt.toFixed(0)} km altitude
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
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <Satellite className="text-cyan-400" size={22} />
          Satellite Monitoring System.
        </h1>
        <p className="text-xs text-gray-500 mt-1">Real-time satellite monitoring.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <ApiKeySection />
        <LocationSection />
        <RegionFilterSection onRegionSearch={onRegionSearch} />
        <SearchByNameSection />
        <BrowseCategorySection onSearch={onSearch} />
        <TrackedSection />
        <ResultsSection />
      </div>
    </div>
  );
}
