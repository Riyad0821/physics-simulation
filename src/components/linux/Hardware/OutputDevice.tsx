'use client';

import { useLinuxStore } from '@/stores/linuxStore';
import { Text } from '@react-three/drei';

export function OutputDevice({ position }: { position: [number, number, number] }) {
  const setActiveComponent = useLinuxStore((state) => state.setActiveComponent);
  const busActive = useLinuxStore((state) => state.busActive);
  const isReceiving = busActive?.to === 'OUTPUT' && busActive?.active;

  return (
    <group 
      position={position}
      onPointerOver={() => setActiveComponent('OUTPUT')}
      onPointerOut={() => setActiveComponent(null)}
    >
      {/* Monitor Base */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.5, 0.8, 0.2, 32]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      
      {/* Stand */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Screen Frame */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[4, 2.5, 0.2]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0.5, 0.11]}>
        <planeGeometry args={[3.6, 2.1]} />
        <meshStandardMaterial 
            color={isReceiving ? "#0000ff" : "#000"} 
            emissive={isReceiving ? "#0000ff" : "#000"}
            emissiveIntensity={isReceiving ? 0.5 : 0}
        />
      </mesh>

      <Text position={[0, 1.9, 0]} fontSize={0.3} color="white">
        OUTPUT
      </Text>
       <Text position={[0, 0.5, 0.12]} fontSize={0.2} color="white">
        {isReceiving ? "DATA RECEIVED" : "NO SIGNAL"}
      </Text>
    </group>
  );
}
