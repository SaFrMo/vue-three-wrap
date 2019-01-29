Bare-bones Vue component wrapping a THREE.js instance.

See examples [here](https://three-examples.netlify.com/) ([source](https://github.com/SaFrMo/threejs-examples/tree/master/src/examples)).

# Table of Contents

1. [Main](#main)
    1. [Props](#props)
    1. [CSS Renderer](#css-renderer)
1. [Extras](#mixins)
    1. [Raycaster](#raycaster)

## Main

Usage:

`npm install vue-three-wrap --save`

Then:

```html
<template>
    <main class="example">
        <!-- vue-three-wrap will stretch to fit its container by default -->
        <vue-three-wrap :start="start" :update="update" />
    </main>
</template>

<script>
import VueThreeWrap from 'vue-three-wrap'
import * as THREE from 'three'

// can be handy to store THREE objects in an unwatched object
const ref = {}

export default {
    components: {
        'vue-three-wrap': VueThreeWrap
    },
    methods: {
        // called once when the scene is created
        start({ scene, camera, renderer }) {

            // example - add a cube to the scene
            const geometry = new THREE.BoxGeometry()
            const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
            ref.cube = new THREE.Mesh(geometry, material)
            ref.cube.position.z = 10

            scene.add(ref.cube)

        },
        // called once per frame
        update({ scene, camera, renderer }) {

        }
    }
}
</script>
```

### Props

| Name            | Type                                                       | Default                                              | Notes                                                                                                                                                    |
| --------------- | ---------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| camera          | Object                                                     | `new THREE.PerspectiveCamera(75, 0.5625, 0.1, 1000)` | Main camera.                                                                                                                                             |
| cameraType      | Object, Boolean, String                                    | `perspective`                                        | `perspective`, `orthographic`, or `ortho`. Creates the desired [camera](https://threejs.org/docs/index.html#api/en/cameras/Camera) as the scene default. |
| fov             | Number, String                                             | `75`                                                 | Camera field of view.                                                                                                                                    |
| height          | Number                                                     | -1                                                   | Height of the canvas. -1 to take up full height of container.                                                                                            |
| rendererOptions | Object                                                     | {}                                                   | Object of [options](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) to be passed directly to the WebGLRenderer.                                |
| renderLoop      | Boolean                                                    | true                                                 | Whether or not to call `update` every frame.                                                                                                             |
| renderType      | String                                                     | webgl                                                | `webgl` or `css`. Uses the [CSS3DRenderer](https://threejs.org/docs/#examples/renderers/CSS3DRenderer) if set to `css`. (See [below](#css-renderer))     |
| start           | Function({ scene, camera, renderer, slot, elements, CSS }) | null                                                 | Function to be called once at scene creation.                                                                                                            |
| update          | Function({ scene, camera, renderer, slot, elements, CSS }) | null                                                 | Function called once per frame.                                                                                                                          |
| width           | Number                                                     | -1                                                   | Width of the canvas. -1 to take up full width of container.                                                                                              |

### CSS Renderer

You can use THREE's CSS renderer with `vue-three-wrap`:

```html
<template>
    <vue-three-wrap :start="start" :update="update" renderType="css">
        <h2>I'm an h2</h2>
        <p>And I'm a paragraph</p>
    </vue-three-wrap>
</template>

<script>
    const ref = {}
    export default {
        methods: {
            start({ scene, camera, renderer, elements, CSS }) {
                // `elements` is a list of valid elements in the default slot
                // you'll need to manually create a new CSS3DObject for each separate element, then add it to the scene
                ref.h2 = new CSS.CSS3DObject(elements[0])
                ref.p = new CSS.CSS3DObject(elements[1])
                scene.add(ref.h2)
                scene.add(ref.p)

                // you can also do something iterative like:
                // elements.map(el => new CSS.CSS3DObject(el)).map(cssObj => scene.add(cssObj))

                // some arbitrary scaling and positioning
                // the important thing is that you can work with CSS3DObjects just like regular meshes
                ref.h2.position.set(20, 0, 0)
                ref.h2.lookAt(new THREE.Vector3(0, 20, 20))

                ref.p.position.set(-20, -20, 0)
                ref.p.lookAt(new THREE.Vector3(0, 0, 20))
                camera.position.z = 150
            },
            update() {
                ref.h2.rotation.z += 0.01
            }
        }
    }
</script>
```

To do so:

1. Set the `renderType` prop to `css`.
1. Use the `elements` argument in the `start` method to access elements in the default render slot.
1. Create new CSS3DObjects using the `CSS` property passed to the `start` and `update` functions.

Otherwise, it's just like working with a normal THREE.js scene, just with usable DOM objects.

## Extras

### Raycaster

A class that wraps Three's [raycaster](https://threejs.org/docs/index.html#api/en/core/Raycaster).

Example:

```html
<template>
    <vue-three-wrap ref="threeWrap" :start="start" :update="update"/>
</template>

<script>
import Raycaster from 'vue-three-wrap/extras/raycaster'

const ref = {}

export default {
    methods: {
        start({camera}){
            ref.raycaster = new Raycaster({
                el: this.$refs.threeWrap.$el,
                camera: camera
            })

            // (add your scene objects here)
        },
        update({scene}){
            // cast against all objects in the scene
            const intersects = ref.raycaster.intersectObjects(scene.children)
            // get objects from intersections
            const intersectedObjects = intersects.map(i => i.object)
            console.log(intersects, intersectedObjects)
        }
    }
}
</script>
```

### Constructor

### Properties

### Methods
