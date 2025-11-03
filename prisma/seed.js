import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getRandomImage() {
  const url = `https://picsum.photos/500/500?random=${Math.floor(Math.random() * 100)}`;
  return url;
}

function getRandomAvatar(gender) {
  if (gender === 'male') return `https://xsgames.co/randomusers/assets/avatars/male/${Math.floor(Math.random() * 78) + 1}.jpg`;
  if (gender === 'female') return `https://xsgames.co/randomusers/assets/avatars/female/${Math.floor(Math.random() * 78) + 1}.jpg`;
  return `https://xsgames.co/randomusers/assets/avatars/pixel/${Math.floor(Math.random() * 53) + 1}.jpg`;
}

async function main() {
  console.log("Iniciando seed...");

  await prisma.user.createMany({
    data: [
      {
        name: "Alice",
        email: "alice@example.com",
        passwordHash: "123",
        city: "SP",
        state: "SP",
        avatarUrl: getRandomAvatar("female")
      },
      {
        name: "Bob",
        email: "bob@example.com",
        passwordHash: "123",
        city: "RJ",
        state: "RJ",
        avatarUrl: getRandomAvatar("male")
      },
      {
        name: "Carol",
        email: "carol@example.com",
        passwordHash: "123",
        city: "MG",
        state: "MG",
        avatarUrl: getRandomAvatar("female")
      },
    ],
    skipDuplicates: true,
  });

  const allUsers = await prisma.user.findMany();

  const alice = allUsers.find(u => u.name === "Alice");
  const bob = allUsers.find(u => u.name === "Bob");
  const carol = allUsers.find(u => u.name === "Carol");

  if (alice) {
    await prisma.post.createMany({
      data: [
        {
          title: "Colar de Prata com Pingente de Coração",
          description: "Colar delicado de prata 925, com pingente em formato de coração. Ideal para uso diário ou para presentear alguém especial.",
          image: getRandomImage(),
          categoryId: 1,
          conditionId: 1,
          userId: alice.id,
          rating: 5,
        },
        {
          title: "Kit Skincare Facial Completo",
          description: "Conjunto com sabonete, tônico e hidratante facial. Produtos veganos e dermatologicamente testados.",
          image: getRandomImage(),
          categoryId: 2,
          conditionId: 1,
          userId: alice.id,
          rating: 4,
        },
        {
          title: "Conjunto de Taças de Cristal",
          description: "Jogo com 6 taças de cristal Bohemia, perfeitas para vinho tinto. Usadas apenas uma vez.",
          image: getRandomImage(),
          categoryId: 3,
          conditionId: 2,
          userId: alice.id,
          rating: 5,
        },
        {
          title: "Headphone Bluetooth Sony WH-CH520",
          description: "Fone de ouvido sem fio com microfone embutido e bateria de até 50h. Som limpo e confortável para longas sessões.",
          image: getRandomImage(),
          categoryId: 4,
          conditionId: 1,
          userId: alice.id,
          rating: 5,
        },
        {
          title: "Jaqueta Jeans Oversized Feminina",
          description: "Jaqueta jeans azul clara, modelo oversized, em ótimo estado. Combina com diversos estilos.",
          image: getRandomImage(),
          categoryId: 5,
          conditionId: 2,
          userId: alice.id,
          rating: 4,
        },
        {
          title: "Violão Yamaha C40",
          description: "Violão clássico Yamaha C40, usado mas em ótimo estado. Som impecável.",
          image: getRandomImage(),
          categoryId: 6,
          conditionId: 2,
          userId: alice.id,
          rating: 4,
        },
      ],
    });

    await prisma.address.createMany({
      data: [
        {
          street: "Rua das Flores, 123 - Apto 45",
          city: "São Paulo",
          state: "SP",
          zipCode: "01234-567",
          country: "Brasil",
          userId: alice.id
        },
        {
          street: "Av. Paulista, 1000 - Sala 501",
          city: "São Paulo",
          state: "SP",
          zipCode: "01310-100",
          country: "Brasil",
          userId: alice.id
        },
        {
          street: "Rua Augusta, 456",
          city: "São Paulo",
          state: "SP",
          zipCode: "01305-000",
          country: "Brasil",
          userId: alice.id
        }
      ]
    });
  }

  if (bob) {
    await prisma.post.createMany({
      data: [
        {
          title: "Relógio de Pulso Masculino Casio",
          description: "Relógio Casio clássico com pulseira de aço inoxidável, resistente à água e perfeito para uso diário.",
          image: getRandomImage(),
          categoryId: 1,
          conditionId: 1,
          userId: bob.id,
          rating: 5,
        },
        {
          title: "Kit Barba Completo",
          description: "Conjunto com óleo, balm e pente de madeira para cuidados com a barba. Produtos premium e masculinos.",
          image: getRandomImage(),
          categoryId: 2,
          conditionId: 1,
          userId: bob.id,
          rating: 4,
        },
        {
          title: "Conjunto de Canecas de Cerâmica",
          description: "Jogo com 4 canecas de cerâmica para café ou chá, design moderno e resistente.",
          image: getRandomImage(),
          categoryId: 3,
          conditionId: 2,
          userId: bob.id,
          rating: 4,
        },
        {
          title: "Fone Bluetooth JBL T450BT",
          description: "Fone de ouvido Bluetooth JBL, confortável e com som potente. Ideal para esportes e deslocamentos.",
          image: getRandomImage(),
          categoryId: 4,
          conditionId: 1,
          userId: bob.id,
          rating: 5,
        },
        {
          title: "Camisa Polo Masculina Lacoste",
          description: "Camisa polo clássica Lacoste, azul marinho, em ótimo estado. Perfeita para trabalho ou lazer.",
          image: getRandomImage(),
          categoryId: 5,
          conditionId: 2,
          userId: bob.id,
          rating: 4,
        },
        {
          title: "Bola de Futebol Adidas",
          description: "Bola de futebol Adidas oficial, usada em treinos, mas em excelente condição.",
          image: getRandomImage(),
          categoryId: 6,
          conditionId: 2,
          userId: bob.id,
          rating: 4,
        },
      ],
    });

    await prisma.address.createMany({
      data: [
        {
          street: "Rua da Lapa, 789 - Casa 2",
          city: "Rio de Janeiro",
          state: "RJ",
          zipCode: "20021-180",
          country: "Brasil",
          userId: bob.id
        },
        {
          street: "Av. Copacabana, 200 - Apto 301",
          city: "Rio de Janeiro",
          state: "RJ",
          zipCode: "22020-000",
          country: "Brasil",
          userId: bob.id
        }
      ]
    });
  }

  if (carol) {
    await prisma.post.createMany({
      data: [
        {
          title: "Brincos de Ouro com Pérola",
          description: "Par de brincos delicados em ouro 18k com pérolas naturais. Elegante para qualquer ocasião.",
          image: getRandomImage(),
          categoryId: 1,
          conditionId: 1,
          userId: carol.id,
          rating: 5,
        },
        {
          title: "Kit Maquiagem Completo",
          description: "Conjunto com base, blush, sombra e batom. Ideal para looks diários e ocasiões especiais.",
          image: getRandomImage(),
          categoryId: 2,
          conditionId: 1,
          userId: carol.id,
          rating: 4,
        },
        {
          title: "Jogo de Copos de Vidro Colorido",
          description: "Jogo com 6 copos de vidro colorido, resistentes e perfeitos para sucos ou drinks.",
          image: getRandomImage(),
          categoryId: 3,
          conditionId: 2,
          userId: carol.id,
          rating: 4,
        },
        {
          title: "Smartwatch Samsung Galaxy",
          description: "Smartwatch com monitoramento de saúde, notificações e design moderno. Bateria de longa duração.",
          image: getRandomImage(),
          categoryId: 4,
          conditionId: 1,
          userId: carol.id,
          rating: 5,
        },
        {
          title: "Vestido Floral Midi",
          description: "Vestido midi com estampa floral, tecido leve e confortável, perfeito para primavera e verão.",
          image: getRandomImage(),
          categoryId: 5,
          conditionId: 2,
          userId: carol.id,
          rating: 4,
        },
        {
          title: "Bicicleta Infantil Aro 20",
          description: "Bicicleta aro 20, usada mas em ótimo estado, com cestinha frontal e freios confiáveis.",
          image: getRandomImage(),
          categoryId: 6,
          conditionId: 2,
          userId: carol.id,
          rating: 4,
        },
      ],
    });

    await prisma.address.createMany({
      data: [
        {
          street: "Rua da Liberdade, 321 - Loja 1",
          city: "Belo Horizonte",
          state: "MG",
          zipCode: "30112-000",
          country: "Brasil",
          userId: carol.id
        }
      ]
    });
  }

  // Cria propostas entre usuários com os novos produtos
  if (bob && alice && carol) {
    // Bob faz propostas para produtos da Alice
    const aliceProducts = await prisma.post.findMany({
      where: { userId: alice.id },
      take: 3, // pega os 3 primeiros produtos
    });

    for (const product of aliceProducts) {
      await prisma.proposal.create({
        data: {
          message: `Oi Alice! Gostei do seu produto "${product.title}". Tenho algo para trocar, que acha?`,
          requesterId: bob.id,
          responderId: alice.id,
          status: "pending",
        },
      });
    }

    // Carol faz propostas para produtos da Alice
    for (const product of aliceProducts) {
      await prisma.proposal.create({
        data: {
          message: `Olá Alice! Vi seu produto "${product.title}" e posso oferecer algo em troca. Vamos negociar?`,
          requesterId: carol.id,
          responderId: alice.id,
          status: "pending",
        },
      });
    }

    // Alice faz propostas para produtos do Bob
    const bobProducts = await prisma.post.findMany({
      where: { userId: bob.id },
      take: 3,
    });

    for (const product of bobProducts) {
      await prisma.proposal.create({
        data: {
          message: `Oi Bob! Seu produto "${product.title}" me interessou. Posso oferecer algo em troca?`,
          requesterId: alice.id,
          responderId: bob.id,
          status: "pending",
        },
      });
    }

    // Alice faz propostas para produtos da Carol
    const carolProducts = await prisma.post.findMany({
      where: { userId: carol.id },
      take: 3,
    });

    for (const product of carolProducts) {
      await prisma.proposal.create({
        data: {
          message: `Olá Carol! Tenho interesse no seu produto "${product.title}". Podemos negociar?`,
          requesterId: alice.id,
          responderId: carol.id,
          status: "pending",
        },
      });
    }

    // Bob faz propostas para produtos da Carol
    for (const product of carolProducts) {
      await prisma.proposal.create({
        data: {
          message: `Oi Carol! Gostei do seu produto "${product.title}". Tenho algo que posso trocar com você.`,
          requesterId: bob.id,
          responderId: carol.id,
          status: "pending",
        },
      });
    }
  }


  console.log("Seed finalizado!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
