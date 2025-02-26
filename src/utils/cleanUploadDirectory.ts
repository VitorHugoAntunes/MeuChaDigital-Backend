import fs from 'fs';

export const cleanUploadDirectory = (userId: string) => {
  if (!userId) {
    throw new Error('O ID do usuário é obrigatório para limpar o diretório de uploads.');
  }

  const uploadPath = `uploads/${userId}`;
  if (fs.existsSync(uploadPath)) {
    fs.rmdirSync(uploadPath, { recursive: true });
  }
};