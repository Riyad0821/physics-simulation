import { create } from 'zustand';

interface UIState {
  showDebug: boolean;
  showStats: boolean;
  selectedObject: string | null;
  cameraMode: 'orbit' | 'fly' | 'cinematic';
  
  // Actions
  toggleDebug: () => void;
  toggleStats: () => void;
  selectObject: (id: string | null) => void;
  setCameraMode: (mode: 'orbit' | 'fly' | 'cinematic') => void;
}

export const useUIStore = create<UIState>((set) => ({
  showDebug: false,
  showStats: true,
  selectedObject: null,
  cameraMode: 'orbit',
  
  toggleDebug: () => set((state) => ({ showDebug: !state.showDebug })),
  toggleStats: () => set((state) => ({ showStats: !state.showStats })),
  selectObject: (id) => set({ selectedObject: id }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
}));
