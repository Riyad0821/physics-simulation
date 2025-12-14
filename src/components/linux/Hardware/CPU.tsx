'use client';

import { useLinuxStore } from '@/stores/linuxStore';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

export function CPU({ position }: { position: [number, number, number] }) {
  const setActiveComponent = useLinuxStore((state) => state.setActiveComponent);
  const meshRef = useRef<THREE.Group>(null);

  // Simple animation or heat pulse
  useFrame((state) => {
    if (meshRef.current) {
        // meshRef.current.rotation.y += 0.005; 
    }
  });

  return (
    <group 
      ref={meshRef} 
      position={position}
      onPointerOver={() => setActiveComponent('CPU')}
      onPointerOut={() => setActiveComponent(null)}
    >
      {/* CPU Socket / Substrate */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[4.2, 0.2, 4.2]} />
        <meshStandardMaterial color="#004400" roughness={0.5} />
      </mesh>

      {/* Heat Spreader (IHS) */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[3.8, 0.2, 3.8]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Label */}
      <Text position={[0, 0.21, 1.5]} fontSize={0.3} color="black" rotation={[-Math.PI / 2, 0, 0]}>
        INTEL CORE
      </Text>
      
      {/* Cores (Visualized underneath if we made IHS transparent, or separate block) */}
      {/* For now, just graphical blocks representing "logical cores" floating above for visualization */}
       <group position={[0, 0.5, 0]}>
         {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map((pos, i) => (
            <mesh key={i} position={[pos[0], 0, pos[1]]}>
                <boxGeometry args={[0.8, 0.1, 0.8]} />
                <meshStandardMaterial color="#ff5500" emissive="#ff2200" emissiveIntensity={0.5} />
            </mesh>
         ))}
       </group>

    </group>
  );
}
