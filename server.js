const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Mics Server is running...');
});

const io = new Server(server, {
    cors: {
        origin: "*", // Разрешаем подключения отовсюду
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Пользователь подключился:', socket.id);

    socket.on('message', (data) => {
        // Добавляем время на сервере
        const msg = {
            user: data.user || 'Аноним',
            text: data.text,
            time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
        };
        io.emit('message', msg); // Рассылаем всем
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключился');
    });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
