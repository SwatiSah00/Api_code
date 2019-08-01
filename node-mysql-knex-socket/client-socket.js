var cookie = require('cookie');
const tokenValidator = require("./token");
const knex = require("./route/chat/chatDb");
const Chat = require("./route/chat/chat");

var _user = []

var ClientSocket = (io) => {

    // middleware
    io.use((socket, next) => {
        try {
            var cookies = cookie.parse(socket.handshake.headers.cookie || {});
            var token = cookies["jwt"];
            var decryptToken = tokenValidator.tokenSerialize(token);
            if (decryptToken) {
                return next();
            }
            return next(new Error('authentication error'));
        } catch (ex) {
            console.log(ex);
            return next(new Error('authentication error'));
        }
    });

    io.on('connection', async (socket) => {
        try {
            console.log("user connected");
            var cookies = cookie.parse(socket.handshake.headers.cookie || {});
            var token = cookies["jwt"];
            var decryptToken = tokenValidator.tokenSerialize(token);
            var _userData = await knex("users").where({
                id: decryptToken.loginId
            }).select("*");
            let _name = `${_userData[0].f_name} ${_userData[0].l_name} `;
            if (_user.some(x => x.userId == decryptToken.loginId)) {
                _user.forEach((index, item) => {
                    if (item.userId == decryptToken.loginId) {
                        _user[index] = {
                            userId: decryptToken.loginId,
                            socketId: socket.id,
                            name: _name
                        }
                    }
                })
            } else {
                _user.push({
                    userId: decryptToken.loginId,
                    socketId: socket.id,
                    name: _name
                });
            }
        } catch (ex) {
            console.log(ex)
        }

        // socket.emit("onlineUsers", _user);
        // socket.broadcast.emit('onlineUsers', _user);
        io.emit('onlineUsers', _user);
        socket.on("sendMessage", async ({ senderId, message }) => {
            let date = new Date();

            if (_user.some(x => x.userId == parseInt(senderId))) {
                let socketId = _user.find(x => x.userId == senderId).socketId;
                io.to(`${socketId}`).emit('receiveMessage', {
                    sender_id: decryptToken.loginId,
                    message: message,
                    created_on: date
                });
                // await Chat.getMessages(decryptToken.loginId, senderId)
                //     .then((messages) => {
                //         socket.emit("loadMessages", messages)
                //     })
            }
            await Chat.save(decryptToken.loginId, senderId, message, date);

        });
        socket.on("getMyMessages", async (data) => {
            await Chat.getMessages(decryptToken.loginId, data.senderId)
                .then((messages) => {
                    socket.emit("loadMessages", messages)
                })
        });

        socket.on("disconnect", function () {
            _user = _user.filter(x => x.socketId != socket.id);
            io.emit('onlineUsers', _user);
        });
    });




}

module.exports = ClientSocket;


