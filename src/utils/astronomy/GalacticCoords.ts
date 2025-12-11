/**
 * Galactic Coordinate Systems
 */

import { Vector3 } from 'three';

export class GalacticCoords {
  /**
   * Convert Galactic Coordinates (radius, longitude, latitude) to Cartesian
   * @param r Radius (distance from center)
   * @param l Galactic Longitude (radians)
   * @param b Galactic Latitude (radians)
   */
  static toCartesian(r: number, l: number, b: number): Vector3 {
    const x = r * Math.cos(b) * Math.cos(l);
    const y = r * Math.sin(b); // In Three.js y is up, usually galactic b maps to y or z depending on orientation. Assuming y is up (galactic plane is xz)
    const z = r * Math.cos(b) * Math.sin(l);
    return new Vector3(x, y, z);
  }

  /**
   * Convert Carteisan to Galactic Coordinates
   */
  static fromCartesian(x: number, y: number, z: number): { r: number, l: number, b: number } {
    const r = Math.sqrt(x*x + y*y + z*z);
    const b = Math.asin(y / r);
    const l = Math.atan2(z, x);
    return { r, l, b };
  }
}
