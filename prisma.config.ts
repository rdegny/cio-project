import { loadEnvFile } from "node:process";
import { defineConfig, env } from "prisma/config";

for (const envFile of [".env", ".env.local"]) {
  try {
    loadEnvFile(envFile);
  } catch {
    // Missing local env files are expected in fresh clones and CI.
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
