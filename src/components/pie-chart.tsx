"use client";

import { PieChart } from "@mui/x-charts/PieChart";

// const data = [
//   { value: 1, label: '完了済', color: '#3182ce' },
//   { value: 2, label: '未完了', color: 'gray' },
// ];

// const details = [
//   { value: 1 , label: '仕掛り中', color: 'red' },
//   { value: 1 , label: '登録済み', color: 'gray' },
// ]

const size = {
  width: 300,
  height: 500,
  legend: {
    hidden: true,
  },
};

type PieChartProps = {
  data: { value: number; label: string; color: string }[];
  details: { value: number; label: string; color: string }[];
};

export default function CustomPieChart({ data, details }: PieChartProps) {
  return (
    <>
      <h4 className="text-md font-medium text-center">進捗状況</h4>
      <PieChart
        series={[
          {
            data,
            arcLabel: (item) => `${item.value}`,
            highlightScope: {
              faded: "global",
              highlighted: "item",
            },
            innerRadius: 60,
            outerRadius: 90,
            id: "pie-chart-1",
          },
          {
            data: details[0].value && details[1].value ? details : [],
            arcLabel: (item) => `${item.value}`,
            highlightScope: {
              faded: "global",
              highlighted: "item",
            },
            innerRadius: 100,
            outerRadius: 120,
            startAngle: (data[0].value / (data[0].value + data[1].value)) * 360,
          },
        ]}
        {...size}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      />
    </>
  );
}
