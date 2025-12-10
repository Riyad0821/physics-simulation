'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GALAXY_CONFIG } from './galaxyData';

interface SpiralArmsProps {
  animationSpeed?: number;
  showArms?: boolean;
}

export default function SpiralArms({ animationSpeed = 1, showArms = true }: SpiralArmsProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Generate spiral arm star positions
  const { positions, colors, sizes } = useMemo(() => {
    const starCount = GALAXY_CONFIG.starCount;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const armCount = GALAXY_CONFIG.armCount;
    const armTightness = GALAXY_CONFIG.armTightness;
    const diskRadius = GALAXY_CONFIG.diskRadius;
    const coreRadius = GALAXY_CONFIG.coreRadius;

    for (let i = 0; i < starCount; i++) {
      // Determine which arm this star belongs to
      const armIndex = i % armCount;
      const armOffset = (armIndex / armCount) * Math.PI * 2;

      // Distance from center (weighted toward outer regions)
      const distanceRatio = Math.pow(Math.random(), 0.6);
      const distance = coreRadius + distanceRatio * (diskRadius - coreRadius);

      // Logarithmic spiral angle
      const spiralAngle = armTightness * Math.log(distance / coreRadius + 1);
      const angle = armOffset + spiralAngle;

      // Add some scatter for realism
      const scatter = (1 - distanceRatio * 0.5) * 15;
      const scatterX = (Math.random() - 0.5) * scatter;
      const scatterY = (Math.random() - 0.5) * scatter * 0.3; // Flatter disk
      const scatterZ = (Math.random() - 0.5) * scatter;

      positions[i * 3] = Math.cos(angle) * distance + scatterX;
      positions[i * 3 + 1] = scatterY;
      positions[i * 3 + 2] = Math.sin(angle) * distance + scatterZ;

      // Color based on distance from center
      // Inner stars: blue-white (hot, young)
      // Outer stars: yellow-red (cooler, older)
      const colorRatio = distanceRatio;
      
      if (colorRatio < 0.3) {
        // Blue-white hot stars
        colors[i * 3] = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 2] = 1.0;
      } else if (colorRatio < 0.6) {
        // Yellow-white stars
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 0.6 + Math.random() * 0.3;
      } else {
        // Red-orange cooler stars
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.4;
        colors[i * 3 + 2] = 0.3 + Math.random() * 0.3;
      }

      // Size varies with distance (closer = larger apparent size for visual effect)
      sizes[i] = 0.5 + Math.random() * 1.5 * (1 - distanceRatio * 0.5);
    }

    return { positions, colors, sizes };
  }, []);

  // Rotate the galaxy slowly
  useFrame((_, delta) => {
    if (groupRef.current && showArms) {
      groupRef.current.rotation.y += GALAXY_CONFIG.rotationSpeed * delta * animationSpeed;
    }
  });

  if (!showArms) return null;

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.2}
          sizeAttenuation
          transparent
          opacity={0.9}
          vertexColors
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
