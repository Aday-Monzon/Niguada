import { PrismaClient } from "@prisma/client";
import { disconnectSeedPrisma, seed } from "./seed";

const prisma = new PrismaClient();

const seedIfEmpty = async () => {
  const [clients, opportunities, tasks] = await Promise.all([
    prisma.client.count(),
    prisma.opportunity.count(),
    prisma.task.count()
  ]);

  const hasCrmData = clients > 0 || opportunities > 0 || tasks > 0;

  if (hasCrmData) {
    console.log(
      `Seed skipped: existing CRM data found (${clients} clients, ${opportunities} opportunities, ${tasks} tasks).`
    );
    return;
  }

  console.log("No CRM data found. Running demo seed...");
  await seed();
};

seedIfEmpty()
  .then(async () => {
    await disconnectSeedPrisma();
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Conditional seed failed", error);
    await disconnectSeedPrisma();
    await prisma.$disconnect();
    process.exit(1);
  });
