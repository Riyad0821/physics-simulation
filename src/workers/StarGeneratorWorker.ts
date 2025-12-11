/**
 * Star Generator Worker
 * Offloads massive star data generation to a web worker.
 */

import { expose } from 'comlink';
import * as THREE from 'three';
import { StarFactory } from '@/components/galaxy/stellar/StarFactory';
import { GALAXY_CONFIG } from '@/config/galaxy.config';

class StarGenerator {
  private factory: StarFactory;

  constructor() {
    this.factory = new StarFactory();
  }

  generateBatch(count: number, offset: number, batchId: number) {
    // ArrayBuffers for transfer
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const types = new Float32Array(count); // Store type index if needed, or simple ID

    for (let i = 0; i < count; i++) {
        const r = Math.random() * GALAXY_CONFIG.science.diskRadius;
        const theta = Math.random() * Math.PI * 2 * GALAXY_CONFIG.science.armWinding;
        
        const star = this.factory.generateStar(r, theta);
        
        positions[i*3] = star.position.x;
        positions[i*3+1] = star.position.y;
        positions[i*3+2] = star.position.z;
        
        colors[i*3] = star.color.r;
        colors[i*3+1] = star.color.g;
        colors[i*3+2] = star.color.b;
        
        sizes[i] = star.size;
    }

    // Zero-copy transfer
    return {
        positions,
        colors,
        sizes,
        batchId
    };
  }
}

expose(StarGenerator);
