const ws = require('ws');
const crypto = require('crypto');

const server = new ws.WebSocketServer({
    port: 3000
});

server.on('connection', (socket, request) => {
    const uniqueId = crypto.randomUUID();
    socket.on('ping', () => socket.pong());
    socket.on('pong', () => socket.ping());
    socket.on('message', (data) => {
        server.clients.forEach(socket_ => {
            if (socket !== socket_) {
                let message = data.toString();
                const setMessage = message.startsWith('###$$$');
                if (setMessage) {
                    message = message.slice(6);
                }
                socket_.send(JSON.stringify({
                    id: uniqueId,
                    message,
                    setMessage,
                }));
            }
        })
    })
});

server.on('listening', () => {
    console.log('started');
})