import Player from './Player.js';
import Game from './main.js';
import Chat from './Chat.js';

import World from './world.js';

let SocketEventHandler = {
	init: socketEvents
};

function socketEvents() {

		let socket = Game.socket;

		Game.socket.on('send-world', (worldData) => {
			console.log('world data arrived')
	
			let blocksArray = [];
			let bgBlocksArray = [];
	
			for (let i = 0; i < worldData.length; i++) {
				blocksArray.push(worldData[i][0]);
				bgBlocksArray.push(worldData[i][1]);
			}
	
			World.blocks = blocksArray;
			World.backgroundBlocks = bgBlocksArray;
		});
	
		socket.on('current-players', (online) => {		
			for (let i = 0; i < online.length; i++) {
				if (online[i] === Player.uniqueID) return;
	
					let id = online[i][0];
	
					// Player.createSprite(id);
			}
		});
	
		socket.on('player-join', (username, identifyer) => {
			Player.createSprite(identifyer, World.entryTile.x, World.entryTile.y);
	
			Chat.addMessageToChat(`${username} joined the game`, getCurrentTime(), '*SERVER*', 'S');
		});
	
		socket.on('zoom', (zoom) => {
			camera.position.z += zoom;
		});
	
		socket.on('player-movement', (identifyer, x, y) => {
			let otherPlayer = Game.scene.getObjectByName(identifyer);
	
			otherPlayer.position.x = x;
			otherPlayer.position.y = y;
		});
	
		socket.on('player-leave', (identifyer, username) => {
			Game.scene.remove(identifyer);
	
			addMessageToChat(`${username} left the game`, getCurrentTime(), '*SERVER*', 'S');
		});
	
		socket.on('message-world', (message, time, username, type) => {
			addMessageToChat(message, time, username, type);
		});
};

export default SocketEventHandler;