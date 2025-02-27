"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContribution = void 0;
const contributionService_1 = __importDefault(require("../services/contributionService"));
const createContribution = async (req, res) => {
    try {
        const { txid: txId, valor: value, infoPagador: message } = req.body.pix[0];
        const formattedValue = Number(value);
        const contribution = await contributionService_1.default.createContributionService({ value: formattedValue, message, txId });
        console.log('Passou pelo controller de contribuição');
        res.status(201).json(contribution);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro ao criar contribuição: ' + error.message });
    }
};
exports.createContribution = createContribution;
