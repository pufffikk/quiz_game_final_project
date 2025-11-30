import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function DeleteQuestion() {
  const [questionName, setQuestionName] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!questionName.trim()) {
      setError('Question name is required')
      return
    }

    try {
      await api.deleteQuestion(questionName)
      setSuccess(true)
      setQuestionName('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete question')
      setTimeout(() => setError(''), 5000)
    }
  }

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
      <h1>Delete Question</h1>
      <form onSubmit={handleSubmit}>
        <label className="label">Enter the question name to delete:</label>
        <input
          type="text"
          className="input"
          value={questionName}
          onChange={e => setQuestionName(e.target.value)}
          placeholder="Question name"
          required
        />

        <button type="submit" className="button button-danger" style={{ width: '100%', marginTop: '20px' }}>
          Delete Question
        </button>
      </form>

      {success && (
        <div className="message message-success" style={{ marginTop: '20px' }}>
          Question was successfully deleted!
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

export default DeleteQuestion

