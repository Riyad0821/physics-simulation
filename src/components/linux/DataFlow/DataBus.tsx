'use client';

import { useLinuxStore } from '@/stores/linuxStore';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import React from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

export function DataBus() {
  const buses = useLinuxStore((state) => state.buses);
  
  // Bus Geometries (Simplified lines for now)
  // Address Bus: Top (Yellow)
  // Data Bus: Middle (Blue)
  // Control Bus: Bottom (Red)
  
  return (
    <group position={[0, 0, 0]}>
        {/* Address Bus */}
       <BusLine 
            start={[-4, 0.5, -2]} 
            end={[4, 0.5, -2]} 
            color="#ffff00" 
            label="ADDRESS BUS" 
            active={buses.activeLines.address} 
            value={buses.address?.toString().padStart(3, '0') || ''}
        />

        {/* Data Bus */}
       <BusLine 
            start={[-4, 0.5, 0]} 
            end={[4, 0.5, 0]} 
            color="#0088ff" 
            label="DATA BUS" 
            active={buses.activeLines.data} 
            value={buses.data?.toString() || ''}
        />

        {/* Control Bus */}
       <BusLine 
            start={[-4, 0.5, 2]} 
            end={[4, 0.5, 2]} 
            color="#ff0000" 
            label="CONTROL BUS" 
            active={buses.activeLines.control} 
            value={buses.control || ''}
        />
    </group>
  );
}

const BusLine = React.memo(function BusLine({ start, end, color, label, active, value }: { 
    start: [number, number, number], 
    end: [number, number, number], 
    color: string, 
    label: string, 
    active: boolean,
    value: string
}) {
    const particleRef = useRef<THREE.Mesh>(null);
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const distance = startVec.distanceTo(endVec);
    const direction = endVec.clone().sub(startVec).normalize();
    const midPoint = startVec.clone().add(endVec).multiplyScalar(0.5);

    useFrame((state) => {
        if (particleRef.current && active) {
            const speed = 5;
            const t = (state.clock.elapsedTime * speed) % distance;
            particleRef.current.position.copy(startVec).add(direction.clone().multiplyScalar(t));
            particleRef.current.visible = true;
        } else if (particleRef.current) {
            particleRef.current.visible = false;
        }
    });

    return (
        <group>
            {/* The Bus Wire */}
            <mesh position={midPoint} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction)} rotation={[0,0,Math.PI/2]}>
                <cylinderGeometry args={[0.05, 0.05, distance, 8]} />
                <meshStandardMaterial color={active ? color : '#333'} emissive={active ? color : '#000'} emissiveIntensity={0.5} />
            </mesh>
            
            {/* Label */}
            <Text position={[midPoint.x, midPoint.y + 0.3, midPoint.z]} fontSize={0.25} color="white" rotation={[-Math.PI/2, 0, 0]}>
                {label} {active ? `[${value}]` : ''}
            </Text>

            {/* Signal Particle */}
            <mesh ref={particleRef}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshBasicMaterial color="white" />
            </mesh>
        </group>
    )
});
