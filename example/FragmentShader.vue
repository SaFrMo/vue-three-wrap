<template>
    <vue-three-wrap class="fragment-shader" :start="start" :update="update">
        <script type="shader/fragment">
            vec3 mod289(vec3 x) {
                return x - floor(x * (1.0 / 289.0)) * 289.0;
            }

            vec2 mod289(vec2 x) {
                return x - floor(x * (1.0 / 289.0)) * 289.0;
            }

            vec3 permute(vec3 x) {
                return mod289(((x*34.0)+1.0)*x);
            }

            float snoise(vec2 v)
            {
                const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                                  0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                                 -0.577350269189626,  // -1.0 + 2.0 * C.x
                                  0.024390243902439); // 1.0 / 41.0
                // First corner
                vec2 i  = floor(v + dot(v, C.yy) );
                vec2 x0 = v -   i + dot(i, C.xx);

                // Other corners
                vec2 i1;
                //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
                //i1.y = 1.0 - i1.x;
                i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                // x0 = x0 - 0.0 + 0.0 * C.xx ;
                // x1 = x0 - i1 + 1.0 * C.xx ;
                // x2 = x0 - 1.0 + 2.0 * C.xx ;
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;

                // Permutations
                i = mod289(i); // Avoid truncation effects in permutation
                vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                    + i.x + vec3(0.0, i1.x, 1.0 ));

                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                m = m*m ;
                m = m*m ;

                // Gradients: 41 points uniformly over a line, mapped onto a diamond.
                // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;

                // Normalise gradients implicitly by scaling m
                // Approximation of: m *= inversesqrt( a0*a0 + h*h );
                m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

                // Compute final noise value at P
                vec3 g;
                g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }

            varying vec2 vUv;
            uniform float time;

            void main() {
                float noise = snoise((vUv + time) * 10.);
                vec4 dark = vec4(0.09, 0.49, 0.537, 1.);
                gl_FragColor = mix(dark, vec4(0.23, 0.325, 0.537, 1.), noise);
            }
        </script>
    </vue-three-wrap>
</template>

<script>
import VueThreeWrap from '../src/VueThreeWrap'
import * as THREE from 'three'

const ref = {}

export default {
    components: {
        'vue-three-wrap': VueThreeWrap
    },
    methods: {
        start({ scene, camera, vertexShader, fragmentShader }) {
            const geo = new THREE.BoxGeometry()
            const mat = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 }
                },
                vertexShader,
                fragmentShader
            })
            ref.cube = new THREE.Mesh(geo, mat)
            scene.add(ref.cube)

            camera.position.set(2, 1, 2)
            camera.lookAt(new THREE.Vector3(0, 0, 0))
        },
        update() {
            ref.cube.material.uniforms.time.value += 0.002
            ref.cube.rotation.y -= 0.001
        }
    }
}
</script>

<style lang="scss">
.fragment-shader {
}
</style>
