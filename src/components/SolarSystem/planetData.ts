// Planet data configuration for the Solar System
export interface MoonConfig {
  name: string;
  radius: number;
  distance: number;
  orbitSpeed: number;
  texture: string;
}

export interface PlanetConfig {
  name: string;
  radius: number;
  distance: number;
  orbitSpeed: number;
  rotationSpeed: number;
  texture: string;
  moons?: MoonConfig[];
  hasRings?: boolean;
  ringTexture?: string;
  tilt?: number; // Axial tilt in radians
  description: string;
  facts: {
    diameter: string;
    dayLength: string;
    yearLength: string;
    moons: number;
  };
}

export const PLANET_DATA: PlanetConfig[] = [
  {
    name: 'Mercury',
    radius: 0.4,
    distance: 8,
    orbitSpeed: 4.0,
    rotationSpeed: 0.5,
    texture: '/textures/mercury.jpg',
    tilt: 0.03,
    description: 'The smallest planet and closest to the Sun.',
    facts: {
      diameter: '4,879 km',
      dayLength: '59 Earth days',
      yearLength: '88 Earth days',
      moons: 0,
    },
  },
  {
    name: 'Venus',
    radius: 0.95,
    distance: 12,
    orbitSpeed: 3.5,
    rotationSpeed: -0.4, // Retrograde rotation
    texture: '/textures/venus_surface.jpg',
    tilt: 0.04,
    description: 'The hottest planet with a thick toxic atmosphere.',
    facts: {
      diameter: '12,104 km',
      dayLength: '243 Earth days',
      yearLength: '225 Earth days',
      moons: 0,
    },
  },
  {
    name: 'Earth',
    radius: 1.0,
    distance: 16,
    orbitSpeed: 3.0,
    rotationSpeed: 1.0,
    texture: '/textures/earth_daymap.jpg',
    tilt: 0.41,
    moons: [
      {
        name: 'Moon',
        radius: 0.27,
        distance: 2.5,
        orbitSpeed: 3.0,
        texture: '/textures/moon.jpg',
      },
    ],
    description: 'Our home planet, the only known world with life.',
    facts: {
      diameter: '12,742 km',
      dayLength: '24 hours',
      yearLength: '365.25 days',
      moons: 1,
    },
  },
  {
    name: 'Mars',
    radius: 0.53,
    distance: 22,
    orbitSpeed: 2.5,
    rotationSpeed: 0.97,
    texture: '/textures/mars.jpg',
    tilt: 0.44,
    description: 'The Red Planet, a cold desert world with potential for exploration.',
    facts: {
      diameter: '6,779 km',
      dayLength: '24.6 hours',
      yearLength: '687 Earth days',
      moons: 2,
    },
  },
  {
    name: 'Jupiter',
    radius: 2.8,
    distance: 34,
    orbitSpeed: 1.3,
    rotationSpeed: 2.4,
    texture: '/textures/jupiter.jpg',
    tilt: 0.05,
    description: 'The largest planet, a gas giant with a Great Red Spot storm.',
    facts: {
      diameter: '139,820 km',
      dayLength: '10 hours',
      yearLength: '12 Earth years',
      moons: 95,
    },
  },
  {
    name: 'Saturn',
    radius: 2.3,
    distance: 48,
    orbitSpeed: 0.9,
    rotationSpeed: 2.2,
    texture: '/textures/saturn.jpg',
    hasRings: true,
    ringTexture: '/textures/saturn_ring.png',
    tilt: 0.47,
    description: 'Famous for its stunning ring system made of ice and rock.',
    facts: {
      diameter: '116,460 km',
      dayLength: '10.7 hours',
      yearLength: '29 Earth years',
      moons: 146,
    },
  },
  {
    name: 'Uranus',
    radius: 1.4,
    distance: 62,
    orbitSpeed: 0.6,
    rotationSpeed: -1.4, // Retrograde rotation
    texture: '/textures/uranus.jpg',
    tilt: 1.71, // Extreme tilt
    description: 'An ice giant that rotates on its side.',
    facts: {
      diameter: '50,724 km',
      dayLength: '17 hours',
      yearLength: '84 Earth years',
      moons: 28,
    },
  },
  {
    name: 'Neptune',
    radius: 1.35,
    distance: 76,
    orbitSpeed: 0.5,
    rotationSpeed: 1.5,
    texture: '/textures/neptune.jpg',
    tilt: 0.49,
    description: 'The windiest planet with supersonic storms.',
    facts: {
      diameter: '49,244 km',
      dayLength: '16 hours',
      yearLength: '165 Earth years',
      moons: 16,
    },
  },
];

export const SUN_CONFIG = {
  radius: 4,
  texture: '/textures/sun.jpg',
  rotationSpeed: 0.1,
};
