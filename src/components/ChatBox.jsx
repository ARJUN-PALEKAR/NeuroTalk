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
          model: 'openai/gpt-3.5-turbo',
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
        {chat.length === 0 && (
          <div className="placeholder-text">How may I help you?</div>
        )}
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
