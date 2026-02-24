const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
const path = require('path');

// Раздаем твой HTML-файл из корня
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    socket.on('message', (data) => {
        io.emit('message', data); 
    });
});

const PORT = process.env.PORT || 10000;
http.listen(PORT, () => console.log('Сайт готов!'));
