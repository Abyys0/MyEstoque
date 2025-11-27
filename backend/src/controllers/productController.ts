import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Mock data - em produção seria no banco de dados
const products: any[] = [];

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Aqui iria a query no banco de dados
    const data = products.slice(skip, skip + limit);

    res.json({
      success: true,
      data,
      pagination: {
        page,
        total: products.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao listar produtos',
    });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter produto',
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { barcode, name, quantity, price, category } = req.body;

    const newProduct = {
      id: uuidv4(),
      barcode,
      name,
      quantity: quantity || 0,
      price,
      category,
      createdAt: new Date(),
    };

    products.push(newProduct);

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar produto',
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado',
      });
    }

    products[productIndex] = {
      ...products[productIndex],
      ...updateData,
      updatedAt: new Date(),
    };

    res.json({
      success: true,
      data: products[productIndex],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar produto',
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado',
      });
    }

    products.splice(productIndex, 1);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar produto',
    });
  }
};
