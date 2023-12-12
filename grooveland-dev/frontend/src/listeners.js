import * as THREE from 'three';

import Chat from './Chat.js';

import Player, { initPlayerListeners, createPlayerSprite } from './Player.js';

import Game from './main.js';
import Camera from './Camera.js';
import World from './world.js';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();



function initListeners() {
    document.addEventListener('keydown', (event) => {
        const keyName = event.key.toLowerCase();
        if (keyName === 'enter') {
            Chat.sendMessage();
        }
    });

    // -----------------------------------------

    document.addEventListener('keyup', (event) => {
        let inputField = document.getElementById('chat__input__field');
        if (inputField.value.length > 500) {
            inputField.value = inputField.value.substring(0, 500);
        }
    });

    // -----------------------------------------

    // -----------------------------------------

    document.addEventListener('pointerdown', (event) => {
        Player.mouseIsDown = true;
    });

    document.addEventListener('pointermove', (event) => {

        Player.mouseX = event.clientX;
        Player.mouseY = event.clientY;

        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
        // update the picking ray with the camera and pointer position
        raycaster.setFromCamera(pointer, Camera.camera);
    
        // calculate objects intersecting the picking ray
        Player.hoveringOver = raycaster.intersectObjects(Game.scene.children);
    });

    document.addEventListener('pointerup', (event) => {
        Player.mouseIsDown = false;
    });

}


export default initListeners;