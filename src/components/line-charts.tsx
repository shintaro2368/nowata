"use client";

import { DailyReport, Project } from "@prisma/client";
import dayjs from "dayjs";
import {
  Area,
  AreaChart,
  Brush,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function getData(reports: DailyReport[]) {
  const startOfMonth = dayjs().startOf("M");
  const endOfMonth = dayjs().endOf("M");
  const diff = endOfMonth.diff(startOfMonth, "d");
  const data = [];
  let total = 0;

  for (let i = 0; i <= diff; i++) {
    const targetDate = startOfMonth.add(i, "d");
    const report = reports.find((r) => dayjs(r.date).isSame(targetDate, "d"));
    total += report?.workTimeHour ? report.workTimeHour : 0;
    const fmtDate = `${targetDate.get("month") + 1}/${targetDate.get("D")}`;

    data.push({
      total: report?.workTimeHour ? total : null,
      fmtDate,
    });
  }
  console.log(data);
  return data;
}

export default function ({
  reports,
  project,
}: {
  reports: DailyReport[];
  project: Project | null;
}) {
  return (
    <ResponsiveContainer>
      <AreaChart data={getData(reports)}>
        <XAxis dataKey="fmtDate" />
        <YAxis dataKey="total" domain={[0, 200]} tickCount={21} />
        <Area name="稼働時間" dataKey="total" connectNulls activeDot />
        <Tooltip formatter={v => v && v + "時間"}/>
        {project?.maximumWorkHour && (
          <ReferenceLine y={project.maximumWorkHour} />
        )}
        {project?.standardWorkHour && (
          <ReferenceLine y={project.standardWorkHour} />
        )}
        {project?.minimumWorkHour && (
          <ReferenceLine y={project.minimumWorkHour} />
        )}
        <Brush dataKey="fmtDate" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
