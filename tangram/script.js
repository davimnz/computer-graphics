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
        var triangle = new THREE.Triangle(this.vertexA.clone(), this.vertexB.clone(), this.vertexC.clone());
        var normal = triangle.normal();
        geometry.vertices.push(triangle.a);
        geometry.vertices.push(triangle.b);
        geometry.vertices.push(triangle.c);
        geometry.faces.push(new THREE.Face3(0, 1, 2, normal));
        this.triangleMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: this.color }));

        this.centerOfMass = new THREE.Vector3().copy(this.vertexA);
        this.centerOfMass.add(this.vertexB);
        this.centerOfMass.add(this.vertexC);
        this.centerOfMass.divideScalar(3);
        /* Center triangles that we want to rotate */
        if (isDraggable) {
            geometry.center();
        }

        this.triangleMesh.userData.isDraggable = isDraggable
        this.triangleMesh.userData.localVertexA = geometry.vertices[0];
        this.triangleMesh.userData.localVertexB = geometry.vertices[1];
        this.triangleMesh.userData.localVertexC = geometry.vertices[2];
        this.triangleMesh.userData.centerOfMass = this.centerOfMass;
    }

    get mesh() {
        return this.triangleMesh;
    }

    set position(newPosition) {
        this.mesh.position.x = newPosition.x;
        this.mesh.position.y = newPosition.y;
        this.mesh.position.z = newPosition.z;
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
const VERTEX_A = new THREE.Vector3(-1 / 2, 1, 0);
const VERTEX_B = new THREE.Vector3(0, 1, 0);
const VERTEX_C = new THREE.Vector3(1 / 2, 1, 0);
const VERTEX_D = new THREE.Vector3(-1 / 4, 1 / 2, 0);
const VERTEX_E = new THREE.Vector3(1 / 6, 1 / 2, 0);
const VERTEX_F = new THREE.Vector3(0, 1 / 4, 0);
const VERTEX_G = new THREE.Vector3(-1 / 2, 0, 0);
const VERTEX_H = new THREE.Vector3(1 / 2, 0, 0);
const VERTEX_I = new THREE.Vector3(0, -1 / 2, 0);

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

/* Base positions for colored triangles */
// initialPositions = [
//     /* [displacement, rotation (rad)] */
//     [new THREE.Vector3(-2, 1, 0), -2],
//     [new THREE.Vector3(-3, 1, 0), 2],
//     [new THREE.Vector3(-4, 1, 0), 0],
//     [new THREE.Vector3(-2, 0, 0), 0.5],
//     [new THREE.Vector3(-3, 0, 0), 1.5],
//     [new THREE.Vector3(-4, 0, 0), -1.5],
//     [new THREE.Vector3(-2, -1, 0), -1],
//     [new THREE.Vector3(-3, -1, 0), -0.5],
//     [new THREE.Vector3(-4, -1, 0), 1],
// ]
initialPositions = [
    /* [displacement, rotation (rad)] */
    [new THREE.Vector3(-2, 1, 0), 0],
    [new THREE.Vector3(-3, 1, 0), 0],
    [new THREE.Vector3(-4, 1, 0), 0],
    [new THREE.Vector3(-2, 0, 0), 0],
    [new THREE.Vector3(-3, 0, 0), 0],
    [new THREE.Vector3(-4, 0, 0), 0],
    [new THREE.Vector3(-2, -1, 0), 0],
    [new THREE.Vector3(-3, -1, 0), 0],
    [new THREE.Vector3(-4, -1, 0), 0],
]

/* Generate shadow shape */
shadowArray = [];
facesArray.forEach((face, _) => {
    shadowArray.push(new Triangle(face[0].clone(), face[1].clone(), face[2].clone(), COLOR_BLACK, false));
});
shadowArray.forEach((triangle, _) => scene.add(triangle.mesh));

/* Generate triangles with colors */
trianglesArray = []
facesArray.forEach((face, _) => {
    trianglesArray.push(new Triangle(face[0].clone(), face[1].clone(), face[2].clone(), face[3], true));
});
trianglesArray.forEach((triangle, _) => scene.add(triangle.mesh));

/* Translate and rotate colored triangles to initial position */
for (var i = 0; i < initialPositions.length; i++) {
    trianglesArray[i].position = initialPositions[i][0];
    trianglesArray[i].mesh.rotateZ(initialPositions[i][1]);
}

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
function updateVerticesPosition(draggable) {
    var vertexA = new THREE.Vector3().copy(draggable.userData.localVertexA);
    vertexA.add(new THREE.Vector3(draggable.position.x, draggable.position.y, 0));
    
    var vertexB = new THREE.Vector3().copy(draggable.userData.localVertexB);
    vertexB.add(new THREE.Vector3(draggable.position.x, draggable.position.y, 0));

    var vertexC = new THREE.Vector3().copy(draggable.userData.localVertexC);
    vertexC.add(new THREE.Vector3(draggable.position.x, draggable.position.y, 0));

    // console.log(vertexA, vertexB, vertexC);
}

function dragPolygon() {
    if (draggable != null) {
        draggable.position.x = mousePositionWorldFrame.x;
        draggable.position.y = mousePositionWorldFrame.y;
        updateVerticesPosition(draggable);
    }
}

/* Set rotation functions */
const R_KEY = 114;
const E_KEY = 101;
const Z_ANGULAR_VELOCITY = 0.1;

const onKeyPress = (event) => {
    if (event.keyCode == R_KEY) {
        if (draggable != null) {
            draggable.rotateZ(Z_ANGULAR_VELOCITY);
            draggable.userData.localVertexA.applyAxisAngle(new THREE.Vector3(0, 0, 1), Z_ANGULAR_VELOCITY);
            draggable.userData.localVertexB.applyAxisAngle(new THREE.Vector3(0, 0, 1), Z_ANGULAR_VELOCITY);
            draggable.userData.localVertexC.applyAxisAngle(new THREE.Vector3(0, 0, 1), Z_ANGULAR_VELOCITY);
            updateVerticesPosition(draggable);
        }
    }
    else if (event.keyCode == E_KEY) {
        if (draggable != null) {
            draggable.rotateZ(-Z_ANGULAR_VELOCITY);
            draggable.userData.localVertexA.applyAxisAngle(new THREE.Vector3(0, 0, 1), -Z_ANGULAR_VELOCITY);
            draggable.userData.localVertexB.applyAxisAngle(new THREE.Vector3(0, 0, 1), -Z_ANGULAR_VELOCITY);
            draggable.userData.localVertexC.applyAxisAngle(new THREE.Vector3(0, 0, 1), -Z_ANGULAR_VELOCITY);
            updateVerticesPosition(draggable);
        }
    }
}

window.addEventListener('keypress', onKeyPress);

/* Render Loop */
var render = function () {
    if (draggable == null) {
        /* Verify if game ended */
        var isEnd = checkEnd();
        if (isEnd) {
            /* Show the end window */
            var clickedButton = window.confirm("Congratulations! You just finished the game.\n Click OK to restart.");
            if (clickedButton) {
                /* Refresh the page */
                window.location.reload();
            }
        }
    }

    dragPolygon();
    requestAnimationFrame(render);

    /* Render the scene */
    renderer.render(scene, camera);  
};

function checkEnd() {
    var verticesError = 0;
    var gameOver = false;
    for (var i = 0; i < trianglesArray.length; i++) {
        var meshPosition = trianglesArray[i].mesh.position;
        var centerOfMass = trianglesArray[i].centerOfMass;

        var vertexA = new THREE.Vector3().copy(trianglesArray[i].vertexA);
        vertexA.add(meshPosition);
        vertexA.sub(centerOfMass);

        var vertexB = new THREE.Vector3().copy(trianglesArray[i].vertexB);
        vertexB.add(meshPosition);
        vertexB.sub(centerOfMass);

        var vertexC = new THREE.Vector3().copy(trianglesArray[i].vertexC);
        vertexC.add(meshPosition);
        vertexC.sub(centerOfMass);
        
        const triangle_pos = [vertexA, vertexB, vertexC];
        const desired_pos = facesArray[i];
        
        verticesError +=  triangle_pos[0].distanceTo(desired_pos[0]) +
                          triangle_pos[1].distanceTo(desired_pos[1]) +
                          triangle_pos[2].distanceTo(desired_pos[2]);
    }

    if (verticesError <= 2) {
        gameOver = true;
    }

    return gameOver;
}

render();