import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import QuizzesList from './pages/QuizzesList'
import CreateQuiz from './pages/CreateQuiz'
import DeleteQuiz from './pages/DeleteQuiz'
import QuestionsList from './pages/QuestionsList'
import CreateQuestion from './pages/CreateQuestion'
import DeleteQuestion from './pages/DeleteQuestion'
import ConnectQuizQuestion from './pages/ConnectQuizQuestion'
import Game from './pages/Game'
import Leaderboard from './pages/Leaderboard'
import Navigation from './components/Navigation'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navigation />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/quizzes" element={<QuizzesList />} />
              <Route path="/quizzes/create" element={<CreateQuiz />} />
              <Route path="/quizzes/delete" element={<DeleteQuiz />} />
              <Route path="/questions" element={<QuestionsList />} />
              <Route path="/questions/create" element={<CreateQuestion />} />
              <Route path="/questions/delete" element={<DeleteQuestion />} />
              <Route path="/questions/connect" element={<ConnectQuizQuestion />} />
              <Route path="/game" element={<Game />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App

