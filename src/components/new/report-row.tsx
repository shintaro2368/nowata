import { PDFReport, workStyleKeyValue } from "@/lib/definitions";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { WorkStyle } from "@prisma/client";
import dayjs from "dayjs";
import { useState } from "react";
import TimeMask from "./time-mask";

export type InputReport = Pick<
  PDFReport,
  "workStyle" | "start" | "end" | "breakTime" | "description"
>;

export default function ReportRow({
  pdfReport,
  handleAddCommits,
}: {
  pdfReport: PDFReport;
  handleAddCommits: (pdfReport: PDFReport) => void;
}) {
  const [inputReport, setInputReport] = useState<InputReport>({ ...pdfReport });
  // 本日より未来日のデータは編集不可にする
  const disabled = dayjs(pdfReport.date).isAfter(dayjs(), "day");
  const notWorkedDate =
    inputReport.workStyle === WorkStyle.Absent ||
    inputReport.workStyle === WorkStyle.DayOff;

  function handleOnChange(key: keyof InputReport, value: string | undefined) {
    if (inputReport[key] === value) return;

    const obj = {
      [key]: value,
    };
    const newObj = { ...inputReport, ...obj };
    setInputReport(newObj);
    handleAddCommits({ ...pdfReport, ...newObj });
  }

  return (
    <TableRow
      key={pdfReport.id}
      sx={{
        "& > .MuiTableCell-root": { padding: 0, height: 30 },
        backgroundColor:
          inputReport.workStyle === WorkStyle.DayOff ? "gray" : "inherit",
      }}
    >
      <TableCell align="center">{pdfReport.day}</TableCell>
      <TableCell align="center">{pdfReport.dayOfWeek}</TableCell>
      <TableCell align="center">
        <select
          value={disabled ? undefined : inputReport.workStyle}
          className="text-center w-full h-full bg-inherit appearance-none"
          onChange={(e) => handleOnChange("workStyle", e.target.value)}
          disabled={disabled}
        >
          {disabled && <option value={undefined}></option>}
          {Object.entries(workStyleKeyValue).map((entry) => (
            <option key={`${pdfReport.id}-${entry[0]}`} value={entry[0]}>
              {entry[1]}
            </option>
          ))}
        </select>
      </TableCell>
      <TableCell align="right">
        <TimeMask
          disabled={disabled || notWorkedDate}
          value={inputReport.start}
          handleOnAccept={(value: string) => handleOnChange("start", value)}
        />
      </TableCell>
      <TableCell align="right">
        <TimeMask
          disabled={disabled || notWorkedDate}
          value={inputReport.end}
          handleOnAccept={(value: string) => handleOnChange("end", value)}
        />
      </TableCell>
      <TableCell align="right">
        <TimeMask
          disabled={disabled || notWorkedDate}
          value={inputReport.breakTime}
          handleOnAccept={(value: string) => handleOnChange("breakTime", value)}
        />
      </TableCell>
      <TableCell align="left">
        <input
          disabled={disabled}
          type="text"
          defaultValue={inputReport.description}
          className="w-full h-full bg-inherit"
          onChange={(e) => handleOnChange("description", e.target.value)}
        />
      </TableCell>

      <TableCell align="right">{pdfReport.workTime}</TableCell>
    </TableRow>
  );
}
