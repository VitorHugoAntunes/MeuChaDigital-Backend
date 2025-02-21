import axios from 'axios';
import { getEfiToken } from '../config/efi';
import { env } from 'process';

import { PaymentStatus, PrismaClient } from '@prisma/client';
import { ChargeCreate, PaymentCreate } from '../models/paymentModel';
import UserService from '../services/userService';

const prisma = new PrismaClient();

const EFI_URL = env.EFI_URL || 'https://pix.api.efipay.com.br';

const generateCharge = async (
  expiracao: number,
  original: string,
  chave: string,
  solicitacaoPagador: string,
  giftId: string,
  payerId?: string,
  isGuest?: boolean,
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
    if (isGuest && !payerId) {
      const user = await UserService.createGuestUser({ isGuest: true });
      payerId = user.id;
    } else if (!payerId) {
      return { error: 'PayerId não informado' };
    }

    const response = await axios.post(`${EFI_URL}/v2/cob`, chargeData, config);

    console.log(response.data);

    const qrCode = await axios.get(`${EFI_URL}/v2/loc/${response.data.loc.id}/qrcode`, config);

    const charge: ChargeCreate = {
      localId: String(response.data.loc.id), // Pois vem da EFI como number
      txId: response.data.txid,
      giftId: giftId,
      payerId: payerId,
      value: Number(response.data.valor.original), // Pois vem da EFI como string
      paymentMethod: 'PIX',
      pixKey: response.data.chave,
      pixCopyAndPaste: response.data.pixCopiaECola,
      qrCode: qrCode.data.imagemQrcode,
      generatedAt: new Date(response.data.calendario.criacao),
      // a expiracao vem em formato de segundos, exemplo: 3600 que da 1 hora
      expirationDate: new Date(new Date().getTime() + (response.data.calendario.expiracao * 1000)),
    };

    try {
      await prisma.charge.create({
        data: {
          ...charge,
          giftId: giftId,
	  payerId: payerId,
        },
      });
    } catch (error) {
      console.error(error);

      return { error: 'Erro ao salvar cobrança no banco de dados' };
    }

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

const createPayment = async (data: PaymentCreate) => {

  const payment = await prisma.payment.create({
    data: {
      status: data.status as PaymentStatus,
      paymentMethod: data.paymentMethod,
      pixKey: data.pixKey,
      paymentDate: data.paymentDate,
      contribution: {
        connect: {
          id: data.contributionId,
        },
      },
    },
  });

  return payment;
}

export default { generateCharge, createPayment };
