"use server";
import moment from "moment";

export async function createSetting(formData: FormData) {
  const start = formData.get("start") as string;
  const end = formData.get("end") as string;
  const breakTime = formData.get("breakTime") as string;
  console.log(moment(start, "HH時mm分"));
  console.log(moment(end, "HH時mm分"));
  console.log(moment(breakTime, "HH時間mm分"));
}
