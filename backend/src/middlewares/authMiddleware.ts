import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import { ApiResponse, UserRole } from '../types';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email: string;
    role: UserRole;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Token de autenticação não fornecido',
      } as ApiResponse);
      return;
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      role: (decodedToken.role as UserRole) || UserRole.VIEWER,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado',
    } as ApiResponse);
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Usuário não autenticado',
      } as ApiResponse);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Permissão negada',
      } as ApiResponse);
      return;
    }

    next();
  };
};
