/**
 * Black Hole Core
 * Manages the central black hole visual representation
 */

import * as THREE from 'three';
import blackHoleShader from '@/shaders/library/relativity/schwarzschild.glsl';

export class BlackHoleCore {
  scene: THREE.Scene;
  mesh: THREE.Mesh;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    
    // Screen-facing quad or large sphere?
    // Using a sphere for local volume, but lensing usually needs post-process
    // We'll use a local sphere with inverted normals or a billboard for the effect
    const geometry = new THREE.PlaneGeometry(10000, 10000); 
    
    const material = new THREE.ShaderMaterial({
        vertexShader: `
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: blackHoleShader,
        uniforms: {
            iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            mass: { value: 1.0 }
        },
        transparent: true,
        depthWrite: false,
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(0, 0, 0); // Center of galaxy
    this.mesh.lookAt(0, 100000, 0); // Face up? or Billboard?
    // Actually, simple plane needs to face camera. 
    // Usually Black Hole is a post-process effect for the whole screen or a specific region.
    // For now we add it to scene.
    
    this.scene.add(this.mesh);
  }

  update(camera: THREE.Camera) {
    this.mesh.lookAt(camera.position); // Always face camera
  }
}
