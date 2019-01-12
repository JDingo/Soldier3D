// Set canvas as the space where 3D renderer will be implemented
var canvas = document.getElementById('viewer');

var clock = new THREE.Clock();

// Create scene for 3D objects
var scene = new THREE.Scene();
scene.background = new THREE.Color().setHSL(0.6, 0, 1);
scene.fog = new THREE.Fog(scene.background, 1, 5000);

// Add camera
var camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
camera.position.set(1.5, 1.5, 2);

// Set up canvas and renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.physicallyCorrectLights = true;
renderer.gammaOutput = true;
renderer.gammaFactor = 3.2;
renderer.setClearColor(0xcccccc);
canvas.appendChild(renderer.domElement);

// Add camera controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.update();

// Set up lightning
var dirLightFront = new THREE.DirectionalLight(0xFFFFFF);
dirLightFront.color.setHSL(0.1, 1, 0.95);
dirLightFront.position.set(-1, 1.75, 1);
scene.add(dirLightFront);

var dirLightBack = new THREE.DirectionalLight(0xFFFFFF);
dirLightBack.color.setHSL(0.1, 1, 0.95);
dirLightBack.position.set(1, -1.75, -1);
scene.add(dirLightBack);

var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemiLight.position.set(0, 10, 0);
scene.add(hemiLight);

var ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

// List of actions
var animList = ['idle', 'walk', 'run', 'fire']
var animIndex = 0;

var model;
var mixer;

// Function for loading the model
function loadModel() {
    var loader = new THREE.GLTFLoader();
    loader.load('Model.gltf', function (gltf) {

        model = gltf.scene;
        model.animations = gltf.animations;

        // Add model to 3D scene
        scene.add(model);

        // Play 'idle' using the Threejs animation system
        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(animList[animIndex]).play();
        reSizeCanvas();
        animate(model);
    } );
}

// Listen for window resize or double-click
window.addEventListener('resize', reSizeCanvas, false);
window.addEventListener('dblclick', updateAnimation, false);

// Resize rendering canvas incase of window resize
function reSizeCanvas() {
    // Get new canvas dimensions
    canvas = document.getElementById('viewer');
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;

    // Update renderer size along & camera aspect
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// Update animation on double-click
function updateAnimation () {
    if (animIndex == animList.length - 1) {
        animIndex = 0;
    } else {
        animIndex++;
    };

    mixer = new THREE.AnimationMixer(model);
    mixer.clipAction(animList[animIndex]).play();
};

// Render next frame
function animate() {
    timeDelta = clock.getDelta();
    mixer.update(timeDelta);

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

loadModel();