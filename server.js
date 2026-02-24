const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*", // Разрешаем любым сайтам подключаться к Mics
        methods: ["GET", "POST"]
    }
});

// Главная страница сервера
app.get('/', (req, res) => {
    res.send('<h1>Mics Server V2 is Online</h1>');
});

io.on('connection', (socket) => {
    console.log(`[Mics] Подключен: ${socket.id}`);

    // Обработка нового сообщения
    socket.on('message', (data) => {
        // Добавляем серверное время к сообщению
        const messageData = {
            user: data.user || "Аноним",
            text: data.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        // Отправляем сообщение всем, включая отправителя
        io.emit('message', messageData);
    });

    socket.on('disconnect', () => {
        console.log(`[Mics] Отключен: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 10000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`[Mics] Сервер запущен на порту ${PORT}`);
});
