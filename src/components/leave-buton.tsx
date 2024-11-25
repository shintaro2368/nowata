"use client";

import { leave } from "@/actions/daily-report-action";
import { attendanceAtom } from "@/state";
import Button from "@mui/material/Button";
import { useSetAtom } from "jotai";

export default function LeaveButton() {
  const setAttendanceState = useSetAtom(attendanceAtom);

  async function handleOnClick() {
    await leave();
    setAttendanceState(false);
  }
  return (
    <Button variant="contained" color="warning" onClick={handleOnClick}>
      退勤
    </Button>
  );
}
