'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic import for the Scene to avoid SSR issues with Three.js
const FPSScene = dynamic(() => import('@/components/fps/FPSScene'), { ssr: false });
import { HUD } from '@/components/fps/ui/HUD';

export default function FPSGamePage() {
  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
        <Suspense fallback={<div className="text-white text-center pt-20">Loading Game Assets...</div>}>
            <FPSScene />
        </Suspense>
        <HUD />
    </div>
  );
}
