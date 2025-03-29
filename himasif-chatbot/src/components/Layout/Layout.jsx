import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Sidebar from './Sidebar';
import AppNavbar from '../Navigation/Navbar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout-container">
      <AppNavbar toggleSidebar={toggleSidebar} />
      <div className="d-flex">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <Container fluid className="p-0">
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Layout;