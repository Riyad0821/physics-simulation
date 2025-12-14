'use client';

import { Canvas } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import { PlayerController } from './PlayerController';
import { TargetSystem } from './TargetSystem';

export default function FPSScene() {
  return (
    <Canvas
      shadows
      camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 2, 0] }}
      className="bg-sky-400"
    >
        {/* Environment */}
      <Sky sunPosition={[100, 20, 100]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Grid for reference */}
      <gridHelper args={[100, 100]} />

      {/* Game Components */}
      <PlayerController />
      <TargetSystem />
      
    </Canvas>
  );
}
