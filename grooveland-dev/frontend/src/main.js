import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

import { io } from 'socket.io-client';

import Camera from './camera.js';

import { worldLoader } from './world.js';

import initListeners from './listeners.js';

import physicsEngine from './physics.js';
import Player, { pickUpItem } from './player.js';

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

export const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
Camera.camera = camera;
camera.position.z = Camera.zoom;

export const socket = io('http://localhost:3000');

export const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

let connection = false;

socket.on('connect', () => {
	console.log('connected');
	connection = true;
});

export function mainLoop() {

	Player.sprite.position.x = Player.position.x;
	Player.sprite.position.y = Player.position.y;

	physicsEngine();

	pickUpItem();

	Camera.update();

	requestAnimationFrame(mainLoop);

	renderer.render(scene, camera);
}

if (WebGL.isWebGLAvailable()) {

	initListeners();

	worldLoader();

} else {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById('body').appendChild(warning);
}