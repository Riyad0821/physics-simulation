'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { StarClusterConfig } from './galaxyData';

interface StarClusterProps {
  config: StarClusterConfig;
  onClick?: (config: StarClusterConfig) => void;
  isSelected?: boolean;
}

export default function StarCluster({ config, onClick, isSelected }: StarClusterProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Generate star positions within the cluster
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(config.starCount * 3);
    const colors = new Float32Array(config.starCount * 3);
    const sizes = new Float32Array(config.starCount);

    const color = new THREE.Color(config.color);

    for (let i = 0; i < config.starCount; i++) {
      // Random position within sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.5) * config.radius; // Denser toward center

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Color variation
      const variation = 0.8 + Math.random() * 0.4;
      colors[i * 3] = color.r * variation;
      colors[i * 3 + 1] = color.g * variation;
      colors[i * 3 + 2] = color.b * variation;

      // Random sizes
      sizes[i] = 0.5 + Math.random() * 1.5;
    }

    return { positions, colors, sizes };
  }, [config]);

  // Subtle animation for nebulae
  useFrame((_, delta) => {
    if (config.type === 'nebula' && glowRef.current) {
      const scale = 1 + Math.sin(Date.now() * 0.001) * 0.03;
      glowRef.current.scale.setScalar(scale);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick?.(config);
  };

  return (
    <group position={config.position} onClick={handleClick}>
      {/* Star particles */}
      <points ref={pointsRef}>
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
          size={1.5}
          sizeAttenuation
          transparent
          opacity={0.9}
          vertexColors
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Nebula glow effect */}
      {config.type === 'nebula' && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[config.radius * 1.2, 16, 16]} />
          <meshBasicMaterial
            color={config.color}
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <mesh>
          <sphereGeometry args={[config.radius * 1.5, 16, 16]} />
          <meshBasicMaterial
            color={0x00ff00}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
}
