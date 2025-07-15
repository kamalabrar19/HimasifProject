"use client"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../lib/firebase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { faComments } from "@fortawesome/free-solid-svg-icons"
import LoginButton from "./LoginButton"
import ThemeToggle from "./ThemeToggle"
import "./HomePage.css"
//import image
import logo from "../assets/images/himasif.png"

function HomePage() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const inputRef = useRef(null)

  // Listen untuk auth state changes
  useState(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const handleSearch = async () => {
    if (!query.trim() || isLoading) return
    setIsLoading(true)
    // Navigate to chat with the query
    navigate("/chat", { state: { initialQuery: query.trim() } })
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div className="homepage">
      {/* Gradient Background Elements */}
      <div className="gradient-bg">
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
        <div className="gradient-orb gradient-orb-3"></div>
        <div className="gradient-orb gradient-orb-4"></div>
      </div>

      <div className="homepage-container">
        {/* Black Header */}
        <header className="homepage-header">
          <nav className="header-nav">
            <div className="nav-brand">
              <img src={logo || "/placeholder.svg"} alt="Logo HIMASIF" className="nav-logo" />
              <span className="nav-title">360 AI</span>
            </div>
            <div className="nav-actions">
              <ThemeToggle />
              <LoginButton />
            </div>
          </nav>
        </header>

        {/* Main Content - Direct on Background */}
        <main className="homepage-main">
          <div className="content-section">
            <div className="brand-section">
              <h1 className="brand-title">360 AI</h1>
              <p className="brand-subtitle">HIMASIF Assistant</p>
            </div>

            {/* Search Section */}
            <div className="search-section">
              <div className="search-container">
                <div className="search-input-wrapper">
                  <textarea
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="ngobrol dengan 360 AI..."
                    className="search-input"
                    rows="1"
                    disabled={isLoading}
                  />
                  <div className="search-actions">
                    <button onClick={handleSearch} disabled={!query.trim() || isLoading} className="search-button">
                      {isLoading ? (
                        <div className="loading-spinner"></div>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p className="kesalahan">360 dapat membuat kesalahan, pastikan cek lagi ya.</p>
          </div>
        </main>

        {/* Footer */}
        <footer className="homepage-footer">
          <div className="footer-container">
            <div className="footer-left">
              <div className="footer-brand">
                <img src={logo || "/placeholder.svg"} alt="Logo HIMASIF" className="footer-logo" />
                <span className="footer-brand-text">360 AI</span>
              </div>
              <p className="footer-copyright">&copy; 2025 HIMASIF. All rights reserved.</p>
            </div>

            <div className="footer-right">
              <div className="footer-social-icons">
                <a
                  href="https://www.instagram.com/direct/t/113548216706971/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  title="Direct Message"
                >
                  <FontAwesomeIcon icon={faComments} />
                </a>
                <a
                  href="https://www.instagram.com/himasif360upj/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  title="Instagram"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a
                  href="https://www.youtube.com/@sisteminformasiupj8380"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  title="YouTube"
                >
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default HomePage
