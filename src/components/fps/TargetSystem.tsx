'use client';

import { useRef } from 'react';

export function TargetSystem() {
    // Placeholder targets
    return (
        <group>
            {/* Target 1 */}
            <mesh position={[0, 1, -5]} name="TARGET">
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="red" />
            </mesh>
             {/* Target 2 */}
            <mesh position={[4, 1, -8]} name="TARGET">
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="red" />
            </mesh>
             {/* Target 3 */}
            <mesh position={[-4, 1, -8]} name="TARGET">
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="red" />
            </mesh>
        </group>
    );
}
