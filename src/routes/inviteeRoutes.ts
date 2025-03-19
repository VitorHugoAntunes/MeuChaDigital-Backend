import { Router } from 'express';

import {
  createInvitee,
  getAllInviteesWithPaginationByGiftListSlug,
  getAllInviteesByGiftListSlug,
  updateInvitee,
  deleteInvitee
} from '../controllers/inviteeController';

const router = Router();

router.post('/', createInvitee);
router.get('/:slug', getAllInviteesWithPaginationByGiftListSlug);
router.get('/:slug/all', getAllInviteesByGiftListSlug);
router.put('/:slug/:id', updateInvitee);
router.delete('/:slug/:id', deleteInvitee);

export default router;