import Player from './Player.js';
import Shop from './shop.js';

export function loadGameUI() {

    let currencyContainer = document.getElementById('currency');
    currencyContainer.style.display = 'flex';

    currencyContainer.addEventListener('click', function(e) {
        if (Shop.isOpen) { return; }

        console.log('open shop');
    });

    let currencyNumContainer = document.getElementById('currency__amount');
    currencyNumContainer.innerHTML = Player.currency.toString();

    let backpackContainer = document.getElementById('backpack');
    backpackContainer.style.display = 'flex';

    let chatContainer = document.getElementById('chat');
    chatContainer.style.display = 'flex';

    loadInventoryItems();
}

function loadInventoryItems() {
    let backpack = document.getElementById('backpack__items');

    let punchElement = document.createElement('div');
    punchElement.classList.add('backpack__item');
    punchElement.classList.add('active');
    punchElement.dataset.itemId = '-1';

    backpack.appendChild(punchElement);

    loadBlocks(backpack);
    loadSeeds(backpack);

    let backpackElements = document.querySelectorAll('.backpack__item');
    
    for (let i = 0; i < backpackElements.length; i++) {
        backpackElements[i].addEventListener('click', function(e) {
            let itemID = this.dataset.itemId;

            if (itemID === 'punch') {
                Player.selectedBlock = 0;
            } else {
                Player.selectedBlock = parseInt(itemID);
            }

            for (let i = 0; i < backpackElements.length; i++) {
                backpackElements[i].classList.remove('active');
            }

            this.classList.add('active');
        });
    }
}

function loadSeeds(backpack) {

    for (let i = 0; i < Player.inventory.seeds.length; i++) {
        let item = Player.inventory.seeds[i];

        let itemElement = document.createElement('div');
        itemElement.classList.add('backpack__item');
        itemElement.dataset.itemId = item[0];

        let itemImage = document.createElement('img');
        itemImage.classList.add('backpack__item__image');
        itemImage.src = './textures/seeds/' + item[0].toString() + '.png';

        let itemCount = document.createElement('div');
        itemCount.classList.add('backpack__item__count');
        itemCount.innerHTML = item[1].toString();

        itemElement.appendChild(itemImage);
        itemElement.appendChild(itemCount);

        itemElement.dataset.itemId = item[0];
        itemElement.dataset.itemType = 'seed';

        backpack.appendChild(itemElement);
    }

}

function loadBlocks(backpack) {

    for (let i = 0; i < Player.inventory.blocks.length; i++) {
        let item = Player.inventory.blocks[i];

        let itemElement = document.createElement('div');
        itemElement.classList.add('backpack__item');

        let itemImage = document.createElement('img');
        itemImage.classList.add('backpack__item__image');
        itemImage.src = './textures/blocks/' + item[0].toString() + '.png';

        let itemCount = document.createElement('div');
        itemCount.classList.add('backpack__item__count');
        itemCount.innerHTML = item[1].toString();

        itemElement.appendChild(itemImage);
        itemElement.appendChild(itemCount);
        itemElement.dataset.itemId = item[0];
        itemElement.dataset.itemType = 'block';

        if (item[0] === Player.selectedBlock) {
            itemElement.classList.add('active');
        }

        backpack.appendChild(itemElement);
    }

}

export function updateInventoryItem(itemID) {
    let selecotor = '[data-item-id="' + itemID + '"]';

    let inventoryElement = document.querySelector(selecotor);

    if (inventoryElement === null) return;

    inventoryElement.children[1].innerHTML = Player.inventory.blocks[itemID - 1][1].toString();
}