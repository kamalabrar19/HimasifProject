import React from 'react';
import { Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


const AppNavbar = ({ toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="app-navbar">
      <div className="d-flex align-items-center">
        <Button 
          variant="transparent" 
          className="sidebar-toggle me-2" 
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars"></i>
        </Button>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <img
            src="/himasif-logo.png"
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
            alt="HIMASIF Logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/30?text=H';
            }}
          />
          HIMASIF Assistant
        </Navbar.Brand>
      </div>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          <Dropdown align="end">
            <Dropdown.Toggle variant="transparent" id="user-dropdown" className="user-dropdown">
              <img 
                src={currentUser?.photoURL || 'https://via.placeholder.com/30?text=User'} 
                alt="User"
                className="rounded-circle me-2"
                width="30"
                height="30"
              />
              <span className="d-none d-md-inline">{currentUser?.displayName?.split(' ')[0] || 'User'}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item disabled>
                <small className="text-muted">{currentUser?.email}</small>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-2"></i> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AppNavbar;