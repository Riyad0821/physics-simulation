import * as THREE from 'three';

export class TextureGenerator {
  static generateStarSprite(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    if (!ctx) return new THREE.Texture();

    const centerX = 64;
    const centerY = 64;
    const radius = 60;

    // Create radial gradient for soft glow
    // Core (white/hot) -> Inner Glow -> Outer halo (transparent)
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');     // Core
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)'); // Inner
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)'); // Mid halo
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');           // Edge

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
}
