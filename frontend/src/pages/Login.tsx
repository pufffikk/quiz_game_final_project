import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await api.login(email, password)
      localStorage.setItem('isLoggedIn', 'true')
      navigate('/')
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Login to Your Account</h2>
      <form onSubmit={handleSubmit}>
        <label className="label">Email:</label>
        <input
          type="email"
          className="input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <label className="label">Password:</label>
        <input
          type="password"
          className="input"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        <button type="submit" className="button" style={{ width: '100%', marginTop: '20px' }}>
          Login
        </button>
      </form>

      {error && (
        <div className="message message-error" style={{ marginTop: '20px' }}>
          {error}
        </div>
      )}

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Don't have an account? <Link to="/register" className="link">Register here</Link>
      </p>
    </div>
  )
}

export default Login

