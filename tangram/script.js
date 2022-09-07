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
        this.triangleMesh.userData.worldVertexA = geometry.vertices[0];
        this.triangleMesh.userData.worldVertexB = geometry.vertices[1];
        this.triangleMesh.userData.worldVertexC = geometry.vertices[2];
    }

    get mesh() {
        return this.triangleMesh;
    }

    get worldVertices() {
        return [this.triangleMesh.userData.worldVertexA,
                this.triangleMesh.userData.worldVertexB,
                this.triangleMesh.userData.worldVertexC];
    }

    set position(newPosition) {
        /* Update mesh position */
        this.mesh.position.x = newPosition.x;
        this.mesh.position.y = newPosition.y;
        this.mesh.position.z = newPosition.z;

        /* Update position of vertices in world frame */
        this.mesh.userData.worldVertexA = new THREE.Vector3().copy(this.mesh.userData.localVertexA);
        this.mesh.userData.worldVertexA.add(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, 0));
        this.mesh.userData.worldVertexB = new THREE.Vector3().copy(this.mesh.userData.localVertexB);
        this.mesh.userData.worldVertexB.add(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, 0));
        this.mesh.userData.worldVertexC = new THREE.Vector3().copy(this.mesh.userData.localVertexC);
        this.mesh.userData.worldVertexC.add(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, 0));
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

/* Store the vertices of shadow shape */
shadowPolygon = [VERTEX_I, VERTEX_H, VERTEX_C, VERTEX_A, VERTEX_G];

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
    // TODO: remember to rotate vertices
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

/* Updates the triangle vertices position in world frame */
function updateVerticesPosition(draggable) {
    draggable.userData.worldVertexA = new THREE.Vector3().copy(draggable.userData.localVertexA);
    draggable.userData.worldVertexA.add(new THREE.Vector3(draggable.position.x, draggable.position.y, 0));
    draggable.userData.worldVertexB = new THREE.Vector3().copy(draggable.userData.localVertexB);
    draggable.userData.worldVertexB.add(new THREE.Vector3(draggable.position.x, draggable.position.y, 0));
    draggable.userData.worldVertexC = new THREE.Vector3().copy(draggable.userData.localVertexC);
    draggable.userData.worldVertexC.add(new THREE.Vector3(draggable.position.x, draggable.position.y, 0));
}

/* Updates the triangle vertices orientation in local frame */
function updateVerticesRotationZ(draggable, angle) {
    draggable.userData.localVertexA.applyAxisAngle(new THREE.Vector3(0, 0, 1), angle);
    draggable.userData.localVertexB.applyAxisAngle(new THREE.Vector3(0, 0, 1), angle);
    draggable.userData.localVertexC.applyAxisAngle(new THREE.Vector3(0, 0, 1), angle);
}

/* Define drag function */
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
            updateVerticesRotationZ(draggable, Z_ANGULAR_VELOCITY);
            updateVerticesPosition(draggable);
        }
    }
    else if (event.keyCode == E_KEY) {
        if (draggable != null) {
            draggable.rotateZ(-Z_ANGULAR_VELOCITY);
            updateVerticesRotationZ(draggable, -Z_ANGULAR_VELOCITY);
            updateVerticesPosition(draggable);
        }
    }
}

window.addEventListener('keypress', onKeyPress);

/*** 
 *** Functions to calculate intersection area between two convex polygons 
 ***/

function pointInPolygon(point, polygonVertices) {
    var counter = 0;
    var i;
    var intersectionX;
    var point1, point2;
    const numVertices = polygonVertices.length;

    point1 = polygonVertices[0];
    for (i = 1; i <= numVertices; i++) {
        point2 = polygonVertices[i % numVertices];
        if (point.y > Math.min(point1.y, point2.y)) {
            if (point.y <= Math.max(point1.y, point2.y)) {
                if (point.x <= Math.max(point1.x, point2.x)) {
                    if (point1.y != point2.y) {
                        intersectionX = ((point.y - point1.y) * (point2.x - point1.x)) / (point2.y - point1.y) + point1.x;
                        if (point1.x == point2.x || point.x <= intersectionX) counter++;
                    }
                }
            }
        }
        point1 = point2;
    }

    return counter % 2 !== 0;
}

function pointInsideLine(point, line) {
    return (
        line[0].x <= point.x &&
        point.x <= line[1].x &&
        line[0].y <= point.y &&
        point.y <= line[1].y
    );
}

function lineSuperposition(line1, line2) {
    var points = [];

    for (const v of line2) {
        if (pointInsideLine(v, line1)) {
            points.push(v);
        }
    }

    if (points.length == 1) {
        for (const v of line1) {
            if (
                pointInsideLine(v, line2) &&
                !points.some((p) => p.x === v.x && p.y === v.y)
            ) {
                points.push(v);
            }
        }
    }

    return points;
}

