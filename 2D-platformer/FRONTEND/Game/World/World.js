import * as THREE from 'three';

import Game, { camera } from '../Index.js';
import Block from './Block.js';
import Camera from '../Player/Camera.js';
import Player from '../Player/Player.js';

const worldGroup = new THREE.Group();
worldGroup.name = 'World';

const blocksGroup = new THREE.Group();
blocksGroup.name = 'Blocks';

const backgroundBlocksGroup = new THREE.Group();
backgroundBlocksGroup.name = 'Background Blocks';

let blocks = [1, 1, 1, 0, 0, 0, 4, 1];


     let World = {

     load: loadWorld,
     isLoaded: false,

     width: 100,
     height: 50

     };


function loadWorld() {

     loadWeather();
     loadBlocks(blocks);

     Game.mainScene.add(worldGroup);

     camera.position.x = Camera.position.x;
     camera.position.y = Camera.position.y;
     camera.position.z = Camera.position.z;

     World.isLoaded = true;

}

function loadWeather() {

     const backgroundPlane = new THREE.PlaneGeometry(105, 65);
     const backgroundMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
     const background = new THREE.Mesh(backgroundPlane, backgroundMaterial);

     background.position.x = 50;
     background.position.y = 30;
     background.position.z = -0.0001;

     background.name = 'Background';

     Game.mainScene.add(background);

}

function loadBlocks(blocks) {

     let blockX = 0;
     let blockY = 0;

    for (let i = 0; i < blocks.length; i++) {

         let block = blocks[i];

         let blockMesh = Block.create(block);

         blockMesh.position.x = blockX;
         blockMesh.position.y = blockY;
 
         blocksGroup.add(blockMesh);

         blockX += 1;
         if (blockX % World.width === 0) { 

             blockX = 0; 
             blockY += 1;

        };

    }

     worldGroup.add(blocksGroup);

}

export default World;
