'use client';

import { useLinuxStore } from '@/stores/linuxStore';
import { useRef } from 'react';
import React from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export function Memory({ position }: { position: [number, number, number] }) {
  const setActiveComponent = useLinuxStore((state) => state.setActiveComponent);
  const memory = useLinuxStore((state) => state.memory);
  const mar = useLinuxStore((state) => state.registers.MAR);
  
  // Visualize first 64 bytes (8x8 grid)
  const gridSize = 8;
  const cells = [];

  for (let i = 0; i < gridSize * gridSize; i++) {
      const x = (i % gridSize) * 0.5 - 1.75;
      const z = Math.floor(i / gridSize) * 0.5 - 1.75;
      
      cells.push(
        <MemoryCell 
            key={i} 
            index={i} 
            position={[x, 0.15, z]} 
            isAccessed={mar === i} 
            value={memory[i] || 0} 
        />
      );
  }
  
  return (
    <group 
      position={position}
      onPointerOver={() => setActiveComponent('MEMORY')}
      onPointerOut={() => setActiveComponent(null)}
    >
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[4.5, 0.2, 4.5]} />
        <meshStandardMaterial color="#002200" />
      </mesh>

      {cells}
      
      <Text position={[0, 1.2, 2.5]} fontSize={0.3} color="white">
        RAM (First 64 Bytes)
      </Text>
    </group>
  );
}

const MemoryCell = React.memo(function MemoryCell({ index, position, isAccessed, value }: { index: number, position: number[], isAccessed: boolean, value: number }) {
    return (
        <group position={[position[0], position[1], position[2]]}>
            <mesh>
                <boxGeometry args={[0.4, 0.1, 0.4]} />
                <meshStandardMaterial 
                color={isAccessed ? '#ffff00' : '#004400'} 
                emissive={isAccessed ? '#ffff00' : '#000000'}
                emissiveIntensity={0.5}
                />
            </mesh>
            <Text 
                position={[0, 0.06, 0]} 
                rotation={[-Math.PI/2, 0, 0]} 
                fontSize={0.15} 
                color={isAccessed ? 'black' : '#88ff88'}
            >
                {value}
            </Text>
        </group>
    );
});
