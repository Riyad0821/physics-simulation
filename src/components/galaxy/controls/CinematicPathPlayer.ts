/**
 * Cinematic Path Player
 * Handles automated camera movements along defined spline paths
 */

import { CatmullRomCurve3, Vector3, Camera } from 'three';

export class CinematicPathPlayer {
  private path: CatmullRomCurve3;
  private progress: number = 0;
  private isPlaying: boolean = false;
  private duration: number = 10000; // ms

  constructor(points: Vector3[]) {
    this.path = new CatmullRomCurve3(points);
  }

  play(duration: number = 10000) {
    this.duration = duration;
    this.progress = 0;
    this.isPlaying = true;
  }

  stop() {
    this.isPlaying = false;
  }

  update(camera: Camera, delta: number) {
    if (!this.isPlaying) return;

    this.progress += (delta * 1000) / this.duration;
    
    if (this.progress >= 1) {
        this.progress = 1;
        this.isPlaying = false;
    }

    const position = this.path.getPoint(this.progress);
    camera.position.copy(position);
    
    // Optional: Look at next point
    const nextPos = this.path.getPoint(Math.min(this.progress + 0.01, 1));
    camera.lookAt(nextPos);
  }
}
