import { auth } from "@/auth";
import ReportList from "@/components/new/report-list";
import prisma from "@/db";
import { dayOfWeeks, displayWorkStyle, PDFReport} from "@/lib/definitions";
import { DailyReport } from "@prisma/client";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const startOfCurrentMonth = dayjs().startOf("month");
const endOfCurrentMonth = dayjs().endOf("month");

function fmtTime(hour: number, minutes: number): string {
  return `${hour < 10 ? "0" : ""}${hour}:${minutes < 10 ? "0" : ""}${minutes}`;
}

function createPDFReport(from: Dayjs, to: Dayjs, reports: DailyReport[]): PDFReport[] {
  const pdfReports: PDFReport[] =[];

  const diff = to.diff(from, "day");
  
  for(let i = 0; i <= diff; i++) {
    const targetDate = from.add(i, "day").add(9, "hour");
    
    const record = reports.find(report => report.date.toDateString() === targetDate.toDate().toDateString());
    // console.log(record);
    const id = record ? record.id : undefined;
    const date = targetDate.toDate();
    const day = `${targetDate.get("M") + 1}/${targetDate.get("D")}`;
    const dayOfWeek = dayOfWeeks[targetDate.day()];
    const workStyle = record ? displayWorkStyle[record.workStyle] : undefined;
    const start = record?.startAt ? dayjs(record.startAt).utc().format("HH:mm") : undefined;
    const end = record?.endAt ? dayjs(record.endAt).utc().format("HH:mm") : undefined;
    const breakTime = fmtTime(record ? record.breakTimeHour:0, record ? record.breakTimeMinute:0);
    const description = record?.description ? record.description : undefined;
    const workTime = fmtTime(record ? record.workTimeHour : 0, record ? record.workTimeMinute : 0);
  
    pdfReports.push({
      id,
      date,
      day,
      dayOfWeek,
      workStyle,
      start,
      end,
      breakTime,
      description,
      workTime,
    });
  }
  return pdfReports;
}

export default async function ReportsCommon() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return new Error("Unautorized");
  }

  const reports = await prisma.dailyReport.findMany({
    where: {
      userId,
      reportType: "Common",
      date: {
        gte: startOfCurrentMonth.toDate(),
        lte: endOfCurrentMonth.toDate(),
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  
  const pdfReports = createPDFReport(startOfCurrentMonth, endOfCurrentMonth, reports);
  return <ReportList pdfReports={pdfReports} />;
}
