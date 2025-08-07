
import { Router } from 'express';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated.js';
import { generateSummaries, generateCode } from '../controllers/aiController.js';

const router = Router();

router.post('/ai/summaries', ensureAuthenticated, generateSummaries);
router.post('/ai/code', ensureAuthenticated, generateCode);

export default router;
