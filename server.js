// main.js - Весь ваш HTML перенесен в JS
document.body.innerHTML = `
<header>
    <div class="logo-box">
        <div class="logo">Mics</div>
        <div id="status-dot"></div>
        <div id="status-text">ПОДКЛЮЧЕНИЕ...</div>
    </div>
    <div style="font-size: 10px; opacity: 0.4;">ULTIMATE v3</div>
</header>

<div id="chat">
    <div class="msg-group other-group">
        <div class="bubble other-bubble">
            <b>Система:</b> Ожидайте активации сервера (до 60 сек). Если индикатор станет зеленым — вы в сети!
        </div>
    </div>
</div>

<div id="debug"></div>

<div class="input-area">
    <input type="text" id="nick-input" placeholder="Ник" maxlength="12">
    <input type="text" id="msg-input" placeholder="Сообщение..." autocomplete="off">
    <button id="send-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
    </button>
</div>
`;

// ЛОГИКА ПОДКЛЮЧЕНИЯ
const SERVER_URL = 'https://mics-server-1.onrender.com';
const socket = io(SERVER_URL, { 
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 10 
});

const chat = document.getElementById('chat');
const msgInput = document.getElementById('msg-input');
const nickInput = document.getElementById('nick-input');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const sendBtn = document.getElementById('send-btn');

nickInput.value = "User_" + Math.floor(Math.random() * 999);

socket.on('connect', () => {
    statusDot.style.background = "#00ff88";
    statusDot.style.boxShadow = "0 0 10px #00ff88";
    statusText.innerText = "В СЕТИ";
});

socket.on('message', (data) => {
    const isMy = data.user === nickInput.value;
    render(data, isMy);
});

function sendMsg() {
    const text = msgInput.value.trim();
    const user = nickInput.value.trim() || "MicsUser";
    if (text && socket.connected) {
        socket.emit('message', { user, text });
        msgInput.value = "";
    }
}

function render(data, isMy) {
    const group = document.createElement('div');
    group.className = `msg-group ${isMy ? 'my-group' : 'other-group'}`;
    group.innerHTML = `
        ${!isMy ? `<div class="sender-name">${data.user}</div>` : ''}
        <div class="bubble ${isMy ? 'my-bubble' : 'other-bubble'}">${escapeHTML(data.text)}</div>
        <div class="time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
    `;
    chat.appendChild(group);
    chat.scrollTop = chat.scrollHeight;
}

function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

// Слушатели событий
sendBtn.onclick = sendMsg;
msgInput.onkeypress = (e) => { if(e.key === 'Enter') sendMsg() };
