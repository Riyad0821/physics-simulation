'use client';

import { useRef, Suspense } from 'react';
import { useFrame, useLoader, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetConfig } from './planetData';
import Moon from './Moon';

interface PlanetProps {
  config: PlanetConfig;
  onClick?: (planet: PlanetConfig) => void;
  isSelected?: boolean;
  animationSpeed?: number;
}

// Saturn's rings component
function SaturnRings({ texture, planetRadius }: { texture: string; planetRadius: number }) {
  const ringTexture = useLoader(THREE.TextureLoader, texture);
  
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[planetRadius * 1.3, planetRadius * 2.2, 64]} />
      <meshBasicMaterial
        map={ringTexture}
        side={THREE.DoubleSide}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

export default function Planet({ config, onClick, isSelected, animationSpeed = 1 }: PlanetProps) {
  const orbitRef = useRef<THREE.Group>(null);
  const planetGroupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load planet texture
  const texture = useLoader(THREE.TextureLoader, config.texture);

  // Animation for orbit and rotation
  useFrame((_, delta) => {
    // Orbital revolution around the sun
    if (orbitRef.current) {
      orbitRef.current.rotation.y += config.orbitSpeed * delta * 0.1 * animationSpeed;
    }
    
    // Planetary rotation on its axis
    if (meshRef.current) {
      meshRef.current.rotation.y += config.rotationSpeed * delta * 0.5 * animationSpeed;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (onClick) {
      onClick(config);
    }
  };

  return (
    <group ref={orbitRef}>
      {/* Planet group positioned at orbital distance */}
      <group ref={planetGroupRef} position={[config.distance, 0, 0]}>
        {/* Apply axial tilt to the planet system */}
        <group rotation={[0, 0, config.tilt || 0]}>
          {/* Planet mesh */}
          <mesh
            ref={meshRef}
            onClick={handleClick}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default';
            }}
          >
            <sphereGeometry args={[config.radius, 64, 64]} />
            <meshStandardMaterial
              map={texture}
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
          
          {/* Selection indicator */}
          {isSelected && (
            <mesh>
              <sphereGeometry args={[config.radius * 1.15, 32, 32]} />
              <meshBasicMaterial
                color={0x00ffff}
                transparent
                opacity={0.2}
                side={THREE.BackSide}
              />
            </mesh>
          )}
          
          {/* Saturn's rings */}
          {config.hasRings && config.ringTexture && (
            <Suspense fallback={null}>
              <SaturnRings texture={config.ringTexture} planetRadius={config.radius} />
            </Suspense>
          )}
          
          {/* Moons */}
          {config.moons?.map((moon) => (
            <Suspense key={moon.name} fallback={null}>
              <Moon config={moon} />
            </Suspense>
          ))}
        </group>
      </group>
    </group>
  );
}
