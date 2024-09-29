import { auth } from "@/auth";
import prisma from "@/db";
import { redirect } from "next/navigation";
import AttendanceForm from "@/components/attendance-form";
import CustomPieChart from "@/components/pie-chart";
import LineCharts from "@/components/line-charts";

export default async function DashbordPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/");
  }

  const project = await prisma.project.findUnique({
    where: { selecterId: userId },
  });
  const runningDailyReport = await prisma.dailyReport.findFirst({
    where: { userId, endAt: null },
  });

  // すべてのタスク数
  const taskSize = await prisma.task.count({
    where: { projectId: project?.id },
  });

  // 完了済みのタスク数
  const doneTaskSize = await prisma.task.count({
    where: { projectId: project?.id, status: "DONE" },
  });

  // 作業中のタスク数
  const doingTaskSize = await prisma.task.count({
    where: { projectId: project?.id, status: "DOING" },
  });

  // 未着手のタスク数
  const todoTask = await prisma.task.count({
    where: { projectId: project?.id, status: "TODO" },
  });

  const getProgressCircleData = () => {
    const data = [
      { value: doneTaskSize, label: "完了", color: "#3182ce" },
      { value: todoTask + doingTaskSize, label: "未完了", color: "gray" },
    ];

    const details = [
      { value: doingTaskSize, label: "仕掛り中", color: "red" },
      { value: todoTask, label: "登録済み", color: "gray" },
    ];

    return { data, details };
  };

  return (
    <div>
      <h1 className="text-xl font-medium">ダッシュボード</h1>
      <div className="flex items-center">
        <div className="p-12">
          <div className="flex items-center">
            <p className="text-8xl font-bold text-blue-600">
              {taskSize === 0
                ? 0
                : Math.floor((doneTaskSize / taskSize) * 100)}
              %
            </p>
            <div className="flex flex-col">
              <p>達成 {doneTaskSize}</p>
              <p>登録 {taskSize}</p>
            </div>
          </div>
          <p className="text-gray-700 text-sm py-2">達成率</p>
        </div>
        <div className="p-12">
          <p className="text-6xl font-bold text-blue-600">{doingTaskSize}</p>
          <p className="text-gray-700 text-sm py-2">作業中のタスク</p>
        </div>
        <div className="p-12">
          <p className="text-6xl font-bold text-blue-600">22.5h</p>
          <p className="text-gray-700 text-sm py-2">今月の作業時間</p>
        </div>

        <div className="">
          <AttendanceForm isWorking={!!runningDailyReport} />
        </div>
      </div>
      <div className="flex">
        <div className="border-2 border-blue-800 rounded-md shadow-md p4 m-2">
          <CustomPieChart {...getProgressCircleData()} />
        </div>
        <div className="border-2 border-blue-800 rounded-md shadow-md p4 m-2">
          <LineCharts />
        </div>
      </div>
    </div>
  );
}
