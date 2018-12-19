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
        start: {
            type: Function,
            default: null
        },
        update: {
            type: Function,
            default: null
        },
        camera: {
            type: Object,
            default: () => new THREE.PerspectiveCamera(75, 0.5625, 0.1, 1000)
        },
        rendererOptions: {
            type: Object,
            default: () => {}
        },
        renderLoop: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            three: {}
        }
    },
    mounted() {
        // create scene, camera, and renderer
        this.three.scene = new THREE.Scene()
        this.three.camera = this.camera
        this.three.renderer = new THREE.WebGLRenderer({
            canvas: this.$refs.canvas,
            antialias: true,
            alpha: true,
            ...this.rendererOptions
        })

        // update camera
        this.updateCamera()

        // run start function if one provided
        if (this.start) {
            this.start(this.three)
        }

        // kick animation
        this.render()
    },
    computed: {
        cmpWidth() {
            // use width prop if provided
            if (this.width != -1) return this.width
            // fall back to client rect size or 0
            return this.clientRect ? this.clientRect.width : 0
        },
        cmpHeight() {
            // use height prop if provided
            if (this.height != -1) return this.height
            // fall back to client rect size or 0
            return this.clientRect ? this.clientRect.height : 0
        }
    },
    methods: {
        updateCamera() {
            // ignore if no camera
            if (!this.three.camera) return

            // update aspect ratio, projection matrix, and renderer size
            this.three.camera.aspect = this.cmpWidth / this.cmpHeight
            this.three.camera.updateProjectionMatrix()
            this.three.renderer.setSize(this.cmpWidth, this.cmpHeight)
        },
        render() {
            // request next frame
            if (this.renderLoop) {
                requestAnimationFrame(this.render)
            }

            if (this.update) {
                this.update(this.three)
            }

            this.three.renderer.render(this.three.scene, this.three.camera)
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
