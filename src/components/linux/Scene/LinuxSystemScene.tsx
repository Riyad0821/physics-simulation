'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Environment } from '@react-three/drei';
import { SceneManager } from './SceneManager';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

export default function LinuxSystemScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      className="outline-none"
    >
      <PerspectiveCamera makeDefault position={[0, 15, 15]} fov={50} />
      <OrbitControls 
        maxPolarAngle={Math.PI / 2} 
        minDistance={5} 
        maxDistance={50} 
        enableDamping
        dampingFactor={0.1}
      />

      <color attach="background" args={['#050505']} />
      
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <rectAreaLight width={20} height={20} position={[0, 20, 0]} intensity={2} color="#4c8bf5" />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      
      {/* Environment */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Main Orchestrator */}
      <SceneManager />

      {/* Post Processing */}
      <EffectComposer enableNormalPass={false}>
        <Bloom luminanceThreshold={1.2} mipmapBlur intensity={0.8} radius={0.4} />
        <Vignette offset={0.5} darkness={0.5} />
      </EffectComposer>
    </Canvas>
  );
}
