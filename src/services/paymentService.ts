import { ChargeCreate, PaymentCreate } from '../models/paymentModel';
import UserService from '../services/userService';
import { createChargeInDatabase, createPaymentInDatabase } from '../repositories/paymentRepository';
import EFIService from '../services/efiService';

const generateChargeService = async (
  expiracao: number,
  original: string,
  chave: string,
  solicitacaoPagador: string,
  giftId: string,
  payerId?: string,
  isGuest?: boolean,
) => {
  try {
    // Cria um usuário convidado, se necessário
    if (isGuest && !payerId) {
      const user = await UserService.createGuestUser({ isGuest: true });
      payerId = user.id;
    } else if (!payerId) {
      throw new Error('PayerId não informado');
    }

    const chargeData = {
      calendario: { expiracao },
      valor: { original },
      chave,
      solicitacaoPagador,
    };

    const cobResponse = await EFIService.generatePixCharge(chargeData);

    const qrCodeResponse = await EFIService.getPixQrCode(cobResponse.loc.id);

    const charge: ChargeCreate = {
      localId: String(cobResponse.loc.id),
      txId: cobResponse.txid,
      giftId,
      payerId,
      value: Number(cobResponse.valor.original),
      paymentMethod: 'PIX',
      pixKey: cobResponse.chave,
      pixCopyAndPaste: cobResponse.pixCopiaECola,
      qrCode: qrCodeResponse.imagemQrcode,
      generatedAt: new Date(cobResponse.calendario.criacao),
      expirationDate: new Date(new Date().getTime() + cobResponse.calendario.expiracao * 1000),
    };

    await createChargeInDatabase(charge);

    return cobResponse;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao gerar cobrança');
  }
};

const createPaymentService = async (data: PaymentCreate) => {
  return createPaymentInDatabase(data);
};

export default { generateChargeService, createPaymentService };