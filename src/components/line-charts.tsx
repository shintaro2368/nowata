"use client";

import { LineChart } from "@mui/x-charts/LineChart";

const workTimes = [
  { date: "1", totalWorkTime: 12 },
  { date: "2", totalWorkTime: 27 },
  { date: "3", totalWorkTime: 45 },
  { date: "4", totalWorkTime: 66 },
  { date: "5", totalWorkTime: 89 },
  { date: "6", totalWorkTime: 115 },
  { date: "7", totalWorkTime: 148 },
  { date: "8", totalWorkTime: 178 },
  { date: "9", totalWorkTime: 214 },
  { date: "10", totalWorkTime: 257 },
  { date: "11", totalWorkTime: 303 },
  { date: "12", totalWorkTime: 355 },
  { date: "13", totalWorkTime: 412 },
  { date: "14", totalWorkTime: 475 },
  { date: "15", totalWorkTime: 544 },
  { date: "16", totalWorkTime: 619 },
  { date: "17", totalWorkTime: 699 },
  { date: "18", totalWorkTime: 785 },
  { date: "19", totalWorkTime: 876 },
  { date: "20", totalWorkTime: 973 },
  { date: "21", totalWorkTime: 1075 },
  { date: "22", totalWorkTime: 1183 },
  { date: "23", totalWorkTime: 1297 },
  { date: "24", totalWorkTime: 1417 },
  { date: "25", totalWorkTime: 1543 },
  { date: "26", totalWorkTime: 1675 },
  { date: "27", totalWorkTime: 1813 },
  { date: "28", totalWorkTime: 1957 },
  { date: "29", totalWorkTime: 2107 },
  { date: "30", totalWorkTime: 2263 },
  { date: "31", totalWorkTime: 2425 },
];

export default function LineCharts() {
  return (
    <>
      <LineChart
        width={900}
        height={400}
        xAxis={[
          { data: workTimes.map((item) => item.date), scaleType: "band" },
        ]}
        series={[
          {
            curve: "linear",
            data: workTimes.map((item) => item.totalWorkTime),
            label: "総労働時間",
          },
        ]}
      />
    </>
  );
}
