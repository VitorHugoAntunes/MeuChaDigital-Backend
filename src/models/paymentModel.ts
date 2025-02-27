import { PaymentStatus } from "@prisma/client"

export interface ChargeCreate {
  localId: string,
  txId: string,
  giftId: string,
  payerId: string,
  value: number
  paymentMethod: string,
  pixKey: string
  pixCopyAndPaste: string,
  qrCode: string,
  generatedAt: Date,
  expirationDate: Date,
  paymentDate?: Date,
}

export interface PaymentCreate {
  status: PaymentStatus,
  paymentMethod: string,
  pixKey: string,
  paymentDate: Date,
  contributionId: string,
}
