<template>
    <main class="example"><three-vue :start="start" :update="update" /></main>
</template>

<script>
/* eslint-disable */
import ThreeVue from '../src/ThreeVue'
import * as THREE from 'three'

let cube

export default {
    components: {
        'three-vue': ThreeVue
    },
    methods: {
        start({ scene, camera, renderer }) {
            // example adding a cube to the scene
            const geometry = new THREE.BoxGeometry(1, 1, 1)
            const material = new THREE.MeshBasicMaterial({ color: 0x000000 })
            cube = new THREE.Mesh(geometry, material)
            scene.add(cube)
            camera.position.z = 10
        },
        update({ scene, camera, renderer }) {
            cube.rotation.y -= 0.01
        }
    }
}
</script>

<style lang="scss">
.example {
}
</style>
