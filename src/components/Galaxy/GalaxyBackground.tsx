'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

interface GalaxyBackgroundProps {
  count?: number;
  radius?: number;
}

export default function GalaxyBackground({ count = 4000, radius = 800 }: GalaxyBackgroundProps) {
  // Generate distant star positions
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Random position on outer sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Subtle color variation (mostly white/blue distant stars)
      const brightness = 0.5 + Math.random() * 0.5;
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness;
      colors[i * 3 + 2] = brightness + Math.random() * 0.2;

      // Random sizes
      sizes[i] = 0.3 + Math.random() * 1.0;
    }

    return { positions, colors, sizes };
  }, [count, radius]);

  return (
    <points>
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
        size={1.0}
        sizeAttenuation
        transparent
        opacity={0.7}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
