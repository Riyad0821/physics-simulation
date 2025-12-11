/**
 * Radeon Optimized Renderer
 * Specific optimizations for managing WebGL2 context and resources on AMD cards
 */

import { WebGLRenderer, ACESFilmicToneMapping } from 'three';

export class RadeonOptimizedRenderer {
  private renderer: WebGLRenderer | null = null;

  init(canvas: HTMLCanvasElement): WebGLRenderer {
    // 1. Force WebGL2 behavior
    const contextAttributes: WebGLContextAttributes = {
      alpha: false, // Opaque for perf
      antialias: false, // Handle AA in post (FXAA)
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false,
    };

    // 2. Create Renderer
    this.renderer = new WebGLRenderer({
      canvas,
      context: canvas.getContext('webgl2', contextAttributes) as WebGL2RenderingContext,
      ...contextAttributes
    });

    // 3. Configure defaults
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    
    // 4. Radeon Specific: Enable extensions manually if needed
    // Most are auto-enabled in Three.js, but we can verify
    const gl = this.renderer.getContext();
    gl.getExtension('EXT_color_buffer_float');
    gl.getExtension('OES_texture_float_linear');

    return this.renderer;
  }
  
  dispose() {
    this.renderer?.dispose();
  }
}
