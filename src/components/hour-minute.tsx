import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState } from "react";

type HourAndMinuteProps = {
  label: string;
  hourName: string;
  minuteNuame: string;
  hourKey?: string;
  minuteKey?: string;
  hourAdorment?: string;
  minuteAdorment?: string;
  defaultHour?: number | null;
  defaultMinute?: number | null;
  hourErrors?: string[];
  minuteErrors?: string[];
};

export default function HourAndMinutes({
  label,
  hourName,
  minuteNuame,
  hourKey,
  minuteKey,
  hourAdorment = "時間",
  minuteAdorment = "分",
  defaultHour,
  defaultMinute,
  hourErrors,
  minuteErrors,
}: HourAndMinuteProps) {
  const [hour, setHour] = useState(
    defaultHour == null ? "" : defaultHour.toString()
  );
  const [minute, setMinute] = useState(
    defaultMinute == null ? "" : defaultMinute.toString()
  );

  return (
    <Stack spacing={1}>
      <label>{label}</label>
      <Stack direction="row" spacing={1}>
        <TextField
          inputProps={{ style: { textAlign: "right" } }}
          key={hourKey}
          name={hourName}
          value={hour}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">{hourAdorment}</InputAdornment>
            ),
          }}
          onChange={(e) => {
            if (e.target.value.match("/^d*$/")) {
              return;
            }
            const num = Number(e.target.value);
            if (num >= 0) {
              setHour(num.toString());
            }
          }}
          error={!!hourErrors}
          helperText={hourErrors}
        />
        <TextField
          inputProps={{ style: { textAlign: "right" } }}
          key={minuteKey}
          name={minuteNuame}
          value={minute}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">{minuteAdorment}</InputAdornment>
            ),
          }}
          onChange={(e) => {
            if (e.target.value.match("/^d*$/")) {
              return;
            }
            const num = Number(e.target.value);
            if (num >= 0 && num <= 60) {
              setMinute(num.toString());
            }
          }}
          error={!!minuteErrors}
          helperText={minuteErrors}
        />
      </Stack>
    </Stack>
  );
}
