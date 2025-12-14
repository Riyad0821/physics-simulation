'use client';

import { useLinuxStore } from '@/stores/linuxStore';
import { useRef } from 'react';
import { Text } from '@react-three/drei';

export function Memory({ position }: { position: [number, number, number] }) {
  const setActiveComponent = useLinuxStore((state) => state.setActiveComponent);

  // Create 4 DIMM slots
  const dimms = [0, 1, 2, 3];

  return (
    <group 
      position={position}
      onPointerOver={() => setActiveComponent('RAM')}
      onPointerOut={() => setActiveComponent(null)}
    >
      {/* Base Slot Area */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[2, 0.2, 5]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      {/* DIMM Sticks */}
      {dimms.map((i) => (
        <group key={i} position={[(i - 1.5) * 0.4, 0.5, 0]}>
            {/* PCB */}
            <mesh>
                <boxGeometry args={[0.05, 1, 4.5]} />
                <meshStandardMaterial color="#005500" />
            </mesh>
            {/* Chips */}
            {[-1.5, -0.5, 0.5, 1.5].map((z, j) => (
                <mesh key={j} position={[0.04, 0, z]}>
                    <boxGeometry args={[0.02, 0.6, 0.8]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
            ))}
        </group>
      ))}
      
      <Text position={[0, 1.2, 2.5]} fontSize={0.3} color="white">
        DDR4 RAM
      </Text>
    </group>
  );
}
