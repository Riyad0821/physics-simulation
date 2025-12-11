// Galaxy Generator - Generates star positions for different galaxy components
import * as THREE from 'three';
import { gaussianRandom, perlin2D, temperatureToColor, logarithmicSpiral } from '../../utils/math';
import { GalaxyParams, StarData } from './types';

/**
 * Generate stars for the galactic bulge (dense central region)
 */
export function generateBulge(params: GalaxyParams): StarData {
  const count = params.bulgeStars;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const flickers = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Gaussian distribution for spherical bulge
    const r = Math.abs(gaussianRandom(0, params.bulgeRadius * 0.4));
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi) * 0.6; // Slightly flattened
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    // Older, yellower stars in bulge (higher temperature variation)
    const temperature = 4000 + Math.random() * 4000; // K-type to G-type
    const color = temperatureToColor(temperature);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    // Size and flicker
    sizes[i] = params.starMinSize + Math.random() * (params.starMaxSize - params.starMinSize);
    flickers[i] = 0.5 + Math.random() * 2;
  }

  return { positions, colors, sizes, flickers };
}

/**
 * Generate stars for spiral arms
 */
export function generateSpiralArms(params: GalaxyParams): StarData {
  const count = params.armStars;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const flickers = new Float32Array(count);

  const starsPerArm = Math.floor(count / params.armCount);

  for (let arm = 0; arm < params.armCount; arm++) {
    const armOffset = (arm / params.armCount) * Math.PI * 2;

    for (let i = 0; i < starsPerArm; i++) {
      const idx = arm * starsPerArm + i;
      
      // Progress along arm (0 to 1)
      const t = i / starsPerArm;
      
      // Logarithmic spiral
      const theta = t * 4 * Math.PI; // Multiple rotations
      const baseRadius = params.bulgeRadius * 0.8;
      const { x: spiralX, z: spiralZ } = logarithmicSpiral(
        theta,
        baseRadius,
        params.armTightness
      );

      // Add noise for arm width variation
      const noiseScale = 0.1;
      const noise = perlin2D(theta * noiseScale, arm * 10);
      const armWidth = 10 + t * 20; // Arms get wider further out
      const offsetX = noise * armWidth + gaussianRandom(0, armWidth * 0.3);
      const offsetZ = perlin2D(theta * noiseScale + 100, arm * 10) * armWidth + gaussianRandom(0, armWidth * 0.3);

      // Rotate by arm offset
      const angle = armOffset;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      
      const x = (spiralX + offsetX) * cosA - (spiralZ + offsetZ) * sinA;
      const z = (spiralX + offsetX) * sinA + (spiralZ + offsetZ) * cosA;
      
      // Height with Gaussian falloff toward edges
      const radius = Math.sqrt(x * x + z * z);
      const heightScale = Math.exp(-radius / (params.diskRadius * 0.5));
      const y = gaussianRandom(0, params.diskHeight * heightScale);

      // Clamp to disk radius
      if (radius > params.diskRadius) {
        const scale = params.diskRadius / radius;
        positions[idx * 3] = x * scale;
        positions[idx * 3 + 2] = z * scale;
      } else {
        positions[idx * 3] = x;
        positions[idx * 3 + 2] = z;
      }
      positions[idx * 3 + 1] = y;

      // Color based on position - bluer in arms (young stars), yellower toward center
      const distRatio = radius / params.diskRadius;
      const temperature = 6000 + (1 - distRatio) * 4000 + Math.random() * 2000;
      const color = temperatureToColor(temperature);
      
      // Boost blue for young star regions
      if (distRatio > 0.3 && distRatio < 0.8 && Math.random() > 0.7) {
        colors[idx * 3] = color.r * 0.8;
        colors[idx * 3 + 1] = color.g * 0.9;
        colors[idx * 3 + 2] = Math.min(1, color.b * 1.3);
      } else {
        colors[idx * 3] = color.r;
        colors[idx * 3 + 1] = color.g;
        colors[idx * 3 + 2] = color.b;
      }

      sizes[idx] = params.starMinSize + Math.random() * (params.starMaxSize - params.starMinSize);
      flickers[idx] = 0.5 + Math.random() * 2;
    }
  }

  return { positions, colors, sizes, flickers };
}

