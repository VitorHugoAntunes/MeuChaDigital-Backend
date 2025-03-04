"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGiftByIdFromSubdomain = exports.getAllGiftsBySubdomain = exports.getGiftListBySubdomain = void 0;
const giftListRepository_1 = require("../repositories/giftListRepository");
const giftRepository_1 = require("../repositories/giftRepository");
const getGiftListBySubdomain = async (subdomain) => {
    return await (0, giftListRepository_1.getGiftListBySlugInDatabase)(subdomain);
};
exports.getGiftListBySubdomain = getGiftListBySubdomain;
const getAllGiftsBySubdomain = async (subdomain) => {
    const gifts = await (0, giftRepository_1.getAllGiftsByGiftListSlugFromDatabase)(subdomain);
    return gifts;
};
exports.getAllGiftsBySubdomain = getAllGiftsBySubdomain;
const getGiftByIdFromSubdomain = async (subdomain, giftId) => {
    const gift = await (0, giftRepository_1.getGiftByGiftListSlugFromDatabase)(subdomain, giftId);
    return gift;
};
exports.getGiftByIdFromSubdomain = getGiftByIdFromSubdomain;
