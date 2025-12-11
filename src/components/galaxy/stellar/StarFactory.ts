/**
 * Star Factory
 * Generates star properties based on galactic position and HR diagram
 */

import { Vector3, Color } from 'three';
import { HRDiagram, StarType } from '@/utils/astronomy/HRDiagram';
import { SpiralMath } from '@/utils/math/SpiralMath';
import { GALAXY_CONFIG } from '@/config/galaxy.config';
import seedrandom from 'seedrandom';

export interface StarProperties {
  position: Vector3;
  color: Color;
  size: number;
  temperature: number;
  type: string;
}

export class StarFactory {
  private rng: seedrandom.PRNG;

  constructor(seed: string = 'galaxy-seed') {
    this.rng = seedrandom(seed);
  }

  generateStar(r: number, theta: number, armIndex: number = 0): StarProperties {
    // 1. Determine position (Spiral Arm + Vertical Spread)
    const armOffset = SpiralMath.getArmOffset(theta, armIndex, GALAXY_CONFIG.science.spiralArms, this.rng() * 2000); // 2000ly spread roughly
    
    // Base spiral pos
    const spiral = SpiralMath.logarithmicSpiral(theta, GALAXY_CONFIG.science.coreRadius, 0.2); // 0.2 growth
    
    // Add randomness
    const x = spiral.x + (this.rng() - 0.5) * 1000 + armOffset * Math.cos(theta);
    const z = spiral.z + (this.rng() - 0.5) * 1000 + armOffset * Math.sin(theta);
    
    // Vertical distribution (scale height decreases with radius usually, but simplified here)
    const scaleHeight = 1000;
    const y = (this.rng() - 0.5) * scaleHeight * 2 * Math.exp(-r / GALAXY_CONFIG.science.diskRadius);

    // 2. Determine Type (HR Diagram)
    const starType = HRDiagram.getRandomStarType();
    
    // 3. Final Properties
    return {
      position: new Vector3(x, y, z),
      color: new Color(starType.color),
      size: starType.radius, // This will need scaling for visual representation
      temperature: starType.temp,
      type: starType.class
    };
  }
}
