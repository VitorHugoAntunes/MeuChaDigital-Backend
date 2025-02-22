"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInvitee = void 0;
const inviteeService_1 = __importDefault(require("../services/inviteeService"));
const inviteeValidator_1 = require("../validators/inviteeValidator");
const zod_1 = require("zod");
const createInvitee = async (req, res) => {
    try {
        const { name, phone, email, additionalInvitees, observation, giftListId, status } = inviteeValidator_1.createInviteeSchema.parse(req.body);
        const invitee = await inviteeService_1.default.createInvitee({ name, phone, email, additionalInvitees, observation, giftListId, status });
        res.status(201).json(invitee);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: 'Erro de validação', details: error.errors });
        }
        else {
            res.status(500).json({ error: 'Erro ao criar convidado: ' + error.message });
        }
    }
};
exports.createInvitee = createInvitee;
