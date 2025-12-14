'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { WeaponType } from '@/stores/fpsStore';
import * as THREE from 'three';

export function WeaponModel({ type, isFiring }: { type: WeaponType, isFiring?: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Make the weapon follow the camera
  useFrame((state) => {
      if (meshRef.current) {
          // Copy camera position and rotation
          meshRef.current.position.copy(camera.position);
          meshRef.current.quaternion.copy(camera.quaternion);

          // Recoil Animation Calculation
          const recoilOffset = isFiring ? 0.05 : 0; // Simple kickback
          // We could use a spring or lerp for smooth recoil here, but for now simple state switch
          
          // Apply offset (down and right) + Recoil
          meshRef.current.translateX(0.3);
          meshRef.current.translateY(-0.35); // Lowered slightly
          meshRef.current.translateZ(-0.5 + recoilOffset);
      }
  });

  return (
    <group ref={meshRef}>
        {/* === RIFLE COMPOSITE MODEL === */}
        {/* Main Body */}
        <mesh position={[0, 0, 0.1]}>
            <boxGeometry args={[0.08, 0.12, 0.4]} />
            <meshStandardMaterial color="#222" roughness={0.6} />
        </mesh>

        {/* Stock */}
        <mesh position={[0, -0.05, 0.45]}>
            <boxGeometry args={[0.06, 0.15, 0.35]} />
            <meshStandardMaterial color="#3E2723" roughness={0.8} /> {/* Dark wood/polymer */}
        </mesh>

        {/* Barrel */}
        <mesh position={[0, 0.02, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6]} />
            <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Handguard */}
        <mesh position={[0, 0, -0.25]}>
            <boxGeometry args={[0.06, 0.08, 0.3]} />
            <meshStandardMaterial color="#444" />
        </mesh>

        {/* Magazine */}
        <mesh position={[0, -0.15, 0.1]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.05, 0.25, 0.08]} />
            <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        {/* Scope/Sight */}
        <mesh position={[0, 0.08, 0.1]}>
             <cylinderGeometry args={[0.03, 0.04, 0.15]} rotation={[Math.PI / 2, 0, 0]} />
             <meshStandardMaterial color="#000" />
        </mesh>

      {/* Muzzle Flash Effect */}
      {isFiring && (
          <group position={[0, 0.02, -0.75]}>
              <pointLight color="#ffaa00" intensity={5} distance={3} decay={2} />
              {/* Simple Flash Mesh */}
              <mesh rotation={[0, 0, Math.random() * Math.PI]}>
                   <planeGeometry args={[0.3, 0.3]} />
                   <meshBasicMaterial color="#ffff00" transparent opacity={0.8} side={THREE.DoubleSide} />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                   <planeGeometry args={[0.2, 0.2]} />
                   <meshBasicMaterial color="#ff5500" transparent opacity={0.6} side={THREE.DoubleSide} />
              </mesh>
          </group>
      )}
    </group>
  );
}
