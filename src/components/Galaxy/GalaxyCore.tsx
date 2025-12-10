'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GALAXY_CONFIG } from './galaxyData';

interface GalaxyCoreProps {
  onClick?: () => void;
  isSelected?: boolean;
}

export default function GalaxyCore({ onClick, isSelected }: GalaxyCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const diskRef = useRef<THREE.Mesh>(null);

  // Animate the accretion disk and glow
  useFrame((_, delta) => {
    if (diskRef.current) {
      diskRef.current.rotation.z += delta * 0.3;
    }
    if (glowRef.current) {
      // Pulsing glow effect
      const scale = 1 + Math.sin(Date.now() * 0.002) * 0.05;
      glowRef.current.scale.setScalar(scale);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <group ref={groupRef} onClick={handleClick}>
      {/* Black hole center */}
      <mesh>
        <sphereGeometry args={[GALAXY_CONFIG.coreRadius * 0.3, 32, 32]} />
        <meshBasicMaterial color={0x000000} />
      </mesh>

      {/* Inner hot glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[GALAXY_CONFIG.coreRadius * 0.5, 32, 32]} />
        <meshBasicMaterial
          color={0xffaa00}
          transparent
          opacity={0.6}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[GALAXY_CONFIG.coreRadius * 0.8, 32, 32]} />
        <meshBasicMaterial
          color={0xff6600}
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Accretion disk */}
      <mesh ref={diskRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[GALAXY_CONFIG.coreRadius * 0.4, GALAXY_CONFIG.coreRadius * 1.2, 64]} />
        <meshBasicMaterial
          color={0xffcc44}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Selection indicator */}
      {isSelected && (
        <mesh>
          <sphereGeometry args={[GALAXY_CONFIG.coreRadius * 1.5, 32, 32]} />
          <meshBasicMaterial
            color={0x00ff00}
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Point light from core */}
      <pointLight
        color={0xffaa44}
        intensity={3}
        distance={300}
        decay={0.5}
      />
    </group>
  );
}
