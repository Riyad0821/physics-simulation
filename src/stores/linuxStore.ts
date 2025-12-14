import { create } from 'zustand';

interface LinuxSystemState {
  currentStep: number;
  activeComponent: string | null;
  commandQueue: string[];
  
  // Actions
  addCommand: (cmd: string) => void;
  nextStep: () => void;
  setActiveComponent: (component: string | null) => void;
}

export const useLinuxStore = create<LinuxSystemState>((set) => ({
  currentStep: 0,
  activeComponent: null,
  commandQueue: [],

  addCommand: (cmd) => set((state) => ({ commandQueue: [...state.commandQueue, cmd] })),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  setActiveComponent: (component) => set({ activeComponent: component }),
}));
