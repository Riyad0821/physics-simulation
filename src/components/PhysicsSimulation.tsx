'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere } from '@react-three/drei';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Bouncing Ball Component with Physics
function BouncingBall({ 
  position, 
  gravity, 
  bounceDamping,
  color 
}: { 
  position: [number, number, number];
  gravity: number;
  bounceDamping: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [velocity, setVelocity] = useState({ y: 0 });
  const groundLevel = -2;

  useFrame(() => {
    if (meshRef.current) {
      // Apply gravity
      setVelocity((v) => ({ y: v.y + gravity }));
      
      // Update position
      meshRef.current.position.y += velocity.y;
      
      // Check for ground collision
      if (meshRef.current.position.y <= groundLevel) {
        meshRef.current.position.y = groundLevel;
        setVelocity((v) => ({ y: -v.y * bounceDamping }));
      }
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={[0.5, 32, 32]}>
      <meshStandardMaterial color={color} />
    </Sphere>
  );
}

// Rotating Cube Component
function RotatingCube({ 
  position, 
  rotationSpeed,
  color 
}: { 
  position: [number, number, number];
  rotationSpeed: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotationSpeed;
      meshRef.current.rotation.y += delta * rotationSpeed * 0.6;
    }
  });

  return (
    <Box ref={meshRef} position={position} args={[1, 1, 1]}>
      <meshStandardMaterial color={color} />
    </Box>
  );
}

// Ground Plane
function Ground({ color }: { color: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Main Scene Component
function Scene({ 
  gravity, 
  bounceDamping, 
  rotationSpeed,
  ballColor,
  cubeColor,
  groundColor 
}: {
  gravity: number;
  bounceDamping: number;
  rotationSpeed: number;
  ballColor: string;
  cubeColor: string;
  groundColor: string;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      <BouncingBall 
        position={[0, 5, 0]} 
        gravity={gravity}
        bounceDamping={bounceDamping}
        color={ballColor}
      />
      <RotatingCube 
        position={[-2, 0, 0]} 
        rotationSpeed={rotationSpeed}
        color={cubeColor}
      />
      <RotatingCube 
        position={[2, 0, 0]} 
        rotationSpeed={rotationSpeed}
        color={cubeColor}
      />
      <Ground color={groundColor} />
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />
    </>
  );
}

export default function PhysicsSimulation() {
  const [gravity, setGravity] = useState(-0.01);
  const [bounceDamping, setBounceDamping] = useState(0.8);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [ballColor, setBallColor] = useState('#3b82f6');
  const [cubeColor, setCubeColor] = useState('#10b981');
  const [groundColor, setGroundColor] = useState('#6b7280');

  return (
    <div className="w-full h-screen bg-black">
      {/* Top Info Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="px-6 py-3">
          <h1 className="text-xl font-light text-white">
            webgl / physics simulation
          </h1>
        </div>
      </div>
      
      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        shadows
        className="w-full h-full"
      >
        <Scene 
          gravity={gravity}
          bounceDamping={bounceDamping}
          rotationSpeed={rotationSpeed}
          ballColor={ballColor}
          cubeColor={cubeColor}
          groundColor={groundColor}
        />
      </Canvas>
      
      {/* Sidebar - Three.js Style */}
      <div className="absolute top-14 left-0 w-80 h-[calc(100vh-3.5rem)] bg-[#1a1a1a] border-r border-white/10 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Physics Controls */}
          <div>
            <h3 className="text-white text-sm font-medium mb-4 pb-2 border-b border-white/10">
              Physics Parameters
            </h3>
            
            <div className="space-y-4">
              {/* Gravity */}
              <div>
                <label className="flex justify-between text-white/70 text-xs mb-2">
                  <span>gravity</span>
                  <span className="text-white/50">{gravity.toFixed(3)}</span>
                </label>
                <input
                  type="range"
                  min="-0.05"
                  max="-0.001"
                  step="0.001"
                  value={gravity}
                  onChange={(e) => setGravity(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Bounce Damping */}
              <div>
                <label className="flex justify-between text-white/70 text-xs mb-2">
                  <span>bounce damping</span>
                  <span className="text-white/50">{bounceDamping.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={bounceDamping}
                  onChange={(e) => setBounceDamping(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Rotation Speed */}
              <div>
                <label className="flex justify-between text-white/70 text-xs mb-2">
                  <span>rotation speed</span>
                  <span className="text-white/50">{rotationSpeed.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={rotationSpeed}
                  onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Color Controls */}
          <div>
            <h3 className="text-white text-sm font-medium mb-4 pb-2 border-b border-white/10">
              Colors
            </h3>
            
            <div className="space-y-4">
              {/* Ball Color */}
              <div>
                <label className="flex justify-between text-white/70 text-xs mb-2">
                  <span>ball color</span>
                  <span className="text-white/50">{ballColor}</span>
                </label>
                <input
                  type="color"
                  value={ballColor}
                  onChange={(e) => setBallColor(e.target.value)}
                  className="w-full h-8 bg-transparent cursor-pointer rounded"
                />
              </div>

              {/* Cube Color */}
              <div>
                <label className="flex justify-between text-white/70 text-xs mb-2">
                  <span>cube color</span>
                  <span className="text-white/50">{cubeColor}</span>
                </label>
                <input
                  type="color"
                  value={cubeColor}
                  onChange={(e) => setCubeColor(e.target.value)}
                  className="w-full h-8 bg-transparent cursor-pointer rounded"
                />
              </div>

              {/* Ground Color */}
              <div>
                <label className="flex justify-between text-white/70 text-xs mb-2">
                  <span>ground color</span>
                  <span className="text-white/50">{groundColor}</span>
                </label>
                <input
                  type="color"
                  value={groundColor}
                  onChange={(e) => setGroundColor(e.target.value)}
                  className="w-full h-8 bg-transparent cursor-pointer rounded"
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white text-sm font-medium mb-4 pb-2 border-b border-white/10">
              Controls
            </h3>
            <div className="text-white/50 text-xs space-y-2">
              <p>• Click + Drag to rotate camera</p>
              <p>• Scroll to zoom in/out</p>
              <p>• Right-click + Drag to pan</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
