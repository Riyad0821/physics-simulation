uniform float size;
uniform float scale;
attribute vec3 color;
varying vec3 vColor;

void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    // Size attenuation: scale size by inverse depth
    gl_PointSize = size * (scale / -mvPosition.z);
}
