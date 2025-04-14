import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket = io("http://localhost:3001");

    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, data.message]);
    });

    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket && message.trim() !== "") {
      socket.emit('send_message', { message });
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Chat App</h2>
      <div>
        {chat.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
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
