
import { Router } from 'express';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated.js';
import { getRepos, getFiles, createPullRequest } from '../controllers/githubController.js';

const router = Router();

router.get('/repos', ensureAuthenticated, getRepos);
router.get('/files', ensureAuthenticated, getFiles);
router.post('/pr', ensureAuthenticated, createPullRequest);

export default router;
