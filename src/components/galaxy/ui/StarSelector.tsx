'use client';

import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGalaxyStore } from '@/stores/galaxyStore';
import { useRef } from 'react';

/**
 * Handles raycasting to identify stars managed by StarSystemManager
 * Since StarSystemManager uses raw THREE.Points, we need manual raycasting here.
 */
export function StarSelector() {
  const { camera, scene, raycaster, pointer } = useThree();
  const setSelectedStar = useGalaxyStore((state) => state.setSelectedStar);
  const lastCheckTime = useRef(0);
  
  // Throttle raycasting to every 100ms or so for performance
  useFrame((state) => {
    if (state.clock.elapsedTime - lastCheckTime.current < 0.1) return;
    lastCheckTime.current = state.clock.elapsedTime;

    // Update raycaster
    raycaster.setFromCamera(pointer, camera);
    raycaster.params.Points.threshold = 50; // High threshold for easy picking of sprites

    // Find the points object in the scene
    let pointsObject: THREE.Points | null = null;
    scene.traverse((child) => {
        if (child.type === 'Points') {
            pointsObject = child as THREE.Points;
        }
    });

    if (pointsObject) {
        const intersects = raycaster.intersectObject(pointsObject, false);
        
        if (intersects.length > 0) {
            // Found a star
            const index = intersects[0].index;
            const dist = intersects[0].distanceToRay; // Not distance from camera, but from ray center

            // Mockup data for now (since we don't store per-star data in JS memory easily accessible here without a map)
            // Ideally StarSystemManager would expose a data array.
            // Using random consistent data based on index for "realism" illusion
            if (index !== undefined) {
                 const temp = 3000 + (index % 100) * 100;
                 const typeMap = ['M-Type Red Dwarf', 'K-Type Orange Giant', 'G-Type Main Seq', 'F-Type White', 'A-Type Blue', 'B-Type Blue Giant', 'O-Type Supergiant'];
                 const type = typeMap[index % typeMap.length];
                 
                 setSelectedStar({
                    type,
                    temp,
                    distance: Math.round(intersects[0].point.distanceTo(new THREE.Vector3(0,0,0)))
                 });
                 return;
            }
        }
    }
    
    // Clear selection if nothing found? Or keep last selected?
    // Let's keep last selected to avoiding flickering, or clear if clicking empty space.
    // For hover, maybe clearing is okay.
    // setSelectedStar(null); 
  });

  return null;
}
