import Player from "./Player.js";

let Chat = {
    sendMessage: sendMessage,
    getCurrentTime: getCurrentTime,
    addMessageToChat: addMessageToChat
}

function sendMessage() {
	let message = document.getElementById('chat__input__field').value;

    let dateString = getCurrentTime();

    socket.emit('message', message, dateString, Player.name, 'W');
    addMessageToChat(message, dateString, Player.name, 'W');
}

function getCurrentTime() {
    let date = new Date();

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    return `[${hours}:${minutes}:${seconds}]`;
}

function addMessageToChat(message, time, username, type) {
    if (message === "") { return; }
    if (time === undefined) { 
        time = getCurrentTime();
    }

    const chatMessagesContainer = document.getElementById('chat__messages');

        const chatMessageContainer = document.createElement('div');
        chatMessageContainer.classList.add('chat__messages__message');


            const chatMessageStatsContainer = document.createElement('div');
            chatMessageStatsContainer.classList.add('chat__messages__message__stats');

            
                const chatMessageUsername = document.createElement('div');
                chatMessageUsername.classList.add('chat__messages__message__username');
                chatMessageUsername.innerText = username;

                const chatMessageTime = document.createElement('div');
                chatMessageTime.classList.add('chat__messages__message__time');
                chatMessageTime.innerText = time;

                const chatMessageType = document.createElement('div');
                chatMessageType.classList.add('chat__messages__message__type');
                chatMessageType.innerText = type;



            const chatMessageText = document.createElement('div');
            chatMessageText.classList.add('chat__messages__message__text');
            chatMessageText.innerText = message;



        chatMessageStatsContainer.appendChild(chatMessageType);
        chatMessageStatsContainer.appendChild(chatMessageTime);
        chatMessageStatsContainer.appendChild(chatMessageUsername);

        chatMessageContainer.appendChild(chatMessageStatsContainer);

        chatMessageContainer.appendChild(chatMessageText);

        chatMessagesContainer.appendChild(chatMessageContainer);

        chatMessageContainer.scrollIntoView();


  document.getElementById('chat__input__field').value = "";

}

export default Chat;