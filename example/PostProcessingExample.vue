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
import EffectComposer from '../src/extras/effect-composer'
import RenderPass from '../src/extras/effect-composer/RenderPass'
import ShaderPass from '../src/extras/effect-composer/ShaderPass'
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

            const geo = new THREE.BoxGeometry()
            const mat = new THREE.MeshLambertMaterial({ color: 0xffcccc })
            ref.box = new THREE.Mesh(geo, mat)

            const sun = new THREE.DirectionalLight()
            sun.position.set(5, 5, 5)
            scene.add(sun)

            scene.add(ref.box)

            // build composer
            this.composer = new EffectComposer(renderer)
            this.composer.addPass(new RenderPass(scene, camera))

            // dots
            const dots = new ShaderPass(DotScreenShader)
            dots.uniforms.scale.value = 4
            this.composer.addPass(dots)

            // rgb shift
            const rgb = new ShaderPass(RGBShiftShader)
            rgb.renderToScreen = true
            this.composer.addPass(rgb)
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
