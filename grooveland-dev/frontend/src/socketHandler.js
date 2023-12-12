import Player from './Player.js';
import Game from './main.js';
import Chat from './Chat.js';

import { createPlayerSprite } from './Player.js';


let playerArray = [];

let SocketEventHandler = {
	init: socketEvents
};

function socketEvents() {

	Player.uniqueID = Game.socket.id;

	Game.socket.emit('player-join', Player.name, Player.position.x, Player.position.y);

	Game.socket.on('current-players', (online) => {	
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

	Game.socket.on('player-join', (username, identifyer) => {
		playerArray.push(identifyer);

		createPlayerSprite(identifyer);

		Chat.addMessageToChat(`${username} joined the game`, getCurrentTime(), '*SERVER*', 'S');
	});

	Game.socket.on('zoom', (zoom) => {
		camera.position.z += zoom;
	});

	Game.socket.on('player-movement', (x, y, identifyer) => {
		let otherPlayer = scene.getObjectByName(identifyer);

		otherPlayer.position.x = x;
		otherPlayer.position.y = y;
	});

	Game.socket.on('player-leave', (id, onlinePlayers, username) => {
		let player = scene.getObjectByName(id);
		scene.remove(player);

		playerArray = onlinePlayers;

		addMessageToChat(`${username} left the game`, getCurrentTime(), '*SERVER*', 'S');
	});

	Game.socket.on('message-world', (message, time, username, type) => {
		addMessageToChat(message, time, username, type);
	});
};

export default SocketEventHandler;