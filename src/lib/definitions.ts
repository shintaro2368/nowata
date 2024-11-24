import { TaskStatus, WorkStyle, Task, SubTask, Work } from "@prisma/client";

export type TaskAndWorksQuery = {
  title?: string;
  statuses?: TaskStatus[];
  from?: Date;
  to?: Date;
};

export type DisplayWorkStyle = "出勤" | "在宅勤務" | "欠勤" | "休日";

export const workStyleKeyValue: { [key in WorkStyle]: DisplayWorkStyle } = {
  AtCompany: "出勤",
  AtHome: "在宅勤務",
  Absent: "欠勤",
  DayOff: "休日",
};

export type PDFReport = {
  id: string | undefined;
  date: Date;
  day: string;
  dayOfWeek: string;
  workStyle: WorkStyle | undefined;
  displayWorkStyle: DisplayWorkStyle | undefined;
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

export type WideTask = (Task & {Work: Work[], SubTask: SubTask[]});
