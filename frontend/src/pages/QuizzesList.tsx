import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, Quiz } from '../services/api'

function QuizzesList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [quizName, setQuizName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    loadQuizzes()
  }, [navigate])

  async function loadQuizzes() {
    try {
      setLoading(true)
      const data = await api.getQuizzes()
      setQuizzes(data)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quizzes')
    } finally {
      setLoading(false)
    }
  }

  function handleStartQuiz() {
    if (!quizName.trim()) {
      alert('Please enter a quiz name!')
      return
    }
    navigate(`/game?quiz_name=${encodeURIComponent(quizName)}`)
  }

  function handleStartQuizFromTable(quizName: string, e?: React.MouseEvent) {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    navigate(`/game?quiz_name=${encodeURIComponent(quizName)}`)
  }

  if (loading) {
    return <div>Loading quizzes...</div>
  }

  return (
    <div>
      <h1>Quizzes List</h1>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Start a Quiz</h3>
        <label className="label">Enter the name of the quiz you want to start:</label>
        <input
          type="text"
          className="input"
          value={quizName}
          onChange={e => setQuizName(e.target.value)}
          placeholder="Quiz name"
        />
        <button onClick={handleStartQuiz} className="button">
          Start Quiz
        </button>
      </div>

      {error && (
        <div className="message message-error">
          {error}
        </div>
      )}

      {quizzes.length === 0 ? (
        <p>No quizzes available</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Author</th>
              <th>Questions</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, index) => (
              <tr key={index}>
                <td>{quiz.name}</td>
                <td>{quiz.author}</td>
                <td>
                  {quiz.questions && quiz.questions.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {quiz.questions.map((q, qIndex) => (
                        <li key={qIndex}>{q.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <em>No questions</em>
                  )}
                </td>
                <td>
                  <button 
                    onClick={(e) => handleStartQuizFromTable(quiz.name, e)}
                    className="button"
                    style={{ margin: 0 }}
                    title="Start this quiz"
                  >
                    Start Quiz
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default QuizzesList

