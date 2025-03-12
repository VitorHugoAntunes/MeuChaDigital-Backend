import { Router } from 'express';
import {
  createGift,
  getGiftById,
  getAllGifts,
  getAllGiftsByGiftListSlug,
  getGiftByGiftListSlug,
  updateGift,
  deleteGift
} from '../controllers/giftController';

import {
  createGiftList,
  getGiftListById,
  getAllGiftLists,
  getGiftListBySlug,
  updateGiftList,
  deleteGiftList,
  getAllGiftListsByUserId,
} from '../controllers/giftListController';

import { uploadMiddleware, validateUploadedFilesForGiftList, validateUploadedFilesForGift } from '../middlewares/validateUploadFilesMiddleware';

const router = Router();

// GiftList routes
router.get('/', getAllGiftLists);
router.get('/:id', getGiftListById);
router.get('/slug/:slug', getGiftListBySlug);
router.get('/user/:userId', getAllGiftListsByUserId);
router.post('/', uploadMiddleware, validateUploadedFilesForGiftList, createGiftList);
router.put('/:id', uploadMiddleware, validateUploadedFilesForGiftList, updateGiftList);
router.delete('/:id', deleteGiftList);

// Gift routes
router.get('/:id/gifts', getAllGifts);
router.get('/slug/:slug/gifts', getAllGiftsByGiftListSlug);
router.get('/:id/gifts/:giftId', getGiftById);
router.get('/slug/:slug/gifts/:giftId', getGiftByGiftListSlug);
router.post('/:id/gifts', uploadMiddleware, validateUploadedFilesForGift, createGift);
router.put('/:id/gifts/:giftId', uploadMiddleware, validateUploadedFilesForGift, updateGift);
router.delete('/:id/gifts/:giftId', deleteGift);

export default router;