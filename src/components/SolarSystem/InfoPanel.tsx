'use client';

import { PlanetConfig } from './planetData';

interface InfoPanelProps {
  planet: PlanetConfig | null;
  onClose: () => void;
}

export default function InfoPanel({ planet, onClose }: InfoPanelProps) {
  if (!planet) return null;

  return (
    <div className="absolute bottom-6 right-6 w-80 bg-black/70 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-2xl animate-slideIn">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{planet.name}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>
      </div>
      
      {/* Description */}
      <div className="px-5 py-3 border-b border-white/5">
        <p className="text-white/70 text-sm leading-relaxed">
          {planet.description}
        </p>
      </div>
      
      {/* Facts Grid */}
      <div className="px-5 py-4">
        <h3 className="text-xs uppercase tracking-wider text-white/40 mb-3">Quick Facts</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/40 text-xs mb-1">Diameter</div>
            <div className="text-white font-medium text-sm">{planet.facts.diameter}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/40 text-xs mb-1">Day Length</div>
            <div className="text-white font-medium text-sm">{planet.facts.dayLength}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/40 text-xs mb-1">Year Length</div>
            <div className="text-white font-medium text-sm">{planet.facts.yearLength}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/40 text-xs mb-1">Known Moons</div>
            <div className="text-white font-medium text-sm">{planet.facts.moons}</div>
          </div>
        </div>
      </div>
      
      {/* Footer hint */}
      <div className="px-5 py-3 bg-white/5 border-t border-white/5">
        <p className="text-white/30 text-xs text-center">
          Click elsewhere to close • Use mouse to navigate
        </p>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
