import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SatelliteAbove, Position } from '@/lib/n2yo';

interface ObserverLocation {
  lat: number;
  lng: number;
  alt: number;
}

interface TrackedSatellite {
  id: number;
  name: string;
  positions: Position[];
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
  addTrackedSatellite: (satellite: TrackedSatellite) => void;
  removeTrackedSatellite: (id: number) => void;
  updateTrackedPositions: (id: number, positions: Position[]) => void;
  selectedSatellite: SatelliteAbove | null;
  setSelectedSatellite: (satellite: SatelliteAbove | null) => void;
  selectedOrbitPositions: Position[];
  setSelectedOrbitPositions: (positions: Position[]) => void;
  searchRadius: number;
  setSearchRadius: (radius: number) => void;
  categoryId: number;
  setCategoryId: (id: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8', '#a29bfe'];

export const useSatelliteStore = create<SatelliteStore>()(
  persist(
    (set, get) => ({
      apiKey: '',
      setApiKey: (key) => set({ apiKey: key }),
      observer: { lat: 40.7128, lng: -74.006, alt: 0 },
      setObserver: (location) => set({ observer: location }),
      showObserver: true,
      setShowObserver: (show) => set({ showObserver: show }),
      satellitesAbove: [],
      setSatellitesAbove: (satellites) => set({ satellitesAbove: satellites }),
      trackedSatellites: [],
      addTrackedSatellite: (satellite) => {
        const current = get().trackedSatellites;
        if (current.find((s) => s.id === satellite.id)) return;
        const color = COLORS[current.length % COLORS.length];
        set({ trackedSatellites: [...current, { ...satellite, color }] });
      },
      removeTrackedSatellite: (id) =>
        set({ trackedSatellites: get().trackedSatellites.filter((s) => s.id !== id) }),
      updateTrackedPositions: (id, positions) =>
        set({
          trackedSatellites: get().trackedSatellites.map((s) =>
            s.id === id ? { ...s, positions } : s
          ),
        }),
      selectedSatellite: null,
      setSelectedSatellite: (satellite) => set({ selectedSatellite: satellite, selectedOrbitPositions: [] }),
      selectedOrbitPositions: [],
      setSelectedOrbitPositions: (positions) => set({ selectedOrbitPositions: positions }),
      searchRadius: 70,
      setSearchRadius: (radius) => set({ searchRadius: radius }),
      categoryId: 0,
      setCategoryId: (id) => set({ categoryId: id }),
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'satellite-store',
      partialize: (state) => ({
        apiKey: state.apiKey,
        observer: state.observer,
        showObserver: state.showObserver,
        searchRadius: state.searchRadius,
        categoryId: state.categoryId,
      }),
    }
  )
);
