import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');
  try {
    // Criar uma imagem para o usuário
    const userImage = await prisma.image.create({
      data: { url: 'https://example.com/user-image.jpg', type: 'AVATAR' },
    });

    // Criar um usuário
    const user = await prisma.user.create({
      data: {
        googleId: '123456789',
        name: 'João Silva',
        email: 'joao.silva@example.com',
        isGuest: false,
        photoId: userImage.id,
      },
    });

    // Atualizar imagem do usuário
    await prisma.image.update({
      where: { id: userImage.id },
      data: { userId: user.id },
    });

    // Criar uma categoria
    const category = await prisma.category.create({
      data: { name: 'Eletrônicos', description: 'Produtos eletrônicos em geral' },
    });

    const giftList = await prisma.giftList.create({
      data: {
        name: 'Lista de Casamento',
        slug: 'lista-casamento-joao-maria',
        type: 'WEDDING',
        eventDate: new Date('2023-12-25'),
        description: 'Lista de presentes para o casamento de João e Maria',
        userId: user.id,
        shareableLink: 'https://example.com/lista-casamento-joao-maria',
        status: 'ACTIVE',
      },
    });

    // Criar e associar o banner
    const bannerImage = await prisma.image.create({
      data: {
        url: 'https://example.com/banner.jpg',
        type: 'BANNER',
        bannerForGiftListId: giftList.id, // Associa o banner ao GiftList
      },
    });

    // Atualizar a lista de presentes com o bannerId
    await prisma.giftList.update({
      where: { id: giftList.id },
      data: { bannerId: bannerImage.id },
    });

    // Criar e associar as imagens dos momentos
    const momentsImages = await Promise.all(
      ['https://example.com/moment1.jpg', 'https://example.com/moment2.jpg', 'https://example.com/moment3.jpg'].map((url) =>
        prisma.image.create({
          data: {
            url,
            type: 'MOMENT',
            momentsForGiftListId: giftList.id, // Associa as imagens ao GiftList
          },
        })
      )
    );

    // Atualizar a lista de presentes com as imagens dos momentos
    await prisma.giftList.update({
      where: { id: giftList.id },
      data: {
        momentsImages: {
          connect: momentsImages.map((img) => ({ id: img.id })), // Conectamos SOMENTE imagens do tipo MOMENT
        },
      },
    });

    // Criar um convidado
    const invitee = await prisma.invitee.create({
      data: {
        email: 'maria.silva@example.com',
        phone: '11987654321',
        name: 'Maria Silva',
        additionalInvitees: 2,
        observation: 'Vamos com as crianças',
        giftListId: giftList.id,
        status: 'ACCEPTED',
      },
    });

    // Criar uma imagem para o presente
    const giftImage = await prisma.image.create({
      data: { url: 'https://example.com/gift-image.jpg', type: 'GIFT' },
    });

    // Criar um presente
    const gift = await prisma.gift.create({
      data: {
        name: 'Smart TV 55"',
        description: 'Smart TV 4K com HDR',
        totalValue: 3000.0,
        priority: 'HIGH',
        giftListId: giftList.id,
        categoryId: category.id,
        photoId: giftImage.id,
      },
    });

    // Atualizar imagem do presente
    await prisma.image.update({
      where: { id: giftImage.id },
      data: { giftId: gift.id },
    });

    // Criar uma contribuição
    const contribution = await prisma.contribution.create({
      data: {
        value: 500.0,
        message: 'Parabéns pelo casamento!',
        giftId: gift.id,
        userId: user.id,
      },
    });

    // Criar um pagamento
    const payment = await prisma.payment.create({
      data: {
        status: 'PENDING',
        paymentMethod: 'PIX',
        pixKey: '123456789',
        contributionId: contribution.id,
      },
    });

    // Criar uma cobrança
    await prisma.charge.create({
      data: {
        localId: '123456',
        txId: 'tx123456',
        giftId: gift.id,
        payerId: user.id,
        value: 500.0,
        paymentMethod: 'PIX',
        pixKey: '123456789',
        pixCopyAndPaste: '00020126360014BR.GOV.BCB.PIX01141234567890212Pagamento do Presente5204000053039865405500.005802BR5910João Silva6008São Paulo62070503***6304ABCD',
        qrCode: 'https://example.com/qrcode.png',
        generatedAt: new Date(),
        expirationDate: new Date('2023-11-25'),
      },
    });

    console.log('Seed data created successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();