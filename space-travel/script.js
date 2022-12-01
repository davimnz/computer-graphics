async function main() {
    /* Create an empty scene */
    var scene = new THREE.Scene();

    /* Create a light */
    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 10);
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
    let planet;
    async function loadGLTF() {
        spaceship = await loader.loadAsync('./gltf/spaceship.gltf', undefined);
        planet = await loader.loadAsync('./gltf/planet.gltf', undefined);
        scene.add(spaceship.scene);
        scene.add(planet.scene);
        ResizeSceneObject(spaceship.scene, 0.05);
        ResizeSceneObject(planet.scene, 1);
    }
    loadGLTF();

    /* Spaceship's trajectory */
    const ellipseCurve = new THREE.EllipseCurve(
        0, 0,            // ax, aY
        5, 2,            // xRadius, yRadius
        0, 2 * Math.PI,  // aStartAngle, aEndAngle
        false,           // aClockwise
        0                // aRotation
    );
    const totalPoints = 1000;
    let ellipsePoints = ellipseCurve.getPoints(totalPoints);
    ellipsePoints.forEach(p => { p.z = -p.y; p.y = 0 });
    const ellipseGeometry = new THREE.BufferGeometry().setFromPoints(ellipsePoints);
    const ellipseMaterial = new THREE.LineBasicMaterial({ color: "white" });
    const ellipse = new THREE.Line(ellipseGeometry, ellipseMaterial);
    let drawEllipse = false;

    function SetSceneObjectPos(sceneObj, pos) {
        sceneObj.position.set(pos.x, pos.y, pos.z);
    }
   
    function SetSceneObjectLookAt(sceneObj, look) {
        sceneObj.lookAt(look.x, look.y, look.z);
    }

    function SetSceneObjectRot(sceneObj, rot) {
        sceneObj.rotation.set(rot.x, rot.y, rot.z);
    }
    
    let posIdx = 0;
    function updatePos() {
        posIdx = (posIdx + 1) % totalPoints;
        posIdxNext = (posIdx + 1) % totalPoints;
        SetSceneObjectPos(spaceship.scene, ellipsePoints[posIdx]);
        SetSceneObjectLookAt(spaceship.scene, ellipsePoints[posIdxNext]);
        cameraSpaceship.position.copy(new THREE.Vector3(ellipsePoints[posIdx].x,
                                                        ellipsePoints[posIdx].y,
                                                        ellipsePoints[posIdx].z)).add(new THREE.Vector3(0, 0.05, 0.4));
    }

    const R_KEY = 114;
    const E_KEY = 101;
    const EnumCameraMode = {
        SPACESHIP: 0,
        GLOBAL: 1,
    };
    let CameraMode = EnumCameraMode.SPACESHIP;
    const onKeyPress = (event) => {
        if (event.keyCode === R_KEY) {
            if (spaceship) {
                if (CameraMode === EnumCameraMode.SPACESHIP)
                    CameraMode = EnumCameraMode.GLOBAL;
                else
                    CameraMode = EnumCameraMode.SPACESHIP;
            }
        }
        if (event.keyCode === E_KEY) {
            drawEllipse = !drawEllipse;
            if (drawEllipse)
                scene.add(ellipse);
            else
                scene.remove(ellipse);
        }
    }
    window.addEventListener('keypress', onKeyPress);

    let planetRot = new THREE.Vector3(0, 0, 0);
    let planetOmega = 0.005;
    let planetTheta = 0;
    var render = function () {
        requestAnimationFrame(render);
        mouseControls.update();
        if (spaceship) {
            updatePos();
        }
        if (planet) {
            planetTheta += planetOmega;
            if (planetTheta >= 2*Math.PI) {
                planetTheta = 2*Math.PI - planetTheta;
            }
            planetRot.add(new THREE.Vector3(planetOmega, planetOmega, 0.5*planetOmega));
            SetSceneObjectRot(planet.scene, planetRot);
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
