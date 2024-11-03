"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { workDescriptionValidation } from "@/lib/validation";
import { parseWithZod } from "@conform-to/zod";
import { TaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type WorkSearchProp = {
  taskTitle: string | undefined;
  from: Date | undefined;
  to: Date | undefined;
  status: TaskStatus[] | undefined;
};


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

export async function searchWork(param: WorkSearchProp) {
  const { taskTitle, status, from, to } = param;

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("");
  }

  const tasks = prisma.task.findMany({
    where: {
      title: {
        contains: taskTitle ? taskTitle : undefined,
      },
      OR: status?.map((status) => ({ status })),
      project: {
        selecterId: userId,
      },
    },
    include: {
      Work: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return tasks;
}

export async function editDescirption(prevState: unknown, formDate: FormData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("ログインをしてください");
  }

  const submission = await parseWithZod(formDate, {
    schema: workDescriptionValidation,
    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { id, description } = submission.value;
  await prisma.work.update({
    where: { id, task: { project: { selecterId: userId } } },
    data: { description },
  });
}
