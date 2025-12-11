// Star fragment shader with soft glow
export const starFragmentShader = `
varying vec3 vColor;
varying float vFlicker;

uniform float uTime;

void main() {
  // Distance from center of point sprite
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  
  // Soft circular falloff
  float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
  
  // Add subtle glow halo
  float glow = exp(-dist * 4.0) * 0.5;
  alpha += glow;
  
  // Slight color variation based on flicker
  vec3 color = vColor * (0.9 + sin(uTime * vFlicker) * 0.1);
  
  gl_FragColor = vec4(color, alpha * 0.9);
  
  // Discard transparent pixels
  if (alpha < 0.01) discard;
}
`;

export default starFragmentShader;
