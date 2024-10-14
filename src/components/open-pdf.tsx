"use client";

import { createManyDailyReport } from "@/actions/seeds/seed";
import { PDFReport } from "@/lib/definitions";
import openPdf from "@/lib/pdf";
import Button from "@mui/material/Button";
import { useState } from "react";

export default function OpenPdfComponet({
  pdfReports,
}: {
  pdfReports: PDFReport[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <Button
        onClick={async () => {
          setIsLoading(true);
          await openPdf(pdfReports);
          setIsLoading(false);
        }}
        disabled={isLoading}
        variant="outlined"
      >
        PDFを表示
      </Button>
      <Button
        onClick={async () => {
          await createManyDailyReport();
        }}
      >
        テストデータ作成
      </Button>
    </>
  );
}
