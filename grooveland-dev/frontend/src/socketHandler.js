import Player from './player.js';
import { createPlayerSprite } from './player.js';

import { scene, camera } from './main.js';

import { addMessageToChat, getCurrentTime } from './chat.js';


let playerArray = [];


export function socketEventHandler(socket) {

	Player.uniqueID = socket.id;

	socket.emit('player-join', Player.name, Player.position.x, Player.position.y);

	socket.on('current-players', (online) => {	
		playerArray = online;

		if (playerArray.length > 0) {
			for (let i = 0; i < playerArray.length; i++) {
				if (playerArray[i] === Player.uniqueID) return;

				let id = playerArray[i][0];
				let x = playerArray[i][1]
				let y = playerArray[i][2]

				createPlayerSprite(id, x, y);
			}
		}
	});

	socket.on('player-join', (username, identifyer) => {
		playerArray.push(identifyer);

		createPlayerSprite(identifyer);

		addMessageToChat(`${username} joined the game`, getCurrentTime(), '*SERVER*', 'S');
	});

	socket.on('zoom', (zoom) => {
		camera.position.z += zoom;
	});

	socket.on('player-movement', (x, y, identifyer) => {
		let otherPlayer = scene.getObjectByName(identifyer);

		otherPlayer.position.x = x;
		otherPlayer.position.y = y;
	});

	socket.on('player-leave', (id, onlinePlayers, username) => {
		let player = scene.getObjectByName(id);
		scene.remove(player);

		playerArray = onlinePlayers;

		addMessageToChat(`${username} left the game`, getCurrentTime(), '*SERVER*', 'S');
	});

	socket.on('message-world', (message, time, username, type) => {
		addMessageToChat(message, time, username, type);
	});
};