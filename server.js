// 1. ИСПРАВЛЕНА ССЫЛКА (CDN должен вести на .js файл)
// Замени в <head> строку со скриптом на эту:
// <script src="https://cdn.socket.io"></script>

const SERVER_URL = 'https://mics-server-1.onrender.com';

// Инициализация сокета с настройками для стабильности
const socket = io(SERVER_URL, { 
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 20,
    reconnectionDelay: 2000
});

const chat = document.getElementById('chat');
const msgInput = document.getElementById('msg-input');
const nickInput = document.getElementById('nick-input');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const debug = document.getElementById('debug');

// Генерация случайного ника
nickInput.value = "User_" + Math.floor(Math.random() * 999);

// --- ОБРАБОТКА СОБЫТИЙ СОКЕТА ---

socket.on('connect', () => {
    statusDot.style.background = "#00ff88";
    statusDot.style.boxShadow = "0 0 10px #00ff88";
    statusText.innerText = "В СЕТИ";
    debug.innerText = "";
    console.log('Connected to server');
});

socket.on('connect_error', (err) => {
    statusDot.style.background = "#ffcc00";
    statusDot.style.boxShadow = "0 0 10px #ffcc00";
    statusText.innerText = "ПОДКЛЮЧЕНИЕ...";
    debug.innerText = "Сервер просыпается (до 60 сек)...";
});

socket.on('message', (data) => {
    // Проверяем, мой ли это ник (с учетом обрезки пробелов)
    const isMy = data.user === nickInput.value.trim();
    render(data, isMy);
});

// --- ФУНКЦИИ ---

function sendMsg() {
    const text = msgInput.value.trim();
    const user = nickInput.value.trim() || "Anonymous";

    if (text && socket.connected) {
        // Отправляем объект на сервер
        socket.emit('message', { user, text });
        msgInput.value = "";
        msgInput.focus();
    } else if (!socket.connected) {
        alert("Подождите, сервер еще не подключен");
    }
}

function render(data, isMy) {
    const group = document.createElement('div');
    group.className = `msg-group ${isMy ? 'my-group' : 'other-group'}`;
    
    // Используем escapeHTML для защиты от XSS атак
    const safeText = escapeHTML(data.text);
    const time = data.time || new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    
    group.innerHTML = `
        ${!isMy ? `<div class="sender-name">${escapeHTML(data.user)}</div>` : ''}
        <div class="bubble ${isMy ? 'my-bubble' : 'other-bubble'}">${safeText}</div>
        <div class="time">${time}</div>
    `;
    
    chat.appendChild(group);
    
    // Плавная прокрутка вниз
    chat.scrollTo({
        top: chat.scrollHeight,
        behavior: 'smooth'
    });
}

function escapeHTML(str) {
    if (!str) return "";
    const map = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'};
    return str.replace(/[&<>"']/g, m => map[m]);
}

// Отправка по Enter
msgInput.onkeypress = (e) => { 
    if(e.key === 'Enter') sendMsg(); 
};
