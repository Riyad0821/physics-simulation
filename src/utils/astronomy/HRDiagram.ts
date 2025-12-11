/**
 * Herzsprung-Russell Diagram Logic
 * Maps stellar mass/temperature to color and luminosity
 */

import { Color } from 'three';

export interface StarType {
  class: string;
  temp: number; // Kelvin
  mass: number; // Solar masses
  radius: number; // Solar radii
  color: string; // Hex
  abundance: number; // Percentage
}

// Simplified Spectral Classification
export const SPECTRAL_CLASSES: StarType[] = [
  { class: 'O', temp: 50000, mass: 60, radius: 15, color: '#9bb0ff', abundance: 0.00003 },
  { class: 'B', temp: 20000, mass: 18, radius: 7, color: '#aabfff', abundance: 0.13 },
  { class: 'A', temp: 8500, mass: 3.2, radius: 2.1, color: '#cad7ff', abundance: 0.6 },
  { class: 'F', temp: 6500, mass: 1.7, radius: 1.3, color: '#f8f7ff', abundance: 3 },
  { class: 'G', temp: 5700, mass: 1.1, radius: 1.1, color: '#fff4ea', abundance: 7.6 },
  { class: 'K', temp: 4500, mass: 0.8, radius: 0.9, color: '#ffd2a1', abundance: 12.1 },
  { class: 'M', temp: 3200, mass: 0.3, radius: 0.4, color: '#ffcc6f', abundance: 76.45 }
];

export class HRDiagram {
  static getRandomStarType(): StarType {
    const rand = Math.random() * 100;
    let cumulative = 0;
    
    for (const type of SPECTRAL_CLASSES) {
      cumulative += type.abundance;
      if (rand <= cumulative) {
        return type;
      }
    }
    return SPECTRAL_CLASSES[SPECTRAL_CLASSES.length - 1];
  }

  static getTemperatureColor(temp: number): Color {
    // Approximate curve fitting for blackbody radiation
    // This is a simplified lookup, in a real app might use a proper algorithm or texture
    if (temp >= 30000) return new Color(0x9bb0ff);
    if (temp >= 10000) return new Color(0xaabfff);
    if (temp >= 7500) return new Color(0xcad7ff);
    if (temp >= 6000) return new Color(0xf8f7ff);
    if (temp >= 5200) return new Color(0xfff4ea);
    if (temp >= 3700) return new Color(0xffd2a1);
    return new Color(0xffcc6f);
  }
}
