'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { SUN_CONFIG } from './planetData';

export default function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load sun texture
  const texture = useLoader(THREE.TextureLoader, SUN_CONFIG.texture);
  
  // Create emissive material for the sun
  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: texture,
      color: new THREE.Color(0xffff80),
    });
  }, [texture]);

  // Slow rotation animation
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += SUN_CONFIG.rotationSpeed * delta;
    }
  });

  return (
    <group>
      {/* Sun mesh */}
      <mesh ref={meshRef} material={material}>
        <sphereGeometry args={[SUN_CONFIG.radius, 64, 64]} />
      </mesh>
      
      {/* Sun glow effect - larger transparent sphere */}
      <mesh>
        <sphereGeometry args={[SUN_CONFIG.radius * 1.2, 32, 32]} />
        <meshBasicMaterial
          color={0xffaa00}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Point light from the sun */}
      <pointLight
        color={0xffffff}
        intensity={2}
        distance={200}
        decay={0.5}
      />
      
      {/* Ambient light for general illumination */}
      <ambientLight intensity={0.1} />
    </group>
  );
}
