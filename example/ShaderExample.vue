<template>
    <vue-three-wrap :start="start" :update="update">
        <script type="shader/vertex">
            uniform vec2 uvScale;
            varying vec2 vUv;
            varying vec3 vNormal;
            uniform float time;

            void main() {
                vUv = uvScale * uv;

                /* get extruded position */
                vec3 extrude = normal * 5.;

                /* current time in seconds (ie, 1.234) */
                float timeInSeconds = time / 1000.;
                /* speed of bulge movement */
                float speed = 0.5;
                /* number of divisions of this tube */
                /* (higher = more bulges in cartoon pipe) */
                float divisions = 2.;
                /* current coordinate, from 0 to 1 */
                float coord = fract((uv.x - timeInSeconds * speed) * divisions);
                /* the higher the number, the stronger the bulge effect */
                float bulgeExaggeration = 10.;
                /* get intensity of current position */
                float intensity = pow(smoothstep(0., 1., 1. - distance(coord, 0.5)), bulgeExaggeration);

                /* build final position by mixing default position and extruded position */
                vec3 pos = mix(position, position + extrude, intensity);

                vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
                vNormal = normal;

                gl_Position = projectionMatrix * mvPosition;
            }
        </script>

        <script type="shader/fragment">
            varying vec3 vNormal;
            varying vec2 vUv;
            uniform vec3 color;

            void main() {
                vec3 light = vec3( 0.5, 0.2, 1.0 );
                light = normalize( light );
                float dProd = dot( vNormal, light ) * 0.5 + 0.5;
                gl_FragColor = vec4( vec3( dProd ) * vec3( color ), 1.0 );
            }
        </script>
    </vue-three-wrap>
</template>

<script>
import VueThree from '../src/VueThreeWrap'

export default {
    props: {
        start: {
            type: Function
        },
        update: {
            type: Function
        }
    },
    components: {
        'vue-three-wrap': VueThree
    }
}
</script>
