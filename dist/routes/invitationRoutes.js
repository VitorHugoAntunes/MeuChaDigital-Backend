"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invitationController_1 = require("../controllers/invitationController");
const router = (0, express_1.Router)();
// Rotas de invitation
router.get('/', invitationController_1.getInvitation); // listaexemplo.domain/
router.get('/gifts', invitationController_1.getGifts); // listaexemplo.domain/gifts
router.get('/gifts/:id', invitationController_1.getGift); // listaexemplo.domain/gifts/:id
exports.default = router;
