import * as THREE from 'three';

import Player from './Player.js';
import Game from './main.js';

let vectorDown = new THREE.Vector3(0, 0, 1);
let origin = new THREE.Vector3(0, 0, 0);

let PhysicsEngine = {
    update: physicsEngine,
    bottomCollision: checkBottomCollision,
    topCollisions: checkTopCollisions,
    leftCollisions: checkLeftCollisions,
    rightCollisions: checkRightCollisions
}

function physicsEngine() {

    // Gravity
    // TODO: Speed up gravity when falling
    if (Player.isMovingUp === false && !checkBottomCollision()) {
        Player.position.y -= 1.5 * Game.delta;
    }


    // Check if touching ground
    if (checkBottomCollision()) {
        Player.isTouchingGround = true;
    }

    if (!checkBottomCollision()) {
        Player.isTouchingGround = false;
    }


    // Movement
    if (Player.isMovingDown === true) {
        Player.position.y -= Player.movementSpeed * Game.delta;
    }

    if (Player.isMovingLeft === true && Player.position.x > (Player.size.x / 2) && !checkLeftCollisions()) {
        Player.position.x -= Player.movementSpeed * Game.delta;
    }

    if (Player.isMovingRight === true && Player.position.x < ((16 * 100) - (Player.size.x / 2)) && !checkRightCollisions()) {
        Player.position.x += Player.movementSpeed * Game.delta;
    }
}

function checkBottomCollision() {
    let playerBottom = Player.position.y - (Player.size.y / 2);
    origin = new THREE.Vector3(Player.position.x, playerBottom, 0);

    let raycaster = new THREE.Raycaster(origin, vectorDown, 0, 16);

    let intersectsList = raycaster.intersectObjects(Game.scene.children);

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

function checkTopCollisions() {

}

function checkLeftCollisions() {
    let playerLeft = Player.position.x - (Player.size.x / 2);
    origin = new THREE.Vector3(playerLeft, Player.position.y, 0);

    let raycaster = new THREE.Raycaster(origin, vectorDown, 0, 16);

    let intersectsList = raycaster.intersectObjects(Game.scene.children);

    for (let i = 0; i < intersectsList.length; i++) {
        if (intersectsList[i].object.name.split('_')[0] !== 'bg') {
            if (intersectsList[i].object.name.split('_')[3] === '1') {
                return true;
            }
        }
    }

   return false;
}

function checkRightCollisions() {
    let playerRight = Player.position.x + (Player.size.x / 2);
    origin = new THREE.Vector3(playerRight, Player.position.y, 0);

    let raycaster = new THREE.Raycaster(origin, vectorDown, 0, 16);

    let intersectsList = raycaster.intersectObjects(Game.scene.children);

    for (let i = 0; i < intersectsList.length; i++) {
        if (intersectsList[i].object.name.split('_')[0] !== 'bg') {
            if (intersectsList[i].object.name.split('_')[3] === '1') {
                return true;
            }
        }
    }

    return false;
}

export default PhysicsEngine;