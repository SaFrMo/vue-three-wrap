import EffectComposer from '../effect-composer'
import RenderPass from '../effect-composer/RenderPass'
import ShaderPass from '../effect-composer/ShaderPass'

export default ({ scene, camera, renderer, passes }) => {
    const output = new EffectComposer(renderer)

    // add initial render pass
    output.addPass(new RenderPass(scene, camera))

    if (passes && Array.isArray(passes)) {
        passes.forEach(pass => {
            // add a shader pass
            if (pass.uniforms && pass.vertexShader && pass.fragmentShader) {
                output.addPass(new ShaderPass(pass))
            }
            // add a raw Pass derivative
            else {
                output.addPass(pass)
            }
        })
    }

    output.passes[output.passes.length - 1].renderToScreen = true

    return output
}
