// Galaxy Controls - Camera presets and animation
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { CAMERA_PRESETS, CameraPreset } from './types';

interface CameraTransition {
  startPosition: THREE.Vector3;
  endPosition: THREE.Vector3;
  startTarget: THREE.Vector3;
  endTarget: THREE.Vector3;
  startFov: number;
  endFov: number;
  progress: number;
  duration: number;
}

export class GalaxyControlsManager {
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls | null = null;
  private transition: CameraTransition | null = null;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }

  setControls(controls: OrbitControls) {
    this.controls = controls;
  }

  /**
   * Animate to a camera preset
   */
  goToPreset(presetIndex: number, duration = 2) {
    const preset = CAMERA_PRESETS[presetIndex];
    if (!preset || !this.controls) return;

    this.transition = {
      startPosition: this.camera.position.clone(),
      endPosition: preset.position.clone(),
      startTarget: this.controls.target.clone(),
      endTarget: preset.target.clone(),
      startFov: this.camera.fov,
      endFov: preset.fov || this.camera.fov,
      progress: 0,
      duration,
    };
  }

  /**
   * Reset to default view
   */
  resetView() {
    this.goToPreset(4, 1.5); // Wide Galaxy preset
  }

  /**
   * Focus on a specific position
   */
  focusOn(position: THREE.Vector3, distance = 50, duration = 1.5) {
    if (!this.controls) return;

    const direction = new THREE.Vector3()
      .subVectors(this.camera.position, this.controls.target)
      .normalize();
    
    const newPosition = position.clone().add(direction.multiplyScalar(distance));

    this.transition = {
      startPosition: this.camera.position.clone(),
      endPosition: newPosition,
      startTarget: this.controls.target.clone(),
      endTarget: position.clone(),
      startFov: this.camera.fov,
      endFov: 50,
      progress: 0,
      duration,
    };
  }

  /**
   * Update camera transition (call in animation loop)
   */
  update(delta: number): boolean {
    if (!this.transition || !this.controls) return false;

    this.transition.progress += delta / this.transition.duration;

    if (this.transition.progress >= 1) {
      // Complete the transition
      this.camera.position.copy(this.transition.endPosition);
      this.controls.target.copy(this.transition.endTarget);
      this.camera.fov = this.transition.endFov;
      this.camera.updateProjectionMatrix();
      this.transition = null;
      return false;
    }

    // Smooth easing
    const t = this.easeInOutCubic(this.transition.progress);

    // Interpolate position
    this.camera.position.lerpVectors(
      this.transition.startPosition,
      this.transition.endPosition,
      t
    );

    // Interpolate target
    this.controls.target.lerpVectors(
      this.transition.startTarget,
      this.transition.endTarget,
      t
    );

    // Interpolate FOV
    this.camera.fov = THREE.MathUtils.lerp(
      this.transition.startFov,
      this.transition.endFov,
      t
    );
    this.camera.updateProjectionMatrix();

    return true;
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}
