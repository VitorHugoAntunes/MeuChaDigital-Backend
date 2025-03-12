import crypto from 'crypto';

export const encryptPixKey = (key: string) => {
  const iv = crypto.randomBytes(16);

  if (!process.env.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY is not defined');
  }

  const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  console.log(encryptionKey.length); // Deve ser 32
  if (encryptionKey.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 bytes');
  }

  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
  let encrypted = cipher.update(key, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return { encryptedKey: encrypted, iv: iv.toString('hex') };
};

export const decryptPixKey = (encryptedKey: string, iv: string) => {
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY is not defined');
  }

  const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  if (encryptionKey.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 bytes');
  }

  const ivBuffer = Buffer.from(iv, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, ivBuffer);

  let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

const key = crypto.randomBytes(32).toString('hex');
