
import { Router } from 'express';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated.js';
import { generateSummaries, generateCode } from '../controllers/aiController.js';

const router = Router();

router.post('/summaries', ensureAuthenticated, generateSummaries);
router.post('/code', ensureAuthenticated, generateCode);

export default router;
