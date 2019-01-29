import * as THREE from 'three'
import { pointer, transform } from 'popmotion'
const { interpolate } = transform

export default {
    data() {
        return {
            raycaster: new THREE.Raycaster(),
            mouseX: 0,
            mouseY: 0,
            canvasSelector: 'canvas',
            buildPointer: true
        }
    },
    async mounted() {
        if (this.buildPointer) {
            pointer()
                .pipe(v => {
                    v.x -= this.clientRect.left
                    v.y -= this.clientRect.top

                    v.x = interpolate([0, this.clientRect.width], [-1, 1])(v.x)
                    v.y = interpolate([0, this.clientRect.height], [1, -1])(v.y)

                    return v
                })
                .start(v => {
                    this.mouseX = v.x
                    this.mouseY = v.y
                })
        }
    },
    methods: {
        updateRaycaster(camera, coordinates = null, autoInterpolate = true) {
            let x = this.mouseX
            let y = this.mouseY

            // use manually passed coordinates
            if (coordinates !== null) {
                x = coordinates.hasOwnProperty('x') ? coordinates.x : x
                y = coordinates.hasOwnProperty('y') ? coordinates.y : y

                // interpolate coordinates if desired
                if (autoInterpolate) {
                    x = interpolate([0, this.clientRect.width], [-1, 1])(x)
                    y = interpolate([0, this.clientRect.height], [1, -1])(y)
                }
            }

            // update raycaster
            this.raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
        }
    }
}
