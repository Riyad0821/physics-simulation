'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

interface StarfieldProps {
  count?: number;
  radius?: number;
}

export default function Starfield({ count = 5000, radius = 500 }: StarfieldProps) {
  // Generate star positions
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Random position on sphere
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
      
      // Slight color variation (white to slightly blue/yellow)
      const colorVariation = 0.8 + Math.random() * 0.2;
      const blueShift = Math.random() > 0.7 ? 0.1 : 0;
      
      colors[i * 3] = colorVariation - blueShift * 0.3;     // R
      colors[i * 3 + 1] = colorVariation - blueShift * 0.1; // G
      colors[i * 3 + 2] = colorVariation + blueShift;       // B
    }
    
    return { positions: pos, colors };
  }, [count, radius]);

  // Generate star sizes
  const sizes = useMemo(() => {
    const sizeArray = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Most stars are small, few are large
      sizeArray[i] = Math.random() > 0.95 ? 2 + Math.random() * 2 : 0.5 + Math.random() * 1.5;
    }
    
    return sizeArray;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[positions.colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.5}
        sizeAttenuation
        transparent
        opacity={0.9}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
