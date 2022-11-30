/***
 *** Basic configurations of THREE.js.
 ***
*/

/* Create an empty scene */
var scene = new THREE.Scene();

/* Create a light */
const light = new THREE.SpotLight()
light.position.set(5, 5, 0)
scene.add(light)

/* Create a basic perspective camera */
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight,
    0.1, 
    1000);
    
camera.position.z = 2;

/* Create a renderer */
const renderer = new THREE.WebGLRenderer({ antialias: true });

/* Configure renderer clear color */
renderer.setClearColor("#000000");

/* Configure renderer size */
renderer.setSize(window.innerWidth, window.innerHeight);

/* Append Renderer to DOM */
document.body.appendChild(renderer.domElement);

/* Load gltf files */
const spaceship = new THREE.GLTFLoader();

spaceship.load(
    '/gltf/spaceship.gltf',
    function ( gltf ) {
        scene.add( gltf.scene );

        gltf.animations;
        gltf.scene;
        gltf.scenes;
        gltf.cameras;
        gltf.asset;
    },
    // called while loading is progressing
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // called when loading has errors
    function (error) {
        console.log('An error happened');
    }
)

var render = function() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

render();