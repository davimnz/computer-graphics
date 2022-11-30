async function main() {
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

    const cameraSpaceship = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000);
    /* Create a renderer */
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    /* Configure renderer clear color */
    renderer.setClearColor("0x000000");

    /* Configure renderer size */
    renderer.setSize(window.innerWidth, window.innerHeight);

    /* Append Renderer to DOM */
    document.body.appendChild(renderer.domElement);

    /* Add mouse control */
    mouseControls = new THREE.OrbitControls(camera, renderer.domElement);

    /* Load gltf files */
    var loader = new THREE.GLTFLoader();

    function ResizeSceneObject(sceneObj, alpha) {
        sceneObj.scale.x *= alpha;
        sceneObj.scale.y *= alpha;
        sceneObj.scale.z *= alpha;
    }

    let spaceship;
    async function loadGLTF() {
        spaceship = await loader.loadAsync('/gltf/spaceship.gltf', undefined);
        scene.add(spaceship.scene);
        ResizeSceneObject(spaceship.scene, 0.05);
    }
    loadGLTF();

    /* Spaceship's trajectory */
    const ellipseCurve = new THREE.EllipseCurve(
        0, 0,            // ax, aY
        5, 2,           // xRadius, yRadius
        0, 2 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
    );
    const totalPoints = 1000;
    let ellipsePoints = ellipseCurve.getPoints(totalPoints);
    ellipsePoints.forEach(p => { p.z = -p.y; p.y = 0 });
    let curveTangent = [];
    for (let i = 0; i < totalPoints - 1; ++i) {
        let diffX = ellipsePoints[i + 1].x - ellipsePoints[i].x;
        let diffY = ellipsePoints[i + 1].y - ellipsePoints[i].y;
        let diffZ = ellipsePoints[i + 1].z - ellipsePoints[i].z;
        let diff = new THREE.Vector3(diffX, diffY, diffZ);
        let angleX = diff.angleTo(new THREE.Vector3(1, 0, 0));
        let angleY = diff.angleTo(new THREE.Vector3(0, 1, 0));
        let angleZ = diff.angleTo(new THREE.Vector3(0, 0, 1));
        curveTangent.push(new THREE.Vector3(angleX, angleY, angleZ));
    }
    const ellipseGeometry = new THREE.BufferGeometry().setFromPoints(ellipsePoints);
    const ellipseMaterial = new THREE.LineBasicMaterial({ color: "white" });
    const ellipse = new THREE.Line(ellipseGeometry, ellipseMaterial);
    scene.add(ellipse);

    function SetSceneObjectPos(sceneObj, pos) {
        sceneObj.position.set(pos.x, pos.y, pos.z);
    }
   
    function SetSceneObjectRot(sceneObj, rot) {
        sceneObj.rotation.set(rot.x, rot.y, 0);
    }
    
    let posIdx = 0;
    function updatePos() {
        posIdx = (posIdx + 1) % totalPoints;
        SetSceneObjectPos(spaceship.scene, ellipsePoints[posIdx]);
        SetSceneObjectRot(spaceship.scene, curveTangent[posIdx]);
        cameraSpaceship.position.copy(new THREE.Vector3(ellipsePoints[posIdx].x,
                                                        ellipsePoints[posIdx].y,
                                                        ellipsePoints[posIdx].z)).add(new THREE.Vector3(0, 0.05, 0.4));
    }

    const R_KEY = 114;
    const EnumCameraMode = {
        SPACESHIP: 0,
        GLOBAL: 1,
    };
    let CameraMode = EnumCameraMode.SPACESHIP;
    const onKeyPress = (event) => {
        if (event.keyCode == R_KEY) {
            if (spaceship) {
                if (CameraMode === EnumCameraMode.SPACESHIP)
                    CameraMode = EnumCameraMode.GLOBAL;
                else
                    CameraMode = EnumCameraMode.SPACESHIP;
            }
        }
    }
    window.addEventListener('keypress', onKeyPress);

    var render = function () {
        requestAnimationFrame(render);
        mouseControls.update();
        if (spaceship) {
            updatePos();
        }
        switch(CameraMode) {
            case EnumCameraMode.SPACESHIP:
                renderer.render(scene, cameraSpaceship);
                break;
            case EnumCameraMode.GLOBAL:
                renderer.render(scene, camera);
                break;
            default:
                break;
        }
    }

    render();
}

main();
