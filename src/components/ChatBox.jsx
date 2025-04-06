import React, { useState } from 'react';
import './ChatBox.css';
import axios from 'axios';

const ChatBox = () => {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', content: input };
    setChat(prev => [...prev, userMsg]);

    try {
      const res = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'mistralai/mistral-7b-instruct',
          messages: [{ role: 'user', content: input }],
        },
        {
          headers: {
            Authorization: 'Bearer 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',
            'Content-Type': 'application/json',
          },
        }
      );

      const reply = res.data.choices[0].message.content;
      const botReply = { sender: 'bot', content: reply };
      setChat(prev => [...prev, botReply]);
    } catch (error) {
      console.error('API Error:', error);
      setChat(prev => [
        ...prev,
        { sender: 'bot', content: '⚠️ API error. Please try again.' },
      ]);
    }

    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {chat.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          placeholder="Ask something..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
