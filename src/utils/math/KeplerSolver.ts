/**
 * Kepler Solver for Orbital Mechanics
 */

export class KeplerSolver {
  /**
   * Solve Kepler's Equation M = E - e*sin(E) for E (Eccentric Anomaly)
   * @param M Mean Anomaly
   * @param e Eccentricity
   * @param tolerance Convergence tolerance
   */
  static solve(M: number, e: number, tolerance: number = 1e-6): number {
    let E = M;
    let delta = 1.0;
    let iter = 0;
    const maxIter = 100;

    while (Math.abs(delta) > tolerance && iter < maxIter) {
      delta = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      E = E - delta;
      iter++;
    }

    return E;
  }

  /**
   * Calculate True Anomaly from Eccentric Anomaly
   */
  static trueAnomaly(E: number, e: number): number {
    return 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2));
  }
}
