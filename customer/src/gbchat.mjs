import { Server } from 'socket.io';
import { getCityFromIp } from '../routes/home.mjs';

function initGlobalChat(server) {
    const io = new Server(server);

    io.sockets.on('connection', (socket, username) => {

        /* function emitActiveUsers() {
            let activeUserList = [];
            io.sockets.sockets.forEach((socket) => {
                activeUserList.push(socket.data.username);
            });
            io.emit('activeusers', activeUserList);
        } */

        socket.on('registeruser', async (username) => {
            socket.data.username = username;
            socket.data.city = await getCityFromIp();
            const messageData = {
                username: socket.data.username,
                city: socket.data.city,
                message: `${username} has joined the chat`
            }
            io.emit('chat', messageData);
            /* emitActiveUsers(); */
        });

        socket.on('chat', (message) => {
            const messageData = {
                username: socket.data.username,
                city: socket.data.city,
                message: message.trim()
            }
            io.emit('chat', messageData);
        });
    });
}

export default initGlobalChat;