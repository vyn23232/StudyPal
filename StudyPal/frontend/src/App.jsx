import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import ExplainConcept from './components/ExplainConcept'
import SummarizeNotes from './components/SummarizeNotes'
import History from './components/History'

function App() {
  const [activeTab, setActiveTab] = useState('explain')

  return (
    <div className="app">
      <Header />
      
      <nav className="tab-nav">
        <div className="container">
          <button 
            className={`tab-btn ${activeTab === 'explain' ? 'active' : ''}`}
            onClick={() => setActiveTab('explain')}
          >
            Explain Concept
          </button>
          <button 
            className={`tab-btn ${activeTab === 'summarize' ? 'active' : ''}`}
            onClick={() => setActiveTab('summarize')}
          >
            Summarize Notes
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          {activeTab === 'explain' && <ExplainConcept />}
          {activeTab === 'summarize' && <SummarizeNotes />}
          {activeTab === 'history' && <History />}
        </div>
      </main>

      <footer className="footer">
        <div className="container text-center">
          <p>StudyPal © 2025 | Your AI Study Companion</p>
          <p className="footer-credit">Built by Vyn</p>
        </div>
      </footer>
    </div>
  )
}

export default App
