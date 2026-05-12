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

  const prompt = `You are StudyPal, an AI study assistant. Give a complete, well-structured explanation of the following topic. Include:
1. A clear, beginner-friendly definition
2. A relatable real-world analogy
3. A step-by-step breakdown of the key components
4. Key points to remember (as bullet points)
5. Exam tips and a quick recall formula

Use markdown formatting: ## for title, ### for sections, **bold** for emphasis, - for bullet points.
Keep it concise but thorough. Assume minimal prior knowledge.

Topic: ${topic}`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1200 }
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.log('Gemini API error:', JSON.stringify(data))
      return { statusCode: 502, body: JSON.stringify({ error: 'AI request failed', details: data?.error?.message }) }
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
    console.log('Function error:', err.message)
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error', details: err.message }) }
  }
}
