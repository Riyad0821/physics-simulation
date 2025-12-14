import * as THREE from 'three';
import { StarFactory } from '../stellar/StarFactory';
import { GALAXY_CONFIG } from '@/config/galaxy.config';
import { TextureGenerator } from '../rendering/TextureGenerator';
import { ImpostorManager } from '../rendering/lod/ImpostorManager';
import { useGalaxyStore } from '@/stores/galaxyStore';
import starVertexShader from '@/shaders/library/stellar/star_vertex.glsl';
import starFragmentShader from '@/shaders/library/stellar/star_surface.glsl';

export class StarSystemManager {
  private factory: StarFactory;
  private scene: THREE.Scene;
  private starPoints: THREE.Points | null = null;
  private geometry: THREE.BufferGeometry;
  private material: THREE.ShaderMaterial;
  private impostorManager: ImpostorManager;
  private unsubQuality: (() => void) | null = null;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.factory = new StarFactory();
    this.geometry = new THREE.BufferGeometry();
    
    // Initialize Impostor Manager
    this.impostorManager = new ImpostorManager();
    
    // Custom Shader Material for Stars
    this.material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            size: { value: 100.0 }, // Adjusted for shader
            scale: { value: 500.0 } // Approximate scale factor for attenuation
        },
        vertexShader: starVertexShader,
        fragmentShader: starFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });
    
    this.setupQualityListener();
  }

  setupQualityListener() {
    this.unsubQuality = useGalaxyStore.subscribe((state) => {
        this.updateQuality(state.qualityPreset);
    });
    // Initial set
    this.updateQuality(useGalaxyStore.getState().qualityPreset);
  }

  updateQuality(preset: string) {
    if (!this.geometry.getAttribute('position')) return;
    
    const count = this.geometry.getAttribute('position').count;
    let limit = count;
    switch(preset) {
        case 'low': limit = Math.floor(count * 0.25); break;
        case 'medium': limit = Math.floor(count * 0.5); break;
        case 'high': limit = Math.floor(count * 0.8); break;
        case 'ultra': limit = count; break;
    }
    this.geometry.setDrawRange(0, limit);
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
    this.starPoints.userData = { isStarSystem: true }; // Marker for raycasting
    this.scene.add(this.starPoints);
    
    // Generate Impostors for LOD
    this.impostorManager.generateImpostors(positions, colors);
    this.scene.add(this.impostorManager.getMesh());
    
    console.log(`Generated ${count} stars (Points) and impostors.`);
  }

  update(delta: number, time: number, camera?: THREE.Camera) {
    // Update Shader Uniforms
    if (this.material) {
        this.material.uniforms.time.value = time;
    }

    if (this.starPoints) {
        this.starPoints.rotation.y += 0.02 * delta;
        // Apply same rotation to impostors to keep them synced
        const impostors = this.impostorManager.getMesh();
        impostors.rotation.y = this.starPoints.rotation.y;
    }
    
    // Basic LOD Logic: Switch based on distance or density
    // For now, simpler: Use impostors for really distant views?
    // Actually, impostors are usually for background clouds or huge clusters.
    // Let's keep both active for now but maybe fade them?
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
    this.scene.remove(this.impostorManager.getMesh());
    this.impostorManager.dispose();
    if (this.unsubQuality) this.unsubQuality();
  }
}
