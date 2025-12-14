'use client';

import { useLinuxStore } from '@/stores/linuxStore';
import { Text } from '@react-three/drei';

export function Storage({ position }: { position: [number, number, number] }) {
  const setActiveComponent = useLinuxStore((state) => state.setActiveComponent);

  return (
    <group 
      position={position}
      onPointerOver={() => setActiveComponent('STORAGE')}
      onPointerOut={() => setActiveComponent(null)}
    >
      {/* SSD PCB */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 0.1, 6]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Controller Chip */}
      <mesh position={[0, 0.06, -2]}>
         <boxGeometry args={[1, 0.1, 1]} />
         <meshStandardMaterial color="#111" />
      </mesh>

      {/* NAND Flash Chips */}
      <mesh position={[0, 0.06, 0.5]}>
         <boxGeometry args={[1.5, 0.1, 2]} />
         <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0, 0.06, 2.8]}>
         <boxGeometry args={[1.5, 0.1, 2]} />
         <meshStandardMaterial color="#111" />
      </mesh>

      <Text position={[0, 0.5, 0]} fontSize={0.3} color="white" rotation={[-Math.PI/2, 0, 0]}>
        NVMe SSD
      </Text>
    </group>
  );
}
