
import { Router } from 'express';
import { githubLogin, githubCallback, redirectToClient, getUser ,logout} from '../controllers/authController.js';

const router = Router();

router.get('/github/login', githubLogin);
router.get('/github/callback', githubCallback, redirectToClient);
router.get('/user', getUser);

router.post('/logout', logout);
export default router;
