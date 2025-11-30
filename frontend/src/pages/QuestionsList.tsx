import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, Question } from '../services/api'

function QuestionsList() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    loadQuestions()
  }, [navigate])

  async function loadQuestions() {
    try {
      setLoading(true)
      const data = await api.getQuestions()
      setQuestions(data)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading questions...</div>
  }

  return (
    <div>
      <h1>Questions List</h1>

      {error && (
        <div className="message message-error">
          {error}
        </div>
      )}

      {questions.length === 0 ? (
        <p>No questions available</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Quizzes</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => (
              <tr key={index}>
                <td>{question.name}</td>
                <td>{question.question}</td>
                <td>{question.answer}</td>
                <td>
                  {question.quizzes && question.quizzes.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {question.quizzes.map((quiz, qIndex) => (
                        <li key={qIndex}>{quiz.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <em>No quizzes</em>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default QuestionsList

