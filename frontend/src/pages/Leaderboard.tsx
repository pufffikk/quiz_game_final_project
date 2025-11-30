import { useState, useEffect, useMemo } from 'react'
import { api, UserAnswer } from '../services/api'

type SortField = 'user_name' | 'quiz_name' | 'correct_answers' | 'percentage' | 'date'
type SortDirection = 'asc' | 'desc'

function Leaderboard() {
  const [answers, setAnswers] = useState<UserAnswer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sortField, setSortField] = useState<SortField>('percentage')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  useEffect(() => {
    loadLeaderboard()
  }, [])

  async function loadLeaderboard() {
    try {
      setLoading(true)
      const data = await api.getUserAnswers()
      setAnswers(data)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  const sortedAnswers = useMemo(() => {
    const sorted = [...answers].sort((a, b) => {
      let aValue: string | number | undefined
      let bValue: string | number | undefined

      switch (sortField) {
        case 'user_name':
          aValue = a.user_name || ''
          bValue = b.user_name || ''
          break
        case 'quiz_name':
          aValue = a.quiz_name || ''
          bValue = b.quiz_name || ''
          break
        case 'correct_answers':
          aValue = a.correct_answers
          bValue = b.correct_answers
          break
        case 'percentage':
          aValue = a.percentage
          bValue = b.percentage
          break
        case 'date':
          aValue = a.date || ''
          bValue = b.date || ''
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }, [answers, sortField, sortDirection])

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  function getSortIcon(field: SortField) {
    if (sortField !== field) return '↕️'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  if (loading) {
    return <div>Loading leaderboard...</div>
  }

  return (
    <div>
      <h1>Participation List (Leaderboard)</h1>

      {error && (
        <div className="message message-error">
          {error}
        </div>
      )}

      {answers.length === 0 ? (
        <p>No participation records available</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th 
                onClick={() => handleSort('user_name')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to sort"
              >
                User Name {getSortIcon('user_name')}
              </th>
              <th 
                onClick={() => handleSort('quiz_name')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to sort"
              >
                Quiz Name {getSortIcon('quiz_name')}
              </th>
              <th 
                onClick={() => handleSort('correct_answers')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to sort"
              >
                Correct Answers {getSortIcon('correct_answers')}
              </th>
              <th 
                onClick={() => handleSort('percentage')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to sort"
              >
                Percentage {getSortIcon('percentage')}
              </th>
              <th 
                onClick={() => handleSort('date')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                title="Click to sort"
              >
                Date {getSortIcon('date')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAnswers.map((answer, index) => (
              <tr key={index}>
                <td>{answer.user_name || 'N/A'}</td>
                <td>{answer.quiz_name}</td>
                <td>{answer.correct_answers}</td>
                <td>{answer.percentage}%</td>
                <td>{answer.date || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Leaderboard

