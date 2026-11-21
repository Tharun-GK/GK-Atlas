import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { databaseError, success } from "@/lib/api";

export async function GET(_request: NextRequest, context: RouteContext<"/api/providers/[id]">) {
  const { id } = await context.params;
  try {
    const provider = await prisma.provider.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { modelLinks: { include: { model: { include: { company: true, prices: true } } } } },
    });
    if (!provider) return NextResponse.json({ data: null, error: { code: "NOT_FOUND", message: "Provider not found." } }, { status: 404 });
    return success(provider);
  } catch (error) {
    return databaseError(error);
  }
}
