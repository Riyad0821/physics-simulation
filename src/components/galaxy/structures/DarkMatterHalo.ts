/**
 * Dark Matter Halo Model
 * Calculates rotational velocities and mass distribution
 */

import { GALAXY_CONFIG } from '@/config/galaxy.config';

export class DarkMatterHalo {
  /**
   * Calculate orbital velocity at radius r using NFW profile approximation
   * V_circ = sqrt(V_disk^2 + V_halo^2)
   */
  static getOrbitalVelocity(r: number): number {
    // Simplified model components
    const G = GALAXY_CONFIG.science.G;
    
    // 1. Bulge/Disk contribution (Keplerian falloff mostly)
    // Very simplified central mass approximation
    const M_inner = 1e11; // Solar masses
    const v_disk = Math.sqrt(G * M_inner / (r + 1000)); // epsilon to avoid singularity
    
    // 2. Dark Matter Halo (Flat rotation curve)
    // V ~ constant at large r
    const v_halo_max = 220000; // 220 km/s in m/s (approx)
    const r_core = 10000; // Halo core radius
    const v_halo = v_halo_max * Math.sqrt(1 - (r_core / (r + r_core))); 

    // Combine
    // This is a visual approximation, not exact physics relation
    return Math.sqrt(v_disk*v_disk + v_halo*v_halo);
  }

  static getDensity(r: number): number {
    // NFW Profile: rho(r) = rho_0 / ((r/Rs)(1 + r/Rs)^2)
    const Rs = 20000; // Scale radius
    const rho0 = 1e7; // Central density
    const x = r / Rs;
    return rho0 / (x * Math.pow(1 + x, 2));
  }
}
