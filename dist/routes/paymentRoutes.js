"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const efi_1 = require("../config/efi");
const paymentController_1 = require("../controllers/paymentController");
const router = (0, express_1.Router)();
router.post('/auth', async (req, res) => {
    try {
        const token = await (0, efi_1.getEfiToken)();
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get token' });
    }
});
router.post('/webhook(/pix)?', (req, res) => {
    try {
        console.log("🔹 Webhook recebido!");
        // 🔍 Verificando os headers da requisição
        console.log("🔹 Headers:", req.headers);
        // 📦 Verificando se há corpo na requisição
        if (!req.body || Object.keys(req.body).length === 0) {
            console.error("❌ Erro: Corpo da requisição vazio!");
            res.status(400).json({ error: "Corpo da requisição vazio." }); // No `return` here
            return; // Use `return` to stop execution
        }
        console.log("🔹 Payload recebido:", JSON.stringify(req.body, null, 2));
        // 🟢 Responde com sucesso
        res.sendStatus(200); // No `return` here
    }
    catch (error) {
        console.error("🔥 Erro ao processar o webhook:", error);
        // 🔴 Retorna erro interno para evitar falhas no processamento
        res.status(500).json({ error: "Erro interno ao processar o webhook." }); // No `return` here
    }
});
router.post('/charges', paymentController_1.createCharge);
router.get('/charges/:id', paymentController_1.getCharge);
exports.default = router;
