export const vertex = `uniform vec2 uvScale;
varying vec2 vUv;
uniform float time;

void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}`

export const fragment = `void main() {
    gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
}`