function lineLineIntersection(line1, line2) {
    const x1 = line1[0].x;
    const y1 = line1[0].y;

    const x2 = line1[1].x;
    const y2 = line1[1].y;

    const x3 = line2[0].x;
    const y3 = line2[0].y;

    const x4 = line2[1].x;
    const y4 = line2[1].y;

    const t1Up = (x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4);
    const t1Down = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    const t2Up = (x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2);
    const t2Down = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    const insideLine1 =
        t1Down >= 0 ? 0 <= t1Up && t1Up <= t1Down : 0 >= t1Up && t1Up >= t1Down;
    const insideLine2 =
        t2Down >= 0 ? 0 <= t2Up && t2Up <= t2Down : 0 >= t2Up && t2Up >= t2Down;

    if (insideLine1 && insideLine2) {
        const t1 = t1Up / t1Down;

        if (!t1) {
            return lineSuperposition(line1, line2);
        }
        return { x: x1 + t1 * (x2 - x1), y: y1 + t1 * (y2 - y1) };
    }

    return [];
}

function linePolygonIntersection(line, poly) {
    var intersectionPoints = [];

    for (var i = 0; i < poly.length; ++i) {
        const v1 = poly[i];
        const v2 = poly[(i + 1) % poly.length];
        const polyLine = [v1, v2];

        const intersection = lineLineIntersection(line, polyLine);

        if (intersection.length === 2) {
            throw Error('unhandled line');
        } else if (intersection.length === 0) {
            continue;
        }

        if (!intersectionPoints.some(p => p.x === intersection.x && p.y === intersection.y)) {
            intersectionPoints.push(intersection);
        }
    }
    return intersectionPoints;
}

function polygonIntersection(poly1, poly2) {
    var intersection = [];

    for (var i = 0; i < poly1.length; ++i) {
        const v1 = poly1[i];
        const v2 = poly1[(i + 1) % poly1.length];

        const v1Inside = pointInPolygon(v1, poly2);
        const v2Inside = pointInPolygon(v2, poly2);

        if (v1Inside && v2Inside) {
            intersection.push(v2);
        } else if (!v1Inside && v2Inside) {
            const v1Prime = linePolygonIntersection([v1, v2], poly2)[0];
            intersection.push(v1Prime);
            intersection.push(v2);
        } else if (v1Inside && !v2Inside) {
            const v2Prime = linePolygonIntersection([v1, v2], poly2)[0];
            intersection.push(v2Prime);
        }
        else if (!v1Inside && !v2Inside) {
            const intersections = linePolygonIntersection([v1, v2], poly2);
            if (intersections.length != 0) {
                intersection = intersection.concat(intersections);
            }
        }
    }

    /* Verify if some vertice of Polygon 2 is inside Polygon 1 */
    for (var i = 0; i < poly2.length - 1; ++i) {
        const vertice = poly2[i];
        const closedPoly1 = poly1.concat(poly1[0]);
        const inPolygon = pointInPolygon(vertice, closedPoly1);

        if (inPolygon) {
            intersection.push(vertice);
        }
    }

    return intersection;
}

function getPolygonArea(polygon) {
    var polygon2D = []
    for (var i = 0; i < polygon.length; ++i) {
        polygon2D.push(new THREE.Vector2(polygon[i].x, polygon[i].y));
    }
    var area = THREE.ShapeUtils.area(polygon2D);
    return area;
}

/*** 
 *** Function to verify end of the game.
 ***/

function checkEnd(triangles, shadowPolygon) {
    /* Area of shadow polygon */
    const shadowArea = getPolygonArea(shadowPolygon);

    /* Get closed shadow polygon to use in polygonIntersection function */
    const closedShadowPolygon = shadowPolygon.concat(shadowPolygon[0]);

    /* Calculate intersection area between triangles and shadow shape */
    var filledArea = 0;
    for (var i = 0; i < triangles.length; ++i) {
        const currentPoly = triangles[i].worldVertices;
        const intersectionPoly = polygonIntersection(currentPoly, closedShadowPolygon);
        const area = getPolygonArea(intersectionPoly);
        filledArea += area;
    }

    /* Subtract intersection area between any pair of colored triangles */
    var intersectionAreaBetweenTriangles = 0;
    for (var i = 0; i < triangles.length; ++i) {
        const currentPoly1 = triangles[i].worldVertices;
        for (var j = i + 1; j < triangles.length; ++j) {
            const currentPoly2 = triangles[j].worldVertices;
            const intersectionPoly = polygonIntersection(currentPoly1, currentPoly2);
            var area = getPolygonArea(intersectionPoly);
            if (area <= 0) {
                area *= -1; 
            }
            intersectionAreaBetweenTriangles += area;
        }
    }
    filledArea -= intersectionAreaBetweenTriangles;

    /* Compare total filled area with the shadow area */
    const epsilon = 0.05;
    var end = false;
    if (filledArea >= shadowArea - epsilon) {
        end = true;
    }
    return end;
}

/* Render Loop */
var render = function () {
    if (draggable == null) {
        /* Verify if the game ended */
        var isEnd = checkEnd(trianglesArray, shadowPolygon);
        if (isEnd) {
             /* Show the end window */
            var clickedButton = window.confirm("Congratulations! You just finished the game.\n Click OK to restart.");
            if (clickedButton) {
                /* Refresh the page */
                window.location.reload(true);
            }
        }
    }

    dragPolygon();
    requestAnimationFrame(render);

    /* Render the scene */
    renderer.render(scene, camera);  
};

render();