import { useState } from 'react'
import './ExplainConcept.css'

const API_URL = 'http://localhost:5000/api'

function ExplainConcept() {
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState('simple')
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState(null)

  // Function to parse content and separate code blocks from text
  const parseContent = (text) => {
    if (!text) return []
    
    const blocks = []
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    let lastIndex = 0
    let match
    
    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        blocks.push({
          type: 'text',
          content: text.substring(lastIndex, match.index)
        })
      }
      
      // Add code block
      blocks.push({
        type: 'code',
        language: match[1] || 'text',
        content: match[2].trim()
      })
      
      lastIndex = match.index + match[0].length
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      blocks.push({
        type: 'text',
        content: text.substring(lastIndex)
      })
    }
    
    return blocks.length > 0 ? blocks : [{ type: 'text', content: text }]
  }

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

  const explainStyles = [
    { value: 'simple', label: 'Simple Explanation', desc: 'Beginner-friendly language' },
    { value: 'analogy', label: 'Analogy-Based', desc: 'Real-world comparisons' },
    { value: 'stepByStep', label: 'Step-by-Step', desc: 'Numbered breakdown' },
    { value: 'examReady', label: 'Exam-Ready', desc: 'Concise summary' }
  ]

  const handleExplain = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic to explain')
      return
    }

    setLoading(true)
    setError('')
    setExplanation('')

    try {
      const response = await fetch(`${API_URL}/study/explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, style })
      })

      const data = await response.json()

      if (data.success) {
        setExplanation(data.explanation)
      } else {
        setError('Failed to generate explanation')
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the backend is running.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="explain-concept">
      <div className="section-header">
        <h2>Explain a Concept</h2>
        <p>Enter any topic and choose your preferred explanation style</p>
      </div>

      <div className="input-section card">
        <div className="form-group">
          <label htmlFor="topic">Topic or Concept</label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Photosynthesis, Newton's Laws, Machine Learning..."
            onKeyPress={(e) => e.key === 'Enter' && handleExplain()}
          />
        </div>

        <div className="form-group">
          <label>Explanation Style</label>
          <div className="style-grid">
            {explainStyles.map((s) => (
              <button
                key={s.value}
                className={`style-btn ${style === s.value ? 'active' : ''}`}
                onClick={() => setStyle(s.value)}
              >
                <div className="style-label">{s.label}</div>
                <div className="style-desc">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <button 
          className="btn btn-accent" 
          onClick={handleExplain}
          disabled={loading}
        >
          {loading ? <span className="loading"></span> : 'Explain'}
        </button>

        {error && <div className="error-message">{error}</div>}
      </div>

      {explanation && (
        <div className="result-section card">
          <h3>Explanation</h3>
          <div className="explanation-content">
            {parseContent(explanation).map((block, index) => {
              if (block.type === 'code') {
                const isOutput = block.language === 'output' || block.language === 'text'
                return (
                  <div key={index} className="code-block-wrapper" data-language={block.language}>
                    <div className="code-block-header">
                      <span className="code-language">
                        {isOutput ? 'OUTPUT' : block.language}
                      </span>
                      <button 
                        className="copy-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(block.content)
                          setCopiedIndex(index)
                          setTimeout(() => setCopiedIndex(null), 2000)
                        }}
                      >
                        {copiedIndex === index ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="code-block">
                      <code>{block.content}</code>
                    </pre>
                  </div>
                )
              } else {
                return (
                  <div key={index}>
                    {block.content.split('\n').map((paragraph, pIndex) => (
                      paragraph.trim() && (
                        <p 
                          key={pIndex} 
                          dangerouslySetInnerHTML={{ __html: formatText(paragraph) }}
                        />
                      )
                    ))}
                  </div>
                )
              }
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExplainConcept
