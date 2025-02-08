import axios from 'axios';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { env } from 'process';

const EFI_CLIENT_ID = env.EFI_CLIENT_ID || 'EFI_CLIENT_ID';
const EFI_CLIENT_SECRET = env.EFI_CLIENT_SECRET || 'EFI_CLIENT_SECRET';
const EFI_URL = env.EFI_URL || 'https://pix-h.api.efipay.com.br';
const EFI_CERTIFICATE_PATH = env.EFI_CERTIFICATE_PATH || '../../certificates/homologacao-699618-MeuChaDigital.p12';

const cert = fs.readFileSync(path.resolve(__dirname, EFI_CERTIFICATE_PATH));

const agent = new https.Agent({
  pfx: cert,
  passphrase: '',
});

const credentials = Buffer.from(
  `${EFI_CLIENT_ID}:${EFI_CLIENT_SECRET}`
).toString('base64');

console.log(EFI_URL, EFI_CLIENT_ID, EFI_CLIENT_SECRET, EFI_CERTIFICATE_PATH);

let efiToken: string = '';
let tokenExpiration: number = 0;

const efiAuthorization = async (req: any, res: any) => {
  try {
    const response = await axios({
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
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: error.response?.data || 'Erro na requisição' });
  }
};

export const getEfiToken = async () => {
  if (!efiToken || Date.now() >= tokenExpiration) {
    console.log('Token expirado ou não existe. Obtendo novo token...');
    await efiAuthorization({ body: {} }, { status: () => ({ json: () => { } }) });
  }

  return { token: efiToken, agent };
};