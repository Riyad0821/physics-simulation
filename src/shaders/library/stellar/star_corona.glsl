// Star Corona Shader
// Billboard shader with radial fade for atmospheric glow

uniform vec3 color;
uniform float intensity;
varying vec2 vUv;

void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);
    
    // Smooth radial falloff
    float alpha = smoothstep(0.5, 0.0, dist);
    
    // Power curve for glowing center
    alpha = pow(alpha, 2.0);
    
    gl_FragColor = vec4(color, alpha * intensity);
}
