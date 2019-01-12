// Set canvas as the space where 3D renderer will be implemented
var canvas = document.getElementById('viewer');

var clock = new THREE.Clock();

var scene = new THREE.Scene();
scene.background = new THREE.Color().setHSL(0.6, 0, 1);
scene.fog = new THREE.Fog(scene.background, 1, 5000);

// Camera
var camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
camera.position.set(2, 2, 1);

// Set up canvas and renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.physicallyCorrectLights = true;
renderer.gammaOutput = true;
renderer.gammaFactor = 3.2;
renderer.shadowMap.enabled = true;
renderer.setClearColor(0xcccccc);
canvas.appendChild(renderer.domElement);

// Camera controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.update();

// Lightning 
var dirLightFront = new THREE.DirectionalLight(0xFFFFFF);
dirLightFront.color.setHSL(0.1, 1, 0.95);
dirLightFront.position.set(-1, 1.75, 1);
scene.add(dirLightFront);

dirLightHelperFront = new THREE.DirectionalLightHelper(dirLightFront, 10);
scene.add(dirLightHelperFront);

var dirLightBack = new THREE.DirectionalLight(0xFFFFFF);
dirLightBack.color.setHSL(0.1, 1, 0.95);
dirLightBack.position.set(1, -1.75, -1);
dirLightBack.position.multiplyScalar(30);
dirLightBack.castShadow = true;
scene.add(dirLightBack);

dirLightHelperBack = new THREE.DirectionalLightHelper(dirLightBack, 10);
scene.add(dirLightHelperBack);

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

// Model Loader
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

window.addEventListener('resize', reSizeCanvas, false);
window.addEventListener('dblclick', updateAnimation, false);

// Resize canvas incase of browser resize
function reSizeCanvas() {
    var canvas = document.getElementById('viewer');
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    console.log(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    console.log("Canvas Resized!")
}

// Update animation on double-click
function updateAnimation () {
    if (animIndex == animList.length - 1) {
        animIndex = 0;
    } else {
        animIndex++;
    };

    console.log(animIndex);
    mixer = new THREE.AnimationMixer(model);
    mixer.clipAction(animList[animIndex]).play();
};

// Animate next frame
function animate() {
    timeDelta = clock.getDelta();
    mixer.update(timeDelta);

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

loadModel();