import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';


export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [animation, setAnimation] = useState(false);
  const { currentUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecting if already logged in
    if (currentUser) {
      navigate('/');
    }
    
    // Start animation after a small delay
    const timer = setTimeout(() => {
      setAnimation(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentUser, navigate]);

  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(`Gagal login dengan Google: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-background"></div>
      
      <Container className="login-container">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card className={`login-card ${animation ? 'fade-in' : ''}`}>
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <img 
                    src="/himasif-logo.png" 
                    alt="HIMASIF Logo" 
                    className="login-logo"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/120?text=HIMASIF';
                    }}
                  />
                  <h2 className="app-title mt-3">HIMASIF Assistant</h2>
                  <p className="text-muted">Asisten Virtual Himpunan Mahasiswa Sistem Informasi UPJ</p>
                </div>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                <div className="login-options">
                  <Button 
                    variant="primary" 
                    className="google-button" 
                    onClick={handleGoogleSignIn} 
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <>
                        <img 
                          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                          alt="Google" 
                          className="me-2"
                        />
                        Login dengan Google
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="login-footer text-center mt-4">
                  <p className="mb-1"><small>© {new Date().getFullYear()} HIMASIF UPJ</small></p>
                  <p><small>Universitas Pembangunan Jaya</small></p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}