import React, { useRef, useEffect } from 'react';
import Message from './Message';


export default function ChatHistory({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Group messages by date
  const groupMessagesByDate = (msgs) => {
    const groups = {};
    
    msgs.forEach((msg, index) => {
      // Use current date for demo - in real app would use message timestamp
      const date = new Date().toLocaleDateString();
      
      if (!groups[date]) {
        groups[date] = [];
      }
      
      groups[date].push({ ...msg, index });
    });
    
    return groups;
  };
  
  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="chat-history">
      {Object.entries(messageGroups).map(([date, msgs]) => (
        <div key={date} className="message-group">
          <div className="date-divider">
            <span>{date}</span>
          </div>
          
          {msgs.map((msg) => (
            <Message
              key={msg.index}
              message={msg.text}
              isUser={msg.isUser}
            />
          ))}
        </div>
      ))}
      
      {messages.length === 0 && (
        <div className="no-messages">
          <div className="text-center text-muted">
            <i className="fas fa-comment-dots fa-3x mb-3"></i>
            <p>Belum ada pesan. Mulai percakapan sekarang!</p>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}