/* Create an empty scene */
var scene = new THREE.Scene();

/* Create a renderer */
var renderer = new THREE.WebGLRenderer({ antialias: true });

/* Create a basic perspective camera */
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

/* Configure renderer clear color */
renderer.setClearColor("#ffffff");

/* Configure renderer size */
renderer.setSize(window.innerWidth, window.innerHeight);

/* Append Renderer to DOM */
document.body.appendChild(renderer.domElement);

/* Classes definition */
class Triangle {
    constructor(vertexA, vertexB, vertexC, color) {
        this.vertexA = vertexA
        this.vertexB = vertexB
        this.vertexC = vertexC
        this.color = color

        var geometry = new THREE.Geometry();
        var vertexOne = new THREE.Vector3(this.vertexA[0], this.vertexA[1], this.vertexA[2]);
        var vertexTwo = new THREE.Vector3(this.vertexB[0], this.vertexB[1], this.vertexC[2]);
        var vertexThree = new THREE.Vector3(this.vertexC[0], this.vertexC[1], this.vertexC[2]);
        var triangle = new THREE.Triangle(vertexOne, vertexTwo, vertexThree);
        var normal = triangle.normal();
        geometry.vertices.push(triangle.a);
        geometry.vertices.push(triangle.b);
        geometry.vertices.push(triangle.c);
        geometry.faces.push(new THREE.Face3(0, 1, 2, normal));
        this.mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: this.color }));
    }

    get getMesh() {
        return this.mesh;
    }
};

/* Sample triangle */
var testTriangle = new Triangle([1, 0, 0], [0, 1, 0], [0, 0, 0], 0xff0000);
scene.add(testTriangle.getMesh);

/* Render Loop */
var render = function () {
    requestAnimationFrame(render);

    /* Render the scene */
    renderer.render(scene, camera);
};

render();