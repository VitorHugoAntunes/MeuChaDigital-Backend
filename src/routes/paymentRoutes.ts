import { Router, Request, Response } from 'express';
import { getEfiToken } from '../config/efi';
import { createCharge, getCharge } from '../controllers/paymentController';

const router = Router();

router.post('/auth', async (req, res) => {
  try {
    const token = await getEfiToken();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get token' });
  }
});

router.post('/webhook(/pix)?', (req: Request, res: Response) => {
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

  } catch (error) {
    console.error("🔥 Erro ao processar o webhook:", error);

    // 🔴 Retorna erro interno para evitar falhas no processamento
    res.status(500).json({ error: "Erro interno ao processar o webhook." }); // No `return` here
  }
});

router.post('/charges', createCharge);

router.get('/charges/:id', getCharge);

export default router;
