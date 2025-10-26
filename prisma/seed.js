import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      },
      {
        name: "Bob",
        email: "bob@example.com",
        passwordHash: "123",
        city: "RJ",
        state: "RJ",
      },
      {
        name: "Carol",
        email: "carol@example.com",
        passwordHash: "123",
        city: "MG",
        state: "MG",
      },
    ],
    skipDuplicates: true,
  });

  const allUsers = await prisma.user.findMany();

  for (const user of allUsers) {
    await prisma.post.createMany({
      data: [
        {
          title: `${user.name} Produto 1`,
          userId: user.id,
          categoryId: "1",
          subcategoryId: "1",
          imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=400&fit=crop",
        },
        {
          title: `${user.name} Produto 2`,
          userId: user.id,
          categoryId: "2",
          subcategoryId: "2",
          imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=400&fit=crop",
        },
        {
          title: `${user.name} Produto 3`,
          userId: user.id,
          categoryId: "3",
          subcategoryId: "3",
          imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=400&fit=crop",
        },
      ],
    });
  }

  // Criar propostas de teste
  const alice = allUsers.find(u => u.name === "Alice");
  const bob = allUsers.find(u => u.name === "Bob");
  const carol = allUsers.find(u => u.name === "Carol");

  if (alice && bob && carol) {
    // Bob envia proposta para Alice
    await prisma.proposal.create({
      data: {
        message: "Olá Alice! Vi seu iPhone 13 e gostaria de negociar. Tenho um Apple Watch Series 7 para trocar.",
        requesterId: bob.id,
        responderId: alice.id,
        status: "pending"
      }
    });

    // Carol envia proposta para Alice
    await prisma.proposal.create({
      data: {
        message: "Oi Alice! Interessei-me pelo seu MacBook. Posso oferecer um iPad Pro em troca.",
        requesterId: carol.id,
        responderId: alice.id,
        status: "pending"
      }
    });

    // Bob envia outra proposta para Alice
    await prisma.proposal.create({
      data: {
        message: "Alice, tenho um Nintendo Switch que gostaria de trocar pelo seu iPhone. O que acha?",
        requesterId: bob.id,
        responderId: alice.id,
        status: "pending"
      }
    });

    // Criar endereços para Alice
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

    // Criar endereços para Bob
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

    // Criar endereços para Carol
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

  console.log("Seed finalizado!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
