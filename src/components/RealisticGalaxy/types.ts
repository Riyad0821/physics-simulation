// Type definitions for Realistic Galaxy System
import * as THREE from 'three';

export type QualityLevel = 'low' | 'medium' | 'high';

export interface GalaxyParams {
  // Star counts by component
  bulgeStars: number;
  armStars: number;
  haloStars: number;
  clusterStars: number;
  
  // Galaxy structure
  armCount: number;
  armTightness: number;
  diskRadius: number;
  bulgeRadius: number;
  haloRadius: number;
  diskHeight: number;
  
  // Animation
  rotationSpeed: number;
  
  // Visual
  starMinSize: number;
  starMaxSize: number;
}

export interface StarData {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  flickers: Float32Array;
}

export interface NebulaConfig {
  position: THREE.Vector3;
  radius: number;
  color: THREE.Color;
  density: number;
  type: 'emission' | 'reflection' | 'dark';
}

export interface CameraPreset {
  name: string;
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov?: number;
}

export interface GalaxyState {
  quality: QualityLevel;
  showArms: boolean;
  showNebulae: boolean;
  showClusters: boolean;
  showHalo: boolean;
  showVolumetric: boolean;
  rotationSpeed: number;
  starCount: number;
}

// Quality presets
export const QUALITY_PRESETS: Record<QualityLevel, GalaxyParams> = {
  low: {
    bulgeStars: 20000,
    armStars: 60000,
    haloStars: 15000,
    clusterStars: 5000,
    armCount: 4,
    armTightness: 0.4,
    diskRadius: 200,
    bulgeRadius: 30,
    haloRadius: 250,
    diskHeight: 15,
    rotationSpeed: 0.02,
    starMinSize: 0.5,
    starMaxSize: 2.0,
  },
  medium: {
    bulgeStars: 80000,
    armStars: 350000,
    haloStars: 50000,
    clusterStars: 20000,
    armCount: 4,
    armTightness: 0.45,
    diskRadius: 200,
    bulgeRadius: 30,
    haloRadius: 280,
    diskHeight: 12,
    rotationSpeed: 0.02,
    starMinSize: 0.4,
    starMaxSize: 2.5,
  },
  high: {
    bulgeStars: 150000,
    armStars: 700000,
    haloStars: 100000,
    clusterStars: 50000,
    armCount: 4,
    armTightness: 0.5,
    diskRadius: 200,
    bulgeRadius: 30,
    haloRadius: 300,
    diskHeight: 10,
    rotationSpeed: 0.02,
    starMinSize: 0.3,
    starMaxSize: 3.0,
  },
};

// Camera presets
export const CAMERA_PRESETS: CameraPreset[] = [
  {
    name: 'Top View',
    position: new THREE.Vector3(0, 400, 0),
    target: new THREE.Vector3(0, 0, 0),
    fov: 60,
  },
  {
    name: 'Edge View',
    position: new THREE.Vector3(400, 20, 0),
    target: new THREE.Vector3(0, 0, 0),
    fov: 50,
  },
  {
    name: 'Core Close-up',
    position: new THREE.Vector3(50, 30, 50),
    target: new THREE.Vector3(0, 0, 0),
    fov: 45,
  },
  {
    name: 'Arm Flythrough',
    position: new THREE.Vector3(100, 15, 80),
    target: new THREE.Vector3(150, 0, 120),
    fov: 70,
  },
  {
    name: 'Wide Galaxy',
    position: new THREE.Vector3(150, 200, 300),
    target: new THREE.Vector3(0, 0, 0),
    fov: 55,
  },
];

// Default nebula configurations
export const DEFAULT_NEBULAE: NebulaConfig[] = [
  {
    position: new THREE.Vector3(80, 5, 60),
    radius: 20,
    color: new THREE.Color(0xff6b9d),
    density: 0.8,
    type: 'emission',
  },
  {
    position: new THREE.Vector3(-100, -3, 40),
    radius: 25,
    color: new THREE.Color(0x64b5f6),
    density: 0.6,
    type: 'reflection',
  },
  {
    position: new THREE.Vector3(60, 8, -90),
    radius: 18,
    color: new THREE.Color(0xce93d8),
    density: 0.7,
    type: 'emission',
  },
  {
    position: new THREE.Vector3(-70, -5, -60),
    radius: 22,
    color: new THREE.Color(0x81d4fa),
    density: 0.5,
    type: 'reflection',
  },
  {
    position: new THREE.Vector3(120, 4, 20),
    radius: 15,
    color: new THREE.Color(0xffd54f),
    density: 0.9,
    type: 'emission',
  },
];
