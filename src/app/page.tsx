'use client';

import { useCallback, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSatelliteStore } from '@/store/satellite-store';
import Sidebar from '@/components/Sidebar';
import SatellitePanel from '@/components/SatellitePanel';
import { Loader2, Satellite } from 'lucide-react';

const Globe = dynamic(() => import('@/components/Globe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      <p className="text-gray-400 text-sm">Loading 3D Globe...</p>
    </div>
  ),
});

function StatsBar() {
  const { satellitesAbove, trackedSatellites, selectedRegion, regionFilterEnabled } = useSatelliteStore();
  
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-900/80 backdrop-blur-sm rounded-full px-6 py-2 flex items-center gap-6 border border-gray-700/50">
      {regionFilterEnabled && selectedRegion && (
        <>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-sm text-gray-300">
              <span className="font-bold text-white">{selectedRegion.name}</span>
            </span>
          </div>
          <div className="w-px h-4 bg-gray-700" />
        </>
      )}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cyan-400" />
        <span className="text-sm text-gray-300">
          <span className="font-bold text-white">{satellitesAbove.length}</span> visible
        </span>
      </div>
      <div className="w-px h-4 bg-gray-700" />
      <div className="flex items-center gap-2">
        <Satellite size={14} className="text-cyan-400" />
        <span className="text-sm text-gray-300">
          <span className="font-bold text-white">{trackedSatellites.length}</span> tracked
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const {
    apiKey,
    observer,
    searchRadius,
    categoryId,
    setSatellitesAbove,
    setIsLoading,
    trackedSatellites,
    updateTrackedPositions,
  } = useSatelliteStore();

  const searchSatellites = useCallback(async () => {
    if (!apiKey) {
      alert('Please enter your N2YO API key first');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/satellite/above?lat=${observer.lat}&lng=${observer.lng}&alt=${observer.alt}&radius=${searchRadius}&category=${categoryId}&apiKey=${apiKey}`
      );
      const data = await res.json();
      if (data.above) {
        setSatellitesAbove(data.above);
      } else {
        setSatellitesAbove([]);
      }
    } catch (error) {
      console.error('Failed to fetch satellites:', error);
      setSatellitesAbove([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, observer, searchRadius, categoryId, setSatellitesAbove, setIsLoading]);

  const searchSatellitesByRegion = useCallback(async (region: any) => {
    if (!apiKey) {
      alert('Please enter your N2YO API key first');
      return;
    }

    setIsLoading(true);
    try {
      // Use maximum radius (90°) for region searches to get comprehensive coverage
      const regionRadius = 90;
      
      // Fetch satellites from all sampling points in the region
      const promises = region.samplingPoints.map((point: any) =>
        fetch(
          `/api/satellite/above?lat=${point.lat}&lng=${point.lng}&alt=0&radius=${regionRadius}&category=${categoryId}&apiKey=${apiKey}`
        ).then(res => res.json())
      );

      const results = await Promise.all(promises);
      
      // Combine all satellites and remove duplicates by satid
      const allSatellites: any[] = [];
      const seenIds = new Set<number>();
      
      results.forEach(data => {
        if (data.above) {
          data.above.forEach((sat: any) => {
            if (!seenIds.has(sat.satid)) {
              seenIds.add(sat.satid);
              allSatellites.push(sat);
            }
          });
        }
      });

      console.log(`Region search: Found ${allSatellites.length} unique satellites over ${region.name}`);
      setSatellitesAbove(allSatellites);
    } catch (error) {
      console.error('Failed to fetch satellites for region:', error);
      setSatellitesAbove([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, categoryId, setSatellitesAbove, setIsLoading]);

  // Update tracked satellite positions periodically (every 3 seconds for real-time)
  useEffect(() => {
    if (!apiKey || trackedSatellites.length === 0) return;

    const updatePositions = async () => {
      for (const sat of trackedSatellites) {
        try {
          const res = await fetch(
            `/api/satellite/positions?satId=${sat.id}&lat=${observer.lat}&lng=${observer.lng}&alt=${observer.alt}&seconds=300&apiKey=${apiKey}`
          );
          const data = await res.json();
          if (data.positions) {
            updateTrackedPositions(sat.id, data.positions);
          }
        } catch (error) {
          console.error(`Failed to update positions for ${sat.name}:`, error);
        }
      }
    };

    // Initial update
    updatePositions();
    // Update every 3 seconds for smooth real-time tracking
    const interval = setInterval(updatePositions, 3000);
    return () => clearInterval(interval);
  }, [apiKey, trackedSatellites.length, observer, updateTrackedPositions]);

  return (
    <main className="h-screen flex bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 flex-shrink-0 hidden md:block">
        <Sidebar onSearch={searchSatellites} onRegionSearch={searchSatellitesByRegion} />
      </aside>

      {/* Globe Area */}
      <div className="flex-1 relative overflow-hidden">
        <Suspense
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
              <p className="text-gray-400 text-sm">Loading 3D Globe...</p>
            </div>
          }
        >
          <Globe />
        </Suspense>
        
        <StatsBar />
        <SatellitePanel />
        
        {/* Mobile sidebar toggle - could be expanded */}
        <div className="md:hidden absolute top-4 left-4">
          <button className="p-2 bg-gray-800 rounded-lg text-white">
            <Satellite size={20} />
          </button>
        </div>
      </div>
    </main>
  );
}
