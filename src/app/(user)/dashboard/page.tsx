import { auth } from "@/auth";
import LineCharts from "@/components/line-charts";
import prisma from "@/db";
import { minutesToHoursMinutes } from "@/lib/time";
import Box from "@mui/material/Box";
import grey from "@mui/material/colors/grey";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
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

  const startOfMonth = dayjs().startOf("M").add(9, "hour").toDate();
  const endOfMonth = dayjs().endOf("M").add(9, "hour").toDate();
  const reports = await prisma.dailyReport.findMany({
    where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
    orderBy: { date: "asc" },
  });

  let sumWorkMinutes = 0;
  reports.forEach(
    (report) =>
      (sumWorkMinutes += report.workTimeHour * 60 + report.workTimeMinute)
  );

  return (
    <Grid container spacing={3} rowSpacing={2} padding={2} maxWidth={1200}>
      <Grid item xs={6} height={200}>
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
          <Typography variant="h2" fontWeight={500} align="center">
            {`${Math.floor((doneTaskSize / taskSize) * 100)}%`}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={6} height={200}>
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
          <Typography variant="h2" fontWeight={500} align="center">
            {minutesToHoursMinutes(sumWorkMinutes)}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4} height={200}>
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
          <Typography variant="h2" fontWeight={500} align="center">
            {todoTask}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4} height={200}>
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
          <Typography variant="h2" fontWeight={500} align="center">
            {doingTaskSize}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={4} height={200}>
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
          <Typography variant="h2" fontWeight={500} align="center">
            {doneTaskSize}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} height={500}>
        <Box
          height="100%"
          bgcolor="#fff"
          padding={1}
          borderRadius={4}
          borderColor={grey[200]}
          sx={{ borderWidth: 3 }}
        >
          <Typography
            variant="h4"
            color={grey[700]}
            align="center"
            fontSize="1.1em"
          >
            稼働時間の推移
          </Typography>
          <LineCharts reports={reports} project={project} />
        </Box>
      </Grid>
    </Grid>
  );
}
