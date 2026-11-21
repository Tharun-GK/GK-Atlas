import { NextRequest } from "next/server";
import { searchQuerySchema } from "@/lib/validations";
import { databaseError, success, validationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const parsed = searchQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return validationError(parsed.error);
  const { q, limit } = parsed.data;
  try {
    const [models, companies, providers, capabilities] = await Promise.all([
      prisma.model.findMany({ where: { name: { contains: q, mode: "insensitive" } }, take: limit, include: { company: true } }),
      prisma.company.findMany({ where: { name: { contains: q, mode: "insensitive" } }, take: limit }),
      prisma.provider.findMany({ where: { name: { contains: q, mode: "insensitive" } }, take: limit }),
      prisma.capability.findMany({ where: { name: { contains: q, mode: "insensitive" } }, take: limit }),
    ]);
    return success({ models, companies, providers, capabilities });
  } catch (error) {
    return databaseError(error);
  }
}
