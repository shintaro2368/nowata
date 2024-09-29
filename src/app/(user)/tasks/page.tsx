import { auth } from "@/auth";
import Tasks from "@/components/new/tasks";

import prisma from "@/db";

export default async function TasksPage() {
  const session = await auth();
  const user = session?.user;
  const project = await prisma.project.findUnique({
    where: { selecterId: user?.id },
  });
  const tasks = await prisma.task.findMany({
    where: { projectId: project?.id },
    orderBy: { createdAt: "desc" },
    include: {
      Work: {
        where: {
          endAt: null,
        },
      },
    },
  });

  return (
    <>
      <Tasks tasks={tasks} />
    </>
  );
}
