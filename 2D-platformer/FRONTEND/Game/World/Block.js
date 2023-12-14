import * as THREE from 'three';


    let Block = {

        create: createBlock

    };


function createBlock() {

    const blockPlane = new THREE.PlaneGeometry(1, 1);
    const blockMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const block = new THREE.Mesh(blockPlane, blockMaterial);

    block.position.z = 0.001;

    block.name = 'Block';

    block.userData = {
        objectType: 'Block'
    };

    return block;

}

export default Block;