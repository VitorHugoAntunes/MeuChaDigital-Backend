import { Router } from 'express';
import { getEfiToken } from '../config/efi';
import { createCharge } from '../controllers/paymentController';

const router = Router();

router.post('/auth', async (req, res) => {
  try {
    const token = await getEfiToken();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get token' });
  }
});

router.post('/charge', createCharge);

export default router;
