/**
 * Spiral Galaxy Math Utilities
 * Based on Density Wave Theory and Logarithmic Spirals
 */

export class SpiralMath {
  /**
   * Calculate position on a logarithmic spiral
   * @param angle Angle in radians
   * @param a Scale factor
   * @param b Growth rate (cotangent of pitch angle)
   */
  static logarithmicSpiral(angle: number, a: number, b: number): { x: number, z: number } {
    const r = a * Math.exp(b * angle);
    return {
      x: r * Math.cos(angle),
      z: r * Math.sin(angle)
    };
  }

  /**
   * Perturb star position based on density wave
   * @param angle Current angle
   * @param armIndex Index of the spiral arm
   * @param totalArms Total number of arms
   * @param spread Random spread factor
   */
  static getArmOffset(angle: number, armIndex: number, totalArms: number, spread: number): number {
    const armAngle = (2 * Math.PI * armIndex) / totalArms;
    // Gaussian-like distribution for arm width
    return (Math.random() - 0.5) * spread; // Simplified, can be replaced with Box-Muller for Gaussian
  }
}
