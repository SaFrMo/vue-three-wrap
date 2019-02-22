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
import buildComposer from '../src/extras/quick-composer'
// import DotScreenShader from '../src/shaders/DotScreenShader'
// import RGBShiftShader from '../src/shaders/RGBShiftShader'

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
            this.composer = buildComposer({
                scene,
                camera,
                renderer,
                passes: [
                    {
                        // will be CapitalCamelCased and have 'Effect' added
                        // so this will be 'PixelationEffect'
                        type: 'pixelation',
                        // passed directly to the constructor of this effect
                        options: 3,
                        // when created
                        created: pass => {
                            // can manipulate this pass once created - example:
                            // pass.setGranularity(20)
                            // save a reference to this pass
                            ref.pixelate = pass
                        }
                    },
                    // can also pass a string for default values
                    // for example, for BloomEffect:
                    'bloom'
                ]
            })
        },
        update() {
            // rotate the box
            ref.box.rotation.x += 0.002
            ref.box.rotation.y -= 0.005

            // move the box in a circle
            const d = Date.now() * 0.0015
            ref.box.position.set(Math.sin(d) * 2, Math.cos(d) * 2, 0)

            ref.pixelate.setGranularity(
                Math.abs(Math.sin(Date.now() / 1000) * 10)
            )
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
