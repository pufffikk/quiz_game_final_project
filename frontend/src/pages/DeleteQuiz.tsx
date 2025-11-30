import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function DeleteQuiz() {
  const [quizName, setQuizName] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!quizName.trim()) {
      setError('Quiz name is required')
      return
    }

    try {
      await api.deleteQuiz(quizName)
      setSuccess(true)
      setQuizName('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete quiz')
      setTimeout(() => setError(''), 5000)
    }
  }

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
      <h1>Delete Quiz</h1>
      <form onSubmit={handleSubmit}>
        <label className="label">Enter the quiz name to delete:</label>
        <input
          type="text"
          className="input"
          value={quizName}
          onChange={e => setQuizName(e.target.value)}
          placeholder="Quiz name"
          required
        />

        <button type="submit" className="button button-danger" style={{ width: '100%', marginTop: '20px' }}>
          Delete Quiz
        </button>
      </form>

      {success && (
        <div className="message message-success" style={{ marginTop: '20px' }}>
          Quiz was successfully deleted!
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

export default DeleteQuiz

