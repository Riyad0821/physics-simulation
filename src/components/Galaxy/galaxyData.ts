// Galaxy data configuration
export interface StarClusterConfig {
  name: string;
  position: [number, number, number];
  radius: number;
  starCount: number;
  color: string;
  type: 'cluster' | 'nebula';
  description: string;
  facts: {
    distance: string;
    age: string;
    stars: string;
  };
}

export interface GalaxyConfig {
  name: string;
  armCount: number;
  armTightness: number;
  coreRadius: number;
  diskRadius: number;
  starCount: number;
  rotationSpeed: number;
}

export const GALAXY_CONFIG: GalaxyConfig = {
  name: 'Milky Way',
  armCount: 4,
  armTightness: 0.5,
  coreRadius: 15,
  diskRadius: 200,
  starCount: 15000,
  rotationSpeed: 0.02,
};

export const NOTABLE_OBJECTS: StarClusterConfig[] = [
  {
    name: 'Orion Nebula',
    position: [80, 5, 40],
    radius: 8,
    starCount: 300,
    color: '#ff6b9d',
    type: 'nebula',
    description: 'A diffuse nebula in the Milky Way, one of the brightest nebulae visible to the naked eye.',
    facts: {
      distance: '1,344 light-years',
      age: '3 million years',
      stars: '~700 stars forming',
    },
  },
  {
    name: 'Crab Nebula',
    position: [-60, 8, 70],
    radius: 5,
    starCount: 150,
    color: '#64b5f6',
    type: 'nebula',
    description: 'A supernova remnant and pulsar wind nebula in Taurus.',
    facts: {
      distance: '6,500 light-years',
      age: '970 years (since supernova)',
      stars: '1 pulsar at center',
    },
  },
  {
    name: 'Pleiades',
    position: [40, -5, -80],
    radius: 10,
    starCount: 400,
    color: '#81d4fa',
    type: 'cluster',
    description: 'An open star cluster known as the Seven Sisters.',
    facts: {
      distance: '444 light-years',
      age: '100 million years',
      stars: '~1,000 stars',
    },
  },
  {
    name: 'Omega Centauri',
    position: [-90, -10, -50],
    radius: 12,
    starCount: 500,
    color: '#ffd54f',
    type: 'cluster',
    description: 'The largest globular cluster in the Milky Way.',
    facts: {
      distance: '17,090 light-years',
      age: '12 billion years',
      stars: '~10 million stars',
    },
  },
  {
    name: 'Eagle Nebula',
    position: [100, 3, -30],
    radius: 7,
    starCount: 250,
    color: '#ce93d8',
    type: 'nebula',
    description: 'Home to the famous "Pillars of Creation".',
    facts: {
      distance: '7,000 light-years',
      age: '5.5 million years',
      stars: 'Active star formation',
    },
  },
];

export const GALAXY_CORE_INFO = {
  name: 'Sagittarius A*',
  description: 'The supermassive black hole at the center of the Milky Way galaxy.',
  facts: {
    mass: '4 million solar masses',
    distance: '26,000 light-years from Earth',
    diameter: '~44 million km',
    type: 'Supermassive Black Hole',
  },
};
