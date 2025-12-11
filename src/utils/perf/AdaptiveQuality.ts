/**
 * Adaptive Quality System
 * Monitors performance and adjusts visual fidelity
 */

import { usePerformanceStore } from '@/stores/performanceStore';
import { useGalaxyStore } from '@/stores/galaxyStore';

export class AdaptiveQualitySystem {
  private history: number[] = [];
  private checkInterval = 60; // frames
  private frameCount = 0;

  update(currentFps: number) {
    this.frameCount++;
    this.history.push(currentFps);
    
    if (this.history.length > 60) this.history.shift();
    
    if (this.frameCount % this.checkInterval === 0) {
        this.evaluate();
    }
  }

  evaluate() {
    const avgFps = this.history.reduce((a, b) => a + b, 0) / this.history.length;
    const { qualityPreset, setQualityPreset } = useGalaxyStore.getState();

    if (avgFps < 30) {
        if (qualityPreset === 'ultra') setQualityPreset('high');
        else if (qualityPreset === 'high') setQualityPreset('medium');
        else if (qualityPreset === 'medium') setQualityPreset('low');
    } else if (avgFps > 58) {
        // Only upgrade if we are really stable, to avoid oscillating
        // if (qualityPreset === 'low') setQualityPreset('medium');
    }
  }
}
