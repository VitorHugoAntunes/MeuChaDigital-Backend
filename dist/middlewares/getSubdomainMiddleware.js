"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getSubdomainMiddleware = (req, res, next) => {
    const hostname = req.hostname; // Exemplo: "listadofulano.meuchadigital.com" ou "localhost"
    const parts = hostname.split('.');
    if (parts.length >= 2) {
        req.subdomain = parts[0];
    }
    else {
        req.subdomain = undefined;
    }
    next();
};
exports.default = getSubdomainMiddleware;
