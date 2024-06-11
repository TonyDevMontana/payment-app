import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

async function main() {
  const alice = await prisma.user.upsert({
    where: { phone: 1234 },
    update: {},
    create: {
      phone: 1234,
      password: await bcrypt.hash("alice", 10),
      name: "alice",
      Balance: {
        create: {
          amount: 20000,
          locked: 0,
        },
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 20000,
          token: "122",
          provider: "HDFC Bank",
        },
      },
    },
  });
  const bob = await prisma.user.upsert({
    where: { phone: 1122 },
    update: {},
    create: {
      phone: 1122,
      password: await bcrypt.hash("bob", 10),
      name: "bob",
      Balance: {
        create: {
          amount: 200,
          locked: 1,
        },
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Failure",
          amount: 2000,
          token: "123",
          provider: "HDFC Bank",
        },
      },
    },
  });
  console.log({ alice, bob });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
