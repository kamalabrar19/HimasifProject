import { HashRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./components/HomePage"
import ChatPage from "./components/ChatPage"
import { ThemeProvider } from "./context/ThemeContext"
import "./App.css"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
