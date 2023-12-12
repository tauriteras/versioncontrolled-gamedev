import * as THREE from 'three';

import Game from './main.js';
import World from './world.js';

import { updateInventoryItem, loadGameUI } from './ui.js';

let Player = {
    name: '',
    uniqueID: '',
    position: {
        x: 600,
        y: 410,
        z: 3
    },
    size: { 
        x: 16, 
        y: 24
    },
    inventory: {
        blocks: [[1, 10], [2, 10], [3, 10], [4, 10], [5, 10], [6, 10]],
        backgroundTiles: [[7, 10]],
        seeds: [[8, 10], [9, 10], [10, 10]]
    },
    sprite: '',
    currency: 99999,
    selectedBlock: -1,
    hoveringOver: '',
    movementSpeed: 2,
    isTouchingGround: true,
    isMovingLeft: false,
    isMovingRight: false,
    isMovingUp: false,
    isMovingDown: false,
    mouseX: 0,
    mouseY: 0,
    mouseIsDown: false,

    initInputListener: initPlayerListeners,
    createSprite: createPlayerSprite,

    itemPicker: pickUpItem,
    respawn: respawn,

    punch: punch,
    jump: jump,
}

export function getEntryTilePosition() {
    let tile = Game.scene.getObjectByName(World.entryTile.name);

    Player.position.x = tile.position.x;
    Player.position.y = tile.position.y + 4;

    World.entryTile = tile;
}

function respawn() {
    let tile = Game.scene.getObjectByName(World.entryTile.name);

    Player.position.x = tile.position.x;
    Player.position.y = tile.position.y + 4;

}

export function createPlayerSprite(idendtifyer, x, y, username = Player.name) {
    let playerGeometry = new THREE.PlaneGeometry( Player.size.x , Player.size.y );
    let playerMaterial = new THREE.MeshBasicMaterial( { 
        map: new THREE.TextureLoader().load('./textures/player/male/player.png'), 
        side: THREE.DoubleSide,
        transparent: true
    } );

    let playerSprite = new THREE.Mesh( playerGeometry, playerMaterial );

    playerSprite.name = idendtifyer;
	playerSprite.position.x = x;
	playerSprite.position.y = y;
    playerSprite.position.z = Player.position.z;

    playerSprite.renderOrder = 100;

    loadGameUI();
    createNameTag(username);

    Game.scene.add(playerSprite);
    Player.sprite = playerSprite;
}

function createNameTag(username) {

}

export function initPlayerListeners() {
    document.addEventListener('keydown', (event) => {

        const keyName = event.key.toLowerCase();

        let playerSprite = Game.scene.getObjectByName(Player.uniqueID);

        if (playerSprite === undefined) { return; }

        if (((keyName === 'w' || keyName === ' ') && Player.isTouchingGround)) {
            Player.jump();
        }
        if (keyName === 'a') {
            Player.isMovingLeft = true;
        }
        if (keyName === 'd') {
            Player.isMovingRight = true;
        }

        if (keyName === 's' && Player.position.y > -448 + 24) {
            Player.isMovingDown = true;
        }

        if (keyName === 'r') {
            Player.respawn();
        }
    });

    document.addEventListener('keyup', (event) => {
        const keyName = event.key.toLowerCase();

        if (keyName === ' ' || keyName === 'w') {
            Player.isMovingUp = false;
        }

        if (keyName === 'a') {
            Player.isMovingLeft = false;
        }

        if (keyName === 'd') {
            Player.isMovingRight = false;
        }

        if (keyName === 's') {
            Player.isMovingDown = false;
        }

    });
}

function jump() {
    Player.position.y += 24;
    Player.isTouchingGround = false;
}

function punch() {
        let hoverArray = Player.hoveringOver;
        let tile;
        let backgroundTile;

        if (hoverArray === undefined) return;

        for (let i = 0; i < hoverArray.length; i++) {

            let object = hoverArray[i].object;

            if (object != undefined 
                && object.name != 'overlay'
                 && object.name != 'weather' 
                 && object.name != 'solid_tilemap' 
                 && object.name != Player.uniqueID 
                 && object.name.split('_')[0] != 'bg'
                 && object.name.split('_')[0] != 'block'
                 && object.name.split('_')[0] != 'seed') {
                tile = object;
            }

            if (object != undefined && object.name != 'weather' && object.name != 'solid_tilemap' && object.name != Player.uniqueID && object.name.split('_')[0] == 'bg') {
                backgroundTile = object;
            }
        }


            if (tile.name.split('_')[2] === '0') {
                tile = backgroundTile;
            }

            hit(tile);


        // if (Player.selectedBlock !== -1) {
        //     if (tile.name.split('_')[2] === '0') {
        //         placeItem(tile);
        //     } else {
        //         let audio = Game.scene.getObjectByName('error_audio');
        //         audio.play();
        //     }
        // }
}



