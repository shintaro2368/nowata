"use client";

import { leave } from "@/actions/daily-report-action";
import Button from "@mui/material/Button";
import { usePathname } from "next/navigation";

export default async function LeaveButton() {
  const pathname = usePathname();

  return (
    <Button
      variant="contained"
      color="warning"
      onClick={async () => await leave(pathname)}
    >
      退勤
    </Button>
  );
}
