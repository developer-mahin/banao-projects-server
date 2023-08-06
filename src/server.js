const colors = require("colors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");
const app = require("./app");
const socket = require("socket.io");

// const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.dpsxnyh.mongodb.net/?retryWrites=true&w=majority`;

const uri = "mongodb://127.0.0.1:27017/job-hunter"

mongoose.connect(uri)
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