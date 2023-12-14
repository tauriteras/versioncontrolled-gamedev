import * as THREE from 'three';
import Player from './Player.js';
import World from '../World/World.js';
import { camera } from '../Index.js';

    let Camera = {

        updateLocation: updateCameraLocation,
        position: {
            x: 0,
            y: 0,
            z: 5
        },

        zoomSpeed: 5,
        zoomingOut: false,
        zoomingIn: false

    };

function updateCameraLocation() {

    if (World.isLoaded === false) { return; }

     camera.position.x = Player.position.x;
     camera.position.y = Player.position.y;

}

export default Camera;