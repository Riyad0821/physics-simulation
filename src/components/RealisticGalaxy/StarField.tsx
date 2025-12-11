'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { starVertexShader } from '../../shaders/star.vert';
import { starFragmentShader } from '../../shaders/star.frag';
import { StarData, GalaxyParams, QUALITY_PRESETS } from './types';
import {
  generateBulge,
  generateSpiralArms,
  generateHalo,
  generateStarClusters,
  mergeStarData,
} from './GalaxyGenerator';

interface StarFieldProps {
  quality: 'low' | 'medium' | 'high';
  showArms: boolean;
  showHalo: boolean;
  showClusters: boolean;
  rotationSpeed: number;
}

export default function StarField({
  quality,
  showArms,
  showHalo,
  showClusters,
  rotationSpeed,
}: StarFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const params = QUALITY_PRESETS[quality];

  // Generate star data
  const starData = useMemo(() => {
    console.log(`Generating stars for quality: ${quality}`);
    const startTime = performance.now();

    const bulge = generateBulge(params);
    const dataSets: StarData[] = [bulge];

    if (showArms) {
      dataSets.push(generateSpiralArms(params));
    }
    if (showHalo) {
      dataSets.push(generateHalo(params));
    }
    if (showClusters) {
      dataSets.push(generateStarClusters(params));
    }

    const merged = mergeStarData(...dataSets);
    const endTime = performance.now();
    console.log(`Generated ${merged.positions.length / 3} stars in ${(endTime - startTime).toFixed(0)}ms`);

    return merged;
  }, [quality, showArms, showHalo, showClusters, params]);

  // Create geometry with instanced attributes
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    
    geo.setAttribute('position', new THREE.BufferAttribute(starData.positions, 3));
    geo.setAttribute('instanceColor', new THREE.BufferAttribute(starData.colors, 3));
    geo.setAttribute('instanceSize', new THREE.BufferAttribute(starData.sizes, 1));
    geo.setAttribute('instanceFlicker', new THREE.BufferAttribute(starData.flickers, 1));

    return geo;
  }, [starData]);

  // Create shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: starVertexShader,
      fragmentShader: starFragmentShader,
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  // Animation loop
  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    // Keplerian rotation - inner stars rotate faster
    if (pointsRef.current && rotationSpeed > 0) {
      pointsRef.current.rotation.y += delta * rotationSpeed * 0.1;
    }
  });

  // Cleanup
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <primitive object={material} ref={materialRef} attach="material" />
    </points>
  );
}
