"use client";

import { cancelLeave } from "@/actions/daily-report-action";
import { attendanceAtom } from "@/state";
import Button from "@mui/material/Button";
import { useSetAtom } from "jotai";

export default function CancelLeaveButton() {
  const setAttendanceState = useSetAtom(attendanceAtom);
  async function handleOnClick() {
    await cancelLeave();
    setAttendanceState(true);
  }

  return (
    <Button
      variant="contained"
      color="info"
      onClick={handleOnClick}
      title="退勤時刻を取り消します"
    >
      退勤を取消
    </Button>
  );
}
