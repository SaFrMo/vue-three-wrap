<template>
    <div class="three-view">
        <canvas ref="canvas" :width="cmpWidth" :height="cmpHeight" />
    </div>
</template>

<script>
import rect from 'fh-components/mixins/rect'
import * as THREE from 'three'

export default {
    mixins: [rect],
    props: {
        width: {
            type: Number,
            default: -1
        },
        height: {
            type: Number,
            default: -1
        },
        update: {
            type: Function,
            default: null
        },
        camera: {
            type: Object,
            default: () => new THREE.PerspectiveCamera(75, 0.5625, 0.1, 1000)
        },
        renderer: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            three: {}
        }
    },
    mounted() {
        this.three.scene = new THREE.Scene()

        this.three.camera = this.camera

        this.three.renderer = new THREE.WebGLRenderer({
            canvas: this.$refs.canvas,
            antialias: true,
            alpha: true,
            ...this.renderer
        })
        this.three.renderer.setSize(this.cmpWidth, this.cmpHeight)

        // example adding a cube to the scene
        // var geometry = new THREE.BoxGeometry(1, 1, 1)
        // var material = new THREE.MeshBasicMaterial({ color: 0x000000 })
        // var cube = new THREE.Mesh(geometry, material)
        // this.three.scene.add(cube)
        // this.three.camera.position.z = 10

        var animate = () => {
            requestAnimationFrame(animate)

            if (this.update) {
                this.update(this.three)
            }

            this.three.renderer.render(this.three.scene, this.three.camera)
        }

        animate()
    },
    computed: {
        cmpWidth() {
            if (this.width != -1) return this.width
            return this.clientRect ? this.clientRect.width : 0
        },
        cmpHeight() {
            if (this.height != -1) return this.height
            return this.clientRect ? this.clientRect.height : 0
        }
    },
    methods: {
        updateCamera() {
            if (!this.three.camera) return

            this.three.camera.aspect = this.cmpWidth / this.cmpHeight
            this.three.camera.updateProjectionMatrix()
            this.three.renderer.setSize(this.cmpWidth, this.cmpHeight)
        }
    },
    watch: {
        cmpWidth(newVal, oldVal) {
            if (newVal == oldVal) return
            this.updateCamera()
        },
        cmpHeight(newVal, oldVal) {
            if (newVal == oldVal) return
            this.updateCamera()
        }
    }
}
</script>

<style lang="scss">
.three-view {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    font-size: 0;
}
</style>
