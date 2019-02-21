import EffectComposer from '../effect-composer'
import RenderPass from '../effect-composer/RenderPass'
import ShaderPass from '../effect-composer/ShaderPass'

export default ({ scene, camera, renderer, passes }) => {
    const output = new EffectComposer(renderer)

    // add initial render pass
    output.addPass(new RenderPass(scene, camera))

    // TODO: duck-typing for shaders to smartly add passes
    if (passes && Array.isArray(passes)) {
        passes.forEach(shader => {
            output.addPass(new ShaderPass(shader))
        })
    }

    output.passes[output.passes.length - 1].renderToScreen = true

    return output
}
