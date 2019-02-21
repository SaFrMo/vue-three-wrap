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
import DotScreenShader from '../src/shaders/DotScreenShader'
import RGBShiftShader from '../src/shaders/RGBShiftShader'

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
            // position camera
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
            this.composer = QuickComposer({
                scene,
                camera,
                renderer,
                passes: [DotScreenShader, RGBShiftShader]
            })

            // Set a uniform of a pass
            // Note that passes are 1-indexed when using QuickComposer
            this.composer.getPass(1).uniforms.scale.value = 4
            // A quicker way to do the same thing:
            this.composer.setUniform(1, 'scale', 4)
        },
        update() {
            // rotate the box
            ref.box.rotation.x += 0.002
            ref.box.rotation.y -= 0.005

            // move the box in a circle
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
