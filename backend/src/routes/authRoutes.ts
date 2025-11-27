import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth, db } from '../config/firebase';
import { ApiResponse, UserRole } from '../types';

const router = Router();

// Register
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
    body('name').notEmpty().withMessage('Nome é obrigatório'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: errors.array()[0].msg,
        } as ApiResponse);
        return;
      }

      const { email, password, name } = req.body;

      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
      });

      // Set default role
      await auth.setCustomUserClaims(userRecord.uid, { role: UserRole.OPERATOR });

      // Save user data in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        email,
        name,
        role: UserRole.OPERATOR,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res.status(201).json({
        success: true,
        data: {
          uid: userRecord.uid,
          email,
          name,
          role: UserRole.OPERATOR,
        },
        message: 'Usuário criado com sucesso',
      } as ApiResponse);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Erro ao criar usuário',
      } as ApiResponse);
    }
  }
);

// Login (Firebase handles this on client side, but we can verify token here)
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({
        success: false,
        error: 'Token não fornecido',
      } as ApiResponse);
      return;
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();

    res.json({
      success: true,
      data: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        ...userData,
      },
      message: 'Login realizado com sucesso',
    } as ApiResponse);
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message || 'Token inválido',
    } as ApiResponse);
  }
});

// Update FCM token for push notifications
router.post('/fcm-token', async (req: Request, res: Response) => {
  try {
    const { userId, fcmToken } = req.body;

    if (!userId || !fcmToken) {
      res.status(400).json({
        success: false,
        error: 'userId e fcmToken são obrigatórios',
      } as ApiResponse);
      return;
    }

    await db.collection('users').doc(userId).update({
      fcmToken,
      updatedAt: new Date(),
    });

    res.json({
      success: true,
      message: 'Token FCM atualizado',
    } as ApiResponse);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Erro ao atualizar token',
    } as ApiResponse);
  }
});

export default router;
