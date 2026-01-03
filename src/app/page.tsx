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
  const { satellitesAbove, trackedSatellites } = useSatelliteStore();
  
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-900/80 backdrop-blur-sm rounded-full px-6 py-2 flex items-center gap-6 border border-gray-700/50">
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

  // Update tracked satellite positions periodically
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

    updatePositions();
    const interval = setInterval(updatePositions, 30000);
    return () => clearInterval(interval);
  }, [apiKey, trackedSatellites.length, observer, updateTrackedPositions]);

  return (
    <main className="h-screen flex bg-gray-950">
      {/* Sidebar */}
      <aside className="w-80 flex-shrink-0 hidden md:block">
        <Sidebar onSearch={searchSatellites} />
      </aside>

      {/* Globe Area */}
      <div className="flex-1 relative">
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
