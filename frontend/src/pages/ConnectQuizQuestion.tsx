import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function ConnectQuizQuestion() {
  const [quizName, setQuizName] = useState('')
  const [questionName, setQuestionName] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!quizName.trim() || !questionName.trim()) {
      setError('Both quiz name and question name are required')
      return
    }

    try {
      await api.connectQuestionToQuiz(quizName.trim(), questionName.trim())
      setSuccess(true)
      setQuizName('')
      setQuestionName('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect question to quiz')
      setTimeout(() => setError(''), 5000)
    }
  }

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
      <h1>Connect Question with Quiz</h1>
      <form onSubmit={handleSubmit}>
        <label className="label">Question Name:</label>
        <input
          type="text"
          className="input"
          value={questionName}
          onChange={e => setQuestionName(e.target.value)}
          placeholder="Enter question name"
          required
        />

        <label className="label">Quiz Name:</label>
        <input
          type="text"
          className="input"
          value={quizName}
          onChange={e => setQuizName(e.target.value)}
          placeholder="Enter quiz name"
          required
        />

        <button type="submit" className="button" style={{ width: '100%', marginTop: '20px' }}>
          Connect Quiz and Question
        </button>
      </form>

      {success && (
        <div className="message message-success" style={{ marginTop: '20px' }}>
          Question was successfully connected to quiz!
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

export default ConnectQuizQuestion

