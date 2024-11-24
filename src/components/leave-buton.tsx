"use client";

import { leave } from "@/actions/daily-report-action";
import { attendanceAtom } from "@/state";
import Button from "@mui/material/Button";
import { useSetAtom } from "jotai";
import { usePathname } from "next/navigation";

export default function LeaveButton() {
  const pathname = usePathname();
  const setAttendanceState = useSetAtom(attendanceAtom);

  async function handleOnClick() {
    await leave(pathname);
    setAttendanceState(false);
  }
  return (
    <Button
      variant="contained"
      color="warning"
      onClick={handleOnClick}
    >
      退勤
    </Button>
  );
}
