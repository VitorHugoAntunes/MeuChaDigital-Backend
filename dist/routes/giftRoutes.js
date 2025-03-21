"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const giftController_1 = require("../controllers/giftController");
const giftListController_1 = require("../controllers/giftListController");
const validateUploadFilesMiddleware_1 = require("../middlewares/validateUploadFilesMiddleware");
const router = (0, express_1.Router)();
// GiftList routes
router.get('/', giftListController_1.getAllGiftLists);
// router.get('/:id', getGiftListById);
router.get('/slug/:slug', giftListController_1.getGiftListBySlug);
router.get('/user/:userId', giftListController_1.getAllGiftListsByUserId);
router.post('/', validateUploadFilesMiddleware_1.uploadMiddleware, validateUploadFilesMiddleware_1.validateUploadedFilesForGiftList, giftListController_1.createGiftList);
router.put('/:id', validateUploadFilesMiddleware_1.uploadMiddleware, validateUploadFilesMiddleware_1.validateUploadedFilesForGiftList, giftListController_1.updateGiftList);
router.delete('/:id', giftListController_1.deleteGiftList);
// Gift routes
router.get('/:id/gifts', giftController_1.getAllGifts);
router.get('/slug/:slug/gifts', giftController_1.getAllGiftsByGiftListSlug);
router.get('/:id/gifts/:giftId', giftController_1.getGiftById);
router.get('/slug/:slug/gifts/:giftId', giftController_1.getGiftByGiftListSlug);
router.post('/:id/gifts', validateUploadFilesMiddleware_1.uploadMiddleware, validateUploadFilesMiddleware_1.validateUploadedFilesForGift, giftController_1.createGift);
router.put('/:id/gifts/:giftId', validateUploadFilesMiddleware_1.uploadMiddleware, validateUploadFilesMiddleware_1.validateUploadedFilesForGift, giftController_1.updateGift);
router.delete('/:id/gifts/:giftId', giftController_1.deleteGift);
exports.default = router;
