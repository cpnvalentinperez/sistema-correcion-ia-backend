import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';

const router = Router();

// Endpoint: POST /auth/login

router.post('/login', login);

export default router;