function hit(tile) {
    let hitSound = Game.scene.getObjectByName('hit_audio');

    let audio = Game.scene.getObjectByName('punch_block');
    audio.play();
    
    console.log('punching item', tile.name);

    console.log(parseInt(tile.name.split('_')[6]), parseInt(tile.name.split('_')[7]));

    if (tile.name.split('_')[4] === '1') {
        let hitCount = parseInt(tile.name.split('_')[6]);

        if (hitCount < 4) {
            interactItem(tile);
        }

        if (hitCount >= 4 ) {
            hitSound.play();

            breakingOverlay(tile);
        }
    
        if (hitCount == 7) {
            breakBlock(tile);
        }

        addPunchCount(tile);
    }

    
    if (tile.name.split('_')[2] !== '0' &&
        tile.name.split('_')[0] !== 'bg' &&
        tile.name.split('_')[4] === '0' &&
        parseInt(tile.name.split('_')[6]) < parseInt(tile.name.split('_')[7])) 
    {

        hitSound.play();

        breakingOverlay(tile);

        addPunchCount(tile);
    }
    
    if(tile.name.split('_')[2] !== '0' &&
        tile.name.split('_')[0] !== 'bg' &&
        tile.name.split('_')[4] === '0' &&
        tile.name.split('_')[4] === '0' && 
        (parseInt(tile.name.split('_')[6])) === parseInt(tile.name.split('_')[7])) {

        breakBlock(tile);

    }

    if (tile.name.split('_')[0] === 'bg' &&
     tile.name.split('_')[3] !== '0') {

        breakBackgroundTile(tile);
    }
}

function addPunchCount(tile) {

    let punchCount = parseInt(tile.name.split('_')[6]);

    if ((punchCount + 1) === tile.name.split('_')[7]) {
        breakBlock(tile);
        return;
    }

    tile.name = tile.name.split('_')[0] +
     '_' + tile.name.split('_')[1] + '_' +
      tile.name.split('_')[2] + '_' +
       tile.name.split('_')[3] + '_' +
        tile.name.split('_')[4] + '_' +
        tile.name.split('_')[5] + '_' +
         (punchCount + 1) +
          '_' + tile.name.split('_')[7];

    console.log('new punchcount', tile.name);
}

function breakingOverlay(tile) {
    let overlay;
    let hasOverlay = false;
    let tileChildren = tile.children;

    for (let i = 0; i < tileChildren.length; i++) {
        if (tileChildren[i].name === 'overlay') {
            hasOverlay = true;
            overlay = tileChildren[i];
        }
    }

    if (!hasOverlay) {

        const geometry = new THREE.PlaneGeometry( 16, 16 );
        const material = new THREE.MeshBasicMaterial( {  
            side: THREE.DoubleSide,
            transparent: true
        } );
        const tileOverlay = new THREE.Mesh(geometry, material);

        tileOverlay.material.map = new THREE.TextureLoader().load('./textures/assets/breaking/breaking_1.png');

        tileOverlay.name = 'overlay';
        tileOverlay.renderOrder = 10;
        tile.add(tileOverlay);

        console.log("added overlay")
    } 
    
    if (hasOverlay) {
        let punchCount = parseInt(tile.name.split('_')[6]);

        if (tile.name.split('_')[4] === '1') { punchCount = parseInt(tile.name.split('_')[6]) - 5; }

        console.log('punch-count', punchCount)

        if (punchCount == 1) {
            overlay.material.map = new THREE.TextureLoader().load('./textures/assets/breaking/breaking_2.png');
        } 
        if (punchCount == 2) {
            overlay.material.map = new THREE.TextureLoader().load('./textures/assets/breaking/breaking_3.png');
        }
    }
}

function placeItem(tile) {
    if (Player.inventory.blocks[Player.selectedBlock - 1][1] === 0) {
        let audio = Game.scene.getObjectByName('error_audio');
        audio.play();
        return;
    };

    let audio = Game.scene.getObjectByName('place_block');
    audio.play();

    Player.inventory.blocks[Player.selectedBlock - 1][1] -= 1;
   
    tile.material.map = new THREE.TextureLoader().load('./textures/blocks/' + (Player.selectedBlock).toString() + '.png');
    tile.material.opacity = 1;

    if (Player.selectedBlock === 5) {
    tile.name = tile.name.split('_')[0] + '_' + tile.name.split('_')[1] + '_' + Player.selectedBlock + '_0' + '_0' + '_0' + '_0';
    } else if (Player.selectedBlock === 6) {
        tile.name = tile.name.split('_')[0] +
         '_' + tile.name.split('_')[1] +
          '_' + Player.selectedBlock +
           '_0' +
            '_1' +
             '_0' +
              '_0' +
                '_3';
        let audioLoader = new THREE.AudioLoader();
        let listener = new THREE.AudioListener();
        let audio = new THREE.Audio(listener);
        let stream = './sounds/radio.wav';

        audioLoader.load(stream, function(buffer) {
            audio.setBuffer(buffer);
            audio.setLoop(true);
        });

        tile.add(audio);

    } else {
        tile.name = tile.name.split('_')[0] +
         '_' + tile.name.split('_')[1] +
          '_' + Player.selectedBlock +
           '_1' + 
           '_0' + 
           '_0' + 
           '_0' +
            '_3';
    }

    console.log('placed in tile', tile.name)

    updateInventoryItem(Player.selectedBlock);
}

