const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// Отдаем твой интерфейс при заходе на сайт
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mics Messenger Ultimate</title>
    <script src="https://cdn.socket.io"></script>
    <style>
        :root { --accent: #00d2ff; --bg: #0b0b0e; --panel: #16161d; --text: #ffffff; --msg-other: #25252d; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; background: var(--bg); color: var(--text); height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
        header { background: var(--panel); padding: 15px 25px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--accent); box-shadow: 0 4px 20px rgba(0,0,0,0.5); z-index: 10; }
        .logo-box { display: flex; align-items: center; gap: 10px; }
        .logo { font-size: 24px; font-weight: 900; color: var(--accent); letter-spacing: 3px; text-transform: uppercase; }
        #status-dot { width: 10px; height: 10px; background: #ff4444; border-radius: 50%; transition: 0.5s; }
        #status-text { font-size: 11px; font-weight: bold; opacity: 0.6; margin-left: 5px; }
        #chat { flex: 1; overflow-y: auto; padding: 25px; display: flex; flex-direction: column; gap: 15px; background: radial-gradient(circle at top right, #1a1a24, #0b0b0e); }
        .msg-group { display: flex; flex-direction: column; max-width: 80%; animation: msgIn 0.3s ease; }
        @keyframes msgIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .my-group { align-self: flex-end; }
        .other-group { align-self: flex-start; }
        .sender-name { font-size: 11px; font-weight: bold; color: var(--accent); margin-bottom: 4px; padding-left: 5px; }
        .bubble { padding: 12px 16px; border-radius: 20px; font-size: 15px; line-height: 1.4; box-shadow: 0 2px 10px rgba(0,0,0,0.2); }
        .my-bubble { background: linear-gradient(135deg, var(--accent), #3a7bd5); color: #000; border-bottom-right-radius: 4px; }
        .other-bubble { background: var(--msg-other); color: #fff; border-bottom-left-radius: 4px; }
        .time { font-size: 10px; opacity: 0.4; margin-top: 4px; align-self: flex-end; }
        .input-area { background: var(--panel); padding: 20px; display: flex; gap: 12px; border-top: 1px solid #333; }
        input { background: #25252e; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 12px; outline: none; }
        #nick-input { width: 100px; text-align: center; font-weight: bold; color: var(--accent); }
        #msg-input { flex: 1; }
        button { background: var(--accent); color: #000; border: none; width: 48px; height: 48px; border-radius: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        button:hover { transform: scale(1.1); background: #fff; }
    </style>
</head>
<body>
<header>
    <div class="logo-box">
        <div class="logo">Mics</div>
        <div id="status-dot"></div>
        <div id="status-text">ПОДКЛЮЧЕНИЕ...</div>
    </div>
    <div style="font-size: 10px; opacity: 0.4;">ULTIMATE v3</div>
</header>
<div id="chat"></div>
<div class="input-area">
    <input type="text" id="nick-input" placeholder="Ник" maxlength="12">
    <input type="text" id="msg-input" placeholder="Сообщение..." autocomplete="off">
    <button onclick="sendMsg()">➤</button>
</div>

<script>
    // Важно: Пустая строка '' значит подключаться к текущему домену (Render)
    const socket = io();

    const chat = document.getElementById('chat');
    const msgInput = document.getElementById('msg-input');
    const nickInput = document.getElementById('nick-input');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');

    nickInput.value = "User_" + Math.floor(Math.random() * 999);

    socket.on('connect', () => {
        statusDot.style.background = "#00ff88";
        statusText.innerText = "В СЕТИ";
    });

    socket.on('message', (data) => {
        const isMy = data.user === nickInput.value;
        const group = document.createElement('div');
        group.className = 'msg-group ' + (isMy ? 'my-group' : 'other-group');
        
        group.innerHTML = 
            (!isMy ? '<div class="sender-name">' + data.user + '</div>' : '') +
            '<div class="bubble ' + (isMy ? 'my-bubble' : 'other-bubble') + '">' + escapeHTML(data.text) + '</div>' +
            '<div class="time">' + new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) + '</div>';
        
        chat.appendChild(group);
        chat.scrollTop = chat.scrollHeight;
    });

    function sendMsg() {
        const text = msgInput.value.trim();
        if (text && socket.connected) {
            socket.emit('message', { user: nickInput.value, text: text });
            msgInput.value = "";
        }
    }

    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
    }

    msgInput.onkeypress = (e) => { if(e.key === 'Enter') sendMsg() };

    socket.on('disconnect', () => {
        statusDot.style.background = "#ff4444";
        statusText.innerText = "ОФФЛАЙН";
    });
</script>
</body>
</html>
    `);
});

// ЛОГИКА ЧАТА (Socket.io)
io.on('connection', (socket) => {
    console.log('Новый пользователь подключился');

    socket.on('message', (data) => {
        // Пересылаем сообщение абсолютно всем подключенным
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключился');
    });
});

// ЗАПУСК СЕРВЕРА
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log('Сервер запущен на порту ' + PORT);
});
