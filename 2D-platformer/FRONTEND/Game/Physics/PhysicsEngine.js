import * as THREE from 'three';

import Player from '../Player/Player.js';
import World from '../World/World.js';
import Game from '../Index.js';

const raycaster = new THREE.Raycaster();


    let PhysicsEngine = {
        update: update,
        gravityStrength: 5,
        checkCollisionWhileWalking: checkCollisionWhileWalking,
    };


function update() {

    if (Player.sprite === null) { return; }

    checkCollisionsBelow();

    if (!Player.collisions.bottom) {

        Player.sprite.position.y -= PhysicsEngine.gravityStrength * (Player.airborneTime * Player.airborneTime) * Game.delta;

    }

}

function checkCollisionWhileWalking() {


    // for debugging \/
    console.log('Checking collision while walking')


    let direction = new THREE.Vector3(0, 0, -1);
    
    if (Player.goingLeft) {

        direction.x = -1;

    }

    if (Player.goingRight) {

        direction.x = 1;

    }

    let distance = 0.1;

    raycaster.set(Player.facingDirection, direction);

    if (World.blocks === undefined) { return; }

    let collisionResults = raycaster.intersectObjects(World.blocks);

    if (collisionResults === undefined) { return; }

    if (collisionResults.length > 0) {
        Player.faceCollides = true;
    }

    Player.faceCollides = false;
}

function checkCollisionsBelow() {


    // for debugging \/
    // console.log('Checking collisions below')


    let direction = new THREE.Vector3(0, -1, 0);

    let distance = 0.1;

    raycaster.set((Player.sprite.position - (Player.size.height / 2)), direction);

    if (World.isLoaded === false) { Player.collisions.bottom = false; return; }

    let collisionResults = raycaster.intersectObjects(Game.mainScene);

    if (collisionResults === undefined) { 
        Player.collisions.bottom = false; 
        Player.airborneTime += Game.delta;

        return;
    }

    if (collisionResults.length > 0) {
        Player.collisions.bottom = true;
        Player.airborneTime += Game.delta;

        return;
    }

    Player.collisions.bottom = false;
    Player.airborneTime = 0;

}

export default PhysicsEngine;