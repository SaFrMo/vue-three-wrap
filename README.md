Bare-bones Vue component wrapping a THREE.js instance.

See examples [here](https://three-examples.netlify.com/) ([source](https://github.com/SaFrMo/nuxt-three/tree/master/components)).

# Table of Contents

1. [Main](#main)
    1. [Props](#props)
    1. [`start` and `update`](#start-and-update)
    1. [CSS Renderer](#css-renderer)
    1. [Shader Injection](#shader-injection)
1. [Extras](#extras)
    1. [Raycaster](#raycaster)
    1. [Postprocessing](#postprocessing)
        1. [Post Shaders](#post-shaders)
    1. [Object Loader](#object-loader)
    1. [BMFont](#bmfont)

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
                const material = new THREE.MeshBasicMaterial({
                    color: 0xff0000
                })
                ref.cube = new THREE.Mesh(geometry, material)
                ref.cube.position.z = -4

                scene.add(ref.cube)
            },
            // called once per frame
            update({ scene, camera, renderer }) {
                ref.cube.rotation.y -= 0.01
            }
        }
    }
</script>
```

### Props

| Name            | Type                                                                                     | Default                                              | Notes                                                                                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| camera          | Object                                                                                   | `new THREE.PerspectiveCamera(75, 0.5625, 0.1, 1000)` | Main camera.                                                                                                                                             |
| cameraType      | Object, Boolean, String                                                                  | `perspective`                                        | `perspective`, `orthographic`, or `ortho`. Creates the desired [camera](https://threejs.org/docs/index.html#api/en/cameras/Camera) as the scene default. |
| fov             | Number, String                                                                           | `75`                                                 | Camera field of view.                                                                                                                                    |
| height          | Number                                                                                   | -1                                                   | Height of the canvas. -1 to take up full height of container.                                                                                            |
| injectShaders   | Boolean                                                                                  | `false`                                              | Whether or not to inject custom shaders. See [below](#shader-injection).                                                                                 |
| rendererOptions | Object                                                                                   | {}                                                   | Object of [options](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) to be passed directly to the WebGLRenderer.                                |
| renderLoop      | Boolean                                                                                  | true                                                 | Whether or not to call `update` every frame.                                                                                                             |
| renderType      | String                                                                                   | webgl                                                | `webgl` or `css`. Uses the [CSS3DRenderer](https://threejs.org/docs/#examples/renderers/CSS3DRenderer) if set to `css`. (See [below](#css-renderer))     |
| start           | Function({ scene, camera, renderer, slot, elements, CSS, vertexShader, fragmentShader }) | null                                                 | Function to be called once at scene creation.                                                                                                            |
| update          | Function({ scene, camera, renderer, slot, elements, CSS, vertexShader, fragmentShader }) | null                                                 | Function called once per frame.                                                                                                                          |
| width           | Number                                                                                   | -1                                                   | Width of the canvas. -1 to take up full width of container.                                                                                              |

### `start` and `update`

`start` and `update` functions accept one object with the following parameters:

```js
{
    // The THREE scene created by this VueThreeWrap
    scene,
        // The main camera
        camera,
        // The main renderer
        renderer,
        // The contents of the default slot
        slot,
        // An array of all valid elements in the default slot
        elements,
        // an object containing CSS renderer objects (see below)
        CSS,
        // the text of the first <script> tag in the default slot whose type is set to "shader/vertex"
        // (defaults to a standard vertex shader if none exists - see src/utils/shader-defaults.js)
        vertexShader,
        // the text of the first <script> tag in the default slot whose type is set to "shader/fragment"
        // (defaults to a pink fragment shader if none exists - see src/utils/shader-defaults.js)
        fragmentShader
}
```

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

### Shader Injection

Set the `inject-shaders` prop to `true` to inject some common [noise functions](https://github.com/ashima/webgl-noise). You can use THREE's `#include` convention. All return a value of -1 to 1.

-   `float snoise(vec2)` - 2D simplex noise.
-   `float cnoise(vec2)` - 2D Perlin noise.

An example fragment shader using 2D simplex noise:

```html
<vue-three-wrap :inject-shaders="true">
    <script type="shader/fragment">
        #include <snoise>

        varying vec2 vUv;
        uniform float time;

        void main() {
            /* increase the viewing area (* 3) */
            /* scale from -1 -> 1 to 0 -> 2 (+ 1) */
            /* scale from 0 -> 2 to 0 -> 1 (/ 2) */
            float noise = (snoise((vUv + time) * 3.) + 1.) / 2.;
            vec4 dark = vec4(0., 0., 0., 1.);
            vec4 light = vec4(1.);
            gl_FragColor = mix(dark, light, noise);
        }
    </script>
</vue-three-wrap>
```

**Note that comments in your custom shaders must use `/* this format */`, not `// this format`.**

## Extras

### Raycaster

A class that wraps Three's [raycaster](https://threejs.org/docs/index.html#api/en/core/Raycaster).

Example:

```html
<template>
    <vue-three-wrap ref="threeWrap" :start="start" :update="update" />
</template>

<script>
    import Raycaster from 'vue-three-wrap/extras/raycaster'

    const ref = {}

    export default {
        methods: {
            start({ camera }) {
                ref.raycaster = new Raycaster({
                    el: this.$refs.threeWrap.$el,
                    camera: camera
                })

                // (add your scene objects here)
            },
            update({ scene }) {
                // cast against all objects in the scene
                const intersects = ref.raycaster.intersectObjects(
                    scene.children
                )
                // get objects from intersections
                const intersectedObjects = intersects.map(i => i.object)
                console.log(intersects, intersectedObjects)
            }
        }
    }
</script>
```

### Constructor

Defaults shown.

```js
new Raycaster({
    // the area to check on mouseover
    el: document.querySelector('canvas'),

    // the camera that will be doing the raycasting
    camera: null,

    // whether or not to print debug messages
    debug: false,

    // raycaster (optional - will create automatically if not specified)
    raycaster: null
})
```

### Properties

| Name          | Type   | Notes                                                   |
| ------------- | ------ | ------------------------------------------------------- |
| interpolatedX | Number | The normalized relative mouse X position, from -1 to 1. |
| interpolatedY | Number | The normalized relative mouse Y position, from -1 to 1. |
| mouseX        | Number | The latest mouseX position relative to the container.   |
| mouseY        | Number | The latest mouseY position relative to the container.   |

### Methods

| Name             | Arguments                                                         | Notes                                                                                                                                                                                              |
| ---------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| init             | options (same as constructor)                                     | Initializes this raycaster. Same method as called by constructor.                                                                                                                                  |
| updateMouse      | mouse event                                                       | Updates relative mouse coordinates. Called internally.                                                                                                                                             |
| cast             | `{ coordinates: { x: Number, y: Number }, camera: THREE.Camera }` | Raycast and save the results internally. If `coordinates` are unspecified, uses the last coordinates set by `updateMouse`. If `camera` is unspecified, uses the camera added during instantiation. |
| intersectObject  | (object, recursive, optionalTarget, coordinates, camera)          | Calls `cast()` with the given `coordinates` and `camera`, then runs [intersectObject](https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObject) with the first three arguments.   |
| intersectObjects | (objects, recursive, optionalTarget, coordinates, camera)         | Calls `cast()` with the given `coordinates` and `camera`, then runs [intersectObjects](https://threejs.org/docs/index.html#api/en/core/Raycaster.intersectObjects) with the first three arguments. |
| destroy          | None                                                              | Destroys the event listener created during `init`.                                                                                                                                                 |

### Postprocessing

You can use the postprocessor from the [examples](https://threejs.org/examples/?q=post) very easily with the `custom-renderer` prop:

```html
<template>
    <vue-three-wrap
        :custom-renderer="composer"
        :start="start"
        :update="update"
    />
</template>

<script>
    import * as THREE from 'three'
    import QuickComposer from 'vue-three-wrap/extras/quick-composer'
    import DotScreenShader from 'vue-three-wrap/shaders/DotScreenShader'
    import RGBShiftShader from 'vue-three-wrap/shaders/RGBShiftShader'

    const ref = {}

    export default {
        data() {
            return {
                composer: null
            }
        },
        methods: {
            start({ scene, camera, renderer }) {
                // position camera
                camera.position.z = 10

                // add cube
                const geo = new THREE.BoxGeometry()
                const mat = new THREE.MeshLambertMaterial({ color: 0xffcccc })
                ref.box = new THREE.Mesh(geo, mat)
                scene.add(ref.box)

                // add sun
                const sun = new THREE.DirectionalLight()
                sun.position.set(5, 5, 5)
                scene.add(sun)

                // build composer
                this.composer = QuickComposer({
                    scene,
                    camera,
                    renderer,
                    passes: [DotScreenShader, RGBShiftShader]
                })

                // Set a uniform of a pass
                // Note that passes are 1-indexed when using QuickComposer
                this.composer.getPass(1).uniforms.scale.value = 4
                // A quicker way to do the same thing:
                this.composer.setUniform(1, 'scale', 4)
            },
            update() {
                // rotate the box
                ref.box.rotation.x += 0.002
                ref.box.rotation.y -= 0.005

                // move the box in a circle
                const d = Date.now() * 0.0015
                ref.box.position.set(Math.sin(d) * 2, Math.cos(d) * 2, 0)
            }
        }
    }
</script>
```

To use:

1. Import `QuickComposer` from `vue-three-wrap/extras/quick-composer`.
    1. If you want more control of your composer, you can also import `EffectComposer` from `vue-three-wrap/extras/effect-composer`.
1. Set the `custom-renderer` prop in `vue-three-wrap` to an instance of the QuickComposer.
1. Instantiate the QuickComposer with the following options as an object:

    ```
    {
        // these three can just be passed from your start/update functions
        scene,
        camera,
        renderer,

        // an array of shader objects (see below)
        passes: []
    }
    ```

**TODO**: document EffectComposer and QuickComposer

#### Post Shaders

`vue-three-wrap` comes with some complete shaders in the form of JS objects:

-   `DotScreenShader`
-   `RGBShiftShader`

You can import any existing shader from `vue-three-wrap/shaders/YourDesiredShader`.

You can also create your own by making an object with `uniforms`, `vertexShader`, and `fragmentShader` properties:

```
// ExampleShader.js
export default {
    uniforms: {
        // Each uniform ust be an object with a `value` property
        yourUniform: { value: 0}
    },
    vertexShader: 'A string containing your WebGL vertex shader',
    fragmentShader: 'A string containing your WebGL fragment shader'
}
```

You can then use this shader as a pass in the QuickComposer or EffectComposer. Writing shaders is beyond the scope of this readme - take a look at [The Book of Shaders](https://thebookofshaders.com/) for more information.

### Object Loader

You can import `.gltf` and `.glb` files, [the format that Three prefers](https://threejs.org/docs/#manual/en/introduction/Loading-3D-models), using the `load-gltf` extra.

```html
<template>
    <vue-three-wrap class="object-loader" :start="start" />
</template>

<script>
    // to use the loadObjects module:
    import { loadObjects } from 'vue-three-wrap/extras/load-gltf/'
    // to use the default full scene loader:
    import loadScene from 'vue-three-wrap/extras/load-gltf'

    export default {
        methods: {
            async start({ scene, camera, vertexShader, fragmentShader }) {
                // you can load a full scene...
                // const glb = await loadScene('/assets/scene.glb')
                // scene.add(glb.scene)

                // ...or individual objects
                const objects = await loadObjects('/assets/scene.glb')
                objects.forEach(obj => scene.add(obj))

                // remember to add some lighting

                // place and rotate the camera
                camera.position.set(-4, 4, 4)
                camera.lookAt(new THREE.Vector3(0, 0, 0))
            }
        }
    }
</script>
```

### BMFont

`vue-three-wrap` comes with methods to handle loading and displaying text with BMFonts. To use:

1. Convert your font to a BMFont with a tool like [`msdf-bmfont`](https://github.com/Jam3/msdf-bmfont). Place the created `.fnt` and `.png` files in your project.
1. Import the `bmfont` method from `vue-three-wrap/extras/bm-font`and use like this:

```html
<template>
    <vue-three-wrap class="bmfont" :start="start" />
</template>

<script>
    import bmFont from 'vue-three-wrap/extras/bm-font'

    export default {
        methods: {
            async start({ scene }) {
                // `result` is an object with properties { font, texture, geometry, mesh, material }
                const result = await bmFont({
                    // path to .fnt and .png files
                    fnt: '/your-font-file.fnt',
                    png: '/your-font-image.png',

                    // the text you want to display
                    text: 'Your text here!',

                    // OPTIONAL: options to pass to material - see the MSDFShader method here:
                    // https://tympanus.net/codrops/2019/10/10/create-text-in-three-js-with-three-bmfont-text/
                    opts: {
                        // fragmentShader: `void main() { ... }`,
                        // vertexShader: `...`
                        // etc
                    }
                })

                // mesh will be very large by default, so we're moving it away from the camera here
                // mesh is also instantiated upside-down, so the bmFont method rotates it 180deg on the X axis
                scene.add(result.mesh)
                result.mesh.position.z = -130
            }
        }
    }
</script>
```
