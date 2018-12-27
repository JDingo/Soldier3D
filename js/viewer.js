var canvas = document.getElementById('viewer');

var clock = new THREE.Clock();

var scene = new THREE.Scene();
scene.background = new THREE.Color().setHSL(0.6, 0, 1);
scene.fog = new THREE.Fog(scene.background, 1, 5000);

var camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
camera.position.set(2, 2, 1);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.physicallyCorrectLights = true;
renderer.gammaOutput = true;
renderer.gammaFactor = 3.2;
renderer.shadowMap.enabled = true;
renderer.setClearColor(0xcccccc);
canvas.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.update();

var envMap = new THREE.MeshBasicMaterial;

// Ground
var groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
var groundMat = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x050505 });
groundMat.color.setHSL(0.095, 1, 0.75);
var ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = - Math.PI / 2;
ground.position.y = - 0.02;
ground.receiveShadow = true;
scene.add(ground);


// Sky
var skyGeo = new THREE.SphereBufferGeometry(100, 100, 100);
var skyMat = new THREE.MeshPhongMaterial( { color: 0x66ccff } );
skyMat.side = THREE.DoubleSide;
var sky = new THREE.Mesh( skyGeo, skyMat );
scene.add(sky);

// Lightning 
var dirLightFront = new THREE.DirectionalLight(0xFFFFFF);
dirLightFront.color.setHSL(0.1, 1, 0.95);
dirLightFront.position.set(-1, 1.75, 1);
dirLightFront.position.multiplyScalar(30);
dirLightFront.castShadow = true;
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

var ambientLight = new THREE.AmbientLight(0x404040, 5);
scene.add(ambientLight);

// Model Loader
function loadModel() {
    var loader = new THREE.GLTFLoader();
    loader.load('Model.gltf', function (gltf) {

        model = gltf.scene;
        model.animations = gltf.animations;

        model.traverse( function (child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.geometry.computeFaceNormals();
                child.geometry.computeVertexNormals(true);
                child.geometry.normalsNeedUpdate = true;
                child.material.shading = THREE.SmoothShading;
            }
        } );

        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction('Action').play()
        console.log(mixer);
        animate();
    },

        undefined, function (e) {
            console.error(e);
        }
    );
}

window.addEventListener('resize', reSizeCanvas, false);

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

function animate() {
    timeDelta = clock.getDelta();
    mixer.update(timeDelta);

    console.log("Render")

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

loadModel();