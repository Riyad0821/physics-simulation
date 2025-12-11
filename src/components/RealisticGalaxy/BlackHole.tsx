'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BlackHoleProps {
  radius?: number;
  accretionDiskRadius?: number;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function BlackHole({
  radius = 5,
  accretionDiskRadius = 25,
  onClick,
  isSelected,
}: BlackHoleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const diskRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const innerDiskRef = useRef<THREE.Mesh>(null);

  // Create accretion disk material
  const diskMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uInnerColor: { value: new THREE.Color(0xffffff) },
        uMidColor: { value: new THREE.Color(0xffaa00) },
        uOuterColor: { value: new THREE.Color(0xff4400) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vRadius;
        void main() {
          vUv = uv;
          vRadius = length(position.xz) / ${accretionDiskRadius.toFixed(1)};
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uInnerColor;
        uniform vec3 uMidColor;
        uniform vec3 uOuterColor;
        varying vec2 vUv;
        varying float vRadius;

        void main() {
          // Radial color gradient
          vec3 color;
          if (vRadius < 0.3) {
            color = mix(uInnerColor, uMidColor, vRadius / 0.3);
          } else {
            color = mix(uMidColor, uOuterColor, (vRadius - 0.3) / 0.7);
          }
          
          // Rotating spiral pattern
          float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
          float spiral = sin(angle * 8.0 - uTime * 3.0 + vRadius * 20.0) * 0.3 + 0.7;
          
          // Brightness variation
          float brightness = spiral * (1.0 - vRadius * 0.5);
          
          // Inner edge glow
          float innerGlow = smoothstep(0.15, 0.25, vRadius);
          
          // Outer edge fade
          float outerFade = 1.0 - smoothstep(0.8, 1.0, vRadius);
          
          float alpha = innerGlow * outerFade * brightness;
          
          gl_FragColor = vec4(color * brightness * 1.5, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, [accretionDiskRadius]);

  // Animation
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (diskMaterial.uniforms) {
      diskMaterial.uniforms.uTime.value = time;
    }

    // Rotate disk
    if (diskRef.current) {
      diskRef.current.rotation.z = time * 0.5;
    }

    // Inner disk rotates faster
    if (innerDiskRef.current) {
      innerDiskRef.current.rotation.z = time * 1.5;
    }

    // Pulsing glow
    if (glowRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.05;
      glowRef.current.scale.setScalar(scale);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <group ref={groupRef} onClick={handleClick}>
      {/* Event horizon - pure black sphere */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial color={0x000000} />
      </mesh>

      {/* Photon sphere glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.5, 32, 32]} />
        <meshBasicMaterial
          color={0xff6600}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Inner accretion disk (hotter, faster) */}
      <mesh
        ref={innerDiskRef}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <ringGeometry args={[radius * 1.2, radius * 2.5, 128, 1]} />
        <meshBasicMaterial
          color={0xffffcc}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Main accretion disk */}
      <mesh
        ref={diskRef}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <ringGeometry args={[radius * 2, accretionDiskRadius, 128, 8]} />
        <primitive object={diskMaterial} attach="material" />
      </mesh>

      {/* Selection indicator */}
      {isSelected && (
        <mesh>
          <sphereGeometry args={[accretionDiskRadius * 1.2, 32, 32]} />
          <meshBasicMaterial
            color={0x00ff00}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Point light at center */}
      <pointLight
        color={0xffaa44}
        intensity={5}
        distance={100}
        decay={1}
      />
    </group>
  );
}
