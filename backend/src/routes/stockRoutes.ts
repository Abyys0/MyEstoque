import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../config/firebase';
import { authenticate, authorize, AuthRequest } from '../middlewares/authMiddleware';
import { ApiResponse, UserRole, MovementType, StockMovement } from '../types';

const router = Router();

// Get stock movements
router.get('/movements', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { productId, startDate, endDate, type } = req.query as any;
    let query = db.collection('stock_movements').orderBy('timestamp', 'desc');

    if (productId) {
      query = query.where('productId', '==', productId) as any;
    }

    if (type) {
      query = query.where('type', '==', type) as any;
    }

    const snapshot = await query.limit(100).get();
    const movements = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    })) as StockMovement[];

    res.json({
      success: true,
      data: movements,
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    } as ApiResponse);
  }
});

// Record stock movement (IN/OUT/ADJUSTMENT)
router.post(
  '/movement',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OPERATOR),
  [
    body('productId').notEmpty().withMessage('ID do produto é obrigatório'),
    body('type').isIn(['in', 'out', 'adjustment']).withMessage('Tipo inválido'),
    body('quantity').isNumeric().withMessage('Quantidade deve ser numérica'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: errors.array()[0].msg,
        } as ApiResponse);
        return;
      }

      const { productId, type, quantity, reason, notes } = req.body;

      // Get product
      const productDoc = await db.collection('products').doc(productId).get();
      if (!productDoc.exists) {
        res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
        } as ApiResponse);
        return;
      }

      const product = productDoc.data()!;
      const previousStock = product.currentStock || 0;
      let newStock = previousStock;

      // Calculate new stock
      switch (type) {
        case MovementType.IN:
          newStock = previousStock + parseFloat(quantity);
          break;
        case MovementType.OUT:
          newStock = previousStock - parseFloat(quantity);
          if (newStock < 0) {
            res.status(400).json({
              success: false,
              error: 'Estoque insuficiente',
            } as ApiResponse);
            return;
          }
          break;
        case MovementType.ADJUSTMENT:
          newStock = parseFloat(quantity);
          break;
      }

      // Get user info
      const userDoc = await db.collection('users').doc(req.user!.uid).get();
      const userName = userDoc.data()?.name || 'Usuário';

      // Create movement record
      const movementData: Omit<StockMovement, 'id'> = {
        productId,
        type: type as MovementType,
        quantity: parseFloat(quantity),
        previousStock,
        newStock,
        reason,
        notes,
        userId: req.user!.uid,
        userName,
        timestamp: new Date(),
      };

      await db.collection('stock_movements').add(movementData);

      // Update product stock
      await db.collection('products').doc(productId).update({
        currentStock: newStock,
        updatedAt: new Date(),
      });

      // Emit socket event for real-time update
      const io = (req as any).app.get('io');
      io.emit('stock_updated', {
        productId,
        previousStock,
        newStock,
        type,
      });

      res.json({
        success: true,
        data: {
          previousStock,
          newStock,
          movement: movementData,
        },
        message: 'Movimentação registrada com sucesso',
      } as ApiResponse);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      } as ApiResponse);
    }
  }
);

// Get low stock products
router.get('/low-stock', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((p: any) => p.currentStock <= p.minStock);

    res.json({
      success: true,
      data: products,
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    } as ApiResponse);
  }
});

// Get products expiring soon
router.get('/expiring-soon', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const daysWarning = parseInt(process.env.EXPIRY_WARNING_DAYS || '30');
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + daysWarning);

    const snapshot = await db.collection('products')
      .where('expiryDate', '<=', warningDate)
      .where('expiryDate', '>=', new Date())
      .get();

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: products,
    } as ApiResponse);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    } as ApiResponse);
  }
});

export default router;
