import * as THREE from 'three';
import { scene, socket } from './main.js';

let World = {
    blocks: [],
    backgroundBlocks: [],
    entryTile: ''
}

let audioLoader = new THREE.AudioLoader();
let listener = new THREE.AudioListener();

export function worldLoader() {

    socket.emit('request-world');

    socket.on('send-world', (worldData) => {
        let flippedBlocksArray = [];
        let flippedBackgroundBlocksArray = [];

        for (let i = worldData.length; i > 1; i--) {
            if (worldData[i] !== undefined) {
                flippedBlocksArray.push(worldData[i][0]);
                flippedBackgroundBlocksArray.push(worldData[i][1]);
            }
        }

        World.blocks = flippedBlocksArray;
        World.backgroundBlocks = flippedBackgroundBlocksArray;

		generateWorld(flippedBlocksArray);
        loadBackgroundTiles(flippedBackgroundBlocksArray);
        loadWeather();

        // addAudioListeners();
        loadAudio();
	});


    return;
}

function loadAudio() {
    var punchAudio = new THREE.Audio(listener);
    var stream = './sounds/punch_block.wav';

    audioLoader.load(stream, function(buffer) {
        punchAudio.setBuffer(buffer);
        punchAudio.setVolume(0.5);
    });
    punchAudio.name = 'punch_block';

    scene.add(punchAudio)


    stream = './sounds/break_block.wav';
    var breakAudio = new THREE.Audio(listener);
    audioLoader.load(stream, function(buffer) {
        breakAudio.setBuffer(buffer);
    });
    breakAudio.name = 'break_block';

    scene.add(breakAudio)


    stream = './sounds/place_block.wav';
    var placeAudio = new THREE.Audio(listener);
    audioLoader.load(stream, function(buffer) {
        placeAudio.setBuffer(buffer);
    });
    placeAudio.name = 'place_block';

    scene.add(placeAudio)


    stream = './sounds/sorryno.wav';
    var errorAudio = new THREE.Audio(listener);
    audioLoader.load(stream, function(buffer) {
        errorAudio.setBuffer(buffer);
        errorAudio.setVolume(3);
    }
    );

    errorAudio.name = 'error_audio';

    scene.add(errorAudio);


    let hitAudio = new THREE.Audio(listener);
    var stream = './sounds/place_block.wav';
    
    audioLoader.load(stream, function(buffer) {
        hitAudio.setBuffer(buffer);
    });

    hitAudio.name = 'hit_audio';

    scene.add(hitAudio);
}


function generateWorld(blocks) {
    let blocknr = 0;
    let rownr = 0;

    for (let i = 0; i < blocks.length; i++) {
        let block_id = blocks[i];

        let canCollide = 1;

        let hasUseStates = 0;
        let useState = 0;
        let punchCount = 0;

        const geometry = new THREE.PlaneGeometry( 16, 16 );

        const material = new THREE.MeshBasicMaterial( {  
            side: THREE.DoubleSide,
            transparent: true
        } );

        const tile = new THREE.Mesh(geometry, material);

        switch(block_id) {
            case 0:
                tile.material.map = new THREE.TextureLoader().load('./textures/blocks/1.png');
                canCollide = 0;
                material.opacity = 0;
                break;
            case 1:
                tile.material.map = new THREE.TextureLoader().load('./textures/blocks/1.png');
                break;
            case 2:
                tile.material.map = new THREE.TextureLoader().load('./textures/blocks/2.png');
                break;
            case 3:
                tile.material.map = new THREE.TextureLoader().load('./textures/blocks/3.png');
                break;
            case 4:
                tile.material.map = new THREE.TextureLoader().load('./textures/blocks/4.png');
                break;
            case 5:
                tile.material.map = new THREE.TextureLoader().load('./textures/blocks/5.png');
                World.entryTile = tile;
                canCollide = 0;
                break;
            case 6:
                tile.material.map = new THREE.TextureLoader().load('./textures/blocks/6.png');
                hasUseStates = 1;
                canCollide = 0;

                var audioLoader = new THREE.AudioLoader();
                var listener = new THREE.AudioListener();
                var audio = new THREE.Audio(listener);
                var stream = './sounds/radio.wav';
        
                audioLoader.load(stream, function(buffer) {
                    audio.setBuffer(buffer);
                    audio.setLoop(true);
                });
        
                tile.add(audio);
                break;
        }

        tile.name = 
            ((blocknr % 100) * 16) + 
            '_' + rownr + 
            '_' + block_id + 
            '_' + canCollide + 
            '_' + hasUseStates + 
            '_' + useState + 
            '_' + punchCount +
            '_3'; // 8params

        tile.position.x = (blocknr % 100) * 16;
        tile.position.y = (rownr % 56) * 16;
        tile.position.z = 3;

        tile.renderOrder = 5;

        scene.add(tile);

        blocknr += 1;
        if (blocknr % 100 === 0) {
            rownr += 1;
        }
    };
}

function loadBackgroundTiles(blocks) {
    let blocknr = 0;
    let rownr = 0;

    for (let i = 0; i < blocks.length; i++) {
        let block_id = blocks[i];

        const geometry = new THREE.PlaneGeometry( 16, 16 );

        const material = new THREE.MeshBasicMaterial( {  
            side: THREE.DoubleSide,
            transparent: true
        } );

        const tile = new THREE.Mesh(geometry, material);

        switch(block_id) {
            case 0:
                tile.material.map = new THREE.TextureLoader().load('./textures/background_blocks/1.png');
                material.opacity = 0;
                break;
            case 1:
                tile.material.map = new THREE.TextureLoader().load('./textures/background_blocks/1.png');
                break;
        }

        tile.name = 'bg_' + ((blocknr % 100) * 16) + '_' + rownr + '_' + block_id;

        tile.position.x = (blocknr % 100) * 16;
        tile.position.y = (rownr % 56) * 16;
        tile.position.z = 3;

        tile.renderOrder = 1;

        scene.add(tile);

        blocknr += 1;
        if (blocknr % 100 === 0) {
            rownr += 1;
        }
    };
}

function loadWeather() {
    const geometry = new THREE.PlaneGeometry( 1600, 900 );

    const material = new THREE.MeshBasicMaterial( {  
        side: THREE.DoubleSide
    } );

    const weatherMesh = new THREE.Mesh(geometry, material);

    weatherMesh.material.map = new THREE.TextureLoader().load('./textures/background.png');

    weatherMesh.position.x = 800 - 10;
    weatherMesh.position.y = 450;
    weatherMesh.name = 'weather';

    scene.add(weatherMesh);
}

export default World;