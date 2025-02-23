"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const giftController_1 = require("../controllers/giftController");
const imageUploadService_1 = require("../services/imageUploadService");
const router = (0, express_1.Router)();
const uploadMiddleware = imageUploadService_1.upload.fields([
    { name: 'banner', maxCount: 1 }, // banner (upload único)
    { name: 'moments_images', maxCount: 10 }, // imagens de momentos (upload múltiplo)
]);
// GiftList routes
router.get('/', giftController_1.getAllGiftLists);
router.get('/:id', giftController_1.getGiftListById);
router.post('/', uploadMiddleware, imageUploadService_1.validateUploadedFiles, giftController_1.createGiftList);
router.put('/:id', giftController_1.updateGiftList);
router.delete('/:id', giftController_1.deleteGiftList);
// Gift routes
router.post('/:id/gifts', giftController_1.createGift);
router.get('/:id/gifts', giftController_1.getAllGifts);
router.get('/:id/gifts/:giftId', giftController_1.getGiftById);
router.put('/:id/gifts/:giftId', giftController_1.updateGift);
router.delete('/:id/gifts/:giftId', giftController_1.deleteGift);
exports.default = router;
