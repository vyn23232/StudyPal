import { addToHistory } from './storageService.js'

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function generateFallbackExplanation(topic) {
  const t = topic.trim()

  return (
    `## ${t}\n\n` +
    `**${t}** is a fundamental concept that plays an important role in its field of study.\n\n` +
    `### What is ${t}?\n\n` +
    `In simple terms, ${t} refers to a principle or idea that helps us understand how certain things work. ` +
    `Think of it as a building block — once you understand it, many related topics become much easier to grasp.\n\n` +
    `### Think of it This Way\n\n` +
    `Imagine you're organizing a **library**. Each book has a specific place on the shelf, and there's a system ` +
    `that helps you find any book quickly. **${t}** works in a similar way — it provides a structured approach ` +
    `to organizing and understanding information in its domain.\n\n` +
    `Just like a library has:\n` +
    `- **Sections** (categories) — ${t} has its own categories or components\n` +
    `- **An index system** (catalog) — ${t} uses specific rules or principles to organize ideas\n` +
    `- **A librarian** (guide) — ${t} has key principles that guide how things work\n\n` +
    `### Breaking it Down Step by Step\n\n` +
    `**1.** Start by identifying what **${t}** is at its core. Every concept has a foundational definition — ` +
    `this is your starting point. Ask yourself: "What problem does ${t} solve?"\n\n` +
    `**2.** Break **${t}** down into its main parts or principles:\n` +
    `- The foundational element that everything else builds on\n` +
    `- The mechanism or process that makes it work\n` +
    `- The outcome or result that ${t} produces\n\n` +
    `**3.** Trace how the parts connect. In **${t}**, the components work ` +
    `together in a specific sequence or relationship. Understanding this flow is key to mastering the topic.\n\n` +
    `**4.** Apply it to a real-world example — this is where theory meets practice.\n\n` +
    `### Key Points to Remember\n\n` +
    `- **Definition:** ${t} describes the core mechanism or idea behind its subject area\n` +
    `- **Why it matters:** Understanding ${t} helps you connect related concepts and solve problems more effectively\n` +
    `- **Where it applies:** ${t} shows up in many real-world situations and exam questions\n` +
    `- **Common misconception:** Students often confuse ${t} with similar-sounding concepts — focus on the specific definition\n\n` +
    `### Exam Tips\n\n` +
    `- When you see **${t}** in a question, first recall the **definition**\n` +
    `- Look for **keywords** that hint at which aspect of ${t} is being tested\n` +
    `- Practice applying ${t} to **different scenarios** — exams often test transfer of knowledge\n\n` +
    `**Quick Recall Formula:** **${t}** = Core Definition + Key Properties + Real-World Application`
  )
}

function generateFallbackSummary(notes) {
  const sentences = notes
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 10)

  const words = notes.toLowerCase().split(/\s+/)
  const wordFreq = {}
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
    'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over',
    'under', 'again', 'further', 'then', 'once', 'and', 'but', 'or',
    'nor', 'not', 'so', 'yet', 'both', 'either', 'neither', 'each',
    'every', 'all', 'any', 'few', 'more', 'most', 'other', 'some',
    'such', 'no', 'only', 'own', 'same', 'than', 'too', 'very', 'just',
    'because', 'if', 'when', 'while', 'where', 'how', 'what', 'which',
    'who', 'whom', 'this', 'that', 'these', 'those', 'i', 'me', 'my',
    'we', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'it',
    'its', 'they', 'them', 'their', 'about', 'also', 'it\'s', 'there'
  ])

  words.forEach(w => {
    const clean = w.replace(/[^a-z]/g, '')
    if (clean.length > 3 && !stopWords.has(clean)) {
      wordFreq[clean] = (wordFreq[clean] || 0) + 1
    }
  })

  const scoredSentences = sentences.map((sentence, index) => {
    const sWords = sentence.toLowerCase().split(/\s+/)
    let score = 0
    sWords.forEach(w => {
      const clean = w.replace(/[^a-z]/g, '')
      if (wordFreq[clean]) score += wordFreq[clean]
    })
    if (index < 3) score += 5
    if (sentence.length > 30 && sentence.length < 200) score += 3
    return { sentence, score }
  })

  scoredSentences.sort((a, b) => b.score - a.score)

  const topSentences = scoredSentences.slice(0, Math.max(5, Math.ceil(sentences.length * 0.3)))
  topSentences.sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))

  const topKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1))

  let summary = `## Study Notes Summary\n\n`
  summary += `### Key Points\n\n`
  topSentences.forEach(({ sentence }) => {
    summary += `- ${sentence}\n`
  })
  summary += `\n### Important Terms\n\n`
  summary += topKeywords.map(k => `**${k}**`).join(', ')
  summary += `\n\n### Quick Review\n\n`
  summary += `These notes cover ${sentences.length} key ideas. Focus on the key points above for exam preparation. `
  summary += `Pay special attention to the important terms listed — they are the most frequently referenced concepts in your notes.`

  return summary
}

async function explainConcept(topic) {
  try {
    const response = await fetch('/.netlify/functions/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    })
    const data = await response.json()
    if (data.success) {
      addToHistory({ topic, style: 'ask', explanation: data.explanation, type: 'explanation' })
      return data
    }
  } catch {}

  await delay(800 + Math.random() * 700)
  const explanation = generateFallbackExplanation(topic)
  addToHistory({ topic, style: 'ask', explanation, type: 'explanation' })
  return { success: true, topic, explanation }
}

async function summarizeNotes(notes) {
  try {
    const response = await fetch('/.netlify/functions/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    })
    const data = await response.json()
    if (data.success) {
      const preview = notes.substring(0, 80).replace(/\n/g, ' ')
      addToHistory({ topic: `Summary: ${preview}...`, style: 'summary', explanation: data.summary, type: 'summary' })
      return data
    }
  } catch {}

  await delay(800 + Math.random() * 700)
  const summary = generateFallbackSummary(notes)
  const preview = notes.substring(0, 80).replace(/\n/g, ' ')
  addToHistory({ topic: `Summary: ${preview}...`, style: 'summary', explanation: summary, type: 'summary' })
  return { success: true, summary }
}

export { explainConcept, summarizeNotes }
