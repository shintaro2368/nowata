"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { revalidatePath } from "next/cache";

export async function startWork() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const notEndWork = await prisma.dailyReport.findFirst({
    where: {
      userId,
      endAt: null,
    },
  });

  if (notEndWork) {
    throw new Error(
      "Already running work. To start new work, please end the current work."
    );
  }

  const setting = await prisma.setting.findFirst({
    where: {
      project: {
        selecterId: userId,
      }
    }
  })
  
  await prisma.dailyReport.create({
    data: {
      date: new Date(),
      workStyle: "AtCompany",
      startAt: new Date(),
      userId,
      breakTime: 1,
    },
  });

  revalidatePath("/dashboard");
}

export async function endWork() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return {
      error: "Unauthorized",
    };
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
    return {
      error: "Not report to end work.",
    };
  }
  await prisma.dailyReport.update({
    where: {
      id: latestWork.id,
    },
    data: {
      endAt: new Date(),
    },
  });

  revalidatePath("/dashboard");
}
