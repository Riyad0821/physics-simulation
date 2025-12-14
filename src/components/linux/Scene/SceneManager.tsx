'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CPU } from '../Hardware/CPU';
import { Memory } from '../Hardware/Memory';
import { Storage } from '../Hardware/Storage';

export function SceneManager() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Global animations can go here
  });

  return (
    <group ref={groupRef}>
      {/* Motherboard Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
      </mesh>
      
      <gridHelper args={[30, 30, 0x111111, 0x111111]} position={[0, -0.49, 0]} />

      {/* Hardware Components */}
      <CPU position={[0, 0.2, 0]} />
      <Memory position={[6, 0.2, 0]} />
      <Storage position={[-6, 0.2, 0]} />
    </group>
  );
}
