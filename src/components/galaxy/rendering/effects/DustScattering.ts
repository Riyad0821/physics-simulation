/**
 * Dust Scattering
 * Logic to calculate extinction (Av) and scattering based on density
 */

import { Vector3 } from 'three';

export class DustScattering {
  static getExtinction(position: Vector3, density: number): number {
    // A_v = density * cross_section
    return density * 0.1;
  }
  
  static applyScattering(color: Vector3, distance: number, density: number): Vector3 {
    // Beer-Lambert Law approximation
    const opticalDepth = density * distance;
    const transmission = Math.exp(-opticalDepth);
    return color.multiplyScalar(transmission);
  }
}
