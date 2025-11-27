import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

// Login
router.post('/login', authController.login);

// Registrar
router.post('/register', authController.register);

// Refresh token
router.post('/refresh', authController.refreshToken);

export default router;
