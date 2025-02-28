import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from './getSubdomainMiddleware'; // Importe a interface CustomRequest

const checkSubdomainMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.subdomain && !req.path.startsWith('/invitation')) {
    return res.status(404).json({ error: 'Not Found' }) as any;
  }

  next();
};

export default checkSubdomainMiddleware;