"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }), (req, res) => {
    if (req.user) {
        res.cookie("user", req.user, { httpOnly: true, secure: false });
    }
});
router.get('/google/callback', passport_1.default.authenticate('google', {
    successRedirect: 'http://localhost:3000/lists',
    failureRedirect: '/auth/failure',
    passReqToCallback: true,
    authInfo: true,
}));
router.get("/user", (req, res) => {
    if (!req.user) {
        res.status(401).json({ error: "Usuário não autenticado" });
    }
    res.json(req.user);
});
router.get('/auth/failure', (_req, res) => {
    res.send('Authentication failed');
});
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err)
            return next(err);
        req.session.destroy(() => {
            res.send(`
        <h1>Logout efetuado</h1>
        <a href="/">Voltar para o inicio</a>
        `);
        });
    });
});
exports.default = router;
