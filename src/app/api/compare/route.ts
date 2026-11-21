import { NextRequest } from "next/server";
import { compareQuerySchema } from "@/lib/validations";
import { databaseError, success, validationError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const parsed = compareQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return validationError(parsed.error);
  if (parsed.data.ids.length > 3) {
    return new (await import("next/server")).NextResponse(
      JSON.stringify({ data: null, error: { code: "VALIDATION_ERROR", message: "Compare at most three models." } }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
  try {
    const models = await prisma.model.findMany({
      where: { OR: parsed.data.ids.flatMap((id) => [{ id }, { slug: id }]) },
      include: {
        company: true,
        providers: { include: { provider: true } },
        capabilities: { include: { capability: true } },
        prices: true,
        benchmarks: { include: { benchmark: true } },
      },
      take: 3,
    });
    return success({ models });
  } catch (error) {
    return databaseError(error);
  }
}
