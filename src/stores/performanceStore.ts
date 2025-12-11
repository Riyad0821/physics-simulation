import { create } from 'zustand';

interface PerformanceState {
  fps: number;
  frameTime: number;
  gpuMemory: number;
  drawCalls: number;
  activeStars: number;
  
  // Actions
  updateMetrics: (metrics: Partial<PerformanceState>) => void;
}

export const usePerformanceStore = create<PerformanceState>((set) => ({
  fps: 60,
  frameTime: 16.6,
  gpuMemory: 0,
  drawCalls: 0,
  activeStars: 0,
  
  updateMetrics: (metrics) => set((state) => ({ ...state, ...metrics })),
}));
