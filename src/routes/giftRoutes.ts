import { Router } from 'express';
import {
  createGiftList,
  getGiftListById,
  getAllGiftLists,
  updateGiftList,
  deleteGiftList,
  createGift,
  getGiftById,
  getAllGifts,
  updateGift,
  deleteGift
} from '../controllers/giftController';
import { upload, validateUploadedFiles } from '../services/imageUploadService';

const router = Router();

const uploadMiddleware = upload.fields([
  { name: 'banner', maxCount: 1 }, // banner (upload único)
  { name: 'moments_images', maxCount: 10 }, // imagens de momentos (upload múltiplo)
]);

// GiftList routes
router.get('/', getAllGiftLists);
router.get('/:id', getGiftListById);
router.post('/', uploadMiddleware, validateUploadedFiles, createGiftList);
router.put('/:id', updateGiftList);
router.delete('/:id', deleteGiftList);

// Gift routes
router.post('/:id/gifts', createGift);
router.get('/:id/gifts', getAllGifts);
router.get('/:id/gifts/:giftId', getGiftById);
router.put('/:id/gifts/:giftId', updateGift);
router.delete('/:id/gifts/:giftId', deleteGift);

export default router;