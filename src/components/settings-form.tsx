"use client";

import DatePickerProvider from "./date-picker-provider";
import { DatePicker, renderTimeViewClock } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { useState } from "react";
import { createSetting } from "@/actions/setting-action";

export default function SettingsForm() {
  const [start, setStart] = useState<moment.Moment | null>(null);
  const [end, setEnd] = useState<moment.Moment | null>(null);
  const [breakTime, setBreakTime] = useState<moment.Moment | null>(null);

  return (
    <DatePickerProvider>
      <form action={createSetting}>
        <div className="flex flex-col gap-4">
          <div>
            <TimePicker
              name="start"
              value={start}
              views={["hours", "minutes"]}
              format="HH時mm分"
              label="出勤"
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
              }}
              onChange={(value) => {
                setStart(value);
              }}
            />
          </div>
          <div>
            <TimePicker
              name="end"
              value={end}
              views={["hours", "minutes"]}
              format="HH時mm分"
              label="退勤"
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
              }}
              onChange={(value) => {
                setEnd(value);
              }}
            />
          </div>
          <div>
            <TimePicker
              name="breakTime"
              value={breakTime}
              views={["hours", "minutes"]}
              format="HH時間mm分"
              label="休憩時間"
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
              }}
              onChange={(value) => {
                setBreakTime(value);
              }}
            />
          </div>
          <div>
            合計時間 {Math.abs(start?.diff(end, "minutes") ?? 0) / 60}時間
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          登録
        </button>
      </form>
    </DatePickerProvider>
  );
}
