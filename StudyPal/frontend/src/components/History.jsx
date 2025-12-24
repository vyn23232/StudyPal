import { useState, useEffect } from 'react'
import './History.css'

const API_URL = 'http://localhost:5000/api'

function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Function to convert markdown to HTML
  const formatText = (text) => {
    if (!text) return text
    
    // Helper function to convert numbers to Roman numerals
    const toRoman = (num) => {
      const romanNumerals = [
        ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
      ]
      let result = ''
      for (const [roman, value] of romanNumerals) {
        while (num >= value) {
          result += roman
          num -= value
        }
      }
      return result
    }
    
    // Convert 1) text to I) text (Roman numerals with parentheses)
    text = text.replace(/^(\d+)\)\s+(.+)$/gm, (match, num, content) => {
      return `<strong>${toRoman(parseInt(num))})</strong> ${content}`
    })
    
    // Convert #### Heading to <h4>
    text = text.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
    
    // Convert ### Heading to <h3>
    text = text.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    
    // Convert ## Heading to <h3> (subheading)
    text = text.replace(/^##\s+(.+)$/gm, '<h3>$1</h3>')
    
    // Convert # Heading to <h3>
    text = text.replace(/^#\s+(.+)$/gm, '<h3>$1</h3>')
    
    // Convert **bold** to <strong>bold</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // Convert *italic* to <em>italic</em>
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Convert `inline code` to <code>inline code</code>
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Convert bullet points (- item or * item) to styled bullets
    text = text.replace(/^[•\-\*]\s+(.+)$/gm, '<span class="bullet-item">• $1</span>')
    
    // Convert numbered lists (1. item) to proper format
    text = text.replace(/^(\d+)\.\s+(.+)$/gm, '<strong>$1.</strong> $2')
    
    return text
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/study/history`)
      const data = await response.json()

      if (data.success) {
        setHistory(data.history || [])
      } else {
        setError('Failed to load history')
      }
    } catch (err) {
      setError('Failed to connect to server')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStyleLabel = (style) => {
    const labels = {
      simple: 'Simple',
      analogy: 'Analogy',
      stepByStep: 'Step-by-Step',
      examReady: 'Exam-Ready'
    }
    return labels[style] || style
  }

  if (loading) {
    return (
      <div className="history">
        <div className="loading-container">
          <span className="loading"></span>
          <p>Loading history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="history">
      <div className="section-header">
        <h2>Study History</h2>
        <p>Review your recent explanations and summaries</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {history.length === 0 ? (
        <div className="empty-state card">
          <h3>No History Yet</h3>
          <p>Your study history will appear here</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item.id} className="history-item card">
              <div className="history-header">
                <h3>{item.topic}</h3>
                <span className="style-badge">{getStyleLabel(item.style)}</span>
              </div>
              <div className="history-date">{formatDate(item.created_at)}</div>
              <div 
                className="history-explanation"
                dangerouslySetInnerHTML={{ 
                  __html: formatText(item.explanation.substring(0, 200) + (item.explanation.length > 200 ? '...' : ''))
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default History
