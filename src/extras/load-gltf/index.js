import GLTFLoader from './gltf-loader'

const loader = new GLTFLoader()

export default path => {
    return new Promise((res, rej) => {
        loader.load(path, gltf => res(gltf), undefined, err => rej(err))
    })
}
export const loadObjects = path => {
    return new Promise((res, rej) => {
        loader.load(
            path,
            gltf => {
                res(
                    gltf && gltf.scene && gltf.scene.children
                        ? gltf.scene.children
                        : null
                )
            },
            undefined,
            err => rej(err)
        )
    })
}
