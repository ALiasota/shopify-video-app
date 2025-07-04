import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle/migrations",
  schema: "./drizzle/schema.server.ts",
  dbCredentials: {
    url: "postgresql://postgres:postgres@127.0.0.1:5432/video-app",
  },
  migrations: {
    schema: "public",
  },
});
