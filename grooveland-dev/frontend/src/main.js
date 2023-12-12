import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { io } from 'socket.io-client';

import Player from './Player.js';
import PhysicsEngine from './PhysicsEngine.js';
import SocketEventHandler from './socketHandler.js';
import Camera from './Camera.js';
import Chat from './Chat.js';
import GameUI from './UI.js';

import World from './world.js';

const clock = new THREE.Clock();

let Game = {
	socket: io('http://localhost:3000'),
	renderer: new THREE.WebGLRenderer(),
	scene: new THREE.Scene(),
	delta: 0,
	camera: new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ),

	run: mainLoop
}

Camera.camera = Game.camera;
Game.camera.position.z = Camera.zoom;

Game.renderer.setSize( window.innerWidth, window.innerHeight);

document.getElementById('game__container').appendChild( Game.renderer.domElement );

Game.socket.on('connect', () => {
	console.log('connected to server')
	SocketEventHandler.init();

	Chat.addMessageToChat('Connected to server', undefined, '*SERVER*', 'S');

	console.log('debug__socket', Game.socket.id)
});

function mainLoop() {
	Game.delta = clock.getDelta();
	// console.log('fps:' + Game.delta * 1000);

	PhysicsEngine.update();
	Player.itemPicker();
	
	if (Player.mouseIsDown && Player.selectedBlock === -1) {  Player.punch(); }
	if (Player.mouseIsDown && Player.selectedBlock !== -1) {  Player.place(Player.selectedBlock); }
	
	// Camera.update();

	requestAnimationFrame(mainLoop);

	Game.renderer.render(Game.scene, Camera.camera);

}

if (WebGL.isWebGLAvailable() === false) {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById('body').appendChild(warning);
} else {

	Game.run();

	document.addEventListener('play-button-click', (event) => {
		let pagesElem = document.getElementById('pages');
		pagesElem.classList.add('animate-main-menu-left');

		console.log('play-button-click');

		Game.socket.emit('request-world');

		document.addEventListener('login-button-click', (event) => {
			console.log('login-button-click');

			let pagesElem = document.getElementById('pages');
			pagesElem.classList.add('move-login-page-right');

			let accountDetails = event.detail;
			if (accountDetails.username !== '') {
				Player.name = accountDetails.username;
			} else {
				Player.name = '@dev';
			}

			document.addEventListener('join-world-button-click', (event) => {

						World.load();

						let pagesElem = document.getElementById('pages');
						pagesElem.classList.add('join-world-animate-right');
		
						let canvasElements = document.getElementsByTagName('canvas');
						let canvas = canvasElements[0];
						canvas.classList.add('animate-canvas-in');
		
						Game.socket.emit('player-join', Player.name);
			
						GameUI.load();
						
						Player.createSprite(Player.uniqueID);
						Player.initInputListener();
			});
		});

	});

}


export default Game;