import Player from './Player.js';

let Camera = {
	camera: '',
	zoomListener: initCameraListeners,
	update: updateCamera,
	zoom: 90
}

function updateCamera() {
	Camera.camera.position.x = Player.position.x;
	Camera.camera.position.y = Player.position.y;
}

function initCameraListeners() {
	document.addEventListener('keydown', (event) => {
		
		const keyName = event.key.toLowerCase();

		if (keyName === 'z' && Camera.camera.position.z < 140) {
			Camera.camera.position.z += 10;
		}

		if (keyName === 'x' && Camera.camera.position.z > 50) {
			Camera.camera.position.z -= 10;
		}
	});
	
}

export default Camera;