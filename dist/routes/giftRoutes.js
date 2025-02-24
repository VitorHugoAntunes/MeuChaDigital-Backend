"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const giftController_1 = require("../controllers/giftController");
const validateUploadFilesMiddelware_1 = require("../middlewares/validateUploadFilesMiddelware");
const router = (0, express_1.Router)();
// GiftList routes
router.get('/', giftController_1.getAllGiftLists);
router.get('/:id', giftController_1.getGiftListById);
router.post('/', validateUploadFilesMiddelware_1.uploadMiddleware, validateUploadFilesMiddelware_1.validateUploadedFilesForGiftList, giftController_1.createGiftList);
router.put('/:id', giftController_1.updateGiftList);
router.delete('/:id', giftController_1.deleteGiftList);
// Gift routes
router.post('/:id/gifts', validateUploadFilesMiddelware_1.uploadMiddleware, validateUploadFilesMiddelware_1.validateUploadedFilesForGift, giftController_1.createGift);
router.get('/:id/gifts', giftController_1.getAllGifts);
router.get('/:id/gifts/:giftId', giftController_1.getGiftById);
router.put('/:id/gifts/:giftId', giftController_1.updateGift);
router.delete('/:id/gifts/:giftId', giftController_1.deleteGift);
exports.default = router;
