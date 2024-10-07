"use client"
import {LineChart} from "@mui/x-charts/LineChart";
import { DailyReport } from "@prisma/client";
import dayjs from "dayjs";

export default function LineCharts({reports}: {reports: DailyReport[]}) {
  const xData = reports.map(r => `${dayjs(r.date).get("M")+1}/${dayjs(r.date).get("D")}`);
  let total = 0;
  const yData = reports.map(r => total += dayjs(r.endAt).diff(r.startAt, "hour"));

  console.log(xData, yData)
  return (
    <LineChart
      xAxis={[{ data: xData, scaleType: "point"}]}
      series={[
        {
          data: yData,
          area: true,
        },
      ]}
    />
  );
}
