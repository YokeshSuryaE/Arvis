import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hello! How can I help?" }]);

  const sendMessage = async (text) => {
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.message }]);
  };

  return (
    <div className="App">
      <h1>Arvis Chatbot</h1>
      <ChatWindow messages={messages} />
      <ChatInput onSend={sendMessage} />
    </div>
  );
}

export default App;
