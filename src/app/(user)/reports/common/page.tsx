import { auth } from "@/auth";
import prisma from "@/db";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { WorkStyle } from "@prisma/client";
import dayjs from "dayjs";
import { createManyDailyReport } from "@/actions/seeds/seed";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const dayOfWeeks = ["日", "月", "火", "水", "木", "金", "土"];
const displayWorkStyle: { [key in WorkStyle]: string } = {
  AtCompany: "出勤",
  AtHome: "在宅出勤",
  Absent: "欠勤",
  DayOff: "休日",
};

function formatDate(date: Date) {
  return `${date.getHours()}:${date.getMinutes()}`;
}

export default async function ReportsCommon() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return new Error("Unautorized");
  }

  const reportCommon = await prisma.dailyReport.findMany({
    where: {
      userId,
      reportType: "Common",
    },
    orderBy: {
      date: "asc",
    },
  });
  console.debug(reportCommon);
  const daysInCurrentMonth = dayjs().daysInMonth();
  const startOfCurrentMonth = dayjs().startOf("month");

  const elms: JSX.Element[] = [];
  for (let day = 0; day < daysInCurrentMonth; day++) {
    const dayJs = startOfCurrentMonth.clone().add(day, "day");
    const report = reportCommon.find(
      (entry) => entry.date.getDate() === dayJs.get("D")
    );
    let diff = undefined;
    if(report?.startAt && report.endAt) {
      diff = dayjs(report.endAt).diff(dayjs(report.startAt), "minutes") / 60;
    }
    elms.push(
      <TableRow key={day} sx={{ "& > .MuiTableCell-root": { padding: 1 } }}>
        <TableCell>{dayJs.get("M")+1}/{dayJs.get("D")}</TableCell>
        <TableCell>{dayOfWeeks[dayJs.day()]}</TableCell>
        <TableCell>
          {report?.workStyle && displayWorkStyle[report.workStyle]}
        </TableCell>
        <TableCell>
          {report?.startAt && dayjs(report.startAt).utc().format("HH:mm")}
        </TableCell>
        <TableCell>
          {report?.endAt && dayjs(report.endAt).utc().format("HH:mm")}
        </TableCell>
        <TableCell>{report?.breakTime.toNumber()}</TableCell>
        <TableCell>{report?.description}</TableCell>
        <TableCell>{diff}</TableCell>
      </TableRow>
    );
  }

  //await createManyDailyReport();

  return (
    <Box maxWidth={1400}>
      <TableContainer sx={{ width: "100%" }}>
        <Table sx={{ textWrap: "nowrap" }}>
          <TableHead>
            <TableRow>
              <TableCell width="5%">日付</TableCell>
              <TableCell width="5%">曜日</TableCell>
              <TableCell width="5%">種別</TableCell>
              <TableCell width="5%">出勤</TableCell>
              <TableCell width="5%">退勤</TableCell>
              <TableCell width="5%">休憩時間</TableCell>
              <TableCell>勤務内容</TableCell>
              <TableCell width="5%">勤務時間</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{elms}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
