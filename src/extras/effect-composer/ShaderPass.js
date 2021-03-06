/**
 * @author alteredq / http://alteredqualia.com/
 */
import * as THREE from 'three'
import Pass from './Pass'

export default class extends Pass {
    constructor(shader, textureID) {
        super()
        this.textureID = textureID !== undefined ? textureID : 'tDiffuse'

        if (shader instanceof THREE.ShaderMaterial) {
            this.uniforms = shader.uniforms

            this.material = shader
        } else if (shader) {
            this.uniforms = THREE.UniformsUtils.clone(shader.uniforms)

            this.material = new THREE.ShaderMaterial({
                defines: Object.assign({}, shader.defines),
                uniforms: this.uniforms,
                vertexShader: shader.vertexShader,
                fragmentShader: shader.fragmentShader
            })
        }

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
        this.scene = new THREE.Scene()

        this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null)
        this.quad.frustumCulled = false // Avoid getting clipped
        this.scene.add(this.quad)
    }

    render(renderer, writeBuffer, readBuffer /*deltaTime, maskActive*/) {
        if (this.uniforms[this.textureID]) {
            this.uniforms[this.textureID].value = readBuffer.texture
        }

        this.quad.material = this.material

        renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer)

        if (this.clear) {
            renderer.clear()
        }
        renderer.render(this.scene, this.camera)
    }
}
