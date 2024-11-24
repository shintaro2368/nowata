"use client";

import { cancelLeave } from "@/actions/daily-report-action";
import Button from "@mui/material/Button";
import { usePathname } from "next/navigation";
import { attendanceAtom } from "@/state";
import { useSetAtom } from "jotai";

export default function CancelLeaveButton() {
  const pathname = usePathname();
  const setAttendanceState = useSetAtom(attendanceAtom);
  async function handleOnClick() {
    await cancelLeave(pathname);
    setAttendanceState(true);
  }


  return (
    <Button
      variant="contained"
      color="info"
      onClick={handleOnClick
        
      }
      title="退勤時刻を取り消します"
    >
      退勤を取消
    </Button>
  );
}
