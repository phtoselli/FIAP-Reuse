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
        },
        {
          title: `${user.name} Produto 2`,
          userId: user.id,
          categoryId: "2",
          subcategoryId: "2",
        },
        {
          title: `${user.name} Produto 3`,
          userId: user.id,
          categoryId: "3",
          subcategoryId: "3",
        },
      ],
    });
  }

  console.log("Seed finalizado!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
