"use client"

import { useState, useRef, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Toast from "./Toast"
import "./ChatPage.css"
import ThemeToggle from "./ThemeToggle"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
//import image
import logo from "../assets/images/himasif.png"
import { faTelegram, faTwitter, faWhatsapp, faXTwitter } from "@fortawesome/free-brands-svg-icons"
import { faCopy, faLink, faX } from "@fortawesome/free-solid-svg-icons"

function ChatPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState("connected")
  const [copiedMessageId, setCopiedMessageId] = useState(null)
  const [showShareMenu, setShowShareMenu] = useState(null)
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" })
  const [hasProcessedInitialQuery, setHasProcessedInitialQuery] = useState(false) // TAMBAHAN: flag untuk mencegah double processing
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const initialQueryRef = useRef(null) 
  const chatContainerRef = useRef(null);
  const messageContainerRef = useRef(null);
  

  // Handle initial query from homepage - FIXED PROPERLY
  useEffect(() => {
    if (location.state?.initialQuery && !hasProcessedInitialQuery) {
      initialQueryRef.current = location.state.initialQuery
      setHasProcessedInitialQuery(true)
    } else if (!location.state?.initialQuery && !hasProcessedInitialQuery) {
      // Add welcome message if no initial query
      setMessages([
        {
          id: 1,
          text: `Halo! Saya adalah **360 AI**, asisten cerdas HIMASIF yang siap membantu Anda.

**Apa yang bisa saya bantu?**
• Informasi HIMASIF - struktur, kegiatan, pengurus
• Programming & teknologi - coding, web development, AI
• Akademik - tugas, penelitian, belajar
• Pertanyaan umum - apapun yang ingin Anda ketahui

Silakan ketik pertanyaan Anda.`,
          sender: "bot",
          timestamp: new Date(),
        },
      ])
      setHasProcessedInitialQuery(true)
    }
  }, [location.state?.initialQuery, hasProcessedInitialQuery])

  // Separate effect untuk send initial query setelah sendMessage ready
  useEffect(() => {
    if (initialQueryRef.current && hasProcessedInitialQuery) {
      const queryToSend = initialQueryRef.current
      initialQueryRef.current = null // Clear ref
      sendMessage(queryToSend)
    }
  }, [hasProcessedInitialQuery])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };  

  useEffect(() => {
    inputRef.current?.focus();
  }, []);  

  const sendMessage = async (messageText = inputMessage) => {
    const textToSend = messageText.trim()
    if (!textToSend || isLoading) return // Cek apakah sedang loading dan pastikan pesan tidak kosong

    const userMessage = {
      id: Date.now(),
      text: textToSend,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("") // Clear input setelah mengirim
    inputRef.current?.focus()
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: textToSend }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()
      const botMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setConnectionStatus("connected")
    } catch (error) {
      console.error("Error:", error)
      const errorMessage = {
        id: Date.now() + 1,
        text: "Maaf, terjadi kesalahan dalam menghubungi server. Silakan coba lagi.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setConnectionStatus("disconnected")
    } finally {
      setIsLoading(false) // Pastikan status loading diubah setelah proses selesai
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault() // Mencegah enter menambahkan line baru
      if (!isLoading && inputMessage.trim()) { // Pastikan ada text dan tidak loading
        sendMessage()
      }
    }
  }

  const formatMessage = (text) => {
    let formattedText = text
    
    // Code blocks: ```code``` -> <pre><code>code</code></pre>
    formattedText = formattedText.replace(/```([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>')
    
    // Code inline: `code` -> <code>code</code>
    formattedText = formattedText.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    
    // Bold text: **text** -> <strong>text</strong>
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong class="bold-text">$1</strong>')
    
    // Italic text: *text* -> <em>text</em>
    formattedText = formattedText.replace(/\*((?!\*)(.*?)(?!\*))\*/g, '<em class="italic-text">$1</em>')
    
    // Underline: __text__ -> <u>text</u>
    formattedText = formattedText.replace(/__(.*?)__/g, '<u class="underline-text">$1</u>')
    
    // Strike through: ~~text~~ -> <del>text</del>
    formattedText = formattedText.replace(/~~(.*?)~~/g, '<del class="strike-text">$1</del>')
    
    // Highlight: ==text== -> <mark>text</mark>
    formattedText = formattedText.replace(/==(.*?)==/g, '<mark class="highlight-text">$1</mark>')
    
    // Auto add emojis untuk kata-kata tertentu (bahasa Indonesia)
    const emojiMappingID = {
      'halo': 'halo 👋',
      'hai': 'hai 👋',
      'terima kasih': 'terima kasih 🙏',
      'makasih': 'makasih 🙏',
      'selamat': 'selamat 🎉',
      'bagus': 'bagus 👍',
      'keren': 'keren 🔥',
      'mantap': 'mantap 💯',
      'programming': 'programming 💻',
      'coding': 'coding 👨‍💻',
      'website': 'website 🌐',
      'aplikasi': 'aplikasi 📱',
      'database': 'database 🗄️',
      'ai': 'AI 🤖',
      'machine learning': 'machine learning 🧠',
      'himasif': 'HIMASIF 🎓',
      'universitas': 'universitas 🏫',
      'kuliah': 'kuliah 📚',
      'tugas': 'tugas 📝',
      'ujian': 'ujian ✍️',
      'lulus': 'lulus 🎓',
      'berhasil': 'berhasil ✅',
      'sukses': 'sukses 🌟',
      'error': 'error ❌',
      'bug': 'bug 🐛',
      'fixed': 'fixed ✅',
      'loading': 'loading ⏳',
      'data': 'data 📊'
    }
    
    // Auto add emojis untuk kata-kata bahasa Inggris dengan styling lebih fancy
    const emojiMappingEN = {
      'hello': '<span class="greeting">Hello 👋✨</span>',
      'hi': '<span class="greeting">Hi 👋😊</span>',
      'thanks': '<span class="gratitude">Thanks 🙏💖</span>',
      'thank you': '<span class="gratitude">Thank you 🙏💖</span>',
      'awesome': '<span class="positive">Awesome 🚀⭐</span>',
      'amazing': '<span class="positive">Amazing 🤩✨</span>',
      'great': '<span class="positive">Great 👌🔥</span>',
      'excellent': '<span class="positive">Excellent 💯🌟</span>',
      'perfect': '<span class="positive">Perfect 💎✨</span>',
      'wonderful': '<span class="positive">Wonderful 🌈💫</span>',
      'fantastic': '<span class="positive">Fantastic 🎆🚀</span>',
      'cool': '<span class="positive">Cool 😎❄️</span>',
      'nice': '<span class="positive">Nice 👌😊</span>',
      'programming': '<span class="tech">Programming 💻⚡</span>',
      'coding': '<span class="tech">Coding 👨‍💻🔥</span>',
      'javascript': '<span class="tech">JavaScript 🟨⚡</span>',
      'python': '<span class="tech">Python 🐍💚</span>',
      'react': '<span class="tech">React ⚛️💙</span>',
      'nodejs': '<span class="tech">Node.js 🟢⚡</span>',
      'database': '<span class="tech">Database 🗄️📊</span>',
      'api': '<span class="tech">API 🔌🌐</span>',
      'website': '<span class="tech">Website 🌐✨</span>',
      'app': '<span class="tech">App 📱🚀</span>',
      'application': '<span class="tech">Application 📱💻</span>',
      'ai': '<span class="ai-text">AI 🤖🧠</span>',
      'artificial intelligence': '<span class="ai-text">Artificial Intelligence 🤖🧠✨</span>',
      'machine learning': '<span class="ai-text">Machine Learning 🧠📊</span>',
      'deep learning': '<span class="ai-text">Deep Learning 🧠🔥</span>',
      'success': '<span class="success">Success ✅🎉</span>',
      'completed': '<span class="success">Completed ✅💯</span>',
      'done': '<span class="success">Done ✅😊</span>',
      'finished': '<span class="success">Finished 🏁✨</span>',
      'error': '<span class="error">Error ❌🚨</span>',
      'bug': '<span class="error">Bug 🐛⚠️</span>',
      'problem': '<span class="error">Problem ⚠️🔧</span>',
      'issue': '<span class="error">Issue ⚠️📋</span>',
      'loading': '<span class="loading">Loading ⏳🔄</span>',
      'processing': '<span class="loading">Processing ⚙️⏳</span>',
      'working': '<span class="loading">Working 🔧⚡</span>'
    }
    
    // Apply Indonesian emoji mappings (simple replacement)
    Object.entries(emojiMappingID).forEach(([word, replacement]) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      formattedText = formattedText.replace(regex, replacement)
    })
    
    // Apply English emoji mappings (with styling)
    Object.entries(emojiMappingEN).forEach(([word, replacement]) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      formattedText = formattedText.replace(regex, replacement)
    })
    
    // Convert line breaks
    formattedText = formattedText.replace(/\n/g, '<br>')
    
    // Add special effects for certain patterns
    // Numbers with special styling
    formattedText = formattedText.replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
    
    // URLs with link styling (basic detection)
    formattedText = formattedText.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="link">$1 🔗</a>')
    
    // Email addresses
    formattedText = formattedText.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '<a href="mailto:$1" class="email">$1 📧</a>')
    
    return formattedText
  }

  const goHome = () => {
    navigate("/")
  }

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ isVisible: true, message, type })
  }

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }

  // Copy message to clipboard
  const copyMessage = async (messageText, messageId) => {
    try {
      await navigator.clipboard.writeText(messageText)
      setCopiedMessageId(messageId)
      showToast("✅ Response copied to clipboard!", "success")
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = messageText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopiedMessageId(messageId)
      showToast("✅ Response copied to clipboard!", "success")
      setTimeout(() => setCopiedMessageId(null), 2000)
    }
  }

  // Share message - FIXED VERSION
  const shareMessage = async (messageText, messageId, platform) => {
    const shareText = `💬 360 AI Response:\n\n${messageText}\n\n🤖 Powered by HIMASIF UPJ`
    const shareUrl = window.location.href
    setShowShareMenu(null)

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank")
        break
      case "telegram":
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
          "_blank",
        )
        break
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank",
        )
        break
      case "copy-link":
        const linkText = `${shareText}\n\n🔗 Link: ${shareUrl}`
        await copyMessage(linkText, messageId)
        showToast("🔗 Link copied with response!", "success")
        break
      default:
        if (navigator.share) {
          try {
            await navigator.share({
              title: "360 AI Response",
              text: shareText,
              url: shareUrl,
            })
          } catch (err) {
            console.log("Share cancelled")
          }
        }
    }
  }

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowShareMenu(null)
    if (showShareMenu) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [showShareMenu])

  return (
    <div className="chat-page">
      {/* Toast Notification */}
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />

      {/* Header */}
      <header className="chat-header">
        <div className="chat-header-content">
          <div className="logo-section">
            <button onClick={goHome} className="home-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 22V12H15V22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="logo">
              <div className="nav-brand">
                <img src={logo || "/placeholder.svg"} alt="Logo HIMASIF" className="nav-logo" />
                <span className="nav-title">360 AI</span>
              </div>
            </div>
          </div>
          <div className="connection-status">
            <ThemeToggle />
            <div className={`status-indicator ${connectionStatus}`}>
              <div className="status-dot"></div>
              <span className="status-text">{connectionStatus === "connected" ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="chat-container">
        <div className="messages-container" ref={messageContainerRef}>
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <div className="message-text" dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }} />
                <div className="message-footer">
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  {/* Copy & Share buttons for bot messages */}
                  {message.sender === "bot" && (
                    <div className="message-actions">
                      <button
                        className={`action-button copy-button ${copiedMessageId === message.id ? "copied" : ""}`}
                        onClick={() => copyMessage(message.text, message.id)}
                        title={copiedMessageId === message.id ? "Copied!" : "Copy response"}
                      >
                        {copiedMessageId === message.id ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M20 6L9 17L4 12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M16 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <rect
                              x="8"
                              y="2"
                              width="8"
                              height="4"
                              rx="1"
                              ry="1"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                      <div className="share-container">
                        <button
                          className="action-button share-button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setShowShareMenu(showShareMenu === message.id ? null : message.id)
                          }}
                          title="Share response"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <polyline
                              points="16,6 12,2 8,6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <line
                              x1="12"
                              y1="2"
                              x2="12"
                              y2="15"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        {/* Share Menu */}
                        {showShareMenu === message.id && (
                          <div
                            className="share-menu"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                            }}
                          >
                            <div className="share-menu-header">
                              <span>Share Response</span>
                            </div>
                            <div className="share-options">
                              <button
                                className="share-option"
                                onClick={(e) => {
                                  e.preventDefault()
                                  shareMessage(message.text, message.id, "whatsapp")
                                }}
                              >
                                <span className="share-icon"><FontAwesomeIcon icon={faWhatsapp} /></span>
                                <span>WhatsApp</span>
                              </button>
                              <button
                                className="share-option"
                                onClick={(e) => {
                                  e.preventDefault()
                                  shareMessage(message.text, message.id, "telegram")
                                }}
                              >
                                <span className="share-icon"><FontAwesomeIcon icon={faTelegram} /></span>
                                <span>Telegram</span>
                              </button>
                              <button
                                className="share-option"
                                onClick={(e) => {
                                  e.preventDefault()
                                  shareMessage(message.text, message.id, "twitter")
                                }}
                              >
                                <span className="share-icon"><FontAwesomeIcon icon={faXTwitter} /></span>
                                <span>X</span>
                              </button>
                              <button
                                className="share-option"
                                onClick={(e) => {
                                  e.preventDefault()
                                  shareMessage(message.text, message.id, "copy-link")
                                }}
                              >
                                <span className="share-icon"><FontAwesomeIcon icon={faLink} /></span>
                                <span>Copy Link</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          ))}
          {isLoading && (
            <div className="message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Container */}
        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="message-input"
              rows="1"
            />
            <button onClick={() => sendMessage()} disabled={!inputMessage.trim() || isLoading} className="send-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor" />
              </svg>
            </button>
          </div>
          <div className="input-footer">
            <span className="footer-text">&copy;HIMASIF 2025</span>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ChatPage