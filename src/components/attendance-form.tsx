"use client";
import { attendanceAtom } from "@/state";
import { DailyReport } from "@prisma/client";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import CancelLeaveButton from "./cancel-leave-button";
import LeaveButton from "./leave-buton";

export default function AttendanceForm({
  lastAttendance,
}: {
  lastAttendance: DailyReport | null;
}) {
  const attendanceState = useAtomValue(attendanceAtom);
  const setAttendanceState = useSetAtom(attendanceAtom);

  // 出勤状態を同期
  useEffect(() => {
    if (lastAttendance) {
      const newValue = lastAttendance.endAt === null;
      if (attendanceState !== newValue) {
        setAttendanceState(newValue);
      }
    }
  }, []);

  return attendanceState ? <LeaveButton /> : <CancelLeaveButton />;
}
