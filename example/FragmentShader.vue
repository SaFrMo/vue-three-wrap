<template>
    <vue-three-wrap
        class="fragment-shader"
        :start="start"
        :update="update"
        :inject-shaders="true"
    >
        <script type="shader/fragment">
            #include <cnoise>

            varying vec2 vUv;
            uniform float time;

            void main() {
                float noise = (cnoise((vUv + time) * 5.) + 1.) / 2.;
                vec4 dark = vec4(0., 0., 0., 1.);
                vec4 light = vec4(1.);
                gl_FragColor = mix(dark, light, noise);
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
