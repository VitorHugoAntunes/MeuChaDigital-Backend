import { Router } from 'express';
import {
  createGift,
  getGiftById,
  getAllGifts,
  updateGift,
  deleteGift
} from '../controllers/giftController';

import {
  createGiftList,
  getGiftListById,
  getAllGiftLists,
  updateGiftList,
  deleteGiftList,
} from '../controllers/giftListController';

import { uploadMiddleware, validateUploadedFilesForGiftList, validateUploadedFilesForGift } from '../middlewares/validateUploadFilesMiddleware';

const router = Router();

router.get('/', getAllGiftLists);
router.get('/:id', getGiftListById);
router.post('/', uploadMiddleware, validateUploadedFilesForGiftList, createGiftList);
router.put('/:id', uploadMiddleware, validateUploadedFilesForGiftList, updateGiftList);
router.delete('/:id', deleteGiftList);

router.get('/:id/gifts', getAllGifts);
router.get('/:id/gifts/:giftId', getGiftById);
router.post('/:id/gifts', uploadMiddleware, validateUploadedFilesForGift, createGift);
router.put('/:id/gifts/:giftId', uploadMiddleware, validateUploadedFilesForGift, updateGift);
router.delete('/:id/gifts/:giftId', deleteGift);

export default router;