Bare-bones Vue component wrapping a THREE.js instance.

See examples [here](https://three-examples.netlify.com/) ([source](https://github.com/SaFrMo/threejs-examples/tree/master/src/examples)).

# Table of Contents

1. [Main](#main)
1. [Mixins](#mixins)
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

export default {
    components: {
        'vue-three-wrap': VueThreeWrap
    },
    methods: {
        // called once when the scene is created
        start({ scene, camera, renderer }) {

        },
        // called once per frame
        update({ scene, camera, renderer }) {

        }
    }
}
</script>
```

## Props

| Name            | Type                                                       | Default                                              | Notes                                                                                                                                                |
| --------------- | ---------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| camera          | Object                                                     | `new THREE.PerspectiveCamera(75, 0.5625, 0.1, 1000)` | Main camera.                                                                                                                                         |
| height          | Number                                                     | -1                                                   | Height of the canvas. -1 to take up full height of container.                                                                                        |
| rendererOptions | Object                                                     | {}                                                   | Object of [options](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) to be passed directly to the WebGLRenderer.                            |
| renderLoop      | Boolean                                                    | true                                                 | Whether or not to call `update` every frame.                                                                                                         |
| renderType      | String                                                     | webgl                                                | `webgl` or `css`. Uses the [CSS3DRenderer](https://threejs.org/docs/#examples/renderers/CSS3DRenderer) if set to `css`. (See [below](#css-renderer)) |
| start           | Function({ scene, camera, renderer, slot, elements, CSS }) | null                                                 | Function to be called once at scene creation.                                                                                                        |
| update          | Function({ scene, camera, renderer, slot, elements, CSS }) | null                                                 | Function called once per frame.                                                                                                                      |
| width           | Number                                                     | -1                                                   | Width of the canvas. -1 to take up full width of container.                                                                                          |

## CSS Renderer

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
                ref.h2 = new CSS.CSS3DObject(elements[0])
                ref.p = new CSS.CSS3DObject(elements[1])
                scene.add(ref.h2)
                scene.add(ref.p)

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

## Mixins

### Raycaster

A shortcut to THREE's raycaster.

Example:

```html
<template>
    <vue-three-wrap :update="update"/>
</template>

<script>
import raycaster from 'vue-three-wrap/mixins/raycaster'

export default {
    mixins: [raycaster],
    methods: {
        update({camera}){
            // updates raycaster with default mouse values
            this.updateRaycaster(camera)
        }
    }
}
</script>
```

## TODO: Continue
