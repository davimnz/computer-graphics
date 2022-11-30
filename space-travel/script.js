/***
 *** Basic configurations of THREE.js.
 ***
*/

/* Create an empty scene */
var scene = new THREE.Scene();

/* Create a renderer */
var renderer = new THREE.WebGLRenderer({ antialias: true });

/* Create a basic perspective camera */
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

/* Configure renderer clear color */
renderer.setClearColor("#000000");

/* Configure renderer size */
renderer.setSize(window.innerWidth, window.innerHeight);

/* Append Renderer to DOM */
document.body.appendChild(renderer.domElement);

/* Load gltf files */
const loader = new THREE.GLTFLoader();

loader.load(
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