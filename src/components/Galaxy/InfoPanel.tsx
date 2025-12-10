'use client';

import { StarClusterConfig, GALAXY_CORE_INFO } from './galaxyData';

interface InfoPanelProps {
  selectedObject: StarClusterConfig | 'core' | null;
  onClose: () => void;
}

export default function InfoPanel({ selectedObject, onClose }: InfoPanelProps) {
  if (!selectedObject) return null;

  const isCore = selectedObject === 'core';
  const title = isCore ? GALAXY_CORE_INFO.name : selectedObject.name;
  const description = isCore ? GALAXY_CORE_INFO.description : selectedObject.description;
  const facts = isCore ? GALAXY_CORE_INFO.facts : selectedObject.facts;
  const type = isCore ? 'Galactic Core' : selectedObject.type === 'nebula' ? 'Nebula' : 'Star Cluster';

  return (
    <div className="absolute bottom-6 right-6 w-80 bg-black/70 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-2xl animate-slideIn">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <span className="text-xs text-white/50">{type}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <span className="text-white/60 text-lg">×</span>
          </button>
        </div>
      </div>
      
      {/* Description */}
      <div className="px-5 py-4 border-b border-white/5">
        <p className="text-white/70 text-sm leading-relaxed">
          {description}
        </p>
      </div>
      
      {/* Facts */}
      <div className="px-5 py-4 space-y-2">
        {Object.entries(facts).map(([key, value]) => (
          <div key={key} className="flex justify-between text-sm">
            <span className="text-white/50 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
            <span className="text-white/90">{value}</span>
          </div>
        ))}
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
