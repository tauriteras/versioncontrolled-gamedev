import * as THREE from 'three';
import { scene, socket, camera, mainLoop } from './main.js';

import { addMessageToChat, sendMessage } from './chat.js';

import { socketEventHandler } from './socketHandler.js';

import initCameraListeners from './camera.js';

import Player, { initPlayerListeners, createPlayerSprite, getEntryTilePosition, respawn } from './player.js';
import Camera from './camera.js';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();



function initListeners() {

    // Temporary camera movement for development
    document.addEventListener('keydown', (event) => {
        const keyName = event.key.toLowerCase();
        if (keyName === 'enter') {
            sendMessage();
        }

        if (keyName === 'r') {
            respawn();
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

    document.addEventListener('login-button-click', (event) => {
        let accountDetails = event.detail;
        if (accountDetails.username !== '') {
            Player.name = accountDetails.username;
        } else {
            Player.name = '@dev';
        }


        Player.uniqueID = socket.id;
        socketEventHandler(socket);

        document.getElementById('login').style.display = 'none';

        initPlayerListeners();
        Camera.zoomListener();

        getEntryTilePosition();

        createPlayerSprite(Player.uniqueID, Player.position.x, Player.position.y);
        console.log('Player created', Player.name, Player.uniqueID);

        addMessageToChat(`Joined the game as ${Player.name}`, undefined, Player.name, 'W');
        
        mainLoop();
    });

    // -----------------------------------------

    document.addEventListener('pointermove', (event) => {

        Player.mouseX = event.clientX;
        Player.mouseY = event.clientY;

        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
        // update the picking ray with the camera and pointer position
        raycaster.setFromCamera(pointer, camera);
    
        // calculate objects intersecting the picking ray
        Player.hoveringOver = raycaster.intersectObjects(scene.children);
    });

    // -----------------------------------------

}


export default initListeners;