"use client";

import { attendance } from "@/actions/daily-report-action";
import { attendanceAtom } from "@/state";
import Button from "@mui/material/Button";
import { useSetAtom } from "jotai";

export default function AttendanceButton() {
  const setAttendanceState = useSetAtom(attendanceAtom);

  async function handleOnClick() {
    await attendance();
    setAttendanceState(true);
  }

  return (
    <Button variant="contained" onClick={handleOnClick}>
      出勤
    </Button>
  );
}
