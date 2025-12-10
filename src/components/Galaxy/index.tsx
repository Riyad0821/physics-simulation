'use client';

import { Suspense, useState, useRef, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import GalaxyCore from './GalaxyCore';
import SpiralArms from './SpiralArms';
import StarCluster from './StarCluster';
import GalaxyBackground from './GalaxyBackground';
import InfoPanel from './InfoPanel';
import { NOTABLE_OBJECTS, StarClusterConfig, GALAXY_CONFIG } from './galaxyData';
import Navbar from '../Navbar';

// Focus target type
interface FocusTarget {
  name: string;
  position: THREE.Vector3;
}

// Camera controller for smooth focus transitions
function CameraController({ 
  focusTarget,
  controlsRef 
}: { 
  focusTarget: FocusTarget | null;
  controlsRef: React.RefObject<any>;
}) {
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
  const isAnimating = useRef(false);
  
  React.useEffect(() => {
    if (focusTarget) {
      targetPosition.current.copy(focusTarget.position);
      isAnimating.current = true;
    }
  }, [focusTarget]);
  
  useFrame(() => {
    if (isAnimating.current && controlsRef.current) {
      const controls = controlsRef.current;
      const currentTarget = controls.target as THREE.Vector3;
      
      currentTarget.lerp(targetPosition.current, 0.08);
      
      if (currentTarget.distanceTo(targetPosition.current) < 0.01) {
        isAnimating.current = false;
        currentTarget.copy(targetPosition.current);
      }
      
      controls.update();
    }
  });
  
  return null;
}

// Need to import React for useEffect
import React from 'react';

// Loading fallback
function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color={0x333333} wireframe />
    </mesh>
  );
}

// Scene content
function SceneContent({ 
  onCoreClick,
  onClusterClick,
  selectedObject,
  showSpiralArms,
  animationSpeed 
}: { 
  onCoreClick: () => void;
  onClusterClick: (cluster: StarClusterConfig) => void;
  selectedObject: StarClusterConfig | 'core' | null;
  showSpiralArms: boolean;
  animationSpeed: number;
}) {
  return (
    <>
      {/* Background stars */}
      <GalaxyBackground count={5000} radius={800} />
      
      {/* Galaxy core */}
      <Suspense fallback={<LoadingFallback />}>
        <GalaxyCore 
          onClick={onCoreClick}
          isSelected={selectedObject === 'core'}
        />
      </Suspense>
      
      {/* Spiral arms */}
      <Suspense fallback={<LoadingFallback />}>
        <SpiralArms 
          animationSpeed={animationSpeed}
          showArms={showSpiralArms}
        />
      </Suspense>
      
      {/* Notable objects (nebulae, clusters) */}
      {NOTABLE_OBJECTS.map((obj) => (
        <Suspense key={obj.name} fallback={<LoadingFallback />}>
          <StarCluster
            config={obj}
            onClick={onClusterClick}
            isSelected={selectedObject !== null && selectedObject !== 'core' && selectedObject.name === obj.name}
          />
        </Suspense>
      ))}
      
      {/* Ambient light */}
      <ambientLight intensity={0.1} />
    </>
  );
}

