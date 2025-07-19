import { useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"
import "./ThemeToggle.css" // buat file css-nya juga

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext)

  return (
    <div className="toggle-wrapper" onClick={toggleTheme}>
      <div className={`toggle-switch ${isDarkMode ? "dark" : "light"}`}>
        <div className="toggle-circle" />
      </div>
    </div>
  )
}

export default ThemeToggle
