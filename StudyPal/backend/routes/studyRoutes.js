import express from 'express';
import { explainConcept, summarizeNotes, getHistory } from '../controllers/studyController.js';

const router = express.Router();

router.post('/explain', explainConcept);
router.post('/summarize', summarizeNotes);
router.get('/history', getHistory);

export default router;
