import { update } from "@/actions/daily-report-action";
import { PDFReport } from "@/lib/definitions";
import Button from "@mui/material/Button";
import { useState } from "react";

export default function ReportSaveButton({
  pdfReports,
}: {
  pdfReports: PDFReport[];
}) {
  const [disabled, setDisabled] = useState(false);
  async function handleOnClick() {
    setDisabled(true);
    if (pdfReports.length > 0) await update(pdfReports);
    setDisabled(false);
  }
  return (
    <Button disabled={disabled} onClick={async () => await handleOnClick()}>
      変更を保存
    </Button>
  );
}
