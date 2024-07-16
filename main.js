import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const cameraDistance = 10;
const cameraverticalOffset = 2;
const aspectRatio = innerWidth / innerHeight;
//const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const camera = new THREE.OrthographicCamera(-cameraDistance * aspectRatio, cameraDistance * aspectRatio, cameraDistance, -cameraDistance, 1, 1000);
const renderer = new THREE.WebGLRenderer();

camera.position.set(cameraDistance, cameraDistance + cameraverticalOffset, cameraDistance);
camera.lookAt(new THREE.Vector3(0, cameraverticalOffset, 0))

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

//-- Light stuff --//
const light = new THREE.DirectionalLight(0xffc0b0, 2);
light.position.set(0, 1, 0);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

//-- Loading Auxiliary Functions --//
function getSize(gltf_object) {
    const box = new THREE.Box3().setFromObject( gltf_object ); 
    return box.getSize(new THREE.Vector3());
}

//-- Load bear model --//
const loader = new GLTFLoader();
let bear;
loader.load('assets/character1.glb', function (gltf) {
    bear = gltf.scene;
    const bear_size = getSize(bear);
    bear.position.set(5, bear_size.y/2 + 0.5, 0); // TODO demagicnumberify this
    scene.add(bear);
}, undefined, function (error) {
    console.error(error);
});


//-- Load pillars --//
loader.load('assets/pillar.glb', function (gltf) {
    const pillar_model_template = gltf.scene;
    const pillar_models = [pillar_model_template, pillar_model_template.clone(), pillar_model_template.clone(), pillar_model_template.clone()];
    const pillar_size = getSize(pillar_model_template);
    const pillar_edge_padding = 2;
    const pillar_padding = pillar_size.z / 2 + pillar_edge_padding;
    const pillar_vertical_padding = pillar_size.y / 2;
    pillar_models[0].position.set(-plane_width/2 + pillar_padding, pillar_vertical_padding, -plane_height/2 + pillar_padding);
    pillar_models[1].position.set( plane_width/2 - pillar_padding, pillar_vertical_padding, -plane_height/2 + pillar_padding);
    pillar_models[2].position.set(-plane_width/2 + pillar_padding, pillar_vertical_padding,  plane_height/2 - pillar_padding);
    pillar_models[3].position.set( plane_width/2 - pillar_padding, pillar_vertical_padding,  plane_height/2 - pillar_padding);
    scene.add(...pillar_models);
    // Add colliders
    for (const model of pillar_models) {
        const model_box = new THREE.Box3().setFromObject(model);
        obstacles.push(model_box);
        // scene.add(new THREE.Box3Helper(model_box, 0xffff00 ));
    }
}, undefined, function (error) {
    console.error(error);
});

//-- bear movement --//
const bear_speed = 5;
const directions = {
    "up":       new THREE.Vector3(-1,  0, -1),
    "right":    new THREE.Vector3( 1,  0, -1),
    "down":     new THREE.Vector3( 1,  0,  1),
    "left":     new THREE.Vector3(-1,  0,  1),
}
let bear_velocity_direction = new THREE.Vector3();
const keys_pressed = {
    "ArrowUp": false,
    "ArrowRight": false,
    "ArrowDown": false,
    "ArrowLeft": false,
}

//-- axes helper --//
// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

//-- keyboard input --//
function updateDirection() {
    const newDirection = new THREE.Vector3();
    if (keys_pressed.ArrowUp) {
        newDirection.addVectors(newDirection, directions.up);
    }
    if (keys_pressed.ArrowRight) {
        newDirection.addVectors(newDirection, directions.right);
    }
    if (keys_pressed.ArrowDown) {
        newDirection.addVectors(newDirection, directions.down);
    }
    if (keys_pressed.ArrowLeft) {
        newDirection.addVectors(newDirection, directions.left);
    }
    bear_velocity_direction = newDirection.normalize();
}
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(e) {
    keys_pressed[e.key] = true;
    updateDirection();
};
document.addEventListener("keyup", onDocumentKeyUp, false);
function onDocumentKeyUp(e) {
    keys_pressed[e.key] = false;
    updateDirection();
}

//-- Colliders --//
const collisionForce = 2;
const obstacles = [];
function collide(movee, colliders, dt) {
    const movee_box = new THREE.Box3().setFromObject(movee);
    for (const collider of colliders) {
        if (movee_box.intersectsBox(collider)) {
            const displacementVector = new THREE.Vector3().subVectors(movee.position, collider.getCenter(new THREE.Vector3())).setComponent(1, 0);
            movee.position.addScaledVector(displacementVector, collisionForce * dt);
        }
    }
}

//-- Animate --//
const clock = new THREE.Clock();
function animate() {
    const dt = clock.getDelta();
    if (bear != undefined) {
        if (bear_velocity_direction.length() > 0) {
            const pos = new THREE.Vector3();
            pos.addVectors(bear_velocity_direction, bear.position);
            bear.lookAt(pos);
            bear.translateZ(bear_speed * dt);
        }
        collide(bear, obstacles, dt);
    }
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);