import { z } from "zod";

export const modelsQuerySchema = z.object({
  q: z.string().trim().min(1).max(100).optional(),
  company: z.string().trim().min(1).max(100).optional(),
  provider: z.string().trim().min(1).max(100).optional(),
  capability: z.string().trim().min(1).max(100).optional(),
  type: z.string().trim().min(1).max(50).optional(),
  sort: z.enum(["input-price", "output-price", "context", "release"]).default("release"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export const searchQuerySchema = z.object({
  q: z.string().trim().min(1).max(100),
  limit: z.coerce.number().int().min(1).max(20).default(8),
});

export const compareQuerySchema = z.object({
  ids: z.string().min(1).max(300).transform((value) => value.split(",").filter(Boolean)),
});
