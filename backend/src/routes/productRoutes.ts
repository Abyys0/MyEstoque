import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../config/firebase';
import { authenticate, authorize, AuthRequest } from '../middlewares/authMiddleware';
import { ApiResponse, UserRole, Product } from '../types';

const router = Router();

// Get all products
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { category, search } = req.query;
    let query = db.collection('products');

    if (category) {
      query = query.where('category', '==', category) as any;
    }

    const snapshot = await query.get();
    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];

    // Search filter
    if (search) {
      const searchLower = (search as string).toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.barcode.includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

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

// Get product by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const doc = await db.collection('products').doc(req.params.id).get();

    if (!doc.exists) {
      res.status(404).json({
        success: false,
        error: 'Produto não encontrado',
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

// Get product by barcode
router.get('/barcode/:barcode', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const snapshot = await db.collection('products')
      .where('barcode', '==', req.params.barcode)
      .limit(1)
      .get();

    if (snapshot.empty) {
      res.status(404).json({
        success: false,
        error: 'Produto não encontrado',
      } as ApiResponse);
      return;
    }

    const doc = snapshot.docs[0];
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

// Create product
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OPERATOR),
  [
    body('barcode').notEmpty().withMessage('Código de barras é obrigatório'),
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('category').notEmpty().withMessage('Categoria é obrigatória'),
    body('unit').notEmpty().withMessage('Unidade é obrigatória'),
    body('minStock').isNumeric().withMessage('Estoque mínimo deve ser numérico'),
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

      // Check if barcode already exists
      const existing = await db.collection('products')
        .where('barcode', '==', req.body.barcode)
        .limit(1)
        .get();

      if (!existing.empty) {
        res.status(400).json({
          success: false,
          error: 'Código de barras já cadastrado',
        } as ApiResponse);
        return;
      }

      const productData = {
        ...req.body,
        currentStock: req.body.currentStock || 0,
        createdBy: req.user!.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await db.collection('products').add(productData);

      res.status(201).json({
        success: true,
        data: { id: docRef.id, ...productData },
        message: 'Produto criado com sucesso',
      } as ApiResponse);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      } as ApiResponse);
    }
  }
);

// Update product
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OPERATOR),
  async (req: AuthRequest, res: Response) => {
    try {
      const doc = await db.collection('products').doc(req.params.id).get();

      if (!doc.exists) {
        res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
        } as ApiResponse);
        return;
      }

      const updateData = {
        ...req.body,
        updatedAt: new Date(),
      };

      // Don't allow updating currentStock directly (use stock movements)
      delete updateData.currentStock;
      delete updateData.createdBy;
      delete updateData.createdAt;

      await db.collection('products').doc(req.params.id).update(updateData);

      res.json({
        success: true,
        message: 'Produto atualizado com sucesso',
      } as ApiResponse);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      } as ApiResponse);
    }
  }
);

// Delete product
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const doc = await db.collection('products').doc(req.params.id).get();

      if (!doc.exists) {
        res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
        } as ApiResponse);
        return;
      }

      await db.collection('products').doc(req.params.id).delete();

      res.json({
        success: true,
        message: 'Produto excluído com sucesso',
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
