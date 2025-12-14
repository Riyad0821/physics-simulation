'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load the scene to avoid SSR issues with Three.js
const LinuxSystemScene = dynamic(() => import('@/components/linux/Scene/LinuxSystemScene'), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-black flex items-center justify-center text-cyan-500 font-mono">INITIALIZING KERNEL...</div>
});

const UIOverlay = dynamic(() => import('@/components/linux/UI/ControlPanel'), { ssr: false });
const SimulationControls = dynamic(() => import('@/components/linux/UI/SimulationControls').then(mod => mod.SimulationControls), { ssr: false });

import Navbar from '@/components/Navbar';

export default function LinuxSimulationPage() {
  return (
    <div className="w-full h-screen bg-[#050505] overflow-hidden relative">
      <Navbar />
      <Suspense fallback={null}>
        <LinuxSystemScene />
      </Suspense>
      <Suspense fallback={null}>
        <SimulationControls />
      </Suspense>
    </div>
  );
}
