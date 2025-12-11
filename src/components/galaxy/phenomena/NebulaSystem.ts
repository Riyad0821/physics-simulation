/**
 * Nebula System Manager
 * Handles the creation and management of volumetric and billboard nebulae.
 */

import * as THREE from 'three';
import nebulaShader from '@/shaders/library/cosmic/nebula_volumetric.glsl'; // Assuming raw-loader configured

// Since we are using raw-loader, shader imports might need type assertion or declaration
// We already configured next.config.ts

export class NebulaSystem {
  scene: THREE.Scene;
  nebulae: THREE.Mesh[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  createVolumetricNebula(position: THREE.Vector3, size: number) {
    // We use a BoxGeometry as a proxy volume for raymarching
    const geometry = new THREE.BoxGeometry(size, size, size);
    
    const material = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vWorldPosition;
            void main() {
                vUv = uv;
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * viewMatrix * worldPosition;
            }
        `,
        fragmentShader: nebulaShader,
        uniforms: {
            time: { value: 0 },
            cameraPos: { value: new THREE.Vector3() },
            sunPosition: { value: new THREE.Vector3(0,0,0) }
        },
        transparent: true,
        side: THREE.BackSide, // Render inside the box if we are inside
        depthWrite: false, // For volumetric
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    this.scene.add(mesh);
    this.nebulae.push(mesh);
  }

  update(delta: number, camera: THREE.Camera) {
    this.nebulae.forEach(mesh => {
        const mat = mesh.material as THREE.ShaderMaterial;
        if (mat.uniforms.time) mat.uniforms.time.value += delta;
        if (mat.uniforms.cameraPos) mat.uniforms.cameraPos.value.copy(camera.position);
    });
  }
}
