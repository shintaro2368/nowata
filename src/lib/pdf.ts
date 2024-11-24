import fontkit from "@pdf-lib/fontkit";
import { PageSizes, PDFDocument, PDFFont, rgb } from "pdf-lib";
import { PDFReport } from "./definitions";

type omit = Omit<PDFReport, "id" | "date" | "workStyle">;

const property = {
  padding: {
    top: 12,
    left: 12,
    right: 12,
    bottom: 100,
  },
  title: {
    value: "勤務表",
    size: 16,
    margin: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 60,
    },
  },
  metaInfo: {
    period: "2024年10月分",
    workerName: "桝井 真太郎",
  },
  columns: {
    height: 20,
    cells: [
      { value: "日付", widthP: 5 },
      { value: "曜日", widthP: 5 },
      { value: "種別", widthP: 10 },
      { value: "出勤", widthP: 10 },
      { value: "退勤", widthP: 10 },
      { value: "休憩時間", widthP: 10 },
      { value: "備考", widthP: 40 },
      { value: "勤務時間", widthP: 10 },
    ],
  },
};

export default async function openPdf(pdfReports: PDFReport[]) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setAuthor("Nowata");
  pdfDoc.setSubject("勤務表");
  pdfDoc.setTitle("勤務表");

  const fontBytes = await fetch("/fonts/NotoSerifJP-Regular.ttf").then((res) =>
    res.arrayBuffer()
  );
  pdfDoc.registerFontkit(fontkit);
  const font = await pdfDoc.embedFont(fontBytes);
  console.log(font.heightAtSize(12));
  console.log(font.heightAtSize(12, { descender: false }));

  // 595.28, 841.89
  // 左下0,0
  const page = pdfDoc.addPage(PageSizes.A4);
  const { width, height } = page.getSize();

  // 勤務表のタイトルを描画
  const titleProp = {
    x: getCenterX(width, property.title.value, font, property.title.size),
    y: height - font.heightAtSize(property.title.size) - property.padding.top,
  };
  page.drawText(property.title.value, {
    x: titleProp.x,
    y: titleProp.y,
    font,
    size: property.title.size,
  });

  // TODO 氏名
  // TODO 期間

  const outerTableProps = {
    x: property.padding.left,
    y: property.padding.bottom,
    width: width - (property.padding.left + property.padding.right),
    height:
      height -
      (height - titleProp.y) -
      property.title.margin.bottom -
      property.padding.bottom,
  };
  page.drawRectangle({
    x: outerTableProps.x,
    y: outerTableProps.y,
    width: outerTableProps.width,
    height: outerTableProps.height,
    opacity: 0,
    borderWidth: 1,
    borderOpacity: 1,
    //color: rgb(126/256,126/256,126/256),
  });

  page.drawLine({
    start: {
      x: outerTableProps.x,
      y: outerTableProps.y + outerTableProps.height - property.columns.height,
    },
    end: {
      x: outerTableProps.x + outerTableProps.width,
      y: outerTableProps.y + outerTableProps.height - property.columns.height,
    },
    opacity: 1,
  });

  let buf = outerTableProps.x;
  property.columns.cells.forEach((cell) => {
    const cellWidth = outerTableProps.width * (cell.widthP / 100);
    const next = buf + cellWidth;

    page.drawText(cell.value, {
      x: next - cellWidth / 2 - font.widthOfTextAtSize(cell.value, 12) / 2,
      y:
        outerTableProps.y +
        outerTableProps.height -
        property.columns.height / 2 -
        12 / 2 +
        1,
      font,
      size: 12,
    });

    // nextStartX = outerTableProps.width * (cell.widthP / 100);
    page.drawLine({
      start: {
        x: next,
        y: outerTableProps.y + outerTableProps.height,
      },
      end: { x: next, y: outerTableProps.y },
    });

    buf += cellWidth;
  });

  const bodyHeight = outerTableProps.height - property.columns.height;
  const rowHeight = pdfReports.length > 0 ? bodyHeight / pdfReports.length : 0;
  let lineStart =
    outerTableProps.y + outerTableProps.height - property.columns.height;
  pdfReports.forEach((pdfReport) => {
    const omitedPdfReport: omit = {
      day: pdfReport.day,
      dayOfWeek: pdfReport.dayOfWeek,
      displayWorkStyle: pdfReport.displayWorkStyle,
      start: pdfReport.start,
      end: pdfReport.end,
      breakTime: pdfReport.breakTime,
      description: pdfReport.description,
      workTime: pdfReport.workTime,
    };
    
    lineStart -= rowHeight;
    if (omitedPdfReport.displayWorkStyle === "休日") {
      page.drawRectangle({
        x: outerTableProps.x,
        y: lineStart,
        width: outerTableProps.width,
        height: rowHeight,
        borderWidth: 0,
        opacity: 0.4,
        color: rgb(126 / 255, 126 / 255, 126 / 255),
      });
    }
    page.drawLine({
      start: { x: outerTableProps.x, y: lineStart },
      end: { x: outerTableProps.x + outerTableProps.width, y: lineStart },
    });

    let bufX = outerTableProps.x;

    Object.values(omitedPdfReport).forEach((entry, index) => {
      const cellWidth =
        outerTableProps.width * (property.columns.cells[index].widthP / 100);

      page.drawText(entry ? entry : "", {
        x:
          bufX +
          cellWidth / 2 -
          font.widthOfTextAtSize(entry ? entry : "", 11) / 2,
        y: lineStart + rowHeight / 2 - 11 / 2 + 1,
        font,
        size: 11,
      });

      bufX += cellWidth;
    });
  });

  window.open(
    URL.createObjectURL(
      new Blob([await pdfDoc.save()], { type: "application/pdf" })
    )
  );
}

function getCenterX(
  parentWidth: number,
  text: string,
  font: PDFFont,
  fontSize: number
): number {
  const textWidth = font.widthOfTextAtSize(text, fontSize);
  return parentWidth / 2 - textWidth / 2;
}
