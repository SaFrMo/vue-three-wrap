import * as THREE from 'three'

// let mountTime = 0

// copied from https://threejs.org/docs/index.html#api/en/geometries/TubeGeometry
function CustomSinCurve(scale) {
    THREE.Curve.call(this)

    this.scale = scale === undefined ? 1 : scale
}

CustomSinCurve.prototype = Object.create(THREE.Curve.prototype)
CustomSinCurve.prototype.constructor = CustomSinCurve

CustomSinCurve.prototype.getPoint = function(t) {
    var tx = t * 10 - 5
    var ty = Math.sin(2 * Math.PI * t) * 0.5
    var tz = 0

    return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale)
}

export default CustomSinCurve
