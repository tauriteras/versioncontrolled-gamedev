import * as THREE from 'three';
import Game from '../Index';

const raycaster = new THREE.Raycaster();


    let Player = {
        name: null,

        createSprite: createPlayerSprite,

        jump: jump,
        airborneTime: 0,

        punch: punch,

        sprite: null,
        size: {
            width: 0.5,
            height: 1
        },
        position: {
            x: 0,
            y: 1,
            z: 0.01
        },
        collisions: {
            left: false,
            right: false,
            top: false,
            bottom: false
        },

        movementSpeed: 1,
        goingLeft: false,
        goingRight: false,

        faceCollides: false,
        facingDirection: new THREE.Vector3(0, 1, 0),
        spriteDirection: new THREE.Vector3(0, 1, 0),
        faceVectorStartPoint: new THREE.Vector3(0, 0, 0),

        setMousePosition: setMousePosition,
        // setClickableElement: setClickableElementSelector,
        holdingMouseRight: false,

        clickedElement: null
    };


function createPlayerSprite() {

    if (Player.name === null) { return; }
    // for debugging \/
    console.log('Creating player')
    
    const playerPlane = new THREE.PlaneGeometry(Player.size.width, Player.size.height);

    const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    let player = new THREE.Mesh(playerPlane, playerMaterial);

    player.position.x = Player.position.x;
    player.position.y = Player.position.y;
    player.position.z = Player.position.z;

    player.renderOrder = 100;

    player.userData = {
        objectType: 'Player',
        name: Player.name,
        dateCreated: Date.now()
    };

    Game.mainScene.add(player);
    Player.sprite = player;
    
}

function jump() {

    Player.position.y += 5;

}

function animatedJumping() {

}

function punch() {


    // for debugging \/
    console.log('Punching')
    // console.log(Player.clickedElement)


    // TODO: Make the punch animation work
    // let punchAnimationDirection = getPunchDirectionVector();


    // for debugging \/
    // console.log(punchAnimationDirection);


    // if (Player.clickedElement === null) { return; }

    // console.log(Player.clickedElement.userData);

    // if (Player.clickedElement.userData.objectType === 'Block') {

    //     Player.clickedElement.material.color.setHex(0xff0000);

    // }



    // for debugging \/
    // console.log(punchAnimationDirection)


}

// function getPunchDirectionVector() {
    
//     const mousePoint = new THREE.Vector2(Player.mouseX, Player.mouseY);

//     raycaster.set(Player.sprite, mousePoint);

//     const directionVector = raycaster.ray.direction;

//     return directionVector;

// }

// export function mouseHoldEvent(event, camera, scene) {

//     punch();


//     // for debugging \/
//     // console.log('mouse down event')
//     // console.log(Player.clickedElement)
// }

function setMousePosition(event) {

    // calculate pointer position in normalized device coordinates 
    // (-1 to +1) for both components 

     Game.mouseX = (event.clientX / window.innerWidth) * 2 - 1; 
     Game.mouseY = (event.clientY / window.innerHeight) * 2 + 1;

    // for debugging \/
    // console.log('mouse coords', Player.mouseX, Player.mouseY)

}

// function setClickableElementSelector(scene, camera) {

//     const pointer = new THREE.Vector2();     
//     pointer.x = Game.mouseX;
//     pointer.y = Game.mouseY;

//     // update the picking ray with the camera and pointer position 
//     raycaster.setFromCamera(camera, pointer); 

//     // calculate objects intersecting the picking ray 
//     console.log('scene children', scene.children)
//     const intersects = raycaster.intersectObjects( scene.children );


//     // for debugging \/
//     console.log('object picking raycaster', intersects)


//     for(let i = 0; i < intersects.length; i++) {

//         if (intersects[i].object.name === 'Block') {

//             Player.clickedElement = intersects[i].object;

//         }


//         // for debugging
//         console.log(Player.clickedElement)


//     }
    
// // }



export default Player;