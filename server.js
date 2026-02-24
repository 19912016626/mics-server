const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" } // Разрешаем подключения с любых сайтов
});

// Проверка работоспособности
app.get('/', (req, res) => {
    res.send('<h1>Mics Server is Running!</h1>');
});

io.on('connection', (socket) => {
    console.log('Пользователь зашел:', socket.id);

    // Принимаем сообщение и пересылаем всем
    socket.on('message', (data) => {
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('Пользователь вышел');
    });
});

// Render сам подставит нужный PORT
const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => {
    console.log('Mics Server запущен на порту ' + PORT);
});
