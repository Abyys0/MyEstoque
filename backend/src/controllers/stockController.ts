import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Mock data
const transactions: any[] = [];
const products: any[] = [];

export const scanBarcode = async (req: Request, res: Response) => {
  try {
    const { barcode, action, quantity, notes } = req.body;

    // Validar entrada
    if (!barcode || !action || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos',
      });
    }

    // Buscar produto pelo código de barras
    let product = products.find((p) => p.barcode === barcode);

    // Se não encontrar, criar novo produto
    if (!product) {
      product = {
        id: uuidv4(),
        barcode,
        name: `Produto ${barcode}`,
        quantity: 0,
        price: 0,
      };
      products.push(product);
    }

    const quantityBefore = product.quantity;

    // Atualizar quantidade baseado na ação
    if (action === 'in') {
      product.quantity += quantity;
    } else if (action === 'out') {
      product.quantity -= quantity;
    } else if (action === 'adjust') {
      product.quantity = quantity;
    }

    // Registrar transação
    const transaction = {
      id: uuidv4(),
      productId: product.id,
      barcode,
      productName: product.name,
      quantityBefore,
      quantityAfter: product.quantity,
      action,
      notes,
      timestamp: new Date(),
    };

    transactions.push(transaction);

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao processar código de barras',
    });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const { productId, limit = 20 } = req.query;

    let history = transactions;

    if (productId) {
      history = history.filter((t) => t.productId === productId);
    }

    const limited = history.slice(-parseInt(limit as string));

    res.json({
      success: true,
      data: limited,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter histórico',
    });
  }
};

export const getReport = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;

    let filteredTransactions = transactions;

    if (from || to) {
      filteredTransactions = transactions.filter((t) => {
        const date = new Date(t.timestamp);
        if (from && date < new Date(from as string)) return false;
        if (to && date > new Date(to as string)) return false;
        return true;
      });
    }

    const totalValue = products.reduce(
      (sum, p) => sum + p.quantity * p.price,
      0
    );

    const movementsByAction = {
      in: filteredTransactions.filter((t) => t.action === 'in').length,
      out: filteredTransactions.filter((t) => t.action === 'out').length,
      adjust: filteredTransactions.filter((t) => t.action === 'adjust').length,
    };

    res.json({
      success: true,
      data: {
        totalProducts: products.length,
        totalValue,
        movementsByAction,
        products: products.map((p) => ({
          id: p.id,
          name: p.name,
          quantity: p.quantity,
          value: p.quantity * p.price,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar relatório',
    });
  }
};
