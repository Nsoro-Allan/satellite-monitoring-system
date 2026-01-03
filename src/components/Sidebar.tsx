'use client';

import { useState, useEffect } from 'react';
import { useSatelliteStore } from '@/store/satellite-store';
import { SATELLITE_CATEGORIES, POPULAR_SATELLITES } from '@/lib/n2yo';
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
  LucideIcon
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
    <Section title="API Key" icon={Settings} defaultOpen={!apiKey}>
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

  useEffect(() => {
    setLat(observer.lat.toFixed(4));
    setLng(observer.lng.toFixed(4));
  }, [observer.lat, observer.lng]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setObserver({ lat: pos.coords.latitude, lng: pos.coords.longitude, alt: 0 });
        setLoading(false);
      },
      () => setLoading(false)
    );
  };

  return (
    <Section title="Your Location" icon={MapPin}>
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
        
        <button
          onClick={handleGetLocation}
          disabled={loading}
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <MapPin size={14} />}
          Use My Location
        </button>
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

  const searchSatellite = async () => {
    if (!apiKey || !query.trim()) return;
    setLoading(true);
    setSearched(true);
    
    try {
      // Search in multiple categories to find satellites by name
      const categories = [0, 52, 2, 18, 32]; // All, Starlink, ISS, Amateur, CubeSats
      const allResults: Array<{ satid: number; satname: string }> = [];
      
      for (const cat of categories) {
        const res = await fetch(
          `/api/satellite/above?lat=${observer.lat}&lng=${observer.lng}&alt=0&radius=90&category=${cat}&apiKey=${apiKey}`
        );
        const data = await res.json();
        if (data.above) {
          const matches = data.above.filter((s: { satname: string }) => 
            s.satname.toLowerCase().includes(query.toLowerCase())
          );
          allResults.push(...matches);
        }
        if (allResults.length >= 10) break;
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
    try {
      const res = await fetch(
        `/api/satellite/positions?satId=${satid}&lat=${observer.lat}&lng=${observer.lng}&alt=0&seconds=300&apiKey=${apiKey}`
      );
      const data = await res.json();
      addTrackedSatellite({
        id: satid,
        name: satname,
        positions: data.positions || [],
        color: '',
      });
      setQuery('');
      setResults([]);
      setSearched(false);
    } catch (error) {
      console.error('Failed to track:', error);
    }
  };

  return (
    <Section title="Search Satellite" icon={Search}>
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
  const { categoryId, setCategoryId, searchRadius, setSearchRadius, isLoading, apiKey } = useSatelliteStore();

  return (
    <Section title="Browse Above You" icon={Radio}>
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
          disabled={isLoading || !apiKey}
          className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Satellite size={16} />}
          Find Satellites
        </button>
      </div>
    </Section>
  );
}

// Tracked Satellites Section
function TrackedSection() {
  const { trackedSatellites, removeTrackedSatellite } = useSatelliteStore();

  if (trackedSatellites.length === 0) return null;

  return (
    <Section title={`Tracked (${trackedSatellites.length})`} icon={Satellite}>
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
    <Section title={`Results (${satellitesAbove.length})`} icon={Eye}>
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

export default function Sidebar({ onSearch }: { onSearch: () => void }) {
  return (
    <div className="h-full flex flex-col bg-gray-900 border-r border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <Satellite className="text-cyan-400" size={22} />
          Satellite Tracker
        </h1>
        <p className="text-xs text-gray-500 mt-1">Real-time satellite monitoring</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <ApiKeySection />
        <LocationSection />
        <SearchByNameSection />
        <BrowseCategorySection onSearch={onSearch} />
        <TrackedSection />
        <ResultsSection />
      </div>
    </div>
  );
}
