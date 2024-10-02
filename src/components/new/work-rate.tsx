"use client"

import { PieChart } from "@mui/x-charts"

const d = [
  {id: 0, value: 10, label: "タスクA"},
  {id: 1, value: 8, label: "タスB"},
  {id: 2, value: 4, label: "タスクC"},
]

export default function WorkRate() {
  return (
    <PieChart
      series={
        [
          {data: d}
        ]
      }
    />
  )
}