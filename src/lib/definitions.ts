import { TaskStatus, WorkStyle } from "@prisma/client";

export type TaskAndWorksQuery = {
  title?: string;
  statuses?: TaskStatus[];
  from?: Date;
  to?: Date;
};

export type PDFReport = {
  id: string | undefined;
  date: Date;
  day: string;
  dayOfWeek: string;
  workStyle: string | undefined;
  start: string | undefined;
  end: string | undefined;
  breakTime: string;
  description: string | undefined;
  workTime: string;
};

export type ReportForm = {
  readonly id: string;
  readonly date: Date;
  workStyle: WorkStyle;
  start: string | undefined;
  end: string | undefined;
  breakTime: string | undefined;
  descritpion: string | undefined;
};

export const dayOfWeeks: string[] = ["日", "月", "火", "水", "木", "金", "土"];

export const displayWorkStyle: { [key in WorkStyle]: string } = {
  AtCompany: "出勤",
  AtHome: "在宅出勤",
  Absent: "欠勤",
  DayOff: "休日",
};
