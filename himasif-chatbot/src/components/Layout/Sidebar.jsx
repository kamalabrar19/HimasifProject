import React from 'react';
import { useAuth } from '../../contexts/AuthContext';


const Sidebar = ({ isOpen }) => {
  const { currentUser } = useAuth();

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <img 
          src="/himasif-logo.png" 
          alt="HIMASIF Logo" 
          className="sidebar-logo"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/50?text=HIMASIF';
          }}
        />
        <h4>HIMASIF Chat</h4>
      </div>
      
      <div className="user-profile">
        <img 
          src={currentUser?.photoURL || 'https://via.placeholder.com/40?text=User'} 
          alt="User" 
          className="user-avatar"
        />
        <div className="user-info">
          <h6>{currentUser?.displayName || 'User'}</h6>
          <small>{currentUser?.email || ''}</small>
        </div>
      </div>
      
      <div className="sidebar-menu">
        <h6 className="menu-title">Menu</h6>
        <ul className="menu-items">
          <li className="menu-item active">
            <i className="fas fa-comment-dots"></i>
            <span>Chat</span>
          </li>
          <li className="menu-item">
            <i className="fas fa-clock"></i>
            <span>Riwayat Chat</span>
          </li>
          <li className="menu-item">
            <i className="fas fa-info-circle"></i>
            <span>Tentang HIMASIF</span>
          </li>
        </ul>
      </div>
      
      <div className="sidebar-footer">
        <p><small>© {new Date().getFullYear()} HIMASIF UPJ</small></p>
      </div>
    </div>
  );
};

export default Sidebar;