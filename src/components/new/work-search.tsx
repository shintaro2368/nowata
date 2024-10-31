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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import DatePickerProvider from "../date-picker-provider";

export default function WorkSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const urlSearchParams = useRef<URLSearchParams>(
    new URLSearchParams(searchParams)
  );

  const [selectedStatus, setSelectedStatus] = useState<TaskStatus[]>([]);

  // ステータスの選択(スタイル)の反英
  function handleSetSelectedStatus(status: TaskStatus) {
    if (selectedStatus.includes(status)) {
      const newStatus = selectedStatus.filter((s) => s !== status);
      setSelectedStatus(newStatus);
    } else {
      setSelectedStatus((prev) => [...prev, status]);
    }
  }

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
                    variant={
                      selectedStatus.includes(value) ? "contained" : "outlined"
                    }
                    color={selectedStatus.includes(value) ? "info" : "inherit"}
                    key={value}
                    onClick={() => {
                      handleChangeStatuses(value);
                      handleSetSelectedStatus(value);
                    }}
                  >
                    {value}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>

            <DatePickerProvider>
              <DatePicker
                label="稼働期間(開始)"
                slotProps={{ textField: { variant: "standard" } }}
                onChange={(value) => {
                  const dateStr = value?.format("YYYY-MM-DD") || "";
                  handleChangeQueryParameter("from", dateStr);
                }}
              />
              <span>-</span>
              <DatePicker
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
              className="mr-3"
            >
              検索
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
