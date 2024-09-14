"use server";

import prisma from "@/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function startWork(taskId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  const runningWork = await prisma.work.findFirst({
    where: {
      task: {
        project: {
          userId: userId!,
        },
      },
      endAt: null,
    },
  });

  if (runningWork) {
    throw new Error(
      "Already running work. To create new work, please stop the current work."
    );
  }

  await prisma.work.create({
    data: {
      taskId,
      startAt: new Date(),
    },
  });

  revalidatePath("/tasks");
}

export async function stopWork(taskId: string) {
  const runningWork = await prisma.work.findFirst({
    where: {
      taskId,
      endAt: null,
    },
  });

  if (!runningWork) {
    throw new Error(
      "No running work found. To stop work, please start the work first."
    );
  }

  const currentTime = new Date();

  await prisma.work.update({
    where: {
      id: runningWork.id,
    },
    data: {
      endAt: currentTime,
      totalTime: Math.floor(
        (currentTime.getTime() - runningWork.startAt.getTime()) / 60000
      ),
    },
  });

  revalidatePath("/tasks");
}
