import { auth } from "@/auth";
import Tasks from "@/components/new/tasks";
import prisma from "@/db";
import JotaiProvider from "@/jotai-provider";

export default async function TasksPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("ログインしてください");
  }
  const project = await prisma.project.findUnique({
    where: { selecterId: userId },
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
      SubTask: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  console.log(tasks);
  return (
    // アンマウント時に状態をリセットするようにするためProviderをかます
    <JotaiProvider>
      <Tasks tasks={tasks} />
    </JotaiProvider>
  );
}
