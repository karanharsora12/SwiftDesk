import "dotenv/config";
import { z } from "zod";

const environmentSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  CLIENT_ORIGIN: z
    .string()
    .default(
      "http://localhost:5173,http://localhost:5174,http://localhost:5175",
    ),
  PENDING_REQUEST_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(5_000)
    .max(120_000)
    .default(30_000),
});

export const env = environmentSchema.parse(process.env);
