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
    const totalPoints = 100;
    let ellipsePoints = ellipseCurve.getPoints(totalPoints);
    ellipsePoints.forEach(p => { p.z = -p.y; p.y = 0 });
    const ellipseGeometry = new THREE.BufferGeometry().setFromPoints(ellipsePoints);
    const ellipseMaterial = new THREE.LineBasicMaterial({ color: "white" });
    const ellipse = new THREE.Line(ellipseGeometry, ellipseMaterial);
    scene.add(ellipse);

    function SetSceneObjectPos(sceneObj, pos) {
        sceneObj.position.set(pos.x, pos.y, pos.z)
    }
    
    let posIdx = 0;
    function updateSpaceshipPos() {
        posIdx = (posIdx + 1) % totalPoints;
        SetSceneObjectPos(spaceship.scene, ellipsePoints[posIdx]);
    }

    var render = function () {
        requestAnimationFrame(render);
        mouseControls.update();
        if (spaceship) {
            updateSpaceshipPos();  
        }
        renderer.render(scene, camera);
    }

    render();
}

main();
