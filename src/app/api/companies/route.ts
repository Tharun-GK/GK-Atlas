import { prisma } from "@/lib/prisma";
import { databaseError, success } from "@/lib/api";

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: { _count: { select: { models: true } } },
      orderBy: { name: "asc" },
    });
    return success(companies);
  } catch (error) {
    return databaseError(error);
  }
}
