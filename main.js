import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const d = 8;
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
plane.position.set(0, -2.2, 0);
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

//-- Load bear model --//
const loader = new GLTFLoader();
let bear;
loader.load('assets/character1.glb', function (gltf) {
    bear = gltf.scene;
    scene.add(bear);
}, undefined, function (error) {
    console.error(error);
});

//-- bear movement --//
const bear_speed = 1;
