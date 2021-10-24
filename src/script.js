import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Loader
 */
const loader = new THREE.TextureLoader()

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true



/**
 * Sphere
 */
const sphereArr = []
{
    const geo = new THREE.SphereBufferGeometry(2, 64, 64)
    const material = new THREE.MeshStandardMaterial()
    const normalMap = loader.load("/normals/5689d0a9cef193cefd363cf7c23e3dac.png")
    material.roughness = 1
    material.metalness = 1
    material.normalMap = normalMap
    sphereArr.push(new THREE.Mesh(geo, material))
    sphereArr.forEach((object) => {
        scene.add(object)
    })
}

// {
//     const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial())
//     scene.add(mesh)
// }

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * GUI
 */
// Color GUI Picker
class ColorGUIHelper {
    constructor(object, prop) {
        this.object = object
        this.prop = prop
    }
    get value() {
        return `#${this.object[this.prop].getHexString()}`
    }
    set value(hexString) {
        this.object[this.prop].set(hexString)
    }   
}


// GUI controls XYZ
const makeXYZControls = (gui, vec3, name, onChangeFn) => {
    const folder = gui.addFolder(name)
    folder.add(vec3, "x", -10, 10).onChange(onChangeFn)
    folder.add(vec3, "y", -10, 10).onChange(onChangeFn)
    folder.add(vec3, "z", -10, 10).onChange(onChangeFn)
    folder.open()
}


/**
 * Lighting
 */
// Point Light
{
    const color = 0x022f50
    const intensity = 1
    const light = new THREE.PointLight(color, intensity)
    light.power = 40 // lumens
    light.decay = 2
    light.distance = Infinity
    light.position.set(5, 5, 0)
    scene.add(light)

    const helper = new THREE.PointLightHelper(light)
    scene.add(helper)

    const gui = new GUI()
    gui.addColor(new ColorGUIHelper(light, "color"), "value").name("color")
    gui.add(light, "decay", 0, 4, 0.01)
    gui.add(light, "power", 0, 1234)

    makeXYZControls(gui, light.position, 'position');
}

{
    const color = 0x660000
    const intensity = 1
    const light = new THREE.PointLight(color, intensity)
    light.power = 40 // lumens
    light.decay = 2
    light.distance = Infinity
    light.position.set(-5, -5, 6)
    scene.add(light)

    const helper = new THREE.PointLightHelper(light)
    scene.add(helper)

    const gui = new GUI()
    gui.addColor(new ColorGUIHelper(light, "color"), "value").name("color")
    gui.add(light, "decay", 0, 4, 0.01)
    gui.add(light, "power", 0, 1234)

    makeXYZControls(gui, light.position, 'position');
}

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    sphereArr.forEach((object) => {
        object.rotation.y = elapsedTime / 10
        object.rotation.x = elapsedTime / 20
    })

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()