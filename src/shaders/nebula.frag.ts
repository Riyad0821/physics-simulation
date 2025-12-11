import noiseGLSL from './noise.glsl';

// Volumetric nebula fragment shader with raymarching
export const nebulaFragmentShader = `
uniform float uTime;
uniform vec3 uColor;
uniform float uDensity;
uniform float uRadius;
uniform vec3 uCameraPos;

varying vec3 vWorldPos;
varying vec3 vNormal;

${noiseGLSL}

float sampleDensity(vec3 p) {
  // 3D noise for cloud density
  float noise = fbm(p * 0.3 + uTime * 0.02);
  
  // Spherical falloff
  float dist = length(p) / uRadius;
  float falloff = 1.0 - smoothstep(0.0, 1.0, dist);
  
  // Combine noise with falloff
  float density = noise * falloff * uDensity;
  return max(0.0, density);
}

void main() {
  vec3 rayDir = normalize(vWorldPos - uCameraPos);
  vec3 rayOrigin = vWorldPos;
  
  vec4 accumulatedColor = vec4(0.0);
  float stepSize = uRadius * 0.05;
  
  // Raymarching loop
  for (int i = 0; i < 32; i++) {
    vec3 samplePos = rayOrigin + rayDir * float(i) * stepSize;
    float density = sampleDensity(samplePos);
    
    if (density > 0.01) {
      // Light scattering approximation
      vec3 lightDir = normalize(vec3(1.0, 0.5, 0.0));
      float lightDensity = sampleDensity(samplePos + lightDir * stepSize * 2.0);
      float scatter = exp(-lightDensity * 2.0);
      
      vec3 color = uColor * scatter;
      float alpha = density * 0.1;
      
      // Front-to-back compositing
      accumulatedColor.rgb += (1.0 - accumulatedColor.a) * color * alpha;
      accumulatedColor.a += (1.0 - accumulatedColor.a) * alpha;
      
      if (accumulatedColor.a > 0.95) break;
    }
  }
  
  gl_FragColor = accumulatedColor;
}
`;

export default nebulaFragmentShader;
