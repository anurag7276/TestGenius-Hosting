
import { Router } from 'express';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated.js';
import { getRepos, getFiles, createPullRequest } from '../controllers/githubController.js';

const router = Router();

router.get('/github/repos', ensureAuthenticated, getRepos);
router.get('/github/files', ensureAuthenticated, getFiles);
router.post('/github/pr', ensureAuthenticated, createPullRequest);

export default router;
