import { Request, Response } from 'express';
import { ApiResponse } from '../types';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Rota não encontrada: ${req.originalUrl}`,
  } as ApiResponse);
};
