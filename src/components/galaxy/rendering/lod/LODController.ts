/**
 * LOD Controller
 * Manages switching between different detail levels based on camera distance and performance
 */

import { Vector3, Camera } from 'three';
import { GALAXY_CONFIG } from '@/config/galaxy.config';
import { usePerformanceStore } from '@/stores/performanceStore';

export interface LODTier {
  distance: number;
  type: 'instanced' | 'point-sprites' | 'impostor';
  shader: 'high' | 'medium' | 'low';
}

export const LOD_TIERS_RADEON: LODTier[] = [
  { distance: 0,    type: 'instanced',     shader: 'medium' },
  { distance: 150,  type: 'instanced',     shader: 'medium' },
  { distance: 600,  type: 'point-sprites', shader: 'low' },
  { distance: 2500, type: 'impostor',      shader: 'low' }
];

export class LODController {
  private currentTierIndex: number = 0;
  
  update(camera: Camera, target: Vector3): LODTier {
    const dist = camera.position.distanceTo(target);
    const fps = usePerformanceStore.getState().fps;
    
    // Find appropriate tier
    let tierIndex = 0;
    for (let i = 0; i < LOD_TIERS_RADEON.length; i++) {
        if (dist > LOD_TIERS_RADEON[i].distance) {
            tierIndex = i;
        }
    }
    
    // Performance Degrade: If FPS is low, drop to next lower tier if possible
    if (fps < 30 && tierIndex < LOD_TIERS_RADEON.length - 1) {
        tierIndex++;
    }

    this.currentTierIndex = tierIndex;
    return LOD_TIERS_RADEON[tierIndex];
  }
}
