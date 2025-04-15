import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';
let socket;

function App() {
  const [message, setMessage] = useState("");
  const [inchat, setInChat] = useState([]);
  const [outchat, setOutChat] = useState([]);
  const [room, setRoom] = useState(0);
  useEffect(() => {
    socket = io("http://localhost:3001");

    socket.on('receive_message', (data) => {
      if (data.sender !== socket.id) {
        setInChat((prev) => [...prev, data.message]);
      }
    });

    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket && message.trim() !== "") {
      socket.emit('send_message', { message:message.trim(), room });
      setOutChat((prev) => [...prev, message.trim()]);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Chat App</h2>
      <input
        type="text"
        value={room}
        placeholder="Room..."
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={() => socket.emit('join_room', room)}>Join Room</button>
      <h3>Room: {room}</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h3>Outgoing Messages</h3>
          {outchat.map((msg, i) => (
            <p key={i}>{msg}<br></br></p>
          ))}
        </div>
        <div>
          <h3>Incoming Messages</h3>
          {inchat.map((msg, i) => (
            <p key={i}>{msg}<br></br></p>
            
          ))}
        </div>
      </div>
      <input
        type="text"
        value={message}
        placeholder="Message..."
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
