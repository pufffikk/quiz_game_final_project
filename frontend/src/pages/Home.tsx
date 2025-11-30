import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  const quickLinks = [
    {
      icon: '📚',
      title: 'Quizzes List',
      description: 'Browse all available quizzes',
      link: '/quizzes',
      color: '#4CAF50'
    },
    {
      icon: '❓',
      title: 'Questions List',
      description: 'View all questions',
      link: '/questions',
      color: '#2196F3'
    },
    {
      icon: '🏆',
      title: 'Leaderboard',
      description: 'See top participants',
      link: '/leaderboard',
      color: '#FF9800'
    }
  ]

  const actions = [
    {
      icon: '✨',
      title: 'Create Quiz',
      description: 'Create a new quiz',
      link: '/quizzes/create',
      color: '#9C27B0'
    },
    {
      icon: '➕',
      title: 'Create Question',
      description: 'Add a new question',
      link: '/questions/create',
      color: '#00BCD4'
    },
    {
      icon: '🔗',
      title: 'Connect Quiz & Question',
      description: 'Link questions to quizzes',
      link: '/questions/connect',
      color: '#FF5722'
    },
    {
      icon: '🗑️',
      title: 'Delete Quiz',
      description: 'Remove a quiz',
      link: '/quizzes/delete',
      color: '#f44336'
    },
    {
      icon: '❌',
      title: 'Delete Question',
      description: 'Remove a question',
      link: '/questions/delete',
      color: '#E91E63'
    }
  ]

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="emoji-large">🎯</span>
            Welcome to Quiz Game!
          </h1>
          <p className="hero-subtitle">
            Test your knowledge, create quizzes, and compete with others!
          </p>
        </div>
      </div>

      <div className="sections-container">
        <section className="section">
          <h2 className="section-title">
            <span className="section-icon">🚀</span>
            Quick Access
          </h2>
          <div className="cards-grid">
            {quickLinks.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="home-card quick-link-card"
                style={{ '--card-color': item.color } as React.CSSProperties}
              >
                <div className="card-icon">{item.icon}</div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-description">{item.description}</p>
                <div className="card-arrow">→</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">
            <span className="section-icon">⚡</span>
            Actions
          </h2>
          <div className="cards-grid">
            {actions.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="home-card action-card"
                style={{ '--card-color': item.color } as React.CSSProperties}
              >
                <div className="card-icon">{item.icon}</div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-description">{item.description}</p>
                <div className="card-arrow">→</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home

