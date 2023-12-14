import * as THREE from 'three';

import Player from './Player/Player.js';
import World from './World/World.js';
import Camera from './Player/Camera.js';
import PhysicsEngine from '../Game/Physics/PhysicsEngine.js';

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const scene = new THREE.Scene();

const clock = new THREE.Clock();
let delta = 0;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


     let Game = {

          mainScene: scene,
          delta: delta,

          mouseX: 0,
          mouseY: 0,

          camera: camera

     };


function animate() {

     delta = clock.getDelta();

     if (World.isLoaded === true && Player.name !== null) {
          PhysicsEngine.update();
          Camera.updateLocation();
     }


    if (Camera.zoomingIn && camera.position.z > 1.5) {


        // for debugging \/
     //    console.log(camera.position.z)


         camera.position.z -= Camera.zoomSpeed * delta;

    }

    if (Camera.zoomingOut && camera.position.z < 10) {


        // for debugging \/
     //    console.log(camera.position.z)


         camera.position.z += Camera.zoomSpeed * delta;

    }



    if (World.isLoaded === false) {

          requestAnimationFrame(animate);
          renderer.render(scene, camera);
          return;

    }

    if (Player.sprite !== null) {

          Player.sprite.position.x = Player.position.x;
          Player.sprite.position.y = Player.position.y;

    }

    if (Player.goingLeft) {

          if (Player.faceCollides === false) {
               PhysicsEngine.checkCollisionWhileWalking();
               Player.position.x -= Player.movementSpeed * delta;
          }

    }

    if (Player.goingRight) {

          if (Player.faceCollides === false) {
               PhysicsEngine.checkCollisionWhileWalking();
               Player.position.x += Player.movementSpeed * delta;
          }

    }

    if (Player.holdingMouseRight) {


        // for debugging \/
        // console.log('holding mouse right')


     //     mouseHoldEvent();

    }


    requestAnimationFrame(animate);
    renderer.render(scene, camera);

}

document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('keydown', (event) => {

          let key = event.key.toUpperCase();

          if (key === 'Z') {

               Camera.zoomingIn = true;

          }

          if (key === 'X') {

             Camera.zoomingOut = true;

          }

          if (key === 'W' || key === ' ') {

               Player.jump();

          }

          if (key === 'A') {

               if (Player.faceCollides === false) {

                    Player.faceVectorStartPoint.x = Player.position.x - (Player.size.width / 2);
                    Player.facingDirection.x = -1;
                    Player.goingLeft = true;

               }

          }

          if (key === 'D') {

               if (Player.faceCollides === false) {
                    
                    Player.faceVectorStartPoint.x = Player.position.x + (Player.size.width / 2);
                    Player.facingDirection.x = 1;
                    Player.goingRight = true;
     
               }

          }

    });

    document.addEventListener('keyup', (event) => {
          let key = event.key.toUpperCase();

          if (key === 'L') {

               World.load();

               Player.name = 'Player';
               Player.createSprite();

          }

          if (key === 'Z') {

             Camera.zoomingIn = false;

          }

          if (key === 'X') {

               Camera.zoomingOut = false;

          }

          if (key === 'A') {

               Player.facingDirection.x = -1;
               Player.goingLeft = false;

          }

          if (key === 'D') {

               Player.facingDirection.x = 1;
               Player.goingRight = false;

          }

    });

    document.addEventListener('pointerdown', (event) => {


        // for debugging \/
        // console.log('click')

     //    if (World.isLoaded === false) { return; }

     //    Player.setClickableElement(scene, Game.camera);

     //     Player.holdingMouseRight = true;

    });

    document.addEventListener('pointerup', () => {


        // for debugging \/
        // console.log('release')


     //     Player.holdingMouseRight = false;

    });

    document.addEventListener('pointermove', (event) => {


        // for debugging \/
        // console.log('move')

     //     Player.setMousePosition(event);
     //     console.log(Game.mouseX, Game.mouseY)

    });

    animate();

});

export default Game;