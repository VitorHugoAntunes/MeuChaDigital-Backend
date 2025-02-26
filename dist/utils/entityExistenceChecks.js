"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGiftExists = exports.validateGiftListExists = void 0;
const giftRepository_1 = require("../repositories/giftRepository");
const giftListRepository_1 = require("../repositories/giftListRepository");
const validateGiftListExists = async (id) => {
    const existingGiftList = await (0, giftListRepository_1.getGiftListByIdInDatabase)(id);
    if (!existingGiftList) {
        throw new Error("Lista de presentes não encontrada.");
    }
    return existingGiftList;
};
exports.validateGiftListExists = validateGiftListExists;
const validateGiftExists = async (id) => {
    const existingGift = await (0, giftRepository_1.getGiftByIdFromDatabase)(id);
    if (!existingGift) {
        throw new Error("Presente não encontrado.");
    }
    return existingGift;
};
exports.validateGiftExists = validateGiftExists;
