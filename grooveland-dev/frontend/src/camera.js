import Player from './Player.js';
import Game from './main.js';

let Camera = {
	update: updateCamera(),
	zoomDirection: 0,
	zoomSpeed: 5,
	zoomDefault: 90,
	zoom: 90
}

function updateCamera() {
	// Game.camera.position.x = Player.position.x;
	// Game.camera.position.y = Player.position.y;
	
	// while(Player.isZooming) {
	// 	Camera.zoom == (Camera.zoomDirection * Camera.zoomSpeed) * Game.delta;
	// }
}

export default Camera;