/**
 * Generate halo stars (sparse spherical distribution)
 */
export function generateHalo(params: GalaxyParams): StarData {
  const count = params.haloStars;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const flickers = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Spherical distribution biased toward outer regions
    const r = params.bulgeRadius + Math.pow(Math.random(), 0.3) * (params.haloRadius - params.bulgeRadius);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    // Old, red stars in halo
    const temperature = 3000 + Math.random() * 2000;
    const color = temperatureToColor(temperature);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    // Smaller, dimmer stars
    sizes[i] = params.starMinSize * 0.6 + Math.random() * params.starMinSize;
    flickers[i] = 0.3 + Math.random();
  }

  return { positions, colors, sizes, flickers };
}

/**
 * Generate star clusters within spiral arms
 */
export function generateStarClusters(params: GalaxyParams, clusterCount = 25): StarData {
  const starsPerCluster = Math.floor(params.clusterStars / clusterCount);
  const totalStars = starsPerCluster * clusterCount;
  
  const positions = new Float32Array(totalStars * 3);
  const colors = new Float32Array(totalStars * 3);
  const sizes = new Float32Array(totalStars);
  const flickers = new Float32Array(totalStars);

  for (let c = 0; c < clusterCount; c++) {
    // Place cluster along spiral arm
    const armIndex = c % params.armCount;
    const armOffset = (armIndex / params.armCount) * Math.PI * 2;
    const t = 0.2 + Math.random() * 0.6; // Middle portion of arms
    const theta = t * 4 * Math.PI;
    
    const { x: baseX, z: baseZ } = logarithmicSpiral(
      theta,
      params.bulgeRadius * 0.8,
      params.armTightness
    );
    
    const cosA = Math.cos(armOffset);
    const sinA = Math.sin(armOffset);
    const clusterX = baseX * cosA - baseZ * sinA;
    const clusterZ = baseX * sinA + baseZ * cosA;
    const clusterY = gaussianRandom(0, 3);
    const clusterRadius = 3 + Math.random() * 5;

    for (let i = 0; i < starsPerCluster; i++) {
      const idx = c * starsPerCluster + i;
      
      // Dense spherical cluster
      const r = Math.pow(Math.random(), 0.5) * clusterRadius;
      const phi = Math.random() * Math.PI * 2;
      const psi = Math.acos(2 * Math.random() - 1);

      positions[idx * 3] = clusterX + r * Math.sin(psi) * Math.cos(phi);
      positions[idx * 3 + 1] = clusterY + r * Math.cos(psi);
      positions[idx * 3 + 2] = clusterZ + r * Math.sin(psi) * Math.sin(phi);

      // Hot blue-white stars in clusters
      const temperature = 8000 + Math.random() * 12000;
      const color = temperatureToColor(temperature);
      colors[idx * 3] = color.r;
      colors[idx * 3 + 1] = color.g;
      colors[idx * 3 + 2] = color.b;

      sizes[idx] = params.starMinSize + Math.random() * params.starMaxSize * 1.2;
      flickers[idx] = 1 + Math.random() * 3;
    }
  }

  return { positions, colors, sizes, flickers };
}

/**
 * Merge multiple StarData objects into one
 */
export function mergeStarData(...dataSets: StarData[]): StarData {
  const totalCount = dataSets.reduce((sum, d) => sum + d.positions.length / 3, 0);
  
  const positions = new Float32Array(totalCount * 3);
  const colors = new Float32Array(totalCount * 3);
  const sizes = new Float32Array(totalCount);
  const flickers = new Float32Array(totalCount);

  let offset = 0;
  for (const data of dataSets) {
    const count = data.positions.length / 3;
    positions.set(data.positions, offset * 3);
    colors.set(data.colors, offset * 3);
    sizes.set(data.sizes, offset);
    flickers.set(data.flickers, offset);
    offset += count;
  }

  return { positions, colors, sizes, flickers };
}
