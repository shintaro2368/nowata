import { auth } from "@/auth";
import prisma from "@/db";
import { TaskAndWorksQuery } from "./definitions";

export async function fetchFilterdTaskAndWorks(
  taskAndWorksQuery: TaskAndWorksQuery
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("ログインをしてください");
  }
  console.debug(taskAndWorksQuery);
  const data = await prisma.task.findMany({
    where: {
      project: {
        selecterId: userId,
      },
      title: {
        contains: taskAndWorksQuery?.title,
        mode: "insensitive",
      },
      OR: taskAndWorksQuery.statuses?.map((status) => ({ status })),
      Work: {
        some: {
          AND: [
            { startAt: { lte: taskAndWorksQuery.to } },
            { endAt: { gte: taskAndWorksQuery.from } },
          ],
        },
      },
    },
    include: {
      Work: { orderBy: { startAt: "desc" } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}
