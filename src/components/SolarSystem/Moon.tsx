'use client';

import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { MoonConfig } from './planetData';

interface MoonProps {
  config: MoonConfig;
  parentPosition?: THREE.Vector3;
}

export default function Moon({ config }: MoonProps) {
  const orbitRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load moon texture
  const texture = useLoader(THREE.TextureLoader, config.texture);

  // Animation for orbit and rotation
  useFrame((_, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += config.orbitSpeed * delta * 0.5;
    }
    if (meshRef.current) {
      // Tidally locked - same face always towards planet
      meshRef.current.rotation.y += config.orbitSpeed * delta * 0.5;
    }
  });

  return (
    <group ref={orbitRef}>
      <mesh ref={meshRef} position={[config.distance, 0, 0]}>
        <sphereGeometry args={[config.radius, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}
