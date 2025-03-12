import { Router } from 'express';

import {
  createPixKey,
  getAllPixKeysByUser,
  updatePixKey,
  deletePixKey
} from '../controllers/pixKeyController';

const router = Router();

router.post('/', createPixKey);

router.get('/user/:userId', getAllPixKeysByUser);

router.put('/:id', updatePixKey);

router.delete('/:id', deletePixKey);

export default router;