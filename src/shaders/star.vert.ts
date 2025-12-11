// Star vertex shader for instanced rendering
export const starVertexShader = `
attribute float instanceSize;
attribute vec3 instanceColor;
attribute float instanceFlicker;

varying vec3 vColor;
varying float vFlicker;

uniform float uTime;

void main() {
  vColor = instanceColor;
  vFlicker = instanceFlicker;
  
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float distance = -mvPosition.z;
  
  // Size attenuation with distance
  float baseSize = instanceSize * (800.0 / distance);
  
  // Add flickering effect
  float flicker = 1.0 + sin(uTime * instanceFlicker * 3.0) * 0.15;
  
  gl_PointSize = baseSize * flicker;
  gl_PointSize = clamp(gl_PointSize, 0.5, 50.0);
  
  gl_Position = projectionMatrix * mvPosition;
}
`;

export default starVertexShader;
