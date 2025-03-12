import express from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import giftRoutes from './giftRoutes';
import paymentRoutes from './paymentRoutes';
import inviteeRoutes from './inviteeRoutes';
import invitationRoutes from './invitationRoutes';
import pixKeyRoutes from './pixKeyRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/lists', giftRoutes);
router.use('/payments', paymentRoutes);
router.use('/invitees', inviteeRoutes);
router.use('/invitation', invitationRoutes);
router.use('/pix-keys', pixKeyRoutes);

export default router;