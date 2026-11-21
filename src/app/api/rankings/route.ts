import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { databaseError, success } from "@/lib/api";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category") ?? "general-performance";
  try {
    const benchmark = await prisma.benchmark.findUnique({
      where: { slug: category },
      include: {
        modelScores: {
          include: { model: { include: { company: true } } },
          orderBy: { score: "desc" },
          take: 50,
        },
      },
    });
    return success(benchmark);
  } catch (error) {
    return databaseError(error);
  }
}
