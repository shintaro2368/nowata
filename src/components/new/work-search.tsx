"use client";

import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import grey from "@mui/material/colors/grey";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TaskStatus } from "@prisma/client";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import DatePickerProvider from "../date-picker-provider";

export default function WorkSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const urlSearchParams = useRef<URLSearchParams>(
    new URLSearchParams(searchParams)
  );

  function handleChangeStatuses(status: TaskStatus) {
    if (urlSearchParams.current.has("statuses", status)) {
      urlSearchParams.current.delete("statuses", status);
    } else {
      urlSearchParams.current.append("statuses", status);
    }
  }

  function handleChangeQueryParameter(key: string, value: string) {
    if (value) {
      urlSearchParams.current.set(key, value);
    } else {
      urlSearchParams.current.delete(key);
    }
  }

  function handleSearch() {
    replace(`${pathname}?${urlSearchParams.current.toString()}`);
  }

  return (
    <Box bgcolor="#fff" borderRadius={4} paddingY={2} paddingX={4}>
      <Box>
        <Stack spacing={2}>
          <Stack direction="row" spacing={4} alignItems="end">
            <Box>
              <TextField
                label="タスク"
                variant="standard"
                defaultValue={urlSearchParams.current.get("title")?.toString()}
                onChange={(e) => {
                  handleChangeQueryParameter("title", e.target.value);
                }}
              />
            </Box>
            <Box>
              <ButtonGroup>
                {Object.values(TaskStatus).map((value) => (
                  <Button
                    sx={{ borderColor: grey[500] }}
                    color="inherit"
                    key={value}
                    onClick={() => {
                      handleChangeStatuses(value);
                    }}
                  >
                    {value}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>

            <DatePickerProvider>
              <DatePicker
                defaultValue={dayjs(
                  urlSearchParams.current.get("from") || undefined
                )}
                label="稼働期間(開始)"
                slotProps={{ textField: { variant: "standard" } }}
                onChange={(value) => {
                  const dateStr = value?.format("YYYY-MM-DD") || "";
                  console.log(dateStr);
                  handleChangeQueryParameter("from", dateStr);
                }}
              />
              <span>-</span>
              <DatePicker
                defaultValue={dayjs(
                  urlSearchParams.current.get("to") || undefined
                )}
                label="稼働期間(終了)"
                slotProps={{ textField: { variant: "standard" } }}
                onChange={(value) => {
                  const dateStr = value?.format("YYYY-MM-DD") || "";
                  handleChangeQueryParameter("to", dateStr);
                }}
              />
            </DatePickerProvider>
          </Stack>
          <Box>
            <Button
              startIcon={<SearchIcon />}
              variant="contained"
              onClick={handleSearch}
            >
              検索
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
