import { create } from 'zustand';

interface GalaxyState {
  isInitialized: boolean;
  starCount: number;
  timeScale: number;
  currentYear: number;
  qualityPreset: 'low' | 'medium' | 'high' | 'ultra';
  selectedStar: { type: string; temp: number; distance: number } | null;
  
  // Actions
  setInitialized: (val: boolean) => void;
  setStarCount: (count: number) => void;
  setTimeScale: (scale: number) => void;
  updateYear: (dt: number) => void;
  setQualityPreset: (preset: 'low' | 'medium' | 'high' | 'ultra') => void;
  setSelectedStar: (star: { type: string; temp: number; distance: number } | null) => void;
}

export const useGalaxyStore = create<GalaxyState>((set) => ({
  isInitialized: false,
  starCount: 1000000,
  timeScale: 1,
  currentYear: 0,
  qualityPreset: 'high',
  selectedStar: null,
  
  setInitialized: (val) => set({ isInitialized: val }),
  setStarCount: (count) => set({ starCount: count }),
  setTimeScale: (scale) => set({ timeScale: scale }),
  updateYear: (dt) => set((state) => ({ currentYear: state.currentYear + dt * state.timeScale })),
  setQualityPreset: (preset) => set({ qualityPreset: preset }),
  setSelectedStar: (star) => set({ selectedStar: star }),
}));
