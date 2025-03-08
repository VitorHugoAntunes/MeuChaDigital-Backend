import { Request, Response, NextFunction } from 'express';

export interface CustomRequest extends Request {
  subdomain?: string;
}

const getSubdomainMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  const hostname = req.hostname; // Exemplo: "listadofulano.meuchadigital.com" ou "api.meuchadigital.com"
  const parts = hostname.split('.');

  if (parts.length >= 2 && hostname !== 'api.meuchadigital.com') {
    req.subdomain = parts[0]; // Obtém o subdomínio real
  } else {
    req.subdomain = undefined; // Ignora se for "api.meuchadigital.com" ou o domínio principal
  }

  next();
};

export default getSubdomainMiddleware;

