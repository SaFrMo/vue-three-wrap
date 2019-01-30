<template>
    <vue-three-wrap class="fragment-shader" :start="start" :update="update">
    </vue-three-wrap>
</template>

<script>
import VueThreeWrap from '../src/VueThreeWrap'
import * as THREE from 'three'

export default {
    components: {
        'vue-three-wrap': VueThreeWrap
    },
    methods: {
        start() {},
        update() {}
    }
}
</script>

<style lang="scss">
.fragment-shader {
}
</style>
