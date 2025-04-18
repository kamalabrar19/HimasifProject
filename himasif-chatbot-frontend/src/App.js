// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Components
import Navbar from './components/Navbar';
import Chat from './components/Chat';
import Login from './components/Login';
import Register from './components/Register';
import ChatHistory from './components/ChatHistory';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
`;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <AppContainer>
        <div className="loading">Loading...</div>
      </AppContainer>
    );
  }

  return (
    <Router>
      <AppContainer>
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<Chat user={user} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/history" element={<ChatHistory user={user} />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;