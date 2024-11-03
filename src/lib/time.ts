import dayjs from "dayjs";

export function minutesToHoursMinutes(minutes: number): string {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return `${hour.toString()}時間${minute.toString()}分`;
}

export function minutesBetween(from: Date, to: Date): number {
  return dayjs(to).diff(dayjs(from), "m");
}
