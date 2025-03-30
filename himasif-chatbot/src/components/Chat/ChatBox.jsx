import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import { useAuth } from '../../contexts/AuthContext';
import { sendMessage } from '../../services/chat';
import { saveChatToFirestore, getChatHistoryFromFirestore } from '../../services/firebase';


export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const { currentUser } = useAuth();

  // Load chat history when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const history = await getChatHistoryFromFirestore(currentUser.uid);
          
          // Convert to the format our component expects
          const formattedHistory = history.flatMap(chat => [
            { isUser: true, text: chat.user_message },
            { isUser: false, text: chat.ai_response }
          ]);
          
          setMessages(formattedHistory);
          
          // Hide welcome screen if there are messages
          if (formattedHistory.length > 0) {
            setShowWelcome(false);
          }
        } catch (error) {
          console.error('Error loading chat history:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadChatHistory();
  }, [currentUser]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Hide welcome screen when user sends first message
    if (showWelcome) {
      setShowWelcome(false);
    }

    // Add user message to the chat
    const userMessage = { isUser: true, text };
    setMessages(prev => [...prev, userMessage]);
    
    setLoading(true);
    
    try {
      // Send to backend
      const response = await sendMessage(text);
      
      // Add AI response to the chat
      const aiMessage = { isUser: false, text: response.response };
      setMessages(prev => [...prev, aiMessage]);
      
      // Save to Firestore
      if (currentUser) {
        await saveChatToFirestore(currentUser.uid, text, response.response);
      }
    } catch (error) {
      // Add error message
      const errorMessage = { 
        isUser: false, 
        text: "Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi."
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    handleSendMessage(question);
  };

  // Suggested quick questions
  const quickQuestions = [
    'Siapa HIMASIF?',
    'Apa visi dan misi HIMASIF?',
    'Kegiatan HIMASIF apa saja?',
    'Bagaimana cara menjadi anggota HIMASIF?'
  ];

  return (
    <div className="chat-container">
      <Card className="chat-card">
        <Card.Header className="chat-header">
          <h5 className="mb-0">
            <i className="fas fa-robot me-2"></i>
            HIMASIF Assistant
          </h5>
          <div className="chat-actions">
            <Button variant="outline-light" size="sm" title="Hapus Chat">
              <i className="fas fa-trash-alt"></i>
            </Button>
          </div>
        </Card.Header>
        
        <Card.Body className="chat-body p-0">
          {showWelcome ? (
            <div className="welcome-screen">
              <div className="welcome-content">
                <img 
                  src="/himasif-logo.png" 
                  alt="HIMASIF Logo" 
                  className="welcome-logo mb-4"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/100?text=HIMASIF';
                  }}
                />
                <h2>Selamat Datang di HIMASIF Assistant!</h2>
                <p className="text-muted">
                  Asisten virtual HIMASIF siap membantu Anda dengan informasi seputar 
                  Himpunan Mahasiswa Sistem Informasi UPJ
                </p>
                
                <div className="quick-questions">
                  <h6>Pertanyaan yang sering ditanyakan:</h6>
                  <div className="question-buttons">
                    {quickQuestions.map((question, index) => (
                      <Button 
                        key={index} 
                        variant="outline-primary" 
                        size="sm" 
                        className="question-button"
                        onClick={() => handleQuickQuestion(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <ChatHistory messages={messages} />
          )}
        </Card.Body>
        
        <Card.Footer className="chat-footer">
          <ChatInput onSendMessage={handleSendMessage} isLoading={loading} />
        </Card.Footer>
      </Card>
    </div>
  );
}