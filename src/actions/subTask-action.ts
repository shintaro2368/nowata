"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { subTaksValidation } from "@/lib/validation";
import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";

export async function create(formState: unknown, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("ログインしてください");
  }

  const submission = await parseWithZod(formData, {
    schema: subTaksValidation,
    async: true,
  });
  console.log(submission);

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { id, description } = submission.value;
  const task = await prisma.task.findFirst({
    where: {
      id,
      project: {
        selecterId: userId,
      },
    },
  });

  if (!task) {
    throw new Error("サブタスクを追加するタスクが見つかりません");
  }

  console.debug(formData);
  await prisma.subTask.create({
    data: {
      taskId: task.id,
      description,
    },
  });
  revalidatePath("/tasks");
  return submission.reply({ resetForm: true });
}

export async function doneSubTask(id: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("ログインしてください");
  }

  await prisma.subTask.update({
    where: {
      id,
      task: { project: { selecterId: userId } },
    },
    data: { done: true },
  });

  revalidatePath("/tasks");
}
