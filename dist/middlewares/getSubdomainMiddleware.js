"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getSubdomainMiddleware = (req, res, next) => {
    const hostname = req.hostname; // Exemplo: "listadofulano.meuchadigital.com" ou "api.meuchadigital.com"
    const parts = hostname.split('.');
    if (parts.length >= 2 && hostname !== 'api.meuchadigital.com') {
        req.subdomain = parts[0]; // Obtém o subdomínio real
    }
    else {
        req.subdomain = undefined; // Ignora se for "api.meuchadigital.com" ou o domínio principal
    }
    next();
};
exports.default = getSubdomainMiddleware;
