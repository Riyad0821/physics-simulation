'use client';

/**
 * Cockpit HUD
 * Displays flight metrics: Speed, Distance, Coordinates, and Target Info
 */

import React, { useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Vector3 } from 'three';
import { useGalaxyStore } from '@/stores/galaxyStore';

export function CockpitHUD() {
  const { camera } = useThree();
  const lastPos = useRef(new Vector3());
  
  // Using direct DOM manipulation for frequent updates to avoid React render cycle overhead on every frame
  const speedRef = useRef<HTMLSpanElement>(null);
  const distRef = useRef<HTMLSpanElement>(null);
  
  const selectedStar = useGalaxyStore((state) => state.selectedStar);

  useFrame((state, delta) => {
    if (!speedRef.current || !distRef.current) return;

    // Calculate Speed (Ly/s)
    const currentPos = camera.position;
    const distMoved = currentPos.distanceTo(lastPos.current);
    const speedVal = distMoved / delta; 
    
    // Update DOM
    speedRef.current.innerText = `${Math.round(speedVal).toLocaleString()} Ly/s`;

    // Distance from core
    const distFromCore = currentPos.length();
    distRef.current.innerText = `${Math.round(distFromCore).toLocaleString()} Ly`;

    lastPos.current.copy(currentPos);
  });

  return (
    <Html fullscreen pointerEvents="none">
    <div className="absolute bottom-10 left-10 font-mono text-cyan-400 select-none z-50">
      <div className="bg-black/40 backdrop-blur-md p-4 rounded border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
        <div className="flex flex-col gap-2">
            <div className="flex justify-between w-48">
                <span className="opacity-70 text-[10px] tracking-wider">VELOCITY</span>
                <span ref={speedRef} className="font-bold text-lg text-cyan-200">0 Ly/s</span>
            </div>
            <div className="flex justify-between w-48">
                <span className="opacity-70 text-[10px] tracking-wider">DIST. CORE</span>
                <span ref={distRef} className="font-bold text-lg text-cyan-200">0 Ly</span>
            </div>
            
            <div className="h-px bg-gradient-to-r from-cyan-500/50 to-transparent my-1" />
            
            {selectedStar ? (
              <div className="flex flex-col gap-1 text-xs animate-pulse-fast">
                <div className="text-cyan-300 font-bold uppercase tracking-widest mb-1 text-[10px]">Target Lock</div>
                <div className="flex justify-between items-center bg-cyan-950/30 p-1 rounded">
                    <span className="opacity-70">CLASS</span>
                    <span className="text-white font-bold">{selectedStar.type}</span>
                </div>
                <div className="flex justify-between items-center p-1">
                    <span className="opacity-70">TEMP</span>
                    <span className="text-orange-300">{selectedStar.temp} K</span>
                </div>
                 <div className="flex justify-between items-center p-1">
                    <span className="opacity-70">DIST</span>
                    <span className="text-white">{selectedStar.distance.toLocaleString()} Ly</span>
                </div>
              </div>
            ) : (
                <div className="text-[10px] text-cyan-300/40 uppercase tracking-[0.2em] text-center pt-1">
                    System Helios-1
                </div>
            )}
        </div>
      </div>
    </div>
    </Html>
  );
}
