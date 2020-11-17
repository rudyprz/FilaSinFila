const socketIO = require('socket.io');

let socket;

const connection = server => {
    const io = socketIO.listen(server);

    io.on('connection', (socket) => {
        console.log(socket.id)
        socket.on('tu-turno', (data) => {
            console.log(data)
            io.emit('tu-turno', (data))
        })
        socket.on('update-turn', (data) => {
            console.log(data)
            io.emit('update-turn', (data))
        })
        socket.on('request-turn', (data) => {
            console.log(data)
            io.emit('request-turn', (data))
        })
        socket.on('update-token', (data) => {
            console.log(data)
            io.emit('update-token-2', (data))
        })
        socket.on('update-b', (data) => {
            console.log(data)
            io.emit('update-b-2', (data))
        })
        socket.on('add-token', (data) => {
            console.log(data)
            io.emit('add-token', (data))
        })
    })
}

const getSocket = () => socket;

module.exports = {connection, getSocket}