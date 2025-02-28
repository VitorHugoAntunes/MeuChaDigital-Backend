import { Request, Response, NextFunction } from 'express';

export interface CustomRequest extends Request {
  subdomain?: string;
}

const getSubdomainMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  const hostname = req.hostname; // Exemplo: "listadofulano.meuchadigital.com" ou "localhost"
  const parts = hostname.split('.');

  if (parts.length >= 2) {
    req.subdomain = parts[0];
  } else {
    req.subdomain = undefined;
  }

  next();
};

export default getSubdomainMiddleware;
