'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

interface OrbitLineProps {
  distance: number;
  color?: string;
  opacity?: number;
}

export default function OrbitLine({ 
  distance, 
  color = '#ffffff', 
  opacity = 0.15 
}: OrbitLineProps) {
  const points = useMemo(() => {
    const segments = 128;
    const pts: THREE.Vector3[] = [];
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
      ));
    }
    
    return pts;
  }, [distance]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        linewidth={1}
      />
    </line>
  );
}
