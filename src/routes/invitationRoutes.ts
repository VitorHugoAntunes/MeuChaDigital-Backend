import { Router } from 'express';
import {
  getInvitation,
  getGifts,
  getGift,
} from '../controllers/invitationController';

const router = Router();

// Rotas de invitation
router.get('/', getInvitation); // listaexemplo.domain/
router.get('/gifts', getGifts); // listaexemplo.domain/gifts
router.get('/gifts/:id', getGift); // listaexemplo.domain/gifts/:id

export default router;