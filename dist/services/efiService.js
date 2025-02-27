"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const efi_1 = require("../config/efi");
const process_1 = require("process");
const EFI_URL = process_1.env.EFI_URL || 'https://pix.api.efipay.com.br';
const efiRequest = async (endpoint, method, data) => {
    const credentials = await (0, efi_1.getEfiToken)();
    const config = {
        httpsAgent: credentials.agent,
        headers: {
            Authorization: `Bearer ${credentials.token}`,
            'Content-Type': 'application/json',
        },
    };
    const url = `${EFI_URL}${endpoint}`;
    try {
        const response = method === 'GET'
            ? await axios_1.default.get(url, config)
            : await axios_1.default.post(url, data, config);
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error('Erro na requisição à EFI:', error.response?.data || error.message);
            throw new Error(error.response?.data || 'Erro na requisição à EFI');
        }
        else {
            console.error('Erro desconhecido:', error);
            throw new Error('Erro desconhecido');
        }
    }
};
const getChargeByTxId = async (txId) => {
    return efiRequest(`/v2/cob/${txId}`, 'GET');
};
const generatePixCharge = async (data) => {
    return efiRequest('/v2/cob', 'POST', data);
};
const getPixQrCode = async (locId) => {
    return efiRequest(`/v2/loc/${locId}/qrcode`, 'GET');
};
exports.default = {
    efiRequest,
    getChargeByTxId,
    generatePixCharge,
    getPixQrCode,
};
