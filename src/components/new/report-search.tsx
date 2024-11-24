"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import DatePickerProvider from "../date-picker-provider";

export default function ReportSearch() {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const urlSearchParams = useRef<URLSearchParams>(
    new URLSearchParams(searchParams)
  );

  return (
    <Box component="div" padding={2} bgcolor="#fff" margin={2} borderRadius={2}>
      <DatePickerProvider>
        <Stack spacing={1}>
          <Stack direction="row" spacing={2}>
            <DatePicker label="開始日" />
            <DatePicker label="終了日" />
          </Stack>

          <Box>
            <Button variant="contained" fullWidth={false}>
              期間を指定
            </Button>
          </Box>
        </Stack>
      </DatePickerProvider>
    </Box>
  );
}
