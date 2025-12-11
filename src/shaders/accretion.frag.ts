import noiseGLSL from './noise.glsl';

// Accretion disk fragment shader
export const accretionFragmentShader = `
uniform float uTime;
uniform vec3 uInnerColor;
uniform vec3 uOuterColor;

varying vec2 vUv;
varying float vRadius;

${noiseGLSL}

void main() {
  // Radial gradient from inner to outer
  float radialGradient = smoothstep(0.2, 1.0, vRadius);
  vec3 baseColor = mix(uInnerColor, uOuterColor, radialGradient);
  
  // Add turbulence
  float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
  float noise = fbm(vec3(angle * 3.0 + uTime * 0.5, vRadius * 5.0, uTime * 0.2));
  
  // Brightness variation
  float brightness = 0.8 + noise * 0.4;
  
  // Doppler-like color shift (one side brighter)
  float doppler = 1.0 + sin(angle + uTime * 2.0) * 0.2;
  
  // Alpha falloff at edges
  float alpha = smoothstep(1.0, 0.7, vRadius) * smoothstep(0.15, 0.25, vRadius);
  alpha *= brightness * doppler;
  
  gl_FragColor = vec4(baseColor * brightness * doppler, alpha);
}
`;

export default accretionFragmentShader;
