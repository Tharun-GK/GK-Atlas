import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { databaseError, success } from "@/lib/api";

export async function GET(_request: NextRequest, context: RouteContext<"/api/companies/[id]">) {
  const { id } = await context.params;
  try {
    const company = await prisma.company.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { models: { include: { prices: true, capabilities: { include: { capability: true } } }, orderBy: { releaseDate: "desc" } } },
    });
    if (!company) return NextResponse.json({ data: null, error: { code: "NOT_FOUND", message: "Company not found." } }, { status: 404 });
    return success(company);
  } catch (error) {
    return databaseError(error);
  }
}
