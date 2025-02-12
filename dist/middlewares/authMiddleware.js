"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = isLoggedIn;
function isLoggedIn(req, res, next) {
    req.user ? next() : res.status(401).json({
        error: "Usuário não autenticado"
    });
}
