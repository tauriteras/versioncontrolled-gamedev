import * as THREE from 'three';

import { scene } from './main.js';

import Player from './player.js';

let vectorDown = new THREE.Vector3(0, 0, 1);
let origin = new THREE.Vector3(0, 0, 0);


export default function physicsEngine() {

    // Gravity
    if (Player.isMovingUp === false && !checkBottomCollision()) {
        Player.position.y -= 5;
    }


    // Movement
    if (Player.isMovingUp === true) {
        Player.position.y += Player.movementSpeed;
    }

    if (Player.isMovingDown === true) {
        Player.position.y -= Player.movementSpeed;
    }

    if (Player.isMovingLeft === true && Player.position.x > (Player.size.x / 2) && !checkLeftCollisions()) {
        Player.position.x -= Player.movementSpeed;
    }

    if (Player.isMovingRight === true && Player.position.x < ((16 * 100) - (Player.size.x / 2)) && !checkRightCollisions()) {
        Player.position.x += Player.movementSpeed;
    }
}

export function checkBottomCollision() {
    let playerBottom = Player.position.y - (Player.size.y / 2);
    origin = new THREE.Vector3(Player.position.x, playerBottom, 0);

    let raycaster = new THREE.Raycaster(origin, vectorDown, 0, 16);

    let intersectsList = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersectsList.length; i++) {
        if (intersectsList[i].object.name.split('_')[0] !== 'bg') {
            if (intersectsList[i].object.name.split('_')[2] === '0') {
                return false;
            }
    
            if (intersectsList[i].object.name.split('_')[3] === '0') {
                return false;
            }
        }
    }

    return true;
}

export function checkTopCollisions() {

}

export function checkLeftCollisions() {
    let playerLeft = Player.position.x - (Player.size.x / 2);
    origin = new THREE.Vector3(playerLeft, Player.position.y, 0);

    let raycaster = new THREE.Raycaster(origin, vectorDown, 0, 16);

    let intersectsList = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersectsList.length; i++) {
        if (intersectsList[i].object.name.split('_')[0] !== 'bg') {
            if (intersectsList[i].object.name.split('_')[3] === '1') {
                return true;
            }
        }
    }

   return false;
}

export function checkRightCollisions() {
    let playerRight = Player.position.x + (Player.size.x / 2);
    origin = new THREE.Vector3(playerRight, Player.position.y, 0);

    let raycaster = new THREE.Raycaster(origin, vectorDown, 0, 16);

    let intersectsList = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersectsList.length; i++) {
        if (intersectsList[i].object.name.split('_')[0] !== 'bg') {
            if (intersectsList[i].object.name.split('_')[3] === '1') {
                return true;
            }
        }
    }

    return false;
}