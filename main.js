import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { rotate } from 'three/examples/jsm/nodes/Nodes.js';


const scene = new THREE.Scene();
const d = 5;
const aspectRatio = innerWidth / innerHeight;
//const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const camera = new THREE.OrthographicCamera(-d * aspectRatio, d * aspectRatio, d, -d, 1, 1000);
const renderer = new THREE.WebGLRenderer();

camera.position.set(d, d, d);
camera.lookAt(new THREE.Vector3(0, 0, 0))

renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const plane_width = 5;
const plane_height = 5;
const planeGeometry = new THREE.PlaneGeometry(plane_width, plane_height);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, -2, 0);
plane.setRotationFromEuler(new THREE.Euler(90, 0, 0));
scene.add(plane);


const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

function animate() {
    //plane.rotation.x += 0.01;
    camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.01);
    renderer.render(scene, camera);
    console.log(bear)
}
renderer.setAnimationLoop(animate);


const loader = new GLTFLoader();
let bear;
loader.load('assets/character1.glb', function (gltf) {
    bear = gltf.scene;
    scene.add(bear);
}, undefined, function (error) {
    console.error(error);
});