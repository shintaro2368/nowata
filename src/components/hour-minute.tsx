import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState } from "react";

type HourAndMinuteProps = {
  label: string;
  hourName: string;
  minuteNuame: string;
  hourAdorment?: string;
  minuteAdorment?: string;
  defaultHour?: unknown;
  defaultMinute?: unknown;
};

export default function HourAndMinutes({
  label,
  hourName,
  minuteNuame,
  hourAdorment = "時間",
  minuteAdorment = "分",
  defaultHour,
  defaultMinute
}: HourAndMinuteProps) {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  return (
    <Stack spacing={1}>
      <label>{label}</label>
      <Stack direction="row" spacing={1}>
        <TextField
          inputProps={{ style: { textAlign: "right" } }}
          defaultValue={defaultHour}
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
        />
        <TextField
          inputProps={{ style: { textAlign: "right" } }}
          defaultValue={defaultMinute}
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
        />
      </Stack>
    </Stack>
  );
}
