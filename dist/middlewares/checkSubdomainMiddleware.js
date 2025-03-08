"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkSubdomainMiddleware = (req, res, next) => {
    if (req.subdomain && req.subdomain !== 'api' && !req.path.startsWith('/api/v1/invitation')) {
        return res.status(404).json({ error: 'Not Found' });
    }
    next();
};
exports.default = checkSubdomainMiddleware;
