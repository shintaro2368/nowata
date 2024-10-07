import { auth } from "@/auth";
import prisma from "@/db";
import { TaskAndWorksQuery } from "./definitions";

export async function fetchFilterdTaskAndWorks(
  taskAndWorksQuery: TaskAndWorksQuery
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const data = await prisma.task.findMany({
    where: {
      title: {
        contains: taskAndWorksQuery?.title,
      },
    },
    include: {
      Work: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}
