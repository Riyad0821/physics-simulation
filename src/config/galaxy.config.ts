export const GALAXY_CONFIG = {
  science: {
    // Physical constants (scaled)
    G: 6.67430e-11, // Gravitational constant (not actually used directly in visual sim usually, but good for reference)
    kpcToLy: 3261.56,
    
    // Galactic Structure
    diskRadius: 50000, // Light years (scaled)
    coreRadius: 4000,
    haloRadius: 75000,
    spiralArms: 2, // Milky Way main arms
    armWinding: 4.0,
    armWidth: 1500,
    diskThickness: 2000,
    
    // Stars
    count: {
      mobile: 100_000,
      desktop: 100_000, // Balanced for performance/visuals
      highPerf: 2_000_000, // 2M target
    },
    tempRange: [2400, 50000], // Kelvin
  },
  
  rendering: {
    lod: {
      distances: [0, 150, 600, 2500], // Tiers for LOD switches
      morphDuration: 30, // Frames
    },
    camera: {
      fov: 60,
      near: 0.1,
      far: 200000,
      initialPos: [0, 30000, 60000],
    },
    performance: {
      targetFPS: 60,
      maxFrameTime: 1000 / 60,
    }
  }
};
