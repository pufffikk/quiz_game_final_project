import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

function CreateQuestion() {
  const [name, setName] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [quizName, setQuizName] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    try {
      await api.createQuestion(name, question, answer)

      // Two-step process: create question first, then optionally link it to a quiz
      // This allows partial success - question exists even if connection fails
      if (quizName.trim()) {
        try {
          await api.connectQuestionToQuiz(quizName.trim(), name)
        } catch (connectError) {
          setError('Question created but failed to connect to quiz: ' + (connectError instanceof Error ? connectError.message : 'Unknown error'))
          setTimeout(() => {
            setError('')
          }, 5000)
          return
        }
      }

      setSuccess(true)
      setName('')
      setQuestion('')
      setAnswer('')
      setQuizName('')
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create question')
      setTimeout(() => {
        setError('')
      }, 5000)
    }
  }

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
      <h1>Create New Question</h1>
      <form onSubmit={handleSubmit}>
        <label className="label">Name (unique identifier for your question):</label>
        <input
          type="text"
          className="input"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <label className="label">Question:</label>
        <input
          type="text"
          className="input"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          required
        />

        <label className="label">Answer:</label>
        <input
          type="text"
          className="input"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          required
        />

        <label className="label">Quiz name (Optional - to connect this question to a quiz):</label>
        <input
          type="text"
          className="input"
          value={quizName}
          onChange={e => setQuizName(e.target.value)}
        />

        <button type="submit" className="button" style={{ width: '100%', marginTop: '20px' }}>
          Create Question
        </button>
      </form>

      {success && (
        <div className="message message-success" style={{ marginTop: '20px' }}>
          Question was successfully created!
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

export default CreateQuestion

