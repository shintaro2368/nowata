import { auth } from "@/auth";
import prisma from "@/db";
import { redirect } from "next/navigation";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "タスク名",
    width: 150,
    disableColumnMenu: true,
  },
  {
    field: "description",
    headerName: "説明",
    width: 300,
    disableColumnMenu: true,
  },
  {
    field: "totalTime",
    headerName: "作業合計時間(H)",
    width: 150,
    disableColumnMenu: true,
  },
];

export default async function Works() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/");
  }

  const works = await prisma.work.groupBy({
    by: ["taskId"],
    where: {
      task: {
        project: {
          selecterId: userId,
        },
      },
    },
    _sum: {
      totalTime: true,
    },
  });

  const tasks = await prisma.task.findMany({
    where: {
      project: {
        selecterId: userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const tasksWithWorks = tasks.map((task) => {
    const work = works.find((work) => work.taskId === task.id);
    return {
      ...task,
      totalTime: work?._sum.totalTime || 0,
    };
  });

  console.log(tasksWithWorks);

  return (
    <div>
      <h1>Works</h1>
      <DataGrid rows={tasksWithWorks} columns={columns} />
    </div>
  );
}
