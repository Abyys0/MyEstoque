import { Router, Response } from 'express';
import { db } from '../config/firebase';
import { authenticate, authorize, AuthRequest } from '../middlewares/authMiddleware';
import { ApiResponse, UserRole } from '../types';

const router = Router();

// Get all users (Admin only)
router.get(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  async (_req: AuthRequest, res: Response) => {
    try {
      const snapshot = await db.collection('users').get();
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.json({
        success: true,
        data: users,
      } as ApiResponse);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      } as ApiResponse);
    }
  }
);

// Get user by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Users can only view their own profile unless they're admin
    if (req.user!.role !== UserRole.ADMIN && req.user!.uid !== req.params.id) {
      res.status(403).json({
        success: false,
        error: 'Permissão negada',
      } as ApiResponse);
      return;
    }

    const doc = await db.collection('users').doc(req.params.id).get();

    if (!doc.exists) {
      res.status(404).json({
        success: false,
        error: 'Usuário não encontrado',
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: { id: doc.id, ...doc.data() },
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    } as ApiResponse);
  }
});

// Update user
router.put(
  '/:id',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      // Users can only update their own profile unless they're admin
      if (req.user!.role !== UserRole.ADMIN && req.user!.uid !== req.params.id) {
        res.status(403).json({
          success: false,
          error: 'Permissão negada',
        } as ApiResponse);
        return;
      }

      const updateData = { ...req.body, updatedAt: new Date() };

      // Only admins can change roles
      if (req.user!.role !== UserRole.ADMIN) {
        delete updateData.role;
        delete updateData.isActive;
      }

      await db.collection('users').doc(req.params.id).update(updateData);

      res.json({
        success: true,
        message: 'Usuário atualizado com sucesso',
      } as ApiResponse);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      } as ApiResponse);
    }
  }
);

// Delete user (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      await db.collection('users').doc(req.params.id).update({
        isActive: false,
        updatedAt: new Date(),
      });

      res.json({
        success: true,
        message: 'Usuário desativado com sucesso',
      } as ApiResponse);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      } as ApiResponse);
    }
  }
);

export default router;
