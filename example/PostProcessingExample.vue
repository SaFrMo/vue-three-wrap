<template>
    <vue-three-wrap class="post-processing-example" :start="start" />
</template>

<script>
import * as THREE from 'three'
import VueThreeWrap from '../src/VueThreeWrap'

const ref = {}

export default {
    components: {
        'vue-three-wrap': VueThreeWrap
    },
    methods: {
        start({ scene }) {
            const geo = new THREE.BoxGeometry()
            const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 })
            ref.box = new THREE.Mesh(geo, mat)

            ref.box.position.z = -10
            scene.add(ref.box)
        }
    }
}
</script>

<style lang="scss">
.post-processing-example {
}
</style>
