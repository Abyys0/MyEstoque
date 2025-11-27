import { Router } from 'express';
import * as stockController from '../controllers/stockController';

const router = Router();

// Registrar leitura de código de barras
router.post('/scan', stockController.scanBarcode);

// Obter histórico de transações
router.get('/history', stockController.getHistory);

// Gerar relatório de estoque
router.get('/report', stockController.getReport);

export default router;
