/**
 * Star System Manager
 * Orchestrates the generation, updates, and rendering of star systems.
 * Acts as the ECS Coordinator for stars.
 */

import * as THREE from 'three';
import { StarFactory } from '../stellar/StarFactory';
import { LODController } from '../rendering/lod/LODController';
import { GALAXY_CONFIG } from '@/config/galaxy.config';

export class StarSystemManager {
  private factory: StarFactory;
  private scene: THREE.Scene;
  private stars: THREE.InstancedMesh[]; // Array for different star types if needed, or single huge mesh
  private dummy: THREE.Object3D;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.factory = new StarFactory();
    this.dummy = new THREE.Object3D();
    this.stars = [];
  }

  generateGalaxy() {
    console.log('Generating galaxy...');
    const count = GALAXY_CONFIG.science.count.desktop; // Default to desktop count
    
    // Geometry & Material (Placeholder for now, will use shaders later)
    const geometry = new THREE.IcosahedronGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // If we animate
    
    // Generate Stars
    for (let i = 0; i < count; i++) {
        // Spiral Generation Logic
        const armIndex = i % GALAXY_CONFIG.science.spiralArms;
        const randomOffset = Math.random(); // Position along the arm length
        
        // Logarithmic spiral parameters
        const armAngleOffset = (Math.PI * 2 * armIndex) / GALAXY_CONFIG.science.spiralArms;
        const rotation = randomOffset * GALAXY_CONFIG.science.armWinding * Math.PI * 2;
        
        const angle = armAngleOffset + rotation;
        
        // Calculate base spiral position
        // r = a * e^(b * theta)
        // We invert this slightly to map linear randomOffset to exponential growth if needed,
        // or just map randomOffset to distance r directly and solve for angle, 
        // but simpler is to just define r linearly and twist angle.
        
        const r = randomOffset * GALAXY_CONFIG.science.diskRadius;
        
        // Add spread/scatter based on distance from center (core is denser/rounder)
        const spreadRequest = (r / GALAXY_CONFIG.science.diskRadius) * 2000; // More spread at edges
        const spreadX = (Math.random() - 0.5) * spreadRequest;
        const spreadZ = (Math.random() - 0.5) * spreadRequest;
        const spreadY = (Math.random() - 0.5) * (GALAXY_CONFIG.science.diskThickness * (1 - r/GALAXY_CONFIG.science.diskRadius)); // Thicker at core

        // Polar to Cartesian for the spiral arm center at this radius
        const x = r * Math.cos(angle) + spreadX;
        const z = r * Math.sin(angle) + spreadZ;
        const y = spreadY;

        const position = new THREE.Vector3(x, y, z);
        const props = this.factory.generateStar(r, angle); // Just for color/size info
        
        this.dummy.position.copy(position);
        
        // Scale based on size/distance (simplified visual scale)
        const scale = props.size * 20; // Reduced multiplier for better density
        this.dummy.scale.set(scale, scale, scale);
        
        this.dummy.updateMatrix();
        mesh.setMatrixAt(i, this.dummy.matrix);
        mesh.setColorAt(i, props.color);
    }
    
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    
    this.scene.add(mesh);
    this.stars.push(mesh);
    console.log(`Generated ${count} stars.`);
  }

  update(delta: number, time: number) {
    // Animation logic here (rotate galaxy)
    // For specialized headers like compute shaders, we update uniforms here
    if (this.stars.length > 0) {
        // Simple global rotation for now
        this.stars[0].rotation.y += 0.05 * delta;
    }
  }
  
  dispose() {
    this.stars.forEach(mesh => {
        this.scene.remove(mesh);
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
    });
    this.stars = [];
  }
}
