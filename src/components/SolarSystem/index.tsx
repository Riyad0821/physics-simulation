'use client';

import { Suspense, useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Sun from './Sun';
import Planet from './Planet';
import Starfield from './Starfield';
import OrbitLine from './OrbitLine';
import InfoPanel from './InfoPanel';
import { PLANET_DATA, PlanetConfig } from './planetData';
import Navbar from '../Navbar';

// Focus target type - can be Sun, a planet, or null (overview)
interface FocusTarget {
  name: string;
  position: THREE.Vector3;
  radius: number;
}

// Camera controller component for smooth focus transitions
function CameraController({ 
  focusTarget,
  controlsRef 
}: { 
  focusTarget: FocusTarget | null;
  controlsRef: React.RefObject<any>;
}) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
  const isAnimating = useRef(false);
  
  useEffect(() => {
    if (focusTarget) {
      targetPosition.current.copy(focusTarget.position);
      isAnimating.current = true;
    }
  }, [focusTarget]);
  
  useFrame(() => {
    if (isAnimating.current && controlsRef.current) {
      const controls = controlsRef.current;
      const currentTarget = controls.target as THREE.Vector3;
      
      // Smoothly interpolate target position
      currentTarget.lerp(targetPosition.current, 0.08);
      
      // Check if we're close enough to stop animating
      if (currentTarget.distanceTo(targetPosition.current) < 0.01) {
        isAnimating.current = false;
        currentTarget.copy(targetPosition.current);
      }
      
      controls.update();
    }
  });
  
  return null;
}

// Loading fallback for 3D content
function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color={0x333333} wireframe />
    </mesh>
  );
}

// Scene content component
function SceneContent({ 
  onPlanetClick, 
  selectedPlanet,
  showOrbitLines,
  animationSpeed 
}: { 
  onPlanetClick: (planet: PlanetConfig) => void;
  selectedPlanet: PlanetConfig | null;
  showOrbitLines: boolean;
  animationSpeed: number;
}) {
  return (
    <>
      {/* Starfield background */}
      <Starfield count={6000} radius={600} />
      
      {/* Sun at center */}
      <Suspense fallback={<LoadingFallback />}>
        <Sun />
      </Suspense>
      
      {/* Orbit lines for all planets */}
      {showOrbitLines && PLANET_DATA.map((planet) => (
        <OrbitLine key={`orbit-${planet.name}`} distance={planet.distance} />
      ))}
      
      {/* Planets */}
      {PLANET_DATA.map((planet) => (
        <Suspense key={planet.name} fallback={<LoadingFallback />}>
          <Planet
            config={planet}
            onClick={onPlanetClick}
            isSelected={selectedPlanet?.name === planet.name}
            animationSpeed={animationSpeed}
          />
        </Suspense>
      ))}
    </>
  );
}

