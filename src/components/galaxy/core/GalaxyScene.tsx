'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

import { RadeonOptimizedRenderer } from '@/components/galaxy/rendering/RadeonOptimizedRenderer';
import { GALAXY_CONFIG } from '@/config/galaxy.config';
import { useGalaxyStore } from '@/stores/galaxyStore';
import { useUIStore } from '@/stores/uiStore';
import UIOverlay from '../ui/UIOverlay';
import { StarSystemManager } from '../systems/StarSystemManager';

// Placeholder for StarSystemManager (will be implemented next)
const StarSystemPlaceholder = () => {
    return (
        <mesh>
            <sphereGeometry args={[100, 16, 16]} />
            <meshBasicMaterial color="hotpink" wireframe />
        </mesh>
    );
};

const GalaxySceneContent = () => {
  const { camera, gl, scene } = useThree();
  const init = useGalaxyStore((state) => state.isInitialized);
  const setInit = useGalaxyStore((state) => state.setInitialized);
  
  // Radeon Optimization: Initial Setup
  useEffect(() => {
    if (!init) {
        camera.position.set(
            GALAXY_CONFIG.rendering.camera.initialPos[0],
            GALAXY_CONFIG.rendering.camera.initialPos[1],
            GALAXY_CONFIG.rendering.camera.initialPos[2]
        );
        camera.lookAt(0, 0, 0);
        setInit(true);
    }
  }, [camera, init, setInit]);

  // Initialize Star System
  const starSystemRef = useRef<StarSystemManager | null>(null);

  useEffect(() => {
    if (!starSystemRef.current) {
        const manager = new StarSystemManager(scene);
        manager.generateGalaxy();
        starSystemRef.current = manager;
    }
    
    // Cleanup
    return () => {
        if (starSystemRef.current) {
            starSystemRef.current.dispose();
            starSystemRef.current = null;
        }
    };
  }, [scene]);

  useFrame((state, delta) => {
    if (starSystemRef.current) {
        starSystemRef.current.update(delta, state.clock.elapsedTime);
    }
  });

  return (
    <>
        <color attach="background" args={['#050510']} />
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#ffaa55" />
        
        {/* Star system is managed by the Manager directly manipulating the scene */}
        
        <OrbitControls 
            enablePan={true}
            enableZoom={true}
            maxDistance={GALAXY_CONFIG.rendering.camera.far}
            minDistance={100}
        />
        
        {/* Post Processing Stack - Radeon Optimized (Disabled heavy effects) */}
        <EffectComposer enableNormalPass={false}>
            <Bloom 
                intensity={1.5} 
                luminanceThreshold={0.9} 
                luminanceSmoothing={0.025} 
                blendFunction={BlendFunction.SCREEN} 
            />
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
    </>
  );
};

export default function GalaxyScene() {
  const showStats = useUIStore((state) => state.showStats);

  return (
    <div className="w-full h-screen relative bg-black">
      <Canvas
        gl={{
            powerPreference: 'high-performance',
            failIfMajorPerformanceCaveat: false,
            antialias: false, // FXAA used later
            alpha: false,
            stencil: false,
            depth: true
        }}
        camera={{ 
            fov: GALAXY_CONFIG.rendering.camera.fov, 
            near: GALAXY_CONFIG.rendering.camera.near, 
            far: GALAXY_CONFIG.rendering.camera.far 
        }}
        dpr={[1, 2]} // Cap at 2 for performance
      >
        <GalaxySceneContent />
        {showStats && <Stats />}
      </Canvas>
      
      <UIOverlay />

    </div>
  );
}
