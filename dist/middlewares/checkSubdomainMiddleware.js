"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkSubdomainMiddleware = (req, res, next) => {
    if (req.subdomain && !req.path.startsWith('/invitation')) {
        return res.status(404).json({ error: 'Not Found' });
    }
    next();
};
exports.default = checkSubdomainMiddleware;
