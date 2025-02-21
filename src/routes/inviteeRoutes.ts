import { Router } from 'express';

import {
  createInvitee,
} from '../controllers/inviteeController';

const router = Router();

router.post('/', createInvitee);

export default router;