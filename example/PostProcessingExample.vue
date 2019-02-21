<template>
    <vue-three-wrap
        class="post-processing-example"
        :custom-renderer="composer"
        :start="start"
        :update="update"
    />
</template>

<script>
import * as THREE from 'three'
import VueThreeWrap from '../src/VueThreeWrap'
import QuickComposer from '../src/extras/quick-composer'
import DotScreenShader from '../src/extras/shaders/DotScreenShader'
import RGBShiftShader from '../src/extras/shaders/RGBShiftShader'

const ref = {}

export default {
    components: {
        'vue-three-wrap': VueThreeWrap
    },
    data() {
        return {
            composer: null
        }
    },
    methods: {
        start({ scene, camera, renderer }) {
            camera.position.z = 10

            // add cube
            const geo = new THREE.BoxGeometry()
            const mat = new THREE.MeshLambertMaterial({ color: 0xffcccc })
            ref.box = new THREE.Mesh(geo, mat)
            scene.add(ref.box)

            // add sun
            const sun = new THREE.DirectionalLight()
            sun.position.set(5, 5, 5)
            scene.add(sun)

            // build composer
            const dots = DotScreenShader
            // dots.uniforms.scale.value = 4
            dots.scale = this.composer = QuickComposer({
                scene,
                camera,
                renderer,
                passes: [dots, RGBShiftShader]
            })

            this.composer.setUniforms(1, 'scale', 4)

            // dots
            // dots.uniforms.scale.value = 4
        },
        update() {
            ref.box.rotation.x += 0.002
            ref.box.rotation.y -= 0.005

            const d = Date.now() * 0.0015
            ref.box.position.set(Math.sin(d) * 2, Math.cos(d) * 2, 0)
        }
    }
}
</script>

<style lang="scss">
.post-processing-example {
    canvas {
        background: black;
    }
}
</style>
