import createGeometry from './bmFontLibs'
import loadBmFont from 'load-bmfont'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import MSDFShader from './bmFontLibs/shaders/msdf'

export const bmFont = ({ fnt, png, text }) => {
    return new Promise((res, rej) => {
        try {
            loadBmFont(fnt, (err, font) => {
                const geometry = createGeometry(
                    {
                        font,
                        text
                    },
                    THREE
                )

                const loader = new TextureLoader()
                loader.load(png, texture => {
                    res({ font, texture, geometry })
                })
            })
        } catch (err) {
            rej(err)
        }
    })
}

export const quickText = async ({ fnt, png, text, opts }) => {
    const { font, texture, geometry } = await bmFont({ fnt, png, text })
    const mat = new THREE.RawShaderMaterial(
        MSDFShader(
            {
                map: texture,
                color: 0x000000,
                side: THREE.DoubleSide,
                transparent: true,
                negate: false,
                ...opts
            },
            THREE
        )
    )

    const mesh = new THREE.Mesh(geometry, mat)
    // default rotation fix
    mesh.rotation.set(Math.PI, 0, 0)
    return { font, texture, geometry, mesh }
}

export default quickText
