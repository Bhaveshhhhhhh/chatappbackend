const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const app = express();
const PORT = 4000 || process.env.PORT;

const users = [{}];

app.use(cors());

app.get("/", (req, res) => {
  res.send("Working");
});

const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("new connections");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} has joined`);

    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${users[socket.id]} has joined`,
    });

    socket.emit(`welcome`, {
      user: "Admin",
      message: `Welcome to the chat ${users[socket.id]}`,
    });
  });

  socket.on("message", ({ message, id }) => {
    io.emit("sendMessage", { user: users[id], message, id });
  });

  socket.on("disconnected", () => {
    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${users[socket.id]} has Left`,
    });
    console.log(`User Left`);
  });
});
server.listen(PORT, () => {
  console.log("server is working on PORT:" + PORT);
});
