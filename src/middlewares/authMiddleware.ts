import { Request, Response, NextFunction } from 'express';

export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  req.user ? next() : res.status(401).json({
    error: "Usuário não autenticado"
  });
}