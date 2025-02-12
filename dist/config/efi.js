"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEfiToken = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
// import { env } from 'process';
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const EFI_CLIENT_ID = process.env.EFI_CLIENT_ID || 'EFI_CLIENT_ID';
const EFI_CLIENT_SECRET = process.env.EFI_CLIENT_SECRET || 'EFI_CLIENT_SECRET';
const EFI_URL = process.env.EFI_URL || 'https://pix.api.efipay.com.br';
const EFI_CERTIFICATE_PATH = process.env.EFI_CERTIFICATE_PATH || '../../certificates/producao-699618-MeuChaDigital.p12';
const cert = fs_1.default.readFileSync(path_1.default.resolve(__dirname, EFI_CERTIFICATE_PATH));
const agent = new https_1.default.Agent({
    pfx: cert,
    passphrase: '',
});
const credentials = Buffer.from(`${EFI_CLIENT_ID}:${EFI_CLIENT_SECRET}`).toString('base64');
console.log(EFI_URL, EFI_CLIENT_ID, EFI_CLIENT_SECRET, EFI_CERTIFICATE_PATH);
let efiToken = '';
let tokenExpiration = 0;
const efiAuthorization = async (req, res) => {
    try {
        const response = await (0, axios_1.default)({
            method: 'post',
            url: `${EFI_URL}/oauth/token`,
            headers: {
                Authorization: `Basic ${credentials}`,
                'Content-Type': 'application/json',
            },
            httpsAgent: agent,
            data: {
                grant_type: 'client_credentials',
            },
        });
        efiToken = response.data.access_token;
        tokenExpiration = Date.now() + response.data.expires_in * 1000;
        console.log(response.data);
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error(error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: error.response?.data || 'Erro na requisição' });
    }
};
const getEfiToken = async () => {
    if (!efiToken || Date.now() >= tokenExpiration) {
        console.log('Token expirado ou não existe. Obtendo novo token...');
        await efiAuthorization({ body: {} }, { status: () => ({ json: () => { } }) });
    }
    return { token: efiToken, agent };
};
exports.getEfiToken = getEfiToken;
