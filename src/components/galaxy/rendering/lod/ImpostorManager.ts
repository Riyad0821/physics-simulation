/**
 * Impostor Manager
 * Handles billboard rendering for distant galaxy parts
 */

import { Scene, Points, BufferGeometry, Float32BufferAttribute, PointsMaterial, TextureLoader } from 'three';

export class ImpostorManager {
  private geometry: BufferGeometry;
  private material: PointsMaterial;
  private points: Points;
  
  constructor() {
    this.geometry = new BufferGeometry();
    this.material = new PointsMaterial({
        size: 2,
        sizeAttenuation: false,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    this.points = new Points(this.geometry, this.material);
    this.points.frustumCulled = false; // Always visible if enabled
    this.points.visible = false;
  }
  
  generateImpostors(starData: Float32Array, colorData: Float32Array) {
    // Subsample the full star data for impostors (e.g., 10%)
    const count = starData.length / 3;
    const impostorCount = Math.floor(count * 0.1);
    
    const positions = new Float32Array(impostorCount * 3);
    const colors = new Float32Array(impostorCount * 3);
    
    let ptr = 0;
    for (let i = 0; i < count; i += 10) { // Take every 10th
        if (ptr >= impostorCount * 3) break;
        positions[ptr] = starData[i*3];
        positions[ptr+1] = starData[i*3+1];
        positions[ptr+2] = starData[i*3+2];
        
        colors[ptr] = colorData[i*3];
        colors[ptr+1] = colorData[i*3+1];
        colors[ptr+2] = colorData[i*3+2];
        ptr += 3;
    }
    
    this.geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
  }
  
  setVisible(visible: boolean) {
    this.points.visible = visible;
  }
  
  getMesh() {
    return this.points;
  }
}