function breakBlock(tile) {
    let audio = Game.scene.getObjectByName('break_block');
    audio.play();

    tile.material.map = new THREE.TextureLoader().load('./textures/blocks/0.png');
    tile.material.opacity = 0;

    let overlay = tile.getObjectByName('overlay');
    overlay.material.map = new THREE.TextureLoader().load('./textures/assets/breaking_1.png');
    overlay.material.opacity = 0;


    let randInt = Math.floor(Math.random() * 100);
    if (randInt < 10) {
        spawnSeed(tile);
    }

    if (randInt < 40 && randInt > 10) {
        spawBlock(tile);
    }


    updateInventoryItem(tile.name.split('_')[2]);

    tile.name = tile.name.split('_')[0] +
     '_' + tile.name.split('_')[1] +
      '_0' + '_0' + '_0' + '_0' + '_0' + '_0';
    tile.remove(tile.children[0]);
}

function spawnSeed(tile) {
    let itemID = tile.name.split('_')[2];

    let geometry= new THREE.PlaneGeometry(8, 8);
    let seedMaterial = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true
    });

    let seed = new THREE.Mesh(geometry, seedMaterial);

    seed.position.x = tile.position.x;
    seed.position.y = tile.position.y;
    seed.position.z = 3;

    seed.renderOrder = 99;

    seed.name = 'seed_' + itemID;

    if (itemID === '2') {
        seedMaterial.map = new THREE.TextureLoader().load('./textures/seeds/seed.png');
    }

    if (itemID === '3') {
        seedMaterial.map = new THREE.TextureLoader().load('./textures/seeds/seed2.png');
    }

    if (itemID === '4') {
        seedMaterial.map = new THREE.TextureLoader().load('./textures/seeds/seed3.png');
    }

    Game.scene.add(seed);
}

function spawBlock(tile) {
    let itemID = tile.name.split('_')[2];

    let geometry = new THREE.PlaneGeometry(8, 8);
    let seedMaterial = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        transparent: true
    });

    seedMaterial.map = new THREE.TextureLoader().load(`./textures/blocks/${itemID}.png`);

    let block = new THREE.Mesh(geometry, seedMaterial);

    block.position.x = tile.position.x;
    block.position.y = tile.position.y;
    block.position.z = 3;

    block.renderOrder = 99;

    block.name = 'block_' + itemID;

    Game.scene.add(block);
}

function breakBackgroundTile(tile) {
    let audio = Game.scene.getObjectByName('break_block');
    audio.play();

    tile.material.map = new THREE.TextureLoader().load('./textures/blocks/0.png');
    tile.material.opacity = 0;

    // updateInventoryItem(6);

    tile.name = 'bg_' + tile.name.split('_')[1] + '_' + tile.name.split('_')[2] + '_0';
}

function interactItem(tile) {

    if (tile === undefined) return;

    if (tile.name.split('_')[5] === '0') {
        tile.material.map = new THREE.TextureLoader().load('./textures/blocks/6-2.png');
        tile.name = tile.name.split('_')[0] + '_' + tile.name.split('_')[1] + '_' + tile.name.split('_')[2] + '_' + tile.name.split('_')[3] + '_' + tile.name.split('_')[4] + '_1' + '_' + tile.name.split('_')[6] + '_' + tile.name.split('_')[7];

        let audio = tile.children[0];
        audio.play();

    } else if (tile.name.split('_')[5] === '1') {
        tile.material.map = new THREE.TextureLoader().load('./textures/blocks/6.png');
        tile.name = tile.name.split('_')[0] + '_' + tile.name.split('_')[1] + '_' + tile.name.split('_')[2] + '_' + tile.name.split('_')[3] + '_' + tile.name.split('_')[4] + '_0' + '_' + tile.name.split('_')[6] + '_' + tile.name.split('_')[7];

        let audio = tile.children[0];
        audio.stop();
    }

}

function pickUpItem() {
    let playerSprite = Game.scene.getObjectByName(Player.uniqueID);

    let origin = new THREE.Vector3(playerSprite.position.x, playerSprite.position.y, 0);
    let direction = new THREE.Vector3(0, 0, 1);

    let raycaster = new THREE.Raycaster(origin, direction, 0, 16);

    let intersectsList = raycaster.intersectObjects(Game.scene.children);

    for (let i = 0; i < intersectsList.length; i++) {
        let object = intersectsList[i].object;

        if (object.name.split('_')[0] === 'seed') {
            Player.inventory.seeds[0][1] += 1;

            Game.scene.remove(object);
        } else if (object.name.split('_')[0] === 'block') {

            Player.inventory.blocks[object.name.split('_')[1] - 1][1] += 1;

            console.log(object.name);

            updateInventoryItem(object.name.split('_')[1]);

            Game.scene.remove(object);
        }
    }
}


export default Player;