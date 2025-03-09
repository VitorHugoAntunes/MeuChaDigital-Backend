import { Router } from 'express';

import {
  createInvitee,
  getAllInviteesByGiftListSlug
} from '../controllers/inviteeController';

const router = Router();

router.post('/', createInvitee);
router.get('/:slug', getAllInviteesByGiftListSlug);

export default router;