import { Router, Response } from 'express';
import { db } from '../config/firebase';
import { authenticate, authorize, AuthRequest } from '../middlewares/authMiddleware';
import { ApiResponse, UserRole } from '../types';

const router = Router();

// Get stock summary report
router.get(
  '/stock-summary',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const productsSnapshot = await db.collection('products').get();
      const products = productsSnapshot.docs.map(doc => doc.data());

      const totalProducts = products.length;
      const totalValue = products.reduce((sum: number, p: any) => 
        sum + (p.currentStock * (p.price || 0)), 0
      );
      const lowStockProducts = products.filter((p: any) => 
        p.currentStock <= p.minStock
      ).length;
      
      // Get expiring products
      const daysWarning = parseInt(process.env.EXPIRY_WARNING_DAYS || '30');
      const warningDate = new Date();
      warningDate.setDate(warningDate.getDate() + daysWarning);
      
      const expiringProducts = products.filter((p: any) => {
        if (!p.expiryDate) return false;
        const expiryDate = p.expiryDate.toDate ? p.expiryDate.toDate() : new Date(p.expiryDate);
        return expiryDate <= warningDate && expiryDate >= new Date();
      }).length;

      res.json({
        success: true,
        data: {
          totalProducts,
          totalValue,
          lowStockProducts,
          expiringProducts,
          lastUpdate: new Date(),
        },
      } as ApiResponse);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      } as ApiResponse);
    }
  }
);

// Get movement report
router.get(
  '/movements',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { startDate, endDate } = req.query;

      let query = db.collection('stock_movements').orderBy('timestamp', 'desc');

      if (startDate) {
        query = query.where('timestamp', '>=', new Date(startDate as string)) as any;
      }

      if (endDate) {
        query = query.where('timestamp', '<=', new Date(endDate as string)) as any;
      }

      const snapshot = await query.limit(500).get();
      const movements = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
      }));

      const totalIn = movements
        .filter((m: any) => m.type === 'in')
        .reduce((sum: number, m: any) => sum + m.quantity, 0);

      const totalOut = movements
        .filter((m: any) => m.type === 'out')
        .reduce((sum: number, m: any) => sum + m.quantity, 0);

      res.json({
        success: true,
        data: {
          period: {
            start: startDate ? new Date(startDate as string) : null,
            end: endDate ? new Date(endDate as string) : null,
          },
          totalIn,
          totalOut,
          movements,
        },
      } as ApiResponse);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      } as ApiResponse);
    }
  }
);

// Export report (Admin only)
router.get(
  '/export',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const { type } = req.query;

      // Here you would generate CSV/PDF/Excel
      // For now, just return JSON data

      res.json({
        success: true,
        message: `Relatório ${type} gerado`,
        data: {
          format: 'json',
          // Add export data here
        },
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
