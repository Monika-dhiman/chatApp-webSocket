import { Button, Container, TextField, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  const [chat, setChat] = useState([]); 
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");
  const socket = useMemo(() => io("http://localhost:8000"), []); 
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
      setSocketId(socket.id);
    });
    socket.on("welcome", (data) => {
      console.log(data);
    });
    socket.on("recieved-message", (msg) => {
      console.log(msg);
      setChat((messages) => [...messages, msg]);
    });
    // return () => {
    //   socket.disconnect();
    // };
  }, []);
  const sendMessage = () => {
    socket.emit("chat", {message, room});
    setMessage("");
    // setRoom("");
  };
  const handleJoinRoom = () => {
    socket.emit("join-room", roomName);
    setRoomName("");
  };
  return (
    <Container maxWidth="sm" >
      <h1>WeLcOmE tO Socket.io </h1>
      <h2>Join Group</h2>
      <div style={{display:"flex", gap:"20px"}}>
      <TextField
        id="outlined-basic"
        label="Room Name"
        variant="outlined"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        />

      <Button onClick={handleJoinRoom} variant="contained" color="primary">Join</Button>
      </div>
      <h2>Chat</h2>
      <Typography variant="h6">Self socketID🔌: {socketId}</Typography>
      <div style={{display:"flex", gap:"20px"}}>
      <TextField
        id="outlined-basic"
        label="Room"
        variant="outlined"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        />
      <TextField
        id="outlined-basic"
        label="Message"
        variant="outlined"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        />

      <Button onClick={sendMessage} variant="contained" color="primary">Send</Button>
        </div>
        {chat.map((msg, index) => (
          <div key={index}>
            <Typography >{msg}</Typography>
          </div>
        ))}
    </Container>
  );
};
export default App;
