import { useState } from 'react'
import './ExplainConcept.css'
import { explainConcept as explainConceptService } from '../services/studyService.js'

function ExplainConcept() {
  const [topic, setTopic] = useState('')
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState(null)

  const parseContent = (text) => {
    if (!text) return []

    const blocks = []
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        blocks.push({
          type: 'text',
          content: text.substring(lastIndex, match.index)
        })
      }

      blocks.push({
        type: 'code',
        language: match[1] || 'text',
        content: match[2].trim()
      })

      lastIndex = match.index + match[0].length
    }

    if (lastIndex < text.length) {
      blocks.push({
        type: 'text',
        content: text.substring(lastIndex)
      })
    }

    return blocks.length > 0 ? blocks : [{ type: 'text', content: text }]
  }

  const formatText = (text) => {
    if (!text) return text

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

    text = text.replace(/^(\d+)\)\s+(.+)$/gm, (match, num, content) => {
      return `<strong>${toRoman(parseInt(num))})</strong> ${content}`
    })

    text = text.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
    text = text.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    text = text.replace(/^##\s+(.+)$/gm, '<h3>$1</h3>')
    text = text.replace(/^#\s+(.+)$/gm, '<h3>$1</h3>')
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>')
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>')
    text = text.replace(/^[•\-\*]\s+(.+)$/gm, '<span class="bullet-item">• $1</span>')
    text = text.replace(/^(\d+)\.\s+(.+)$/gm, '<strong>$1.</strong> $2')

    return text
  }

  const handleAsk = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic or question')
      return
    }

    setLoading(true)
    setError('')
    setExplanation('')

    try {
      const data = await explainConceptService(topic)
      if (data.success) {
        setExplanation(data.explanation)
      } else {
        setError('Failed to generate response')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="explain-concept">
      <div className="section-header">
        <h2>Ask StudyPal</h2>
        <p>Type any topic or question and get a complete breakdown</p>
      </div>

      <div className="input-section card">
        <div className="form-group">
          <label htmlFor="topic">What do you want to learn?</label>
          <div className="ask-input-row">
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Photosynthesis, Newton's Laws, Machine Learning..."
              onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
            />
            <button
              className="btn btn-accent"
              onClick={handleAsk}
              disabled={loading}
            >
              {loading ? <span className="loading"></span> : 'Ask'}
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>

      {explanation && (
        <div className="result-section card">
          <h3>Response</h3>
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
