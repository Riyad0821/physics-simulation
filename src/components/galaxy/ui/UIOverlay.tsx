'use client';

/**
 * UI Overlay
 * Main HUD for the Galaxy Simulation
 */

import React from 'react';
import { useGalaxyStore } from '@/stores/galaxyStore';
import { useUIStore } from '@/stores/uiStore';
import PerformanceMonitor from '../core/PerformanceMonitor';

export default function UIOverlay() {
  const { starCount, qualityPreset, setQualityPreset } = useGalaxyStore();
  const { showStats, toggleStats } = useUIStore();

  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div>
            <h1 className="text-4xl font-light text-white tracking-widest uppercase opacity-90 drop-shadow-md">
                Helios <span className="text-blue-400 font-bold">Galaxy</span>
            </h1>
            <p className="text-xs text-blue-200 mt-1 uppercase tracking-wider">
                Radeon Optimized Build • {starCount.toLocaleString()} Stars
            </p>
        </div>
        
        {showStats && <PerformanceMonitor />}
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-between items-end pointer-events-auto">
        <div className="space-y-4">
             <div className="bg-black/50 backdrop-blur-md p-4 rounded-lg border border-white/10 text-white">
                <h3 className="text-sm font-bold mb-2 uppercase text-gray-400">Quality Preset</h3>
                <div className="flex gap-2">
                    {['low', 'medium', 'high'].map((tier) => (
                        <button 
                            key={tier}
                            onClick={() => setQualityPreset(tier as any)}
                            className={`px-3 py-1 text-xs rounded uppercase transition-colors ${qualityPreset === tier ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}
                        >
                            {tier}
                        </button>
                    ))}
                </div>
            </div>
        </div>
        
        <div className="space-y-2 text-right">
             <button 
                onClick={toggleStats}
                className="text-xs text-gray-400 hover:text-white uppercase transition-colors"
            >
                {showStats ? 'Hide Stats' : 'Show Stats'}
            </button>
        </div>
      </div>
    </div>
  );
}
