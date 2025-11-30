const API_BASE_URL = ''

export interface Quiz {
  name: string
  author: string
  questions?: Question[]
}

export interface Question {
  name: string
  question: string
  answer: string
  quizzes?: Quiz[]
}

export interface UserAnswer {
  quiz_name: string
  correct_answers: number
  percentage: number
  user_name?: string
  date?: string
}

export const api = {
  async login(email: string, password: string) {
    const data = new URLSearchParams()
    data.append('grant_type', 'password')
    data.append('username', email)
    data.append('password', password)
    data.append('scope', '')
    data.append('client_id', 'string')
    data.append('client_secret', 'string')

    const response = await fetch(`${API_BASE_URL}/auth/cookie/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      credentials: 'include',
      body: data
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Login failed')
    }

    if (response.status === 204) {
      return {}
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }
    
    return {}
  },

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/cookie/logout`, {
      method: 'POST',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Logout failed')
    }

    if (response.status === 204) {
      return {}
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }
    
    return {}
  },

  async register(email: string, password: string, isActive: boolean = true, isSuperuser: boolean = false, isVerified: boolean = false) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        is_active: isActive,
        is_superuser: isSuperuser,
        is_verified: isVerified
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Registration failed')
    }

    return response.json()
  },

  async getQuizzes(): Promise<Quiz[]> {
    const response = await fetch(`${API_BASE_URL}/app/quizzes`, {
      credentials: 'include'
    })

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.setItem('isLoggedIn', 'false')
        window.location.href = '/login'
        throw new Error('Unauthorized - Please login')
      }
      throw new Error('Failed to fetch quizzes')
    }

    return response.json()
  },

  async createQuiz(name: string, author: string): Promise<Quiz> {
    const response = await fetch(`${API_BASE_URL}/app/quizzes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ name, author })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create quiz')
    }

    return response.json()
  },

  async deleteQuiz(quizName: string) {
    const response = await fetch(`${API_BASE_URL}/app/quizzes/delete/${quizName}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete quiz')
    }

    return response.json()
  },

  async getQuestions(): Promise<Question[]> {
    const response = await fetch(`${API_BASE_URL}/app/questions`, {
      credentials: 'include'
    })

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.setItem('isLoggedIn', 'false')
        window.location.href = '/login'
        throw new Error('Unauthorized - Please login')
      }
      throw new Error('Failed to fetch questions')
    }

    return response.json()
  },

  async createQuestion(name: string, question: string, answer: string): Promise<Question> {
    const response = await fetch(`${API_BASE_URL}/app/questions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ name, question, answer })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create question')
    }

    return response.json()
  },

  async deleteQuestion(questionName: string) {
    const response = await fetch(`${API_BASE_URL}/app/questions/delete/${questionName}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete question')
    }

    return response.json()
  },

  async connectQuestionToQuiz(quizName: string, questionName: string) {
    const response = await fetch(`${API_BASE_URL}/app/questions/${encodeURIComponent(quizName)}/${encodeURIComponent(questionName)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({})
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Failed to connect question to quiz')
    }

    return response.json()
  },

  async getNextQuestion(quizName: string, currentIndex: number): Promise<Question> {
    const response = await fetch(`${API_BASE_URL}/app/questions/${quizName}/next?current_index=${currentIndex}`, {
      credentials: 'include'
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('NO_MORE_QUESTIONS')
      }
      throw new Error('Failed to fetch question')
    }

    return response.json()
  },

  async saveQuizResults(quizName: string, correctAnswers: number, percentage: number) {
    const response = await fetch(`${API_BASE_URL}/app/questions/${quizName}/save_results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        quiz_name: quizName,
        correct_answers: correctAnswers,
        percentage: percentage
      })
    })

    if (!response.ok) {
      throw new Error('Failed to save quiz results')
    }

    return response.json()
  },

  async getUserAnswers(): Promise<UserAnswer[]> {
    const response = await fetch(`${API_BASE_URL}/app/user_answers/`, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user answers')
    }

    return response.json()
  }
}

// TODO: Add request caching to avoid unnecessary API calls for quizzes/questions lists
