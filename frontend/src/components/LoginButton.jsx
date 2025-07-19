"use client"

import { useState, useEffect } from "react"
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth"
import { auth, googleProvider } from "../lib/firebase"

function LoginButton() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  // Listen untuk perubahan auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const handleLogin = async () => {
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      // User akan di-set otomatis oleh onAuthStateChanged
    } catch (error) {
      console.error("Login error:", error)
      alert("Login gagal: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      // User akan di-set null otomatis oleh onAuthStateChanged
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Jika user sudah login, tampilkan user menu
  if (user) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          zIndex: 10,
          position: "relative",
        }}
      >
        <span className="user-display-name">
            {user.displayName}
        </span>

        <button
          onClick={handleLogout}
          style={{
            background: "linear-gradient(135deg, #45A7C4 10%, #29616C 100%)",
            color: "#ffffff",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.75rem",
            fontWeight: "900",
            cursor: "pointer",
            fontSize: "0.875rem",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-1px)"
            e.target.style.boxShadow = "0 4px 16px #29616C"
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)"
            e.target.style.boxShadow = "0 2px 8px #29616C"
          }}
        >
          Logout
        </button>
      </div>
    )
  }

  // Jika belum login, tampilkan login button
  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      style={{
        background: "linear-gradient(135deg, #45A7C4 10%, #29616C 100%)",
        color: "#ffffff",
        border: "none",
        padding: "0.75rem 1.5rem",
        borderRadius: "0.75rem",
        fontWeight: "600",
        cursor: loading ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        opacity: loading ? 0.7 : 1,
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.target.style.transform = "translateY(-1px)"
          e.target.style.boxShadow = "0 4px 16px #29616C"
        }
      }}
      onMouseLeave={(e) => {
        if (!loading) {
          e.target.style.transform = "translateY(0)"
          e.target.style.boxShadow = "0 2px 8px #29616C"
        }
      }}
    >
      {loading ? (
        <>
          <div
            style={{
              width: "16px",
              height: "16px",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              borderTop: "2px solid #ffffff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          Signing in...
        </>
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Login with Google
        </>
      )}
    </button>
  )
}

export default LoginButton
