import * as THREE from 'three';
import { StarFactory } from '../stellar/StarFactory';
import { GALAXY_CONFIG } from '@/config/galaxy.config';
import { TextureGenerator } from '../rendering/TextureGenerator';

export class StarSystemManager {
  private factory: StarFactory;
  private scene: THREE.Scene;
  private starPoints: THREE.Points | null = null;
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.factory = new StarFactory();
    this.geometry = new THREE.BufferGeometry();
    
    const texture = TextureGenerator.generateStarSprite();
    
    this.material = new THREE.PointsMaterial({
        size: 200, // Scaled size
        map: texture,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false, // Important for transparency overlap
        transparent: true,
        sizeAttenuation: true
    });
  }

  generateGalaxy() {
    console.log('Generating galaxy with realistic sprites...');
    const count = GALAXY_CONFIG.science.count.desktop;
    
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
        // Spiral Generation Logic
        const armIndex = i % GALAXY_CONFIG.science.spiralArms;
        const randomOffset = Math.random(); 
        
        const armAngleOffset = (Math.PI * 2 * armIndex) / GALAXY_CONFIG.science.spiralArms;
        const rotation = randomOffset * GALAXY_CONFIG.science.armWinding * Math.PI * 2;
        const angle = armAngleOffset + rotation;
        
        const r = randomOffset * GALAXY_CONFIG.science.diskRadius;
        
        const spreadRequest = (r / GALAXY_CONFIG.science.diskRadius) * 2000;
        const spreadX = (Math.random() - 0.5) * spreadRequest;
        const spreadZ = (Math.random() - 0.5) * spreadRequest;
        const spreadY = (Math.random() - 0.5) * (GALAXY_CONFIG.science.diskThickness * (1 - r/GALAXY_CONFIG.science.diskRadius)); 

        const x = r * Math.cos(angle) + spreadX;
        const z = r * Math.sin(angle) + spreadZ;
        const y = spreadY;

        // Position
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Color
        const props = this.factory.generateStar(r, angle);
        color.set(props.color);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    this.starPoints = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.starPoints);
    console.log(`Generated ${count} stars (Points).`);
  }

  update(delta: number, time: number) {
    if (this.starPoints) {
        this.starPoints.rotation.y += 0.02 * delta;
    }
  }
  
  // Method to get star data near a point (for Raycasting/HUD)
  getStarAt(index: number) {
     // Simplified implementation for now
     return { type: 'G-Type Main Sequence', temp: 5700 }; 
  }

  dispose() {
    if (this.starPoints) {
        this.scene.remove(this.starPoints);
        this.geometry.dispose();
        this.material.dispose();
        this.starPoints = null;
    }
  }
}
