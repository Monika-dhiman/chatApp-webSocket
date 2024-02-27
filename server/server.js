import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const app = express();
const server = createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});


io.on("connection", (socket) => {
  console.log("a user connected");
  console.log(socket.id);
  socket.emit("welcome", `Welcome to the chat ${socket.id}`);
  socket.broadcast.emit("welcome", `${socket.id} has joined the chat`);
  // socket.on("disconnect", () => {
  //   console.log(`user disconnected ${socket.id}`);
  //   socket.broadcast.emit("welcome", `${socket.id} has left the chat`);
  // });
  socket.on("chat", ({room, message}) => {
    console.log({room, message});
    // socket.broadcast .emit("recieved-message", {room, message}); //this send to all the clients except the sender
    io.to(room).emit("recieved-message", message); //this send to the sender
  });
  socket.on("join-room", (room) => {
    // console.log(room);
    socket.join(room);
  });
});


const PORT = 8000;
app.get("/", (req, res) => {
  res.send("<h1>API is working!!!</h1>");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
