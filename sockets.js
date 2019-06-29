module.exports = function (io) {
    io.on('connect', (socket) => {
        const clients = []

        socket.on('chat:message', (data) => {
            io.sockets.emit('chat:message', data);
        });

        socket.on('chat:typing', (data) => {
            clients[socket.id] = data;
            socket.broadcast.emit('chat:typing', data);
        });

        socket.on('disconnect', function () {
            console.log('A user has disconnect');
            io.sockets.emit('update', clients[socket.id] + ' has left the server.');
            delete clients[socket.id];
        });
    });
}