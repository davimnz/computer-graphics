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

/* Face colors */
const COLOR_RED = 0xff0505;
const COLOR_CYAN = 0x05b8ff;
const COLOR_BLUE = 0x0509ff;
const COLOR_PINK = 0xff05de;
const COLOR_VIOLET = 0x9305ff;
const COLOR_BLACK = 0x000000;
const COLOR_GREEN = 0x05ff15;
const COLOR_ORANGE = 0xff8a05;
const COLOR_YELLOW = 0xf7ff05;
const COLOR_LIGHT_GREEN = 0x02f079;

/* Triangles array */
trianglesArray = []

facesArray = [
    [[-1 / 2, 0, 0], [-1 / 4, 1 / 2, 0], [-1 / 2, 1, 0], COLOR_RED],
    [[0, 1 / 4, 0], [1 / 2, 0, 0], [1 / 2, 1, 0], COLOR_CYAN],
    [[-1 / 4, 1 / 2, 0], [1 / 6, 1 / 2, 0], [0, 1, 0], COLOR_BLUE],
    [[-1 / 4, 1 / 2, 0], [0, 1 / 4, 0], [1 / 6, 1 / 2 , 0], COLOR_PINK],
    [[-1 / 2, 0, 0], [1 / 2, 0, 0], [0, 1 / 4, 0], COLOR_VIOLET],
    [[-1 / 2, 0, 0], [0, - 1 / 2, 0], [1 / 2, 0, 0], COLOR_GREEN],
    [[-1 / 4, 1 / 2, 0], [0, 1, 0], [-1 / 2, 1, 0], COLOR_ORANGE],
    [[1 / 6, 1 / 2, 0], [1 / 2, 1, 0], [0, 1, 0], COLOR_YELLOW],
    [[-1 / 2, 0, 0], [0, 1 / 4, 0], [-1 / 4, 1 / 2, 0], COLOR_LIGHT_GREEN],
];

/* Generate triangles */
facesArray.forEach((face, _) => {
    trianglesArray.push(new Triangle(face[0], face[1], face[2], face[3]));
});

/* Add to scene */
trianglesArray.forEach((triangle, _) => scene.add(triangle.getMesh));

/* Render Loop */
var render = function () {
    requestAnimationFrame(render);

    /* Render the scene */
    renderer.render(scene, camera);
};

render();