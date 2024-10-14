"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { PDFReport } from "@/lib/definitions";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

export async function startWork(pathname: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("ログインをしてください");
  }

  const notEndWork = await prisma.dailyReport.findFirst({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
  });

  if (notEndWork) {
    // 型情報ではnullだが念のためnullまたはundefinedで評価
    if (notEndWork.endAt == null) {
      throw new Error("出勤するには退勤を行ってください");
    } else {
      throw new Error(
        "本日の勤務はすでに終了しています\n修正をされる場合はレポート全般より入力してください"
      );
    }
  }

  const now = dayjs().add(9, "hour");
  await prisma.dailyReport.create({
    data: {
      date: new Date(now.toDate().setHours(0, 0, 0, 0)),
      workStyle: "AtCompany",
      startAt: now.toDate(),
      userId,
    },
  });

  revalidatePath(pathname);
}

export async function endWork(pathname: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("ログインをしてください");
  }

  const latestWork = await prisma.dailyReport.findFirst({
    where: {
      userId,
      endAt: null,
    },
    orderBy: {
      startAt: "desc",
    },
  });

  if (!latestWork) {
    throw new Error("終了するタスクがありません");
  }

  const endAt = dayjs().add(9, "hour");
  const diff = endAt.diff(dayjs(latestWork.startAt), "minute");
  await prisma.dailyReport.update({
    where: {
      id: latestWork.id,
    },
    data: {
      endAt: dayjs().add(9, "hour").toDate(),
      workTimeHour: Math.floor(diff / 60),
      workTimeMinute: diff % 60,
    },
  });

  revalidatePath(pathname);
}

function fmtTimeToDate(
  date: Date,
  fmtTime: string | undefined
): Date | undefined {
  if (!fmtTime) return undefined;

  const yyyMmDd = dayjs(date).format("YYYY-MM-DD");
  // iso8601のフォーマットで変換
  return dayjs(`${yyyMmDd} ${fmtTime}`).add(9,"hour").toDate();
}

function fmtTimeToHourMinute(fmtTime: string): number[] {
  if (!fmtTime) return [0, 0];

  const hourStr = fmtTime.split(":")[0];
  const minuteStr = fmtTime.split(":")[1];

  const hour = hourStr.startsWith("0")
    ? Number.parseInt(hourStr.split("")[1])
    : Number.parseInt(hourStr);
  const minute = minuteStr.startsWith("0")
    ? Number.parseInt(minuteStr.split("")[1])
    : Number.parseInt(minuteStr);
  return [hour, minute];
}

export async function update(pdfReports: PDFReport[]) {
  console.log(pdfReports);
  const promises = pdfReports.map(async (pdfReoprt) => {
    const { id, date, start, end, breakTime, description } = pdfReoprt;
    const report = await prisma.dailyReport.findUnique({ where: { id } });

    if (!report) {
      throw new Error(
        "一部のデータがすでに削除されています\nページを再読み込み後再度操作してください。"
      );
    }

    const startAt = fmtTimeToDate(date, start);
    const endAt = fmtTimeToDate(date, end);
    let workTimeHour = 0;
    let workTimeMinute = 0;
    if (startAt && endAt) {
      const diff = dayjs(endAt).diff(dayjs(startAt), "minute");
      workTimeHour = Math.floor(diff / 60);
      workTimeMinute = diff % 60;
    }
    const [breakTimeHour, breakTimeMinute] = fmtTimeToHourMinute(breakTime);
    await prisma.dailyReport.update({
      where: {
        id,
      },
      data: {
        startAt,
        endAt,
        breakTimeHour,
        breakTimeMinute,
        description,
        workTimeHour,
        workTimeMinute,
      },
    });
  });

  await Promise.all(promises);
  console.log(promises.length);
  revalidatePath("/reports/common");
}
