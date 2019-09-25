import GLTFLoader from './gltf-loader'

const loader = new GLTFLoader()

export default path => {
    console.log(loader)
    return new Promise((res, rej) => {
        loader.load(path, gltf => res(gltf), undefined, err => rej(err))
    })
}
