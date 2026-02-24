const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Настройка Socket.io с поддержкой CORS
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Главная страница с обновленным интерфейсом
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
        #status-dot { width: 10px; height: 10px; background: #ff4444; border-radius: 50%; box-shadow: 0 0 5px #ff4444; transition: 0.5s; }
        #status-text { font-size: 11px; font-weight: bold; opacity: 0.6; margin-left: 5px; }
        #chat { flex: 1; overflow-y: auto; padding: 25px; display: flex; flex-direction: column; gap: 12px; background: radial-gradient(circle at top right, #1a1a24, #0b0b0e); }
        .msg-group { display: flex; flex-direction: column; max-width: 85%; animation: msgIn 0.2s ease-out; }
        @keyframes msgIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .my-group { align-self: flex-end; }
        .other-group { align-self: flex-start; }
        .sender-name { font-size: 11px; font-weight: bold; color: var(--accent); margin-bottom: 4px; padding-left: 8px; }
        .bubble { padding: 10px 16px; border-radius: 18px; font-size: 15px; line-height: 1.4; }
        .my-bubble { background: linear-gradient(135deg, var(--accent), #3a7bd5); color: #000; border-bottom-right-radius: 4px; }
        .other-bubble { background: var(--msg-other); color: #fff; border-bottom-left-radius: 4px; }
        .input-area { background: var(--panel); padding: 15px; display: flex; gap: 10px; border-top: 1px solid #333; }
        input { background: #25252e; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 10px; outline: none; transition: 0.3s; }
        input:focus { border-color: var(--accent); }
        #nick-input { width: 90px; text-align: center; }
        #msg-input { flex: 1; }
        button { background: var(--accent); border: none; width: 50px; border-radius: 10px; cursor: pointer; font-size: 20px; transition: 0.2s; }
        button:hover { transform: scale(1.05); filter: brightness(1.1); }
    </style>
</head>
<body>
<header>
    <div class="logo-box">
        <div class="logo">MICS</div>
        <div id="status-dot"></div>
        <div id="status-text">ОЖИДАНИЕ...</div>
    </div>
    <div style="font-size: 10px; opacity: 0.4;">ULTIMATE v3.1</div>
</header>
<div id="chat"></div>
<div class="input-area">
    <input type="text" id="nick-input" placeholder="Ник" maxlength="10">
    <input type="text" id="msg-input" placeholder="Сообщение..." autocomplete="off">
    <button onclick="sendMsg()">➤</button>
</div>

<script>
    // Подключаемся к текущему хосту
    const socket = io();

    const chat = document.getElementById('chat');
    const msgInput = document.getElementById('msg-input');
    const nickInput = document.getElementById('nick-input');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');

    nickInput.value = "User" + Math.floor(100 + Math.random() * 899);

    socket.on('connect', () => {
        statusDot.style.background = "#00ff88";
        statusDot.style.boxShadow = "0 0 10px #00ff88";
        statusText.innerText = "В СЕТИ";
    });

    socket.on('disconnect', () => {
        statusDot.style.background = "#ff4444";
        statusDot.style.boxShadow = "none";
        statusText.innerText = "ОФФЛАЙН";
    });

    socket.on('chat_message', (data) => {
        const isMy = data.user === nickInput.value;
        const group = document.createElement('div');
        group.className = 'msg-group ' + (isMy ? 'my-group' : 'other-group');
        
        const time = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
        
        group.innerHTML = 
            (!isMy ? '<div class="sender-name">' + data.user + '</div>' : '') +
            '<div class="bubble ' + (isMy ? 'my-bubble' : 'other-bubble') + '">' + escapeHTML(data.text) + '</div>' +
            '<div style="font-size:9px; opacity:0.3; margin-top:3px; align-self:' + (isMy?'flex-end':'flex-start') + '">' + time + '</div>';
        
        chat.appendChild(group);
        chat.scrollTop = chat.scrollHeight;
    });

    function sendMsg() {
        const text = msgInput.value.trim();
        const user = nickInput.value.trim();
        if (text && socket.connected) {
            socket.emit('chat_message', { user, text });
            msgInput.value = "";
        }
    }

    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    }

    msgInput.onkeypress = (e) => { if(e.key === 'Enter') sendMsg() };
</script>
</body>
</html>
    `);
});

// Логика сервера Socket.io
io.on('connection', (socket) => {
    console.log('User connected: ' + socket.id);

    socket.on('chat_message', (data) => {
        // Рассылаем всем
        io.emit('chat_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Слушаем порт от Render или 10000 локально
const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
    console.log('SERVER READY ON PORT: ' + PORT);
});
