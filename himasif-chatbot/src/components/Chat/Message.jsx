import React from 'react';


export default function Message({ message, isUser }) {
  // Time untuk demo - di aplikasi sebenarnya gunakan timestamp pesan
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`message-container ${isUser ? 'user-message' : 'bot-message'}`}>
      {!isUser && (
        <div className="avatar">
          <img 
            src="/himasif-logo.png" 
            alt="HIMASIF Bot" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/40?text=H';
            }}
          />
        </div>
      )}
      
      <div className="message-content-wrapper">
        <div className={`message-content ${isUser ? 'user' : 'bot'}`}>
          {isUser ? (
            <div className="message-text">{message}</div>
          ) : (
            <div className="message-text" dangerouslySetInnerHTML={{ __html: message }} />
          )}
          <span className="message-time">{time}</span>
        </div>
        
        {isUser && (
          <div className="message-actions">
            <button className="action-button" title="Edit">
              <i className="fas fa-edit"></i>
            </button>
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="avatar">
          <img 
            src={localStorage.getItem('userPhotoURL') || 'https://via.placeholder.com/40?text=U'} 
            alt="User" 
          />
        </div>
      )}
    </div>
  );
}