'use client';

import { useLinuxStore, SimulationState } from '@/stores/linuxStore';
import { useEffect } from 'react';

const CYCLE_ORDER: SimulationState[] = ['FETCH', 'DECODE', 'EXECUTE'];

export function SimulationControls() {
  const simulationState = useLinuxStore((state) => state.simulationState);
  const microStep = useLinuxStore((state) => state.microStep);
  const registers = useLinuxStore((state) => state.registers);
  const nextMicroStep = useLinuxStore((state) => state.nextMicroStep);
  const resetSimulation = useLinuxStore((state) => state.resetSimulation);

  const handleNextStep = () => {
    nextMicroStep();
  };
  
  const handleReset = () => {
      resetSimulation();
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white p-4 rounded-xl backdrop-blur-md border border-white/10 z-50 w-[95%] max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <div>
           <h3 className="text-lg font-bold text-blue-400">CPU Cycle Control</h3>
           <p className="text-sm text-gray-400">
               State: <span className="font-mono text-yellow-400">{simulationState}</span> 
               <span className="text-gray-600 mx-2">|</span>
               Micro-Step: <span className="font-mono text-blue-400">{microStep}</span>
           </p>
        </div>
        <div className="text-right font-mono text-xs grid grid-cols-5 gap-4">
            <div>
                <span className="text-gray-500 block">PC</span>
                <span className="text-white text-lg">{registers.PC}</span>
            </div>
            <div>
                <span className="text-gray-500 block">MAR</span>
                <span className="text-white text-lg">{registers.MAR}</span>
            </div>
            <div>
                <span className="text-gray-500 block">MDR</span>
                <span className="text-white text-lg">{registers.MDR}</span>
            </div>
            <div>
                <span className="text-gray-500 block">CIR</span>
                <span className="text-white text-lg">{registers.CIR}</span>
            </div>
            <div>
                <span className="text-gray-500 block">ACC</span>
                <span className="text-white text-lg">{registers.ACC}</span>
            </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
            onClick={handleNextStep}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-bold flex-1"
        >
          Next Micro-Step
        </button>
        
        <button 
            onClick={handleReset}
            className="px-4 py-2 bg-red-900 hover:bg-red-800 rounded font-bold"
        >
          Reset Simulation
        </button>
      </div>
      
       <div className="mt-4 flex gap-1 h-2 bg-gray-800 rounded overflow-hidden">
         {CYCLE_ORDER.map((s, i) => (
             <div 
                key={s} 
                className={`flex-1 transition-colors duration-300 ${simulationState === s ? 'bg-yellow-500' : 'bg-gray-700'}`}
             />
         ))}
       </div>
    </div>
  );
}
