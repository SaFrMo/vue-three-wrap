import {
    EffectComposer,
    RenderPass,
    EffectPass,
    ShaderPass
} from 'postprocessing'
import _camelCase from 'lodash/camelCase'
import * as Post from 'postprocessing'

const fixCase = input => {
    const cased = _camelCase(input)
    return cased.charAt(0).toUpperCase() + cased.slice(1)
}

export default ({ scene, camera, renderer, passes }) => {
    const output = new Post.EffectComposer(renderer)

    // add initial render pass
    output.addPass(new Post.RenderPass(scene, camera))

    if (passes && Array.isArray(passes)) {
        passes.forEach(pass => {
            // add a shader pass
            if (pass.uniforms && pass.vertexShader && pass.fragmentShader) {
                output.addPass(new Post.ShaderPass(pass))
            } else if (typeof pass === 'string') {
                const propName = fixCase(pass).replace('Effect', '') + 'Effect'
                if (!Post[propName]) {
                    console.log(
                        "postprocessing couldn't find an effect called " +
                            propName
                    )
                } else {
                    output.addPass(
                        new Post.EffectPass(camera, new Post[`${propName}`]())
                    )
                }
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
