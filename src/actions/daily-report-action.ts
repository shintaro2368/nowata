"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { PDFReport } from "@/lib/definitions";
import { minutesBetween } from "@/lib/time";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function attendance() {
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

  const now = dayjs().add(9, "hour");
  const today = dayjs().startOf("d").add(9, "hour");

  if (notEndWork) {
    // 型情報ではnullだが念のためnullまたはundefinedで評価
    if (notEndWork.endAt == null) {
      throw new Error("出勤するには退勤を行ってください");
    }
    if (dayjs(notEndWork.date).isSame(today)) {
      throw new Error(
        "本日の勤務はすでに終了しています\n修正をされる場合はレポート全般より入力してください"
      );
    }
  }

  await prisma.dailyReport.create({
    data: {
      date: today.toDate(),
      workStyle: "AtCompany",
      startAt: now.toDate(),
      userId,
    },
  });

  //revalidatePath(pathname);
  redirect("/dashboard");
}

export async function leave(pathname: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("ログインをしてください");
  }

  await prisma.$transaction(async (tx) => {
    // 出勤データを取得
    const latestWork = await tx.dailyReport.findFirst({
      where: {
        userId,
        endAt: null,
        NOT: [{startAt: null}]
      },
      orderBy: {
        startAt: "desc",
      },
    });

    if (!latestWork) {
      throw new Error("退勤を行うには、出勤を行ってください");
    }

    const now = dayjs().add(9, "hour").toDate();
    // 退勤処理を行う
    // 出勤時刻と退勤時刻から勤務時間の計算を行う
    const diff = minutesBetween(latestWork.startAt!, now);
    await tx.dailyReport.update({
      where: {
        id: latestWork.id,
      },
      data: {
        endAt: now,
        workTimeHour: Math.floor(diff / 60),
        workTimeMinute: diff % 60,
      },
    });

    // アクティブなプロジェクトに紐づく作業を全て終了させる
    const notEndWorks = await tx.work.findMany({
      where: { task: { project: { selecterId: userId } }, endAt: null },
    });
    if (notEndWorks.length > 0) {
      await Promise.all(
        notEndWorks.map(async (work) => {
          return tx.work.update({
            where: { id: work.id },
            data: { endAt: now, totalTime: minutesBetween(work.startAt, now) },
          });
        })
      );
    }

    // プロジェクトを非アクティブにする
    try {
      await tx.project.update({
        where: { selecterId: userId },
        data: { selecterId: null },
      });
    } catch (e) {
      // Updateするレコードがないときに発生するエラーであれば正常とする
      // この方法は公式Docが提示しているので、正攻法なのだろう
      if (
        !(
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2025"
        )
      ) {
        console.error("Error while updating project", e);
        throw new Error();
      }
    }
  });

  revalidatePath(pathname);
}

export async function cancelLeave(pathname: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("ログインをしてください");
  }

  const lastReport = await prisma.dailyReport.findFirst({
    where: { userId, NOT: [{startAt: null}] },
    orderBy: { createdAt: "desc" },
  });

  if (!lastReport) throw new Error("出勤をされていません");
  if (!lastReport.endAt)
    throw new Error("退勤はされていません\n引き続き勤務を行うことができます");

  const today = dayjs().startOf("d").add(9, "hour").toDate();
  if (!dayjs(lastReport.date).isSame(today))
    throw new Error(
      "同日の場合に限り、退勤の取消ができます\n新たに出勤を行ってください"
    );

  // 退勤時刻を取り消す
  await prisma.dailyReport.update({
    where: { id: lastReport.id },
    data: { endAt: null },
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
  return dayjs(`${yyyMmDd} ${fmtTime}`).add(9, "hour").toDate();
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
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("ログインをしてください");
  }

  const promises = pdfReports.map(async (pdfReoprt) => {
    const { id, date, start, end, breakTime, description } = pdfReoprt;
    const report = await prisma.dailyReport.findUnique({ where: { id } });

    if (!pdfReoprt.id && !report) {
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
    if (pdfReoprt.id) {
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
    } else {
      // await prisma.dailyReport.create({
      //   data: {
      //     userId,
      //     date,
      //     startAt,
      //     endAt,
      //     breakTimeHour,
      //     breakTimeMinute,
      //     description,
      //     workTimeHour,
      //     workTimeMinute
      //   }
      // })
    }
  });

  await Promise.all(promises);
  console.log(promises.length);
  revalidatePath("/reports/common");
}
