import openaiService from '../services/openaiService.js';
import db from '../config/database.js';

export const explainConcept = async (req, res) => {
  try {
    const { topic, style } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const explanation = await openaiService.explainConcept(topic, style);

    // Save to database (optional)
    try {
      await db.query(
        'INSERT INTO study_history (topic, style, explanation, created_at) VALUES (?, ?, ?, NOW())',
        [topic, style || 'simple', explanation]
      );
    } catch (dbError) {
      console.log('Database save skipped:', dbError.message);
    }

    res.json({
      success: true,
      topic,
      style: style || 'simple',
      explanation
    });
  } catch (error) {
    console.error('Error in explainConcept:', error);
    res.status(500).json({ error: 'Failed to generate explanation' });
  }
};

export const summarizeNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes) {
      return res.status(400).json({ error: 'Notes are required' });
    }

    const summary = await openaiService.summarizeNotes(notes);

    // Save to database (optional)
    try {
      await db.query(
        'INSERT INTO summaries (original_notes, summary, created_at) VALUES (?, ?, NOW())',
        [notes, summary]
      );
    } catch (dbError) {
      console.log('Database save skipped:', dbError.message);
    }

    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Error in summarizeNotes:', error);
    res.status(500).json({ error: 'Failed to summarize notes' });
  }
};

export const getHistory = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, topic, style, explanation, created_at FROM study_history ORDER BY created_at DESC LIMIT 20'
    );
    res.json({ success: true, history: rows });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.json({ success: true, history: [] }); // Return empty array if table doesn't exist
  }
};
