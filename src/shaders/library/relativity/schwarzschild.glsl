// Schwarzschild Black Hole Shader
// Uses ray tracing/bending for gravitational lensing

uniform vec2 iResolution;
uniform vec3 cameraPos;
uniform vec3 lookAt;
uniform float mass; // Scaled mass factor

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    
    // Simplistic distortion
    // Real implementation requires solving geodesic equations or raymarching curved space
    
    float dist = length(uv);
    float rs = 0.1; // Schwarzschild radius in uv space (scaled)
    
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0); // Event horizon is black
    
    if (dist > rs) {
        // Bend space
        // Deflection angle ~ 4GM/rc^2
        float deflection = 0.05 / dist; 
        
        vec2 distortedUV = uv * (1.0 - deflection);
        
        // This would sample the background texture usually
        // For now, we return transparent to let CSS/Canvas background show through 
        // OR we return a distortion vector for post-processing
        
        // Visualizing the accretion disk
        float disk = smoothstep(0.4, 0.15, abs(dist - 0.3));
        color = vec4(1.0, 0.6, 0.1, 1.0) * disk * 2.0; // Glowing disk
        color.a = disk; 
    }
    
    fragColor = color;
}

// Three.js wrapper expects main()
void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
