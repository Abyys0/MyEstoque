import { Router } from 'express';
import * as productController from '../controllers/productController';

const router = Router();

// Listar produtos
router.get('/', productController.getProducts);

// Obter produto por ID
router.get('/:id', productController.getProduct);

// Criar novo produto
router.post('/', productController.createProduct);

// Atualizar produto
router.put('/:id', productController.updateProduct);

// Deletar produto
router.delete('/:id', productController.deleteProduct);

export default router;
