"use client";

import { PDFReport, ReportForm } from "@/lib/definitions";
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
    
  }
  return (
    <Box maxWidth={1400}>
      <OpenPdfComponet pdfReports={pdfReports} />
      <ReportSaveButton pdfReports={commits.current}/>
      <TableContainer sx={{ width: "100%" }}>
        <Table sx={{ textWrap: "nowrap" }}>
          <TableHead>
            <TableRow>
              <TableCell width="5%">日付</TableCell>
              <TableCell width="5%">曜日</TableCell>
              <TableCell width="5%">種別</TableCell>
              <TableCell width="5%">出勤</TableCell>
              <TableCell width="5%">退勤</TableCell>
              <TableCell width="5%">休憩時間</TableCell>
              <TableCell>勤務内容</TableCell>
              <TableCell width="5%">勤務時間</TableCell>
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
