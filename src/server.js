const colors = require("colors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const app = require("./app");
const socket = require("socket.io");


mongoose.connect(process.env.DATABASE)
    .then(() => {
        console.log("Database connect successfully".blue.bold)
    })
    .catch((err) => {
        console.log(err.message.red.bold);
    });


const server = app.listen(port, () => {
    console.log(`Server is running successfully http://localhost:5000/`.white.bold)
})

const io = socket(server, {
    cors: {
        origin: "*",
        credentials: true,
    },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        }
    });
});