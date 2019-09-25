<template>
    <vue-three-wrap class="object-loader" :start="start">
        <p class="info">
            This is a <code>.glb</code> object exported from Blender and loaded
            using the <code>load-gltf</code> extra.
        </p>
    </vue-three-wrap>
</template>

<script>
import VueThreeWrap from '../src/VueThreeWrap'
import * as THREE from 'three'
import { loadObjects, default as loadScene } from '../src/extras/load-gltf/'

const ref = {}

export default {
    components: {
        'vue-three-wrap': VueThreeWrap
    },
    methods: {
        async start({ scene, camera, vertexShader, fragmentShader }) {
            this.prepLighting(scene)

            // you can load a full scene...
            // const glb = await loadScene('/assets/scene.glb')
            // ref.scene = glb.scene
            // scene.add(ref.scene)

            // ...or individual objects
            ref.objects = await loadObjects('/assets/scene.glb')
            ref.objects.forEach(obj => scene.add(obj))

            camera.position.set(-4, 4, 4)
            camera.lookAt(new THREE.Vector3(0, 0, 0))
        },
        prepLighting(scene) {
            // Ambient light
            ref.light = new THREE.AmbientLight(0xffffff, 0.5)

            // Shadow light
            ref.shadowLight = new THREE.DirectionalLight(0xffffff, 0.5)
            ref.shadowLight.position.set(200, 200, 200)
            ref.shadowLight.castShadow = true
            ref.shadowLight.shadow.mapSize.width = ref.shadowLight.shadow.mapSize.height = 2048

            // Backlight
            ref.backLight = new THREE.DirectionalLight(0xffffff, 0.2)
            ref.backLight.position.set(-100, 200, 50)
            // ref.backLight.castShadow = true

            // Add lights
            scene.add(ref.backLight)
            scene.add(ref.light)
            scene.add(ref.shadowLight)
        }
    }
}
</script>

<style lang="scss">
.object-loader {
    .info {
        font-size: 14px;
        position: absolute;
        right: 20px;
        bottom: 0;
        left: 20px;
        background: white;
    }
}
</style>
