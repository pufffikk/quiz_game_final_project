import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'

function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(loggedIn)
  }, [])

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLoggingOut) return
    
    setIsLoggingOut(true)
    
    try {
      await api.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.setItem('isLoggedIn', 'false')
      setIsLoggedIn(false)
      window.location.href = '/'
    }
  }

  return (
    <nav style={{ 
      backgroundColor: '#2c3e50', 
      padding: '15px', 
      marginBottom: '20px' 
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
            Quiz Game
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            style={{ color: 'white', borderColor: 'white' }}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {isLoggedIn ? (
            <>
              <Link to="/quizzes" className="link" style={{ color: 'white' }}>Quizzes</Link>
              <Link to="/questions" className="link" style={{ color: 'white' }}>Questions</Link>
              <Link to="/leaderboard" className="link" style={{ color: 'white' }}>Leaderboard</Link>
              <button 
                onClick={handleLogout} 
                className="button" 
                style={{ marginLeft: '10px', cursor: isLoggingOut ? 'wait' : 'pointer' }}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="link" style={{ color: 'white' }}>Login</Link>
              <Link to="/register" className="link" style={{ color: 'white' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navigation

