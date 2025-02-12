"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCharge = void 0;
const axios_1 = __importDefault(require("axios"));
const efi_1 = require("../config/efi");
const process_1 = require("process");
const EFI_URL = process_1.env.EFI_URL || 'https://pix-h.api.efipay.com.br';
const generateCharge = async (expiracao, original, chave, solicitacaoPagador) => {
    const credentials = await (0, efi_1.getEfiToken)();
    console.log(credentials);
    const chargeData = {
        calendario: {
            expiracao: expiracao,
        },
        valor: {
            original: original,
        },
        chave: chave,
        solicitacaoPagador: solicitacaoPagador,
    };
    const config = {
        httpsAgent: credentials.agent,
        headers: {
            Authorization: `Bearer ${credentials.token}`,
            'Content-Type': 'application/json',
        },
    };
    try {
        const response = await axios_1.default.post(`${EFI_URL}/v2/cob`, chargeData, config);
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error(error.response?.data || error.message);
            return { error: error.response?.data || 'Erro na requisição' };
        }
        else {
            console.error(error);
            return { error: 'Erro desconhecido' };
        }
    }
};
exports.generateCharge = generateCharge;
