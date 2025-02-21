"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inviteeController_1 = require("../controllers/inviteeController");
const router = (0, express_1.Router)();
router.post('/', inviteeController_1.createInvitee);
exports.default = router;
