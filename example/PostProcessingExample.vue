<template>
    <vue-three-wrap
        class="post-processing-example"
        :custom-renderer="composer"
        :start="start"
    />
</template>

<script>
import * as THREE from 'three'
import VueThreeWrap from '../src/VueThreeWrap'
import EffectComposer from '../src/extras/effect-composer'
import RenderPass from '../src/extras/effect-composer/RenderPass'
import ShaderPass from '../src/extras/effect-composer/ShaderPass'
import DotScreenShader from '../src/extras/shaders/DotScreenShader'

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
            const geo = new THREE.BoxGeometry()
            const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 })
            ref.box = new THREE.Mesh(geo, mat)

            ref.box.position.z = -10
            scene.add(ref.box)

            // build composer
            this.composer = new EffectComposer(renderer)
            this.composer.addPass(new RenderPass(scene, camera))
            const effect = new ShaderPass(DotScreenShader)
            effect.uniforms.scale.value = 4
            this.composer.addPass(effect)
        }
    }
}
</script>

<style lang="scss">
.post-processing-example {
}
</style>