export default function GalaxyScene() {
  const [selectedObject, setSelectedObject] = useState<StarClusterConfig | 'core' | null>(null);
  const [showSpiralArms, setShowSpiralArms] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [focusTarget, setFocusTarget] = useState<FocusTarget | null>(null);
  const controlsRef = useRef<any>(null);

  const handleCoreClick = useCallback(() => {
    setSelectedObject('core');
  }, []);

  const handleClusterClick = useCallback((cluster: StarClusterConfig) => {
    setSelectedObject(cluster);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedObject(null);
  }, []);

  const handleFocusOnCore = useCallback(() => {
    setFocusTarget({
      name: 'Core',
      position: new THREE.Vector3(0, 0, 0)
    });
  }, []);

  const handleFocusOnObject = useCallback((obj: StarClusterConfig) => {
    setFocusTarget({
      name: obj.name,
      position: new THREE.Vector3(...obj.position)
    });
  }, []);

  const handleResetView = useCallback(() => {
    setFocusTarget({
      name: 'Overview',
      position: new THREE.Vector3(0, 0, 0)
    });
    setSelectedObject(null);
  }, []);

  return (
    <div className="w-full h-screen bg-black relative">
      {/* Navbar */}
      <Navbar />

      {/* Three.js Canvas */}
      <Canvas
        camera={{ 
          position: [0, 150, 300], 
          fov: 60,
          near: 0.1,
          far: 3000
        }}
        gl={{ antialias: true, alpha: true }}
      >
        <CameraController focusTarget={focusTarget} controlsRef={controlsRef} />
        
        <SceneContent 
          onCoreClick={handleCoreClick}
          onClusterClick={handleClusterClick}
          selectedObject={selectedObject}
          showSpiralArms={showSpiralArms}
          animationSpeed={animationSpeed}
        />
        
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={800}
          enablePan={true}
          panSpeed={0.5}
          rotateSpeed={0.5}
          zoomSpeed={1.2}
        />
      </Canvas>

      {/* Controls Sidebar */}
      <div className="absolute top-14 left-0 w-72 bg-[#1a1a1a]/90 backdrop-blur-sm border-r border-white/10 max-h-[calc(100vh-56px)] overflow-y-auto">
        <div className="p-5 space-y-5">
          {/* Title */}
          <div>
            <h3 className="text-white text-sm font-medium mb-2 pb-2 border-b border-white/10">
              Galaxy Explorer
            </h3>
            <p className="text-white/50 text-xs">
              Explore the Milky Way galaxy
            </p>
          </div>

          {/* Speed Control */}
          <div>
            <label className="flex justify-between text-white/70 text-xs mb-2">
              <span>Rotation Speed</span>
              <span className="text-white/50">{animationSpeed.toFixed(1)}x</span>
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Toggle Spiral Arms */}
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-xs">Show Spiral Arms</span>
            <button
              onClick={() => setShowSpiralArms(!showSpiralArms)}
              className={`w-10 h-5 rounded-full transition-colors ${
                showSpiralArms ? 'bg-purple-500' : 'bg-white/20'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-0.5 ${
                showSpiralArms ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Focus Camera Controls */}
          <div>
            <h3 className="text-white text-sm font-medium mb-3 pb-2 border-b border-white/10">
              Focus Camera
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleFocusOnCore}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center gap-2 ${
                  focusTarget?.name === 'Core'
                    ? 'bg-orange-500/30 text-orange-300'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>⚫</span>
                <span>Focus on Core (Sagittarius A*)</span>
              </button>
              <button
                onClick={handleResetView}
                className="w-full text-left px-3 py-2 rounded-lg transition-colors text-sm text-white/60 hover:bg-white/10 hover:text-white flex items-center gap-2"
              >
                <span>🔭</span>
                <span>Reset View (Overview)</span>
              </button>
            </div>
          </div>

          {/* Notable Objects */}
          <div>
            <h3 className="text-white text-sm font-medium mb-3 pb-2 border-b border-white/10">
              Notable Objects
            </h3>
            <div className="space-y-1">
              {NOTABLE_OBJECTS.map((obj) => (
                <div
                  key={obj.name}
                  className={`w-full flex items-center gap-1 rounded-lg transition-colors ${
                    selectedObject !== null && selectedObject !== 'core' && selectedObject.name === obj.name
                      ? 'bg-purple-500/30'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <button
                    onClick={() => setSelectedObject(obj)}
                    className={`flex-1 text-left px-3 py-2 text-sm ${
                      selectedObject !== null && selectedObject !== 'core' && selectedObject.name === obj.name
                        ? 'text-purple-300'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <span className="mr-2">{obj.type === 'nebula' ? '🌫️' : '✨'}</span>
                    {obj.name}
                  </button>
                  <button
                    onClick={() => handleFocusOnObject(obj)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      focusTarget?.name === obj.name
                        ? 'bg-green-500/30 text-green-300'
                        : 'text-white/40 hover:text-green-400 hover:bg-green-500/20'
                    }`}
                    title={`Focus camera on ${obj.name}`}
                  >
                    🎯
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Controls Help */}
          <div>
            <h3 className="text-white text-sm font-medium mb-3 pb-2 border-b border-white/10">
              Controls
            </h3>
            <div className="text-white/50 text-xs space-y-1.5">
              <p>• Left-click + drag to rotate</p>
              <p>• Right-click + drag to pan</p>
              <p>• Scroll to zoom in/out</p>
              <p>• Click objects for details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <InfoPanel selectedObject={selectedObject} onClose={handleClosePanel} />

      {/* Custom slider styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          border: 2px solid white;
        }
        .slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
}
