<template>
    <main class="example">
        <vue-three-wrap :start="start1" :update="update1" />
        <vue-three-wrap :start="start2" :update="update2" renderType="css" />
        <vue-three-wrap />
        <vue-three-wrap />
    </main>
</template>

<script>
/* eslint-disable */
import VueThree from '../src/VueThreeWrap'
import * as THREE from 'three'

let cube

export default {
    components: {
        'vue-three-wrap': VueThree
    },
    methods: {
        // top left
        start1({ scene, camera, renderer }) {
            // add directional light
            const light = new THREE.DirectionalLight(0xffffff, 1)
            light.position.set(5, 5, 10)
            scene.add(light)

            // add ambient light
            scene.add(new THREE.AmbientLight(0x404040))

            // example adding a cube to the scene
            const geometry = new THREE.BoxGeometry(1, 1, 1)
            const material = new THREE.MeshLambertMaterial({ color: 0x33cc33 })
            cube = new THREE.Mesh(geometry, material)
            scene.add(cube)
            camera.position.z = 10
        },
        update1({ scene, camera, renderer }) {
            cube.rotation.y -= 0.01
        },

        start2({ scene, camera, renderer }) {},
        update2({ scene, camera, renderer }) {}
    }
}
</script>

<style lang="scss">
.example {
    overflow: hidden;
    background: #c44;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    display: grid;
    grid-template: repeat(2, 50%) / repeat(2, 50%);
    grid-gap: 5px;

    & > div {
        background: white;
        position: relative;
    }
}
</style>
