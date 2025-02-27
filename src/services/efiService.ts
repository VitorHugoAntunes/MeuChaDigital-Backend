
import axios from 'axios';
import { getEfiToken } from '../config/efi';
import { env } from 'process';

const EFI_URL = env.EFI_URL || 'https://pix.api.efipay.com.br';

const efiRequest = async (endpoint: string, method: 'GET' | 'POST', data?: any) => {
  const credentials = await getEfiToken();

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
      ? await axios.get(url, config)
      : await axios.post(url, data, config);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Erro na requisição à EFI:', error.response?.data || error.message);
      throw new Error(error.response?.data || 'Erro na requisição à EFI');
    } else {
      console.error('Erro desconhecido:', error);
      throw new Error('Erro desconhecido');
    }
  }
};

const getChargeByTxId = async (txId: string) => {
  return efiRequest(`/v2/cob/${txId}`, 'GET');
};

const generatePixCharge = async (data: any) => {
  return efiRequest('/v2/cob', 'POST', data);
};

const getPixQrCode = async (locId: string) => {
  return efiRequest(`/v2/loc/${locId}/qrcode`, 'GET');
};

export default {
  efiRequest,
  getChargeByTxId,
  generatePixCharge,
  getPixQrCode,
};