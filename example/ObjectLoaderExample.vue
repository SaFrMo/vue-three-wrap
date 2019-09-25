<template>
    <vue-three-wrap class="fragment-shader" :start="start" :update="update" />
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
            const mat = new THREE.MeshBasicMaterial({ color: 0xabd66a })
            ref.cube = new THREE.Mesh(geo, mat)
            scene.add(ref.cube)

            camera.position.set(2, 1, 2)
            camera.lookAt(new THREE.Vector3(0, 0, 0))
        },
        update() {
            ref.cube.rotation.y -= 0.001
        }
    }
}
</script>

<style lang="scss">
.fragment-shader {
}
</style>
