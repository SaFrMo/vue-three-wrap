import _camelCase from 'lodash/camelCase'
import * as Post from 'postprocessing'

// camelcase with first letter capitalized
const capitalCamel = input => {
    const cased = _camelCase(input)
    return cased.charAt(0).toUpperCase() + cased.slice(1)
}

const buildEffectPass = ({ type, options }) => {
    // add an effect pass using postprocessing's special EffectPass
    // first, case the name - example:
    // 'bloom' becomes 'BloomEffect'
    // 'god-rays' becomes 'GodRaysEffect'
    const propName = capitalCamel(type).replace('Effect', '') + 'Effect'
    // if Post has an effect of that name...
    if (Post[propName]) {
        // create and return the pass
        return new Post[propName](options)
    } else {
        // ...otherwise, log an error and don't add anything
        // eslint-disable-next-line
        console.log("postprocessing couldn't find an effect called " + propName)
        return false
    }
}

export default ({ scene, camera, renderer, passes }) => {
    const composer = new Post.EffectComposer(renderer)

    // add initial render pass
    composer.addPass(new Post.RenderPass(scene, camera))

    // prep effect queue
    const effectQueue = []

    if (passes && Array.isArray(passes)) {
        passes.forEach(pass => {
            if (pass.uniforms && pass.vertexShader && pass.fragmentShader) {
                // add a shader pass
                composer.addPass(new Post.ShaderPass(pass))
            } else if (typeof pass === 'string') {
                effectQueue.push(buildEffectPass({ type: pass }, composer))
            } else if (pass.type && pass.options) {
                let eff = buildEffectPass(pass, composer)
                if (pass.created) {
                    pass.created(eff)
                }
                effectQueue.push(eff)
            }
            // add a raw Pass derivative
            else {
                composer.addPass(pass)
            }
        })
    }

    composer.addPass(new Post.EffectPass(camera, ...effectQueue))

    composer.passes[composer.passes.length - 1].renderToScreen = true

    return composer
}
