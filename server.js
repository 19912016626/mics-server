const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" } // Разрешаем подключения с любых сайтов
});

// Ответ сервера при заходе по ссылке в браузере
app.get('/', (req, res) => {
    res.send('<h1>Mics Server Ultimate V3 is Live</h1>');
});

io.on('connection', (socket) => {
    console.log('Пользователь подключен:', socket.id);

    // Принимаем сообщение от клиента и рассылаем всем
    socket.on('message', (data) => {
        const msgData = {
            user: data.user || "Аноним",
            text: data.text || "",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        io.emit('message', msgData);
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключен');
    });
});

// Render сам назначит порт через process.env.PORT
const PORT = process.env.PORT || 10000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер Mics запущен на порту ${PORT}`);
});
