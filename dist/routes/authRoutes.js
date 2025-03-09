"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: '/auth/failure',
    passReqToCallback: true,
    authInfo: true,
}), (req, res) => {
    if (req.user) {
        res.cookie('user', JSON.stringify(req.user), {
            domain: '.localhost',
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });
    }
    res.redirect('http://localhost:3000/lists');
});
router.get('/user', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    res.json(req.user);
});
router.get('/auth/failure', (_req, res) => {
    res.send('Authentication failed');
});
router.get('/logout', (req, res) => {
    res.clearCookie('session', { domain: 'localhost', path: '/' });
    res.clearCookie('session.sig', { domain: 'localhost', path: '/' });
    res.clearCookie('user', { domain: 'localhost', path: '/' });
    req.session = {};
    res.status(200).send({ message: "Logout realizado com sucesso" });
});
exports.default = router;
