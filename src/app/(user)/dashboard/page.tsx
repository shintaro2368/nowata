import { auth } from "@/auth";
import LineCharts from "@/components/line-charts";
import CustomPieChart from "@/components/pie-chart";
import prisma from "@/db";
import Box from "@mui/material/Box";
import grey from "@mui/material/colors/grey";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { redirect } from "next/navigation";

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

  const reports = await prisma.dailyReport.findMany({
    where: { userId },
    orderBy: { date: "asc" },
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
    <Grid container maxWidth={1200} spacing={3} rowSpacing={2} height="100%">
      <Grid item xs={6} height="15%">
        <Box
          bgcolor="#fff"
          borderRadius={4}
          width="100%"
          height="100%"
          borderColor={grey[200]}
          sx={{ borderWidth: 3 }}
          padding={3}
        >
          <Typography
            variant="h4"
            fontSize="1.3em"
            color={grey[700]}
            marginBottom={2}
          >
            達成率
          </Typography>
          <Typography variant="h2" fontWeight={500}>
            {doneTaskSize}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6} height="15%">
        <Box
          bgcolor="#fff"
          borderRadius={4}
          width="100%"
          height="100%"
          borderColor={grey[200]}
          sx={{ borderWidth: 3 }}
          padding={3}
        >
          <Typography
            variant="h4"
            fontSize="1.3em"
            color={grey[700]}
            marginBottom={2}
          >
            今月の稼働時間
          </Typography>
          <Typography variant="h2" fontWeight={500}>
            {121}H
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4} height="15%">
        <Box
          bgcolor="#fff"
          borderRadius={4}
          width="100%"
          height="100%"
          borderColor={grey[200]}
          sx={{ borderWidth: 3 }}
          padding={3}
        >
          <Typography
            variant="h4"
            fontSize="1.3em"
            color={grey[700]}
            marginBottom={2}
          >
            TODO
          </Typography>
          <Typography variant="h2" fontWeight={500}>
            {todoTask}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4} height="15%">
        <Box
          bgcolor="#fff"
          borderRadius={4}
          width="100%"
          height="100%"
          borderColor={grey[200]}
          sx={{ borderWidth: 3 }}
          padding={3}
        >
          <Typography
            variant="h4"
            fontSize="1.3em"
            color={grey[700]}
            marginBottom={2}
          >
            DOING
          </Typography>
          <Typography variant="h2" fontWeight={500}>
            {doingTaskSize}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4} height="15%">
        <Box
          bgcolor="#fff"
          borderRadius={4}
          width="100%"
          height="100%"
          borderColor={grey[200]}
          sx={{ borderWidth: 3 }}
          padding={3}
        >
          <Typography
            variant="h4"
            fontSize="1.3em"
            color={grey[700]}
            marginBottom={2}
          >
            DONE
          </Typography>
          <Typography variant="h2" fontWeight={500}>
            {doneTaskSize}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} height="30%">
        <Box height="100%" bgcolor={grey[100]}>
          <LineCharts reports={reports} />
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box>
          <CustomPieChart {...getProgressCircleData()} />
        </Box>
      </Grid>
    </Grid>
  );
}
