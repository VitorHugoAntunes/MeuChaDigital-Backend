import axios from 'axios';
import { getEfiToken } from '../config/efi';
import { env } from 'process';

const EFI_URL = env.EFI_URL || 'https://pix-h.api.efipay.com.br';

const generateCharge = async (
  expiracao: number,
  original: string,
  chave: string,
  solicitacaoPagador: string
) => {
  const credentials = await getEfiToken();

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
    const response = await axios.post(`${EFI_URL}/v2/cob`, chargeData, config);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data || error.message);
      return { error: error.response?.data || 'Erro na requisição' };
    } else {
      console.error(error);
      return { error: 'Erro desconhecido' };
    }
  }
};

export { generateCharge };