/***
 *** Basic configurations of THREE.js.
 ***
*/

/* Create an empty scene */
var scene = new THREE.Scene();

/* Create a light */
const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 20);
scene.add(light);

/* Create a basic perspective camera */
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight,
    0.1, 
    1000);
    
camera.position.z = 5;

/* Create a renderer */
const renderer = new THREE.WebGLRenderer({ antialias: true });

/* Configure renderer clear color */
renderer.setClearColor("#000000");

/* Configure renderer size */
renderer.setSize(window.innerWidth, window.innerHeight);

/* Append Renderer to DOM */
document.body.appendChild(renderer.domElement);

/* Load gltf files */
var loader = new THREE.GLTFLoader();
var spaceship;

loader.load(
    '/gltf/spaceship.gltf',
    function ( gltf ) {
        scene.add( gltf.scene );
        spaceship = gltf.scene;
        gltf.animations;
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

const R_KEY = 114;
const E_KEY = 101;

var x = 0;

const onKeyPress = (event) => {
    if (event.keyCode == R_KEY) {
        x -= 0.1;
        spaceship.position.set(x, 0, 0);
    }
    else if (event.keyCode == E_KEY) {
        x += 0.1;
        spaceship.position.set(x, 0, 0);
    }
}

window.addEventListener('keypress', onKeyPress);

var render = function() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

render();