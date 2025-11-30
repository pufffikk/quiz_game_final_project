import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { api, Question } from '../services/api'

function Game() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const quizName = searchParams.get('quiz_name') || ''
  
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [quizEnded, setQuizEnded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!quizName) {
      setError('Quiz name is required')
      return
    }
  }, [quizName])

  useEffect(() => {
    if (quizName && currentIndex > 0 && !currentQuestion && !quizEnded) {
      loadNextQuestion()
    }
  }, [currentIndex, quizName, quizEnded])

  const loadNextQuestion = async () => {
    if (!quizName) return

    setLoading(true)
    setError('')

    try {
      const question = await api.getNextQuestion(quizName, currentIndex)
      setCurrentQuestion(question)
      setAnswer('')
    } catch (err) {
      if (err instanceof Error && err.message === 'NO_MORE_QUESTIONS') {
        endQuiz()
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load question')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitAnswer = () => {
    if (!currentQuestion) return

    const userAnswer = answer.trim().toLowerCase()
    const correctAnswer = currentQuestion.answer.toLowerCase()

    if (userAnswer === correctAnswer) {
      setCorrectAnswers(correctAnswers + 1)
    }

    setCurrentIndex(currentIndex + 1)
    setCurrentQuestion(null)
    setAnswer('')
  }

  const endQuiz = async () => {
    setQuizEnded(true)
    setCurrentQuestion(null)

    const totalQuestions = currentIndex
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

    try {
      await api.saveQuizResults(quizName, correctAnswers, percentage)
      alert(`Quiz completed! You got ${correctAnswers} out of ${totalQuestions} correct (${percentage}%)`)
    } catch (err) {
      console.error('Failed to save results:', err)
    }
  }

  // TODO: Add timer functionality to track how long user takes to complete quiz
  // TODO: Improve UI - show progress bar and question counter instead of alert

  if (!quizName) {
    return (
      <div className="card">
        <h2>Error</h2>
        <p>Quiz name is required</p>
        <button onClick={() => navigate('/quizzes')} className="button">
          Go to Quizzes
        </button>
      </div>
    )
  }

  if (quizEnded) {
    return (
      <div className="card" style={{ textAlign: 'center', maxWidth: '600px', margin: '50px auto' }}>
        <h1>Quiz Completed!</h1>
        <p style={{ fontSize: '20px', marginTop: '20px' }}>
          Congratulations! You have completed the quiz: <strong>{quizName}</strong>
        </p>
        <p style={{ fontSize: '18px', marginTop: '20px' }}>
          You got {correctAnswers} out of {currentIndex} correct ({currentIndex > 0 ? Math.round((correctAnswers / currentIndex) * 100) : 0}%)
        </p>
        <button onClick={() => navigate('/')} className="button" style={{ marginTop: '30px' }}>
          Go Home
        </button>
      </div>
    )
  }

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Quiz: {quizName}</h1>

      {error && (
        <div className="message message-error">
          {error}
        </div>
      )}

      {!currentQuestion && !loading && currentIndex === 0 && (
        <div>
          <p style={{ fontSize: '18px', marginTop: '20px' }}>Press "Next Question" to start!</p>
          <button onClick={loadNextQuestion} className="button" style={{ marginTop: '20px' }}>
            Next Question
          </button>
        </div>
      )}

      {loading && (
        <div style={{ marginTop: '20px' }}>Loading question...</div>
      )}

      {currentQuestion && !loading && (
        <div style={{ marginTop: '30px' }}>
          <div style={{ 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            marginBottom: '20px',
            backgroundColor: '#f9f9f9'
          }}>
            <h2 style={{ marginBottom: '15px' }}>{currentQuestion.name}</h2>
            <p style={{ fontSize: '18px' }}>{currentQuestion.question}</p>
          </div>

          <input
            type="text"
            className="input"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Your answer"
            style={{ maxWidth: '400px', margin: '20px auto' }}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                handleSubmitAnswer()
              }
            }}
          />

          <div>
            <button onClick={handleSubmitAnswer} className="button" style={{ marginTop: '10px' }}>
              Submit Answer
            </button>
          </div>
        </div>
      )}

      <button onClick={() => navigate('/')} className="button" style={{ marginTop: '30px' }}>
        Go Home
      </button>
    </div>
  )
}

export default Game

