'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sphere } from '@react-three/drei';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Bouncing Ball Component with Physics
function BouncingBall({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [velocity, setVelocity] = useState({ y: 0 });
  const gravity = -0.01;
  const bounceDamping = 0.8;
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
      <meshStandardMaterial color="#3b82f6" />
    </Sphere>
  );
}

// Rotating Cube Component
function RotatingCube({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Box ref={meshRef} position={position} args={[1, 1, 1]}>
      <meshStandardMaterial color="#10b981" />
    </Box>
  );
}

// Ground Plane
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#6b7280" />
    </mesh>
  );
}

// Main Scene Component
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      <BouncingBall position={[0, 5, 0]} />
      <RotatingCube position={[-2, 0, 0]} />
      <RotatingCube position={[2, 0, 0]} />
      <Ground />
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />
    </>
  );
}

export default function PhysicsSimulation() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">
            Physics Simulation
          </h1>
          <p className="text-gray-300 text-lg">
            Interactive 3D physics demo with Three.js • Drag to rotate • Scroll to zoom
          </p>
        </div>
      </div>
      
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        shadows
        className="w-full h-full"
      >
        <Scene />
      </Canvas>
      
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold">🎾 Blue Sphere:</span> Gravity & Bounce Physics
              </div>
              <div>
                <span className="font-semibold">🟩 Green Cubes:</span> Continuous Rotation
              </div>
              <div>
                <span className="font-semibold">🎮 Controls:</span> Click + Drag to Orbit
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
