'use client';

import { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { Vector3, Raycaster, Vector2 } from 'three';
import { WeaponModel } from './weapons/WeaponModel';
import { useFPSStore } from '@/stores/fpsStore';

import { fpsAudio } from './audio/SoundManager';

const SPEED = 5;

// Player movement and interaction controller
export function PlayerController() {
  const { camera, scene } = useThree();
  const controlsRef = useRef<any>(null);
  const raycaster = useRef(new Raycaster());
  
  // Visual State
  const [isFiring, setIsFiring] = useState(false);
  const fireTimeoutRef = useRef<NodeJS.Timeout>(null);
  
  // Movement state
  const moveForward = useRef(false);
  const moveBackward = useRef(false);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);
  
  // Game state
  const fireWeapon = useFPSStore((state) => state.fireWeapon);
  const activeWeapon = useFPSStore((state) => state.activeWeapon);
  const addScore = useFPSStore((state) => state.addScore);
  const setGameState = useFPSStore((state) => state.setGameState);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward.current = true;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft.current = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveBackward.current = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight.current = true;
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          moveForward.current = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          moveLeft.current = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          moveBackward.current = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          moveRight.current = false;
          break;
      }
    };
    
    const handleMouseDown = () => {
        if (controlsRef.current?.isLocked) {
             const success = fireWeapon();
             if (success) {
                 // 1. Audio and Visuals
                 fpsAudio.playShootSound();
                 setIsFiring(true);
                 if (fireTimeoutRef.current) clearTimeout(fireTimeoutRef.current);
                 fireTimeoutRef.current = setTimeout(() => setIsFiring(false), 100);

                 // 2. Raycast Logic
                 raycaster.current.setFromCamera(new Vector2(0, 0), camera);
                 const intersects = raycaster.current.intersectObjects(scene.children, true); // Recursive
                 
                 // Find first valid target
                 const hit = intersects.find(i => i.object.name === 'TARGET' || i.object.parent?.name === 'TARGET');
                 
                 if (hit) {
                     console.log('HIT TARGET!', hit.object);
                     addScore(100);
                     fpsAudio.playHitSound();
                     
                     // 3. Target Destruction Logic (Simple Hiding)
                     // In a real ECS/Store system, we'd dispatch an action. 
                     // Here we directly manipulate the object for immediate feedback in this demo.
                     hit.object.visible = false; 
                     // Move it out of the way to prevent hitting invisible object
                     hit.object.position.y = -1000; 
                 }
             }
        } else {
            controlsRef.current?.lock();
            setGameState('PLAYING');
        }
    };
    
    controlsRef.current?.addEventListener('unlock', () => {
        setGameState('MENU');
    });

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousedown', handleMouseDown);
      if (fireTimeoutRef.current) clearTimeout(fireTimeoutRef.current);
    };
  }, [fireWeapon, addScore, setGameState, camera, scene]);

  useFrame((state, delta) => {
      if (!controlsRef.current?.isLocked) return;

      const velocity = new Vector3();
      const direction = new Vector3();
      
      direction.z = Number(moveForward.current) - Number(moveBackward.current);
      direction.x = Number(moveRight.current) - Number(moveLeft.current);
      direction.normalize();

      if (moveForward.current || moveBackward.current) velocity.z -= direction.z * SPEED * delta;
      if (moveLeft.current || moveRight.current) velocity.x -= direction.x * SPEED * delta;

      controlsRef.current.moveRight(-velocity.x);
      controlsRef.current.moveForward(-velocity.z);
      
      // Simple Ground Clamp
      if (camera.position.y !== 1.6) {
          camera.position.y = 1.6;
      }
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} />
      
      {/* Weapon attached to camera */}
      <group position={[0.3, -0.3, -0.5]}>
          <WeaponModel type={activeWeapon} isFiring={isFiring} />
      </group>
    </>
  );
}
