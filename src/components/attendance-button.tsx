"use client";

import { attendance } from "@/actions/daily-report-action";
import Button from "@mui/material/Button";

export default async function AttendanceButton() {
  return (
    <Button variant="contained" onClick={async () => await attendance()}>
      出勤
    </Button>
  );
}
