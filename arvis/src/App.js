// src/App.js
import React, { useState, useRef, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hi — ask me anything!" }]);
  const [input, setInput] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply || "No response" }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Error: " + err.message }]);
    }
  };

  const onKeyDown = (e) => { if (e.key === "Enter") sendMessage(); };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "Arial", padding: 16 }}>
      <h1>AI Chatbot</h1>
      <div ref={containerRef} style={{ border: "1px solid #ccc", padding: 12, height: 420, overflowY: "auto", marginBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "8px 0", textAlign: m.role === "user" ? "right" : "left" }}>
            <div style={{ fontSize: 12, color: "#666" }}>{m.role}</div>
            <div style={{ display: "inline-block", padding: "8px 12px", borderRadius: 10, maxWidth: "80%", background: m.role === "user" ? "#dbeafe" : "#e6f4ea" }}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown} placeholder="Type a message..." style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />
        <button onClick={sendMessage} style={{ padding: "10px 16px", borderRadius: 8 }}>Send</button>
      </div>
    </div>
  );
}

export default App;
