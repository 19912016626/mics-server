const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

// Раздаем HTML напрямую
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
        body { font-family: 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
        header { background: var(--panel); padding: 15px 25px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--accent); }
        .logo-box { display: flex; align-items: center; gap: 10px; }
        .logo { font-size: 24px; font-weight: 900; color: var(--accent); letter-spacing: 3px; text-transform: uppercase; }
        #status-dot { width: 10px; height: 10px; background: #ff4444; border-radius: 50%; }
        #chat { flex: 1; overflow-y: auto; padding: 25px; display: flex; flex-direction: column; gap: 15px; }
        .msg-group { display: flex; flex-direction: column; max-width: 80%; }
        .my-group { align-self: flex-end; }
        .other-group { align-self: flex-start; }
        .bubble { padding: 12px 16px; border-radius: 20px; font-size: 15px; }
        .my-bubble { background: linear-gradient(135deg, var(--accent), #3a7bd5); color: #000; }
        .other-bubble { background: var(--msg-other); color: #fff; }
        .input-area { background: var(--panel); padding: 20px; display: flex; gap: 12px; }
        input { background: #25252e; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 12px; outline: none; }
        #nick-input { width: 100px; }
        #msg-input { flex: 1; }
        button { background: var(--accent); border: none; width: 48px; border-radius: 14px; cursor: pointer; }
    </style>
</head>
<body>
<header>
    <div class="logo-box">
        <div class="logo">Mics</div>
        <div id="status-dot"></div>
        <div id="status-text">ПОДКЛЮЧЕНИЕ...</div>
    </div>
</header>
<div id="chat"></div>
<div class="input-area">
    <input type="text" id="nick-input" placeholder="Ник" maxlength="12">
    <input type="text" id="msg-input" placeholder="Сообщение..." autocomplete="off">
    <button onclick="sendMsg()">➤</button>
</div>

<script>
    const socket = io();
    const chat = document.getElementById('chat');
    const msgInput = document.getElementById('msg-input');
    const nickInput = document.getElementById('nick-input');
    const statusDot = document.getElementById('status-dot');

    nickInput.value = "User_" + Math.floor(Math.random() * 999);

    socket.on('connect', () => {
        statusDot.style.background = "#00ff88";
        document.getElementById('status-text').innerText = "В СЕТИ";
    });

    socket.on('message', (data) => {
        const isMy = data.user === nickInput.value;
        const group = document.createElement('div');
        group.className = 'msg-group ' + (isMy ? 'my-group' : 'other-group');
        group.innerHTML = '<div class="bubble ' + (isMy ? 'my-bubble' : 'other-bubble') + '"><b>' + data.user + ':</b> ' + data.text + '</div>';
        chat.appendChild(group);
        chat.scrollTop = chat.scrollHeight;
    });

    function sendMsg() {
        const text = msgInput.value.trim();
        if (text) {
            socket.emit('message', { user: nickInput.value, text });
            msgInput.value = "";
        }
    }
    msgInput.onkeypress = (e) => { if(e.key === 'Enter') sendMsg() };
</script>
</body>
</html>
    `);
});

// Логика чата
io.on('connection', (socket) => {
    socket.on('message', (data) => {
        io.emit('message', data); // Отправляем всем
    });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
