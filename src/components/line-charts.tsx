"use client";
import { ChartsGrid } from "@mui/x-charts/ChartsGrid";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { ChartsTooltip } from "@mui/x-charts/ChartsTooltip";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { AreaPlot, MarkPlot } from "@mui/x-charts/LineChart";
import { LineHighlightPlot } from "@mui/x-charts/LineChart";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { DailyReport, Project } from "@prisma/client";
import dayjs from "dayjs";

export default function LineCharts({
  reports,
  project,
}: {
  reports: DailyReport[];
  project: Project | null;
}) {
  const xData = reports.map(
    (r) => `${dayjs(r.date).get("M") + 1}/${dayjs(r.date).get("D")}`
  );
  let total = 0;
  const yData = reports.map((r) => {
    if (r.endAt === null || r.startAt === null) return total;
    return (total += dayjs(r.endAt).diff(r.startAt, "hour"));
  });

  console.log(xData, yData);
  return (
    <ResponsiveChartContainer
      xAxis={[{ data: xData, scaleType: "point" }]}
      series={[
        {
          data: yData,
          type: "line",
          label: "稼働時間(合計)",
          area: true,
          connectNulls: true,
          valueFormatter: value => `${value}時間`
        },
      ]}
    >
      <ChartsGrid vertical horizontal />
      <AreaPlot />
      <MarkPlot />
      <ChartsXAxis />
      <ChartsYAxis />
      <ChartsTooltip />
      {project?.minimumWorkHour && (
        <ChartsReferenceLine
          y={project.minimumWorkHour}
          label="最小"
          labelAlign="start"
        />
      )}
      {project?.standardWorkHour && (
        <ChartsReferenceLine
          y={project.standardWorkHour}
          label="標準"
          labelAlign="start"
        />
      )}
      {project?.maximumWorkHour && (
        <ChartsReferenceLine
          y={project.maximumWorkHour}
          label="最大"
          labelAlign="start"
        />
      )}
    </ResponsiveChartContainer>
  );
}
