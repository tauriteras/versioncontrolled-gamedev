import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { io } from 'socket.io-client';

import Player from './Player.js';
import PhysicsEngine from './PhysicsEngine.js';
import SocketEventHandler from './socketHandler.js';
import Camera from './Camera.js';
import Chat from './Chat.js';
import World from './world.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
Camera.camera = camera;
camera.position.z = Camera.zoom;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

let Game = {
	socket: io('http://localhost:3000'),
	scene: scene,
	clock: new THREE.Clock(),

	run: mainLoop
}

Game.socket.on('connect', () => {
	Chat.addMessageToChat('Connected to server', undefined, '*SERVER*', 'S');
});


function mainLoop() {

	Player.sprite.position.x = Player.position.x;
	Player.sprite.position.y = Player.position.y;

	PhysicsEngine.update();

	Player.itemPicker();

	if (Player.mouseIsDown && Player.selectedBlock === -1) {  Player.punch(); }

	if (Player.isMovingDown || Player.isMovingLeft || Player.isMovingRight || Player.isMovingUp) { 
		
	}

	Game.socket.emit('player-movement', Player.position.x, Player.position.y);

	Camera.update();

	requestAnimationFrame(mainLoop);

	renderer.render(scene, camera);
}

if (WebGL.isWebGLAvailable() === false) {
	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById('body').appendChild(warning);
} else {
	
    document.addEventListener('login-button-click', (event) => {
        let accountDetails = event.detail;
        if (accountDetails.username !== '') {
            Player.name = accountDetails.username;
        } else {
            Player.name = '@dev';
        }


        Player.uniqueID = Game.socket.id;
        SocketEventHandler.init();

        document.getElementById('login').style.display = 'none';

        Player.initInputListener()
        Camera.zoomListener();

        World.load();

        Player.createSprite(Player.uniqueID, Player.position.x, Player.position.y);

        Chat.addMessageToChat(`Joined the game as ${Player.name}`, undefined, Player.name, 'W');
        
        Game.run();
    });

}

export default Game;