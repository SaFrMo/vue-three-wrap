<template>
    <main class="example">
        <vue-three-wrap :start="start1" :update="update1" />

        <vue-three-wrap
            :start="start2"
            :update="update2"
            renderType="css"
            class="css"
        >
            <h2>I'm an h2</h2>
            <p>And I'm a paragraph</p>
        </vue-three-wrap>

        <vue-three-wrap />
        <vue-three-wrap />
    </main>
</template>

<script>
/* eslint-disable */
import VueThree from '../src/VueThreeWrap'
import * as THREE from 'three'

let cube
let cssRef = {}

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

        start2({ scene, camera, renderer, elements, CSS }) {
            cssRef.h2 = new CSS.CSS3DObject(elements[0])
            cssRef.p = new CSS.CSS3DObject(elements[1])
            scene.add(cssRef.h2)
            scene.add(cssRef.p)

            cssRef.h2.position.set(20, 0, 0)
            cssRef.h2.lookAt(new THREE.Vector3(0, 20, 20))

            cssRef.p.position.set(-20, -20, 0)
            cssRef.p.lookAt(new THREE.Vector3(0, 0, 20))
            camera.position.z = 150
        },
        update2() {
            cssRef.h2.rotation.z += 0.01
        }
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

    .css {
        font-size: 16px;
    }
}
</style>
