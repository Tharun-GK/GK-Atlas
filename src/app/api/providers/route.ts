import { prisma } from "@/lib/prisma";
import { databaseError, success } from "@/lib/api";

export async function GET() {
  try {
    const providers = await prisma.provider.findMany({
      include: { _count: { select: { modelLinks: true } } },
      orderBy: { name: "asc" },
    });
    return success(providers);
  } catch (error) {
    return databaseError(error);
  }
}