export default function SolarSystemScene() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetConfig | null>(null);
  const [showOrbitLines, setShowOrbitLines] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [focusTarget, setFocusTarget] = useState<FocusTarget | null>(null);
  const controlsRef = useRef<any>(null);

  // Calculate planet position (simplified - assumes planet is at its starting position)
  const getPlanetPosition = useCallback((planet: PlanetConfig): THREE.Vector3 => {
    // For simplicity, we place the planet at its distance along the X-axis
    // In reality, planets orbit, but this gives a good initial target
    return new THREE.Vector3(planet.distance, 0, 0);
  }, []);

  const handleFocusOnPlanet = useCallback((planet: PlanetConfig) => {
    const position = getPlanetPosition(planet);
    setFocusTarget({
      name: planet.name,
      position: position,
      radius: planet.radius
    });
  }, [getPlanetPosition]);

  const handleFocusOnSun = useCallback(() => {
    setFocusTarget({
      name: 'Sun',
      position: new THREE.Vector3(0, 0, 0),
      radius: 4
    });
  }, []);

  const handleResetView = useCallback(() => {
    setFocusTarget({
      name: 'Overview',
      position: new THREE.Vector3(0, 0, 0),
      radius: 0
    });
    setSelectedPlanet(null);
  }, []);

  const handlePlanetClick = (planet: PlanetConfig) => {
    setSelectedPlanet(planet);
  };

  const handleClosePanel = () => {
    setSelectedPlanet(null);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Close panel if clicking on empty space (not on a planet)
    if ((e.target as HTMLElement).tagName === 'CANVAS') {
      // The actual planet click will be handled by the Planet component
      // This is just a fallback
    }
  };

  return (
    <div className="w-full h-screen bg-black relative" onClick={handleCanvasClick}>
      {/* Navbar */}
      <Navbar />

      {/* Three.js Canvas */}
      <Canvas
        camera={{ 
          position: [0, 60, 120], 
          fov: 45,
          near: 0.1,
          far: 2000
        }}
        gl={{ antialias: true, alpha: true }}
      >
        <CameraController focusTarget={focusTarget} controlsRef={controlsRef} />
        
        <SceneContent 
          onPlanetClick={handlePlanetClick}
          selectedPlanet={selectedPlanet}
          showOrbitLines={showOrbitLines}
          animationSpeed={animationSpeed}
        />
        
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          minDistance={0.5}
          maxDistance={500}
          enablePan={true}
          panSpeed={0.5}
          rotateSpeed={0.5}
          zoomSpeed={1.2}
        />
      </Canvas>

      {/* Controls Sidebar */}
      <div className="absolute top-14 left-0 w-72 bg-[#1a1a1a]/90 backdrop-blur-sm border-r border-white/10">
        <div className="p-5 space-y-5">
          {/* Title */}
          <div>
            <h3 className="text-white text-sm font-medium mb-2 pb-2 border-b border-white/10">
              Solar System Explorer
            </h3>
            <p className="text-white/50 text-xs">
              Click on any planet to view details
            </p>
          </div>

          {/* Speed Control */}
          <div>
            <label className="flex justify-between text-white/70 text-xs mb-2">
              <span>Animation Speed</span>
              <span className="text-white/50">{animationSpeed.toFixed(1)}x</span>
            </label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Toggle Orbit Lines */}
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-xs">Show Orbit Lines</span>
            <button
              onClick={() => setShowOrbitLines(!showOrbitLines)}
              className={`w-10 h-5 rounded-full transition-colors ${
                showOrbitLines ? 'bg-blue-500' : 'bg-white/20'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-0.5 ${
                showOrbitLines ? 'translate-x-5' : 'translate-x-0'
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
                onClick={handleFocusOnSun}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center gap-2 ${
                  focusTarget?.name === 'Sun'
                    ? 'bg-orange-500/30 text-orange-300'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>☀️</span>
                <span>Focus on Sun</span>
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

          {/* Planet List */}
          <div>
            <h3 className="text-white text-sm font-medium mb-3 pb-2 border-b border-white/10">
              Planets
            </h3>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {PLANET_DATA.map((planet) => (
                <div
                  key={planet.name}
                  className={`w-full flex items-center gap-1 rounded-lg transition-colors ${
                    selectedPlanet?.name === planet.name
                      ? 'bg-blue-500/30'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <button
                    onClick={() => setSelectedPlanet(planet)}
                    className={`flex-1 text-left px-3 py-2 text-sm ${
                      selectedPlanet?.name === planet.name
                        ? 'text-blue-300'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {planet.name}
                  </button>
                  <button
                    onClick={() => handleFocusOnPlanet(planet)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      focusTarget?.name === planet.name
                        ? 'bg-green-500/30 text-green-300'
                        : 'text-white/40 hover:text-green-400 hover:bg-green-500/20'
                    }`}
                    title={`Focus camera on ${planet.name}`}
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
              <p>• Click planet for details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Planet Info Panel */}
      <InfoPanel planet={selectedPlanet} onClose={handleClosePanel} />

      {/* Custom slider styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
        }
        .slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
}
