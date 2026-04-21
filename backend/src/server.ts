import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";

const start = async () => {
  await prisma.$connect();

  app.listen(env.PORT, () => {
    // Keeping startup logs explicit helps when the project is bootstrapped locally.
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
