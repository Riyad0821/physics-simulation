'use client';

import { QualityLevel, GalaxyState, CAMERA_PRESETS } from './types';

interface UIOverlayProps {
  state: GalaxyState;
  onStateChange: (newState: Partial<GalaxyState>) => void;
  onCameraPreset: (index: number) => void;
  onResetView: () => void;
}

export default function UIOverlay({
  state,
  onStateChange,
  onCameraPreset,
  onResetView,
}: UIOverlayProps) {
  const formatNumber = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return n.toString();
  };

  return (
    <div className="absolute top-14 left-0 w-80 bg-[#0a0a0a]/95 backdrop-blur-md border-r border-white/10 max-h-[calc(100vh-56px)] overflow-y-auto">
      <div className="p-5 space-y-5">
        {/* Header */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-1">
            🌌 Realistic Galaxy
          </h3>
          <p className="text-white/40 text-xs">
            Explore a procedurally generated galaxy
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white/5 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Total Stars</span>
            <span className="text-cyan-400 font-mono">{formatNumber(state.starCount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Quality Mode</span>
            <span className="text-purple-400 font-mono uppercase">{state.quality}</span>
          </div>
        </div>

        {/* Quality Selection */}
        <div>
          <label className="text-white/70 text-xs mb-2 block">Quality Mode</label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as QualityLevel[]).map((q) => (
              <button
                key={q}
                onClick={() => onStateChange({ quality: q })}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                  state.quality === q
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {q.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Rotation Speed */}
        <div>
          <label className="flex justify-between text-white/70 text-xs mb-2">
            <span>Rotation Speed</span>
            <span className="text-white/40">{state.rotationSpeed.toFixed(1)}x</span>
          </label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={state.rotationSpeed}
            onChange={(e) => onStateChange({ rotationSpeed: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        {/* Toggle Controls */}
        <div className="space-y-3">
          <h4 className="text-white text-sm font-medium pb-2 border-b border-white/10">
            Components
          </h4>
          
          {[
            { key: 'showArms', label: 'Spiral Arms', icon: '🌀' },
            { key: 'showNebulae', label: 'Nebulae', icon: '🌫️' },
            { key: 'showClusters', label: 'Star Clusters', icon: '✨' },
            { key: 'showHalo', label: 'Halo Stars', icon: '💫' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <span className="text-white/70 text-sm flex items-center gap-2">
                <span>{item.icon}</span>
                {item.label}
              </span>
              <button
                onClick={() => onStateChange({ [item.key]: !state[item.key as keyof GalaxyState] })}
                className={`w-11 h-6 rounded-full transition-colors ${
                  state[item.key as keyof GalaxyState] ? 'bg-purple-500' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${
                  state[item.key as keyof GalaxyState] ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))}
        </div>

        {/* Camera Presets */}
        <div>
          <h4 className="text-white text-sm font-medium pb-2 mb-3 border-b border-white/10">
            Camera Presets
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {CAMERA_PRESETS.map((preset, i) => (
              <button
                key={preset.name}
                onClick={() => onCameraPreset(i)}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 text-xs transition-all hover:text-white"
              >
                {preset.name}
              </button>
            ))}
          </div>
          <button
            onClick={onResetView}
            className="w-full mt-2 px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg text-cyan-400 text-xs transition-all"
          >
            🔭 Reset View
          </button>
        </div>

        {/* Controls Help */}
        <div className="pt-2 border-t border-white/10">
          <p className="text-white/30 text-xs leading-relaxed">
            <span className="text-white/50">Controls:</span> Drag to rotate • 
            Scroll to zoom • Right-click to pan
          </p>
        </div>
      </div>
    </div>
  );
}
