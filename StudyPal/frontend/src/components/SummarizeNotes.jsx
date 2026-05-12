import { useState } from 'react'
import './SummarizeNotes.css'
import { summarizeNotes as summarizeNotesService } from '../services/studyService.js'

function SummarizeNotes() {
  const [notes, setNotes] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
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

  const handleSummarize = async () => {
    if (!notes.trim()) {
      setError('Please enter some notes to summarize')
      return
    }

    setLoading(true)
    setError('')
    setSummary('')

    try {
      const data = await summarizeNotesService(notes)
      if (data.success) {
        setSummary(data.summary)
      } else {
        setError('Failed to generate summary')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setNotes('')
    setSummary('')
    setError('')
  }

  return (
    <div className="summarize-notes">
      <div className="section-header">
        <h2>Summarize Study Notes</h2>
        <p>Paste your notes and get an exam-focused summary</p>
      </div>

      <div className="input-section card">
        <div className="form-group">
          <label htmlFor="notes">Your Study Notes</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your study notes here... The more content, the better the summary!"
            rows="12"
          />
          <div className="char-count">
            {notes.length} characters
          </div>
        </div>

        <div className="button-group">
          <button 
            className="btn btn-accent" 
            onClick={handleSummarize}
            disabled={loading}
          >
            {loading ? <span className="loading"></span> : 'Summarize'}
          </button>
          <button 
            className="btn" 
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>

      {summary && (
        <div className="result-section card">
          <h3>Summary</h3>
          <div className="summary-content">
            {summary.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p 
                  key={index} 
                  dangerouslySetInnerHTML={{ __html: formatText(paragraph) }}
                />
              )
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SummarizeNotes
