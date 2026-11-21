import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { databaseError, success } from "@/lib/api";

export async function GET(_request: NextRequest, context: RouteContext<"/api/models/[id]">) {
  const { id } = await context.params;
  try {
    const model = await prisma.model.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        company: true,
        providers: { include: { provider: true } },
        capabilities: { include: { capability: true } },
        prices: true,
        benchmarks: { include: { benchmark: true }, orderBy: { score: "desc" } },
      },
    });
    if (!model) return NextResponse.json({ data: null, error: { code: "NOT_FOUND", message: "Model not found." } }, { status: 404 });
    const related = await prisma.model.findMany({
      where: { companyId: model.companyId, id: { not: model.id } },
      take: 4,
      include: { company: true, prices: { take: 1 } },
    });
    return success({ ...model, related });
  } catch (error) {
    return databaseError(error);
  }
}
