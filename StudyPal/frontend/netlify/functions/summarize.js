export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const { notes } = JSON.parse(event.body)

  if (!notes) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Notes are required' }) }
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) }
  }

  const systemPrompt = `You are StudyPal, an AI study assistant. Summarize the provided study notes in a clear, structured, exam-focused format. Use markdown formatting:
- ## for the title
- ### for sections like "Key Points", "Important Terms", "Quick Review"
- **bold** for emphasis
- Bullet points for key ideas
Extract key points, definitions, and important concepts. Keep it concise and memorization-friendly.`

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: `Summarize these study notes for exam preparation:\n\n${notes}` }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 1500 }
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return { statusCode: 502, body: JSON.stringify({ error: 'AI request failed' }) }
    }

    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!summary) {
      return { statusCode: 502, body: JSON.stringify({ error: 'No response from AI' }) }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, summary })
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) }
  }
}
