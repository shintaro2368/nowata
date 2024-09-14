import prisma from "@/db";
import TaskForm from "@/components/task-form";
import { auth } from "@/auth";
import TaskList from "@/components/task-list";
import WorkControle from "@/components/work-controle";

export default async function TasksPage() {
  const session = await auth();
  const user = session?.user;
  const project = await prisma.project.findUnique({
    where: { selecterId: user?.id },
  });
  const tasks = await prisma.task.findMany({
    where: { projectId: project?.id },
    include: {
      Work: {
        where: {
          endAt: null,
        },
      },
    },
  });
  // console.log(tasks);
  const statuses = await prisma.status.findMany({ orderBy: { code: "asc" } });

  return (
    <>
      <div className="flex h-full">
        <div className="w-full">
          <TaskList
            tasks={tasks.map((task) => ({
              id: task.id,
              title: task.title,
              status: task.statusCode,
              description: task.description,
              action: (
                <WorkControle
                  taskId={task.id}
                  status={task.Work.length > 0 ? "running" : "none"}
                />
              ),
            }))}
          />
        </div>
        <div className="w-2/5 border-2 border-gray-200 shadow-lg rounded-md p-4 mx-4">
          <div className="flex flex-col">
            <div className="">
              <TaskForm
                statuses={statuses.map((status) => ({
                  code: status.code,
                  name: status.name,
                }))}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
