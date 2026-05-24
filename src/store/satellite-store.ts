import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SatelliteAbove, Position } from '@/lib/n2yo';
import { Region } from '@/lib/regions';

interface ObserverLocation {
  lat: number;
  lng: number;
  alt: number;
}

interface TrackedSatellite {
  id: number;
  name: string;
  positions: Position[]; // Current/future positions from API
  historicalPositions: Position[]; // Trail: accumulated positions from start to current
  startTime: number;
  color: string;
}

interface SatelliteStore {
  apiKey: string;
  setApiKey: (key: string) => void;
  observer: ObserverLocation;
  setObserver: (location: ObserverLocation) => void;
  showObserver: boolean;
  setShowObserver: (show: boolean) => void;
  satellitesAbove: SatelliteAbove[];
  setSatellitesAbove: (satellites: SatelliteAbove[]) => void;
  trackedSatellites: TrackedSatellite[];
  addTrackedSatellite: (satellite: { id: number; name: string; positions: Position[]; color: string }) => void;
  removeTrackedSatellite: (id: number) => void;
  updateTrackedPositions: (id: number, positions: Position[]) => void;
  selectedSatellite: SatelliteAbove | null;
  setSelectedSatellite: (satellite: SatelliteAbove | null) => void;
  selectTrackedSatellite: (id: number) => void;
  selectedOrbitPositions: Position[];
  setSelectedOrbitPositions: (positions: Position[]) => void;
  searchRadius: number;
  setSearchRadius: (radius: number) => void;
  categoryId: number;
  setCategoryId: (id: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  selectedRegion: Region | null;
  setSelectedRegion: (region: Region | null) => void;
  regionFilterEnabled: boolean;
  setRegionFilterEnabled: (enabled: boolean) => void;
  mapView: 'street' | 'satellite';
  setMapView: (view: 'street' | 'satellite') => void;
}

const COLORS = ['#00ff00', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8', '#a29bfe'];

export const useSatelliteStore = create<SatelliteStore>()(
  persist(
    (set, get) => ({
      apiKey: '',
      setApiKey: (key) => set({ apiKey: key }),
      observer: { lat: 40.7128, lng: -74.006, alt: 0 },
      setObserver: (location) => set({ observer: location }),
      showObserver: false,
      setShowObserver: (show) => set({ showObserver: show }),
      satellitesAbove: [],
      setSatellitesAbove: (satellites) => set({ satellitesAbove: satellites }),
      trackedSatellites: [],
      addTrackedSatellite: (satellite) => {
        const current = get().trackedSatellites;
        if (current.find((s) => s.id === satellite.id)) return;
        const color = COLORS[current.length % COLORS.length];
        const startPosition = satellite.positions[0];
        set({ 
          trackedSatellites: [...current, { 
            ...satellite, 
            color,
            startTime: Date.now(),
            historicalPositions: startPosition ? [startPosition] : []
          }] 
        });
      },
      removeTrackedSatellite: (id) =>
        set({ trackedSatellites: get().trackedSatellites.filter((s) => s.id !== id) }),
      updateTrackedPositions: (id, positions) =>
        set({
          trackedSatellites: get().trackedSatellites.map((s) => {
            if (s.id !== id) return s;
            
            // Get current position (first in the positions array)
            const currentPos = positions[0];
            if (!currentPos) return { ...s, positions };
            
            // Check if we should add to historical trail
            const lastHistorical = s.historicalPositions[s.historicalPositions.length - 1];
            let newHistorical = [...s.historicalPositions];
            
            // Add position if it's different enough from the last one
            if (!lastHistorical || 
                Math.abs(currentPos.satlatitude - lastHistorical.satlatitude) > 0.05 ||
                Math.abs(currentPos.satlongitude - lastHistorical.satlongitude) > 0.05) {
              newHistorical.push(currentPos);
              // Keep max 300 points for performance
              if (newHistorical.length > 300) {
                newHistorical = newHistorical.slice(-300);
              }
            }
            
            return { ...s, positions, historicalPositions: newHistorical };
          }),
        }),
      selectedSatellite: null,
      setSelectedSatellite: (satellite) => set({ selectedSatellite: satellite, selectedOrbitPositions: [] }),
      selectTrackedSatellite: (id) => {
        const tracked = get().trackedSatellites.find((s) => s.id === id);
        if (!tracked || tracked.positions.length === 0) return;
        
        const currentPos = tracked.positions[0];
        const satelliteAbove: SatelliteAbove = {
          satid: tracked.id,
          satname: tracked.name,
          satlat: currentPos.satlatitude,
          satlng: currentPos.satlongitude,
          satalt: currentPos.sataltitude,
          intDesignator: '',
          launchDate: '',
        };
        
        set({ 
          selectedSatellite: satelliteAbove,
          selectedOrbitPositions: tracked.positions
        });
      },
      selectedOrbitPositions: [],
      setSelectedOrbitPositions: (positions) => set({ selectedOrbitPositions: positions }),
      searchRadius: 70,
      setSearchRadius: (radius) => set({ searchRadius: radius }),
      categoryId: 0,
      setCategoryId: (id) => set({ categoryId: id }),
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      selectedRegion: null,
      setSelectedRegion: (region) => set({ selectedRegion: region }),
      regionFilterEnabled: false,
      setRegionFilterEnabled: (enabled) => set({ regionFilterEnabled: enabled }),
      mapView: 'satellite',
      setMapView: (view) => set({ mapView: view }),
    }),
    {
      name: 'satellite-store',
      partialize: (state) => ({
        apiKey: state.apiKey,
        observer: state.observer,
        showObserver: state.showObserver,
        searchRadius: state.searchRadius,
        categoryId: state.categoryId,
        trackedSatellites: state.trackedSatellites,
        selectedRegion: state.selectedRegion,
        regionFilterEnabled: state.regionFilterEnabled,
        mapView: state.mapView,
      }),
    }
  )
);
