// Volumetric Nebula Raymarcher
// Uses 3D noise/texture to raymarch density

uniform float time;
uniform vec3 cameraPos;
uniform vec3 sunPosition;
uniform sampler3D noiseMap; // If supported, or use 2D slice
varying vec2 vUv;
varying vec3 vWorldPosition;

// Simple pseudo-random for noise
float hash(float n) { return fract(sin(n) * 1e4); }

// Value noise
float noise(vec3 x) {
    const vec3 step = vec3(110, 241, 171);
    vec3 i = floor(x);
    vec3 f = fract(x);
    float n = dot(i, step);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                   mix(hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
               mix(mix(hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                   mix(hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
}

// Fractal Brownian Motion
float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100);
    for (int i = 0; i < 5; ++i) {
        v += a * noise(p);
        p = p * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec3 rayDir = normalize(vWorldPosition - cameraPos);
    vec3 rayOrigin = vWorldPosition; // Intersection point on proxy box
    
    float stepSize = 5.0; // Distance per step
    float maxDist = 200.0;
    float currentDist = 0.0;
    
    vec4 accum = vec4(0.0);
    
    for(int i = 0; i < 32; i++) { // Low step count for performance
        if(currentDist > maxDist || accum.a >= 0.95) break;
        
        vec3 p = rayOrigin + rayDir * currentDist;
        
        // Density function
        float den = fbm(p * 0.02 + time * 0.05);
        // Fade edges
        den *= smoothstep(maxDist, 0.0, length(p)); 
        
        if (den > 0.1) {
             vec3 col = mix(vec3(0.5, 0.2, 0.5), vec3(0.1, 0.4, 0.8), den);
             float alpha = den * 0.1;
             
             accum.rgb += col * alpha * (1.0 - accum.a);
             accum.a += alpha;
        }
        
        currentDist += stepSize;
    }
    
    gl_FragColor = accum;
}
