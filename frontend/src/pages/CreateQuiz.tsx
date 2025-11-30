import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function CreateQuiz() {
  const [name, setName] = useState('')
  const [author, setAuthor] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    try {
      await api.createQuiz(name, author)
      setSuccess(true)
      setName('')
      setAuthor('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz')
      setTimeout(() => setError(''), 5000)
    }
  }

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
      <h1>Create New Quiz</h1>
      <form onSubmit={handleSubmit}>
        <label className="label">Name of the quiz:</label>
        <input
          type="text"
          className="input"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <label className="label">Author:</label>
        <input
          type="text"
          className="input"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          required
        />

        <button type="submit" className="button" style={{ width: '100%', marginTop: '20px' }}>
          Create Quiz
        </button>
      </form>

      {success && (
        <div className="message message-success" style={{ marginTop: '20px' }}>
          Quiz was successfully created!
        </div>
      )}

      {error && (
        <div className="message message-error" style={{ marginTop: '20px' }}>
          {error}
        </div>
      )}

      <button 
        onClick={() => navigate('/')} 
        className="button" 
        style={{ width: '100%', marginTop: '20px' }}
      >
        Go Home
      </button>
    </div>
  )
}

export default CreateQuiz

