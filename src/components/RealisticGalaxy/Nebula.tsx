'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NebulaConfig } from './types';

interface NebulaProps {
  config: NebulaConfig;
  useVolumetric?: boolean;
  onClick?: (config: NebulaConfig) => void;
  isSelected?: boolean;
}

export default function Nebula({
  config,
  useVolumetric = false,
  onClick,
  isSelected,
}: NebulaProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mainRef = useRef<THREE.Mesh>(null);
  const layersRef = useRef<THREE.Group>(null);

  // Generate nebula layers for billboard approach
  const layers = useMemo(() => {
    const layerData = [];
    const layerCount = 5;
    
    for (let i = 0; i < layerCount; i++) {
      const t = i / (layerCount - 1);
      layerData.push({
        scale: 0.6 + t * 0.8,
        opacity: config.density * (0.3 - t * 0.2),
        offset: new THREE.Vector3(
          (Math.random() - 0.5) * config.radius * 0.3,
          (Math.random() - 0.5) * config.radius * 0.3,
          (Math.random() - 0.5) * config.radius * 0.3
        ),
        rotation: Math.random() * Math.PI * 2,
      });
    }
    return layerData;
  }, [config]);

  // Animation
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Slow drift and rotation
    if (groupRef.current) {
      groupRef.current.position.x = config.position.x + Math.sin(time * 0.05) * 2;
      groupRef.current.position.y = config.position.y + Math.cos(time * 0.03) * 1;
    }

    // Rotate layers slowly
    if (layersRef.current) {
      layersRef.current.children.forEach((child, i) => {
        child.rotation.z = time * 0.02 * (i % 2 === 0 ? 1 : -1);
      });
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick?.(config);
  };

  // Base color variations
  const colorVariants = useMemo(() => {
    return layers.map((_, i) => {
      const hsl = { h: 0, s: 0, l: 0 };
      config.color.getHSL(hsl);
      hsl.h += (i - 2) * 0.02;
      hsl.s = Math.min(1, hsl.s * (0.8 + i * 0.1));
      return new THREE.Color().setHSL(hsl.h, hsl.s, hsl.l);
    });
  }, [config.color, layers]);

  return (
    <group ref={groupRef} position={config.position} onClick={handleClick}>
      {/* Layered billboard approach */}
      <group ref={layersRef}>
        {layers.map((layer, i) => (
          <mesh
            key={i}
            position={layer.offset}
            scale={config.radius * layer.scale}
            rotation={[0, 0, layer.rotation]}
          >
            <planeGeometry args={[2, 2, 1, 1]} />
            <meshBasicMaterial
              color={colorVariants[i]}
              transparent
              opacity={layer.opacity}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Core glow */}
      <mesh ref={mainRef}>
        <sphereGeometry args={[config.radius * 0.3, 16, 16]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={config.density * 0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer halo */}
      <mesh>
        <sphereGeometry args={[config.radius * 1.2, 16, 16]} />
        <meshBasicMaterial
          color={config.color}
          transparent
          opacity={config.density * 0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Selection indicator */}
      {isSelected && (
        <mesh>
          <sphereGeometry args={[config.radius * 1.5, 16, 16]} />
          <meshBasicMaterial
            color={0x00ff00}
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
}
