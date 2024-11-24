"use client";

import { PDFReport } from "@/lib/definitions";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useRef } from "react";
import OpenPdfComponet from "../open-pdf";
import ReportRow from "./report-row";
import ReportSaveButton from "./report-save-button";
dayjs.extend(utc);

export default function ReportList({
  pdfReports,
}: {
  pdfReports: PDFReport[];
}) {
  const commits = useRef<PDFReport[]>([]);
  function handleAddCommits(pdfReport: PDFReport) {
    const existIndex = commits.current.findIndex(
      (commit) => commit.id === pdfReport.id
    );
    if (existIndex !== -1) {
      commits.current[existIndex] = pdfReport;
    } else {
      commits.current.push(pdfReport);
    }
    console.log(commits.current)
  }
  return (
    <Box padding={2}>
      <OpenPdfComponet pdfReports={pdfReports} />
      <ReportSaveButton pdfReports={commits.current} />
      <TableContainer className="w-full flex bg-white p-2 rounded-lg">
        <Table sx={{ textWrap: "nowrap" }}>
          <TableHead>
            <TableRow>
              <TableCell width="5%" className="p-0">
                <p className="bg-gray-100 m-1 p-4 rounded-lg">日付</p>
              </TableCell>
              <TableCell width="5%" className="p-0">
                <p className="bg-gray-100 m-1 p-4 rounded-lg">曜日</p>
              </TableCell>
              <TableCell width="5%" className="p-0">
                <p className="bg-gray-100 m-1 p-4 rounded-lg">種別</p>
              </TableCell>
              <TableCell width="5%" className="p-0">
                <p className="bg-gray-100 m-1 p-4 rounded-lg">出勤</p>
              </TableCell>
              <TableCell width="5%" className="p-0">
                <p className="bg-gray-100 m-1 p-4 rounded-lg">退勤</p>
              </TableCell>
              <TableCell width="5%" className="p-0">
                <p className="bg-gray-100 m-1 p-4 rounded-lg">休憩時間</p>
              </TableCell>
              <TableCell className="p-0">
                <p className="bg-gray-100 m-1 p-4 rounded-lg">勤務内容</p>
              </TableCell>
              <TableCell width="5%" className="p-0">
                <p className="bg-gray-100 m-1 p-4 rounded-lg">勤務時間</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pdfReports.map((pdfReport) => (
              <ReportRow
                pdfReport={pdfReport}
                handleAddCommits={handleAddCommits}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
