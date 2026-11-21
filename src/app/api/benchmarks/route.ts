import { prisma } from "@/lib/prisma";
import { databaseError, success } from "@/lib/api";

export async function GET() {
  try {
    const benchmarks = await prisma.benchmark.findMany({
      include: { _count: { select: { modelScores: true } } },
      orderBy: { name: "asc" },
    });
    return success(benchmarks);
  } catch (error) {
    return databaseError(error);
  }
}
