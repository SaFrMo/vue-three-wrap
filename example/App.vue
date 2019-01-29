<template>
    <main class="example">
        <!-- Regular ol' spinning cube -->
        <vue-three-wrap :start="start1" :update="update1" />

        <!-- CSS 3D text -->
        <vue-three-wrap
            :start="start2"
            :update="update2"
            renderType="css"
            class="css"
        >
            <h2>I'm an h2</h2>
            <p>And I'm a paragraph</p>
        </vue-three-wrap>

        <!-- Orthographic camera + raycaster -->
        <vue-three-wrap
            :start="start3"
            :update="update3"
            camera-type="ortho"
            fov="10"
            ref="ortho"
        />

        <!-- <vue-three-wrap /> -->
    </main>
</template>

<script>
/* eslint-disable */
import VueThree from '../src/VueThreeWrap'
import * as THREE from 'three'
import Raycaster from '../src/extras/raycaster'

const ref = {}
let cssRef = {}

const addLight = scene => {
    // add directional light
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(5, 5, 10)
    scene.add(light)

    // add ambient light
    scene.add(new THREE.AmbientLight(0x888888))
}

export default {
    components: {
        'vue-three-wrap': VueThree
    },
    methods: {
        // top left
        start1({ scene, camera, renderer }) {
            // add light to scene
            addLight(scene)

            // example adding a cube to the scene
            const geometry = new THREE.BoxGeometry(1, 1, 1)
            const material = new THREE.MeshLambertMaterial({ color: 0x33cc33 })
            ref.cube = new THREE.Mesh(geometry, material)
            scene.add(ref.cube)
            camera.position.z = 10
        },
        update1({ scene, camera, renderer }) {
            ref.cube.rotation.y -= 0.01
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
        },

        start3({ scene, camera }) {
            addLight(scene)

            ref.orthoCubes = []

            // add a bunch of cubes
            for (let x = 0; x < 10; x++) {
                for (let y = 0; y < 10; y++) {
                    const geo = new THREE.BoxGeometry(1, 1, 1)
                    const mat = new THREE.MeshLambertMaterial({
                        color: 0xff00aa
                    })

                    const cube = new THREE.Mesh(geo, mat)
                    cube.position.x = x * 2
                    cube.position.z = y * 2
                    scene.add(cube)
                    ref.orthoCubes.push(cube)
                }
            }

            camera.position.x = 1
            camera.position.y = 6
            camera.position.z = 2

            camera.lookAt(8, 0, 7)

            ref.raycaster = new Raycaster({
                el: this.$refs.ortho.$el,
                debug: true,
                camera
            })
        },
        update3({ camera }) {
            const intersects = ref.raycaster.intersectObjects(ref.orthoCubes)
            const intersectedObjects = intersects.map(i => i.object)

            // default to pink
            ref.orthoCubes.forEach(cube => {
                cube.material.color.setHex(0xff00aa)
            })

            // hover = blue
            intersectedObjects.forEach(obj =>
                obj.material.color.setHex(0x0000ff)
            )
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
