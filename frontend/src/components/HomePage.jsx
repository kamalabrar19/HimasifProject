import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './HomePage.css'

//import image
import logo from '../assets/images/himasif.png'
import instagram from '../assets/images/instagram_icon.png'
import youtube from '../assets/images/youtube_icon.png'

function HomePage() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const handleSearch = async () => {
    if (!query.trim() || isLoading) return

    setIsLoading(true)

    // Navigate to chat with the query
    navigate('/chat', { state: { initialQuery: query.trim() } })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  const suggestions = [
    "Apa itu HIMASIF?",
    "Jelaskan tentang Python programming",
    "Siapa ketua umum HIMASIF?",
    "Bagaimana cara membuat website?",
    "Kegiatan apa saja di HIMASIF?",
    "Apa itu artificial intelligence?"
  ]

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    inputRef.current?.focus()
  }

  return (
    <div className="homepage">
      <div className="homepage-container">
        {/* Header */}
        <header className="homepage-header">
          <div className="logo">
            <img src={logo} alt="Logo HIMASIF" />
          </div>
          <div className="brand">
            <h1 className="brand-title">360 AI</h1>
            <p className="brand-subtitle">HIMASIF Assistant</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="homepage-main">
          <div className="search-section">
            <div className="search-container">
              <div className="search-input-wrapper">
                <textarea
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything..."
                  className="search-input"
                  rows="1"
                  disabled={isLoading}
                />
                <div className="search-actions">
                  <button
                    onClick={handleSearch}
                    disabled={!query.trim() || isLoading}
                    className="search-button"
                  >
                    {isLoading ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                  <button className="voice-button" disabled>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M19 10V12C19 16.42 15.42 20 11 20H13C17.42 20 21 16.42 21 12V10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 20V24" stroke="currentColor" strokeWidth="2"/>
                      <path d="M8 24H16" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                  <button className="attach-button" disabled>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M21.44 11.05L12.25 20.24C11.12 21.37 9.47 22 7.76 22C6.05 22 4.4 21.37 3.27 20.24C2.14 19.11 1.51 17.46 1.51 15.75C1.51 14.04 2.14 12.39 3.27 11.26L10.5 4.03C11.16 3.37 12.04 3 12.96 3C13.88 3 14.76 3.37 15.42 4.03C16.08 4.69 16.45 5.57 16.45 6.49C16.45 7.41 16.08 8.29 15.42 8.95L9.19 15.18C8.86 15.51 8.41 15.7 7.94 15.7C7.47 15.7 7.02 15.51 6.69 15.18C6.36 14.85 6.17 14.4 6.17 13.93C6.17 13.46 6.36 13.01 6.69 12.68L12.25 7.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="suggestions-section">
            <div className="suggestions-grid">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-card"
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isLoading}
                >
                  <span className="suggestion-text">{suggestion}</span>
                  <svg className="suggestion-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="homepage-footer">
          <p className="footer-text">
            Ask anything • Powered by 360 AI • HIMASIF UPJ
          </p>
          <div className="footer-links">
            <a href="https://www.instagram.com/direct/t/113548216706971" target="_blank" rel="noopener noreferrer" className="footer-link">
              💬 Direct Message
            </a>
            <span className="footer-separator">•</span>
            <a href="https://www.instagram.com/himasif360upj/" target="_blank" rel="noopener noreferrer" className="footer-link">
              <div className="footer-instagram">
                <img src={instagram} alt="Instagram HIMASIF" />
                <p>Instagram</p>
              </div>
            </a>
            <span className="footer-separator">•</span>
            <a href="https://www.youtube.com/@sisteminformasiupj8380" target="_blank" rel="noopener noreferrer" className="footer-link">
              <div className="footer-youtube">
                <img src={youtube} alt="Youtube HIMASIF" />
                <p>Youtube</p>
              </div>
            </a>
          </div>
          <br/>
          <div className="footer-copyright">
            <p>&copy;HIMASIF 2025</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default HomePage
