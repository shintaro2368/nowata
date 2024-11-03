"use client";

import { cancelLeave } from "@/actions/daily-report-action";
import Button from "@mui/material/Button";
import { usePathname } from "next/navigation";

export default function CancelLeaveButton() {
  const pathname = usePathname();

  return (
    <Button
      variant="contained"
      color="info"
      onClick={async () => await cancelLeave(pathname)}
      title="退勤時刻を取り消します"
    >
      退勤を取消
    </Button>
  );
}
