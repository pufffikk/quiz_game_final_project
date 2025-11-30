import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isSuperuser, setIsSuperuser] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      await api.register(email, password, isActive, isSuperuser, isVerified)
      setSuccess(true)
      setEmail('')
      setPassword('')
      setIsActive(true)
      setIsSuperuser(false)
      setIsVerified(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label className="label">Email:</label>
        <input
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="label">Password:</label>
        <input
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            style={{ marginRight: '10px' }}
          />
          Is Active
        </label>

        <label style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <input
            type="checkbox"
            checked={isSuperuser}
            onChange={(e) => setIsSuperuser(e.target.checked)}
            style={{ marginRight: '10px' }}
          />
          Is Superuser
        </label>

        <label style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <input
            type="checkbox"
            checked={isVerified}
            onChange={(e) => setIsVerified(e.target.checked)}
            style={{ marginRight: '10px' }}
          />
          Is Verified
        </label>

        <button type="submit" className="button" style={{ width: '100%', marginTop: '20px' }}>
          Register
        </button>
      </form>

      {success && (
        <div className="message message-success" style={{ marginTop: '20px' }}>
          User registered successfully!
        </div>
      )}

      {error && (
        <div className="message message-error" style={{ marginTop: '20px' }}>
          {error}
        </div>
      )}

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account? <Link to="/login" className="link">Login here</Link>
      </p>
    </div>
  )
}

export default Register

