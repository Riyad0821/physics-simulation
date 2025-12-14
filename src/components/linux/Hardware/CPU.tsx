'use client';


import { useLinuxStore } from '@/stores/linuxStore';
import { useRef } from 'react';
import React from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';

// ... (existing code)

function InternalBusPath({ points }: { points: [number, number, number][] }) {
    return (
        <Line 
            points={points} 
            color="#444" 
            lineWidth={2} 
        />
    );
}
import * as THREE from 'three';

export function CPU({ position }: { position: [number, number, number] }) {
  const setActiveComponent = useLinuxStore((state) => state.setActiveComponent);
  const simulationState = useLinuxStore((state) => state.simulationState);
  const registers = useLinuxStore((state) => state.registers);
  
  // Layout constants
  const REG_WIDTH = 0.8;
  const REG_HEIGHT = 0.2;
  const REG_DEPTH = 0.6;
  const TEXT_SIZE = 0.15;

  return (
    <group 
      position={position}
      onPointerOver={() => setActiveComponent('CPU')}
      onPointerOut={() => setActiveComponent(null)}
    >
      {/* ... Substrate and Text ... */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[5, 0.2, 5]} />
        <meshStandardMaterial color="#003300" roughness={0.6} />
      </mesh>

       {/* Heat Spreader (Glass for visibility) */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[4.8, 0.05, 4.8]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.7} opacity={0.3} roughness={0} thickness={0.5} transparent />
      </mesh>

      <Text position={[0, 0.9, 1.8]} fontSize={0.25} color="white" rotation={[-Math.PI/2, 0, 0]}>
        CENTRAL PROCESSING UNIT
      </Text>

      {/* --- Internal Components --- */}
      
      {/* Control Unit (Top Left) */}
      <InternalComponent 
        position={[-1.5, 0.2, -1.5]} 
        color="#cc0000" 
        label="CONTROL UNIT" 
        value={simulationState} 
        width={1.5} 
        depth={1.2} 
        active={true}
      />

      {/* ALU (Top Right) */}
      <InternalComponent 
        position={[1.5, 0.2, -1.5]} 
        color="#0000cc" 
        label="ALU" 
        value={simulationState === 'EXECUTE' ? 'ACTIVE' : 'IDLE'} 
        width={1.5} 
        depth={1.2} 
        active={simulationState === 'EXECUTE'}
      />

      {/* Registers (Bottom Section) */}
      <InternalRegister position={[-1.5, 0.2, 0.5]} label="PC" value={registers.PC} color="#555" active={false} />
      <InternalRegister position={[-0.5, 0.2, 0.5]} label="MAR" value={registers.MAR} color="#555" active={false} />
      
      <InternalRegister position={[0.5, 0.2, 0.5]} label="MDR" value={registers.MDR} color="#555" active={false} />
      <InternalRegister position={[1.5, 0.2, 0.5]} label="CIR" value={registers.CIR} color="#555" active={false} />
      
      {/* Accumulator (Near ALU) */}
      <InternalRegister position={[1.5, 0.2, -0.2]} label="ACC" value={registers.ACC} color="#aa5500" active={false} />

      {/* Internal Bus Visualization (Lines on substrate) */}
      <InternalBusPath points={[ [-1.5, 0.05, 0], [1.5, 0.05, 0] ]} />
      <InternalBusPath points={[ [0, 0.05, -1.5], [0, 0.05, 1] ]} />

    </group>
  );
}

const InternalComponent = React.memo(function InternalComponent({ position, color, label, value, width, depth, active }: any) {
    return (
        <group position={position}>
            <mesh>
                <boxGeometry args={[width, 0.2, depth]} />
                <meshStandardMaterial color={active ? highlightColor(color) : color} />
            </mesh>
            <Text position={[0, 0.11, 0]} fontSize={0.2} color="white" rotation={[-Math.PI / 2, 0, 0]}>
                {label}
            </Text>
             <Text position={[0, 0.11, 0.3]} fontSize={0.15} color="white" rotation={[-Math.PI / 2, 0, 0]}>
                {value}
            </Text>
        </group>
    )
});

const InternalRegister = React.memo(function InternalRegister({ position, label, value, color, active }: any) {
     return (
        <group position={position}>
            <mesh>
                <boxGeometry args={[0.8, 0.15, 0.6]} />
                <meshStandardMaterial color={active ? '#00ff00' : color} />
            </mesh>
            <Text position={[0, 0.08, -0.15]} fontSize={0.15} color="#aaa" rotation={[-Math.PI / 2, 0, 0]}>
                {label}
            </Text>
             <Text position={[0, 0.08, 0.1]} fontSize={0.2} color="white" rotation={[-Math.PI / 2, 0, 0]}>
                {value}
            </Text>
        </group>
    )
});

function highlightColor(hex: string) {
    // Simple mock brighten
    return hex; 
}


