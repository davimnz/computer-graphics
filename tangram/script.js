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
    constructor(vertexA, vertexB, vertexC, color, isDraggable) {
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
        this.triangleMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: this.color }));
        this.triangleMesh.userData.isDraggable = isDraggable
        this.triangleMesh.userData.centerOfMass = new THREE.Vector3();
        this.triangleMesh.userData.centerOfMass.copy(vertexOne);
        this.triangleMesh.userData.centerOfMass.add(vertexTwo);
        this.triangleMesh.userData.centerOfMass.add(vertexThree);
        this.triangleMesh.userData.centerOfMass.multiplyScalar(1/3);
    }

    get mesh() {
        return this.triangleMesh;
    }

    set position(newPosition) {
        this.mesh.position.x = newPosition[0];
        this.mesh.position.y = newPosition[1];
        this.mesh.position.z = newPosition[2];
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

/* Base vertices */
const VERTEX_A = [-1 / 2, 1, 0];
const VERTEX_B = [0, 1, 0];
const VERTEX_C = [1 / 2, 1, 0];
const VERTEX_D = [-1 / 4, 1 / 2, 0];
const VERTEX_E = [1 / 6, 1 / 2, 0];
const VERTEX_F = [0, 1 / 4, 0];
const VERTEX_G = [-1 / 2, 0, 0];
const VERTEX_H = [1 / 2, 0, 0];
const VERTEX_I = [0, -1 / 2, 0];

/* Define faces */
facesArray = [
    [VERTEX_A, VERTEX_G, VERTEX_D, COLOR_RED],
    [VERTEX_F, VERTEX_H, VERTEX_C, COLOR_CYAN],
    [VERTEX_D, VERTEX_E, VERTEX_B, COLOR_BLUE],
    [VERTEX_D, VERTEX_F, VERTEX_E, COLOR_PINK],
    [VERTEX_G, VERTEX_H, VERTEX_F, COLOR_VIOLET],
    [VERTEX_G, VERTEX_I, VERTEX_H, COLOR_GREEN],
    [VERTEX_D, VERTEX_B, VERTEX_A, COLOR_ORANGE],
    [VERTEX_E, VERTEX_C, VERTEX_B, COLOR_YELLOW],
    [VERTEX_G, VERTEX_F, VERTEX_D, COLOR_LIGHT_GREEN],
];

/* Generate shadow shape */
shadowArray = [];
facesArray.forEach((face, _) => {
    shadowArray.push(new Triangle(face[0], face[1], face[2], COLOR_BLACK, false));
});
shadowArray.forEach((triangle, _) => scene.add(triangle.mesh));

/* Generate triangles with colors */
trianglesArray = []
facesArray.forEach((face, _) => {
    trianglesArray.push(new Triangle(face[0], face[1], face[2], face[3], true));
});
trianglesArray.forEach((triangle, _) => scene.add(triangle.mesh));

/* Translate colored triangles to initial position */
trianglesArray.forEach((triangle, _) => {
    triangle.position = [-3, 0, 0];
});

/* Set drag and drop functions */
var draggable = null;  /* Global draggable object */

const mouseCursorScreenFrame2D = new THREE.Vector2();
const mouseCursorScreenFrame = new THREE.Vector3();
const mouseCursorUnproject = new THREE.Vector3();
const mousePositionWorldFrame = new THREE.Vector3();
const clickPoint = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

const onMouseClick = (event) => {
    if (draggable != null) {
        draggable = null;
        return;
    }

    clickPoint.x = (event.clientX / window.innerWidth) * 2 - 1;
    clickPoint.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(clickPoint, camera);
    const intersections = raycaster.intersectObjects(scene.children);

    /* Move closest draggable element */
    for (var i = 0; i < intersections.length; i++) {
        if (intersections[i].object.userData.isDraggable) {
            draggable = intersections[i].object;
            break;
        }
    }
}

const onMouseMove = (event) => {
    mouseCursorScreenFrame.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseCursorScreenFrame.y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouseCursorScreenFrame.z = 0;

    mouseCursorScreenFrame2D.x = mouseCursorScreenFrame.x;
    mouseCursorScreenFrame2D.y = mouseCursorScreenFrame.y;
    
    mouseCursorUnproject.copy(mouseCursorScreenFrame);
    mouseCursorUnproject.unproject(camera);
    mouseCursorUnproject.sub(camera.position).normalize();
    var distance = -camera.position.z / mouseCursorUnproject.z;
    mousePositionWorldFrame.copy(camera.position).add(mouseCursorUnproject.multiplyScalar(distance));
}

window.addEventListener('click', onMouseClick);
window.addEventListener('mousemove', onMouseMove);

/* Define drag function */
function dragPolygon() {
    if (draggable != null) {
        var centerOfMassWorldFrame = new THREE.Vector3();
        centerOfMassWorldFrame.copy(draggable.userData.centerOfMass);
        centerOfMassWorldFrame.add(draggable.position);
        
        var displacementVectorWorldFrame = new THREE.Vector3();
        displacementVectorWorldFrame.copy(mousePositionWorldFrame);
        displacementVectorWorldFrame.sub(centerOfMassWorldFrame);
        draggable.position.x += displacementVectorWorldFrame.x;
        draggable.position.y += displacementVectorWorldFrame.y;
    }
}

/* Render Loop */
var render = function () {
    dragPolygon();
    requestAnimationFrame(render);

    /* Render the scene */
    renderer.render(scene, camera);
};

render();