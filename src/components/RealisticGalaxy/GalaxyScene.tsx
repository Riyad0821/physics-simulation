'use client';

import { Suspense, useState, useRef, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import StarField from './StarField';
import BlackHole from './BlackHole';
import Nebula from './Nebula';
import UIOverlay from './UIOverlay';
import { GalaxyControlsManager } from './GalaxyControls';
import {
  GalaxyState,
  QualityLevel,
  QUALITY_PRESETS,
  CAMERA_PRESETS,
  DEFAULT_NEBULAE,
  NebulaConfig,
} from './types';
import Navbar from '../Navbar';

// Loading fallback
function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[2, 16, 16]} />
      <meshBasicMaterial color={0x333333} wireframe />
    </mesh>
  );
}

// Background stars (distant)
function BackgroundStars() {
  const starsRef = useRef<THREE.Points>(null);

  const { positions, colors } = React.useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 600 + Math.random() * 400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const brightness = 0.3 + Math.random() * 0.7;
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness;
      colors[i * 3 + 2] = brightness + Math.random() * 0.1;
    }

    return { positions, colors };
  }, []);

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1}
        sizeAttenuation
        transparent
        opacity={0.6}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Camera controller for smooth transitions
function CameraController({
  controlsRef,
  presetTrigger,
  resetTrigger,
}: {
  controlsRef: React.RefObject<any>;
  presetTrigger: { index: number; time: number } | null;
  resetTrigger: number;
}) {
  const { camera } = useThree();
  const managerRef = useRef<GalaxyControlsManager | null>(null);

  useEffect(() => {
    managerRef.current = new GalaxyControlsManager(camera as THREE.PerspectiveCamera);
  }, [camera]);

  useEffect(() => {
    if (controlsRef.current && managerRef.current) {
      managerRef.current.setControls(controlsRef.current);
    }
  }, [controlsRef]);

  useEffect(() => {
    if (presetTrigger && managerRef.current) {
      managerRef.current.goToPreset(presetTrigger.index);
    }
  }, [presetTrigger]);

  useEffect(() => {
    if (resetTrigger > 0 && managerRef.current) {
      managerRef.current.resetView();
    }
  }, [resetTrigger]);

  useFrame((_, delta) => {
    managerRef.current?.update(delta);
  });

  return null;
}

// Need React for useMemo
import React from 'react';

// Scene content
function SceneContent({
  state,
  onBlackHoleClick,
  onNebulaClick,
  controlsRef,
  presetTrigger,
  resetTrigger,
}: {
  state: GalaxyState;
  onBlackHoleClick: () => void;
  onNebulaClick: (nebula: NebulaConfig) => void;
  controlsRef: React.RefObject<any>;
  presetTrigger: { index: number; time: number } | null;
  resetTrigger: number;
}) {
  return (
    <>
      {/* Camera controller */}
      <CameraController
        controlsRef={controlsRef}
        presetTrigger={presetTrigger}
        resetTrigger={resetTrigger}
      />

      {/* Background stars */}
      <BackgroundStars />

      {/* Central black hole */}
      <Suspense fallback={<LoadingFallback />}>
        <BlackHole
          radius={5}
          accretionDiskRadius={25}
          onClick={onBlackHoleClick}
        />
      </Suspense>

      {/* Star field */}
      <Suspense fallback={<LoadingFallback />}>
        <StarField
          quality={state.quality}
          showArms={state.showArms}
          showHalo={state.showHalo}
          showClusters={state.showClusters}
          rotationSpeed={state.rotationSpeed}
        />
      </Suspense>

      {/* Nebulae */}
      {state.showNebulae &&
        DEFAULT_NEBULAE.map((nebula, i) => (
          <Suspense key={i} fallback={null}>
            <Nebula
              config={nebula}
              useVolumetric={state.showVolumetric}
              onClick={onNebulaClick}
            />
          </Suspense>
        ))}

      {/* Ambient light */}
      <ambientLight intensity={0.05} />
    </>
  );
}

// Calculate total star count
function calculateStarCount(quality: QualityLevel, state: GalaxyState): number {
  const params = QUALITY_PRESETS[quality];
  let count = params.bulgeStars;
  if (state.showArms) count += params.armStars;
  if (state.showHalo) count += params.haloStars;
  if (state.showClusters) count += params.clusterStars;
  return count;
}

export default function RealisticGalaxyScene() {
  const controlsRef = useRef<any>(null);
  const [presetTrigger, setPresetTrigger] = useState<{ index: number; time: number } | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);

  const [state, setState] = useState<GalaxyState>({
    quality: 'medium',
    showArms: true,
    showNebulae: true,
    showClusters: true,
    showHalo: true,
    showVolumetric: false,
    rotationSpeed: 1,
    starCount: 0,
  });

  // Update star count when settings change
  useEffect(() => {
    const count = calculateStarCount(state.quality, state);
    setState((prev) => ({ ...prev, starCount: count }));
  }, [state.quality, state.showArms, state.showHalo, state.showClusters]);

  const handleStateChange = useCallback((newState: Partial<GalaxyState>) => {
    setState((prev) => ({ ...prev, ...newState }));
  }, []);

  const handleCameraPreset = useCallback((index: number) => {
    setPresetTrigger({ index, time: Date.now() });
  }, []);

  const handleResetView = useCallback(() => {
    setResetTrigger((prev) => prev + 1);
  }, []);

  const handleBlackHoleClick = useCallback(() => {
    console.log('Black hole clicked');
  }, []);

  const handleNebulaClick = useCallback((nebula: NebulaConfig) => {
    console.log('Nebula clicked:', nebula);
  }, []);

  return (
    <div className="w-full h-screen bg-black relative">
      {/* Navbar */}
      <Navbar />

      {/* Three.js Canvas */}
      <Canvas
        camera={{
          position: [150, 200, 300],
          fov: 55,
          near: 0.1,
          far: 3000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <SceneContent
          state={state}
          onBlackHoleClick={handleBlackHoleClick}
          onNebulaClick={handleNebulaClick}
          controlsRef={controlsRef}
          presetTrigger={presetTrigger}
          resetTrigger={resetTrigger}
        />

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          minDistance={10}
          maxDistance={800}
          enablePan={true}
          panSpeed={0.5}
          rotateSpeed={0.4}
          zoomSpeed={1.2}
        />
      </Canvas>

      {/* UI Overlay */}
      <UIOverlay
        state={state}
        onStateChange={handleStateChange}
        onCameraPreset={handleCameraPreset}
        onResetView={handleResetView}
      />
    </div>
  );
}
