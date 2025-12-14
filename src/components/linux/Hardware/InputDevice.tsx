'use client';

import { useRef } from 'react';
import { useLinuxStore } from '@/stores/linuxStore';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export function InputDevice({ position }: { position: [number, number, number] }) {
  const setActiveComponent = useLinuxStore((state) => state.setActiveComponent);
  const busActive = useLinuxStore((state) => state.busActive);
  const isTransmitting = busActive?.from === 'INPUT' && busActive?.active;

  return (
    <group 
      position={position}
      onPointerOver={() => setActiveComponent('INPUT')}
      onPointerOut={() => setActiveComponent(null)}
    >
      {/* Keyboard Base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 0.2, 2]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Keys (Simplified) */}
      <group position={[-1.5, 0.15, -0.5]}>
        {Array.from({ length: 12 }).map((_, i) => (
           <mesh key={i} position={[(i % 4) * 1, 0, Math.floor(i / 4) * 0.6]}>
             <boxGeometry args={[0.8, 0.1, 0.5]} />
             <meshStandardMaterial color={isTransmitting ? "#00ff00" : "#555"} emissive={isTransmitting ? "#00ff00" : "#000"} emissiveIntensity={0.5} />
           </mesh>
        ))}
      </group>

      <Text position={[0, 0.5, 0]} fontSize={0.3} color="white" rotation={[-Math.PI / 2, 0, 0]}>
        INPUT (KB)
      </Text>
    </group>
  );
}
