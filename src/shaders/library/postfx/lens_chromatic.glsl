// Chromatic Lensing Shader for Post-Processing

uniform float mass;
uniform vec2 center;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 dir = uv - center;
    float dist = length(dir);
    
    // Chromatic aberration based on distortion strength
    float strength = mass / (dist + 0.01);
    
    vec2 offsetRed = normalize(dir) * strength * 0.01;
    vec2 offsetBlue = -normalize(dir) * strength * 0.005;
    
    // Sample texture with offsets (Postprocessing lib handles texture access usually via standard functions or texture2D(inputBuffer, ...))
    // This is a placeholder for the actual convolution logic in CustomEffect
    
    outputColor = inputColor; 
    // In real Postprocessing Effect, we'd sample inputBuffer here using inputColor's coords offset
} 
