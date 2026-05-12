export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const { topic } = JSON.parse(event.body)

  if (!topic) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Topic is required' }) }
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) }
  }

  const systemPrompt = `You are StudyPal, an AI study assistant. Give a complete, well-structured explanation that includes:
1. A clear, beginner-friendly definition
2. A relatable real-world analogy
3. A step-by-step breakdown of the key components
4. Key points to remember (as bullet points)
5. Exam tips and a quick recall formula

Use markdown formatting: ## for title, ### for sections, **bold** for emphasis, - for bullet points.
Keep it concise but thorough. Assume minimal prior knowledge.`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: `Explain: ${topic}` }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1200 }
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: 'AI request failed' }) }
    }

    const explanation = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!explanation) {
      return { statusCode: 502, body: JSON.stringify({ error: 'No response from AI' }) }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, topic, explanation })
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) }
  }
}
