// Star Flicker (Twinkling) logic
// Function to be included in other shaders

float getFlicker(float time, vec3 position) {
    float speed = 2.0;
    float seed = dot(position, vec3(12.9898, 78.233, 45.164));
    return 0.8 + 0.2 * sin(time * speed + seed);
}
