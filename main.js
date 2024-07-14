import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const d = 10;
const aspectRatio = innerWidth / innerHeight;
//const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const camera = new THREE.OrthographicCamera(-d * aspectRatio, d * aspectRatio, d, -d, 1, 1000);
const renderer = new THREE.WebGLRenderer();

camera.position.set(d, d, d);
camera.lookAt(new THREE.Vector3(0, 0, 0))

renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

//-- Plane stuff --//
const plane_width = 20;
const plane_height = 20;
const plane_color = 0x7a4aff;
const planeGeometry = new THREE.PlaneGeometry(plane_width, plane_height);
const planeMaterial = new THREE.MeshPhongMaterial({ color: plane_color, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, 0, 0);
plane.rotation.x = Math.PI / 2
scene.add(plane);

const pillar_padding = 5;

//-- Light stuff --//
const light = new THREE.DirectionalLight(0xffc0b0, 2);
light.position.set(0, 1, 0);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

//-- Animate --//
function animate() {
    //camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.01);
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

function get_size(gltf_object) {
    const box = new THREE.Box3().setFromObject( gltf_object ); 
    return box.getSize(new THREE.Vector3());
}

//-- Load bear model --//
const loader = new GLTFLoader();
let bear;
loader.load('assets/character1.glb', function (gltf) {
    bear = gltf.scene;
    const bear_size = get_size(bear);
    bear.position.set(5, bear_size.y/2 + 0.5, 0);
    scene.add(bear);
}, undefined, function (error) {
    console.error(error);
});


//-- Load pillars --//
let pillar1;
loader.load('assets/pillar.glb', function (gltf) {
    pillar1 = gltf.scene;
    const pillar1_size = get_size(pillar1);
    pillar1.position.set(-plane_width/2 + pillar1_size.z/2, pillar1_size.y/2, -plane_height/2 + pillar1_size.z/2);
    scene.add(pillar1);
}, undefined, function (error) {
    console.error(error);
});

let pillar2;
loader.load('assets/pillar.glb', function (gltf) {
    pillar2 = gltf.scene;
    const pillar2_size = get_size(pillar2);
    pillar2.position.set(-plane_width/2 + pillar2_size.z/2, pillar2_size.y/2, plane_height/2 - pillar2_size.z/2);
    scene.add(pillar2);
}, undefined, function (error) {
    console.error(error);
});

let pillar3;
loader.load('assets/pillar.glb', function (gltf) {
    pillar3 = gltf.scene;
    const pillar3_size = get_size(pillar3);
    pillar3.position.set(plane_width/2 - pillar3_size.z/2, pillar3_size.y/2, plane_height/2 - pillar3_size.z/2);
    scene.add(pillar3);
}, undefined, function (error) {
    console.error(error);
});

let pillar4;
loader.load('assets/pillar.glb', function (gltf) {
    pillar4 = gltf.scene;
    const pillar4_size = get_size(pillar4);
    pillar4.position.set(plane_width/2 - pillar4_size.z/2, pillar4_size.y/2, - plane_height/2 + pillar4_size.z/2);
    scene.add(pillar4);
}, undefined, function (error) {
    console.error(error);
});

