import { NextRequest } from "next/server";
import { modelsQuerySchema } from "@/lib/validations";
import { databaseError, success, validationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const parsed = modelsQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return validationError(parsed.error);
  const { q, company, provider, capability, type, sort, order, page, limit } = parsed.data;

  try {
    const where = {
      ...(q ? { OR: [
        { name: { contains: q, mode: "insensitive" as const } },
        { description: { contains: q, mode: "insensitive" as const } },
      ] } : {}),
      ...(company ? { company: { slug: company } } : {}),
      ...(provider ? { providers: { some: { provider: { slug: provider } } } } : {}),
      ...(capability ? { capabilities: { some: { capability: { slug: capability } } } } : {}),
      ...(type ? { modelType: type } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.model.findMany({
        where,
        include: {
          company: true,
          providers: { include: { provider: true } },
          capabilities: { include: { capability: true } },
          prices: { orderBy: { inputPerM: "asc" }, take: 1 },
        },
        orderBy:
          sort === "context" ? { contextWindow: order } :
          sort === "release" ? { releaseDate: order } :
          { name: order },
      }),
      prisma.model.count({ where }),
    ]);
    const sortedItems = sort === "input-price" || sort === "output-price"
      ? [...items].sort((left, right) => {
          const leftPrice = left.prices[0]
            ? Number(sort === "input-price" ? left.prices[0].inputPerM : left.prices[0].outputPerM)
            : Number.MAX_SAFE_INTEGER;
          const rightPrice = right.prices[0]
            ? Number(sort === "input-price" ? right.prices[0].inputPerM : right.prices[0].outputPerM)
            : Number.MAX_SAFE_INTEGER;
          return order === "asc" ? leftPrice - rightPrice : rightPrice - leftPrice;
        })
      : items;
    const paginated = sortedItems.slice((page - 1) * limit, page * limit);
    return success({ items: paginated, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    return databaseError(error);
  }
}
