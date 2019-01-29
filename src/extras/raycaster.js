import * as THREE from 'three'
import { transform } from 'popmotion'
const { interpolate } = transform

export default class {
    constructor(opts = {}) {
        // set initial properties
        this.mouseX = 0
        this.mouseY = 0
        this.interpolatedX = 0
        this.interpolatedY = 0
        this.initialized = false

        // build raycaster
        this.init(opts)
    }

    init(opts = {}) {
        if (this.initialized) {
            this.destroy()
        }

        // set properties
        this.el = opts.hasOwnProperty('el')
            ? opts.el
            : document.querySelector('canvas')
        this.debug = opts.hasOwnProperty('debug') ? opts.debug : false
        this.camera = opts.hasOwnProperty('camera') ? opts.camera : null

        // warn if anything required is missing
        if (!this.el) {
            if (this.debug) {
                // eslint-disable-next-line
                console.warn(
                    'No valid element passed to raycaster. Exiting early.'
                )
            }
            return
        }

        // build raycaster
        this.raycaster = opts.hasOwnProperty('raycaster')
            ? opts.raycaster
            : new THREE.Raycaster(opts.raycasterOpts)
        this.ray
        // build pointer
        this.el.addEventListener('mousemove', evt => this.updateMouse(evt))

        // mark initialized
        this.initialized = true
    }

    updateMouse(evt) {
        this.mouseX = evt.offsetX
        this.mouseY = evt.offsetY
        const clientRect = this.el.getBoundingClientRect()

        this.interpolatedX = interpolate([0, clientRect.width], [-1, 1])(
            this.mouseX
        )
        this.interpolatedY = interpolate([0, clientRect.height], [1, -1])(
            this.mouseY
        )
    }

    cast(coordinates = null, camera = null) {
        // make sure we have a camera...
        if (camera == null && this.camera == null) {
            if (this.debug) {
                // eslint-disable-next-line
                console.warn(
                    'No camera set, canceling raycast. (Try calling cast(camera)?)'
                )
            }
            return
        }

        // ...and a raycaster
        if (!this.raycaster) {
            if (this.debug) {
                // eslint-disable-next-line
                console.warn('No raycaster available, canceling raycast.')
            }
            return
        }

        coordinates = coordinates || {
            x: this.interpolatedX,
            y: this.interpolatedY
        }
        camera = camera || this.camera

        this.raycaster.setFromCamera(
            new THREE.Vector2(coordinates.x, coordinates.y),
            camera
        )
    }

    // methods from THREE raycaster
    intersectObject(
        object,
        recursive = false,
        optionalTarget = [],
        coordinates = null,
        camera = null
    ) {
        this.cast(coordinates, camera)
        return this.raycaster.intersectObject(object, recursive, optionalTarget)
    }

    intersectObjects(
        objects,
        recursive = false,
        optionalTarget = [],
        coordinates = null,
        camera = null
    ) {
        this.cast(coordinates, camera)
        return this.raycaster.intersectObjects(
            objects,
            recursive,
            optionalTarget
        )
    }

    destroy() {
        if (this.el) {
            this.el.removeEventListener('mousemove', this.updateMouse)
        }
    }
}
