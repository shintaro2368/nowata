"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { taskValidation } from "@/lib/validation";
import { parseWithZod } from "@conform-to/zod";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

export async function createTask(prevState: unknown, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("ログインをしてください");
  }

  const submission = await parseWithZod(formData, {
    schema: taskValidation,
    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { title, description, status, dueDate } = submission.value;

  // 選択中のプロジェクトが無ければエラーにする
  const project = await prisma.project.findUnique({
    where: { selecterId: userId },
  });
  if (!project) {
    throw new Error("プロジェクトが選択されていません");
  }

  await prisma.task.create({
    data: {
      title,
      description,
      status,
      dueDate: dueDate ? dayjs(dueDate).add(9, "hour").toDate() : null,
      projectId: project.id,
    },
  });

  revalidatePath("/tasks");
}

export async function updateTask(prevState: unknown, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("ログインをしてください");
  }

  const submission = await parseWithZod(formData, {
    schema: taskValidation,
    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const project = await prisma.project.findUnique({
    where: {
      selecterId: userId,
    },
  });
  if (!project) {
    throw new Error("プロジェクトが選択されていません");
  }

  const { id, title, description, status, dueDate } = submission.value;
  await prisma.task.update({
    where: {
      projectId: project.id,
      id,
    },
    data: {
      title,
      description,
      status,
      dueDate: dueDate ? dayjs(dueDate).add(9, "hour").toDate() : null,
    },
  });

  revalidatePath("/tasks");
}

export async function updateCardBgColor(taskId: string, cardBgColor: string) {
  // ログイン済みかの確認
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("ログインをしてください");
  }

  // 選択中のプロジェクトがなければエラー
  const project = await prisma.project.findUnique({
    where: { selecterId: userId },
  });
  if (!project) {
    throw new Error("プロジェクトを選択してください");
  }

  await prisma.task.update({
    where: {
      id: taskId,
      projectId: project.id,
    },
    data: {
      cardBgColor,
    },
  });
}

export async function deleteTask(taskId: string) {
  // ログイン済みかの確認
  const session = await auth();
  const userId = session?.user?.id;
  if (userId) {
    throw new Error("ログインをしてください");
  }

  // 選択中のプロジェクトがなければエラー
  const project = await prisma.project.findUnique({
    where: { selecterId: userId },
  });
  if (!project) {
    throw new Error("プロジェクトを選択してください");
  }
  await prisma.task.delete({ where: { id: taskId, projectId: project.id } });

  revalidatePath("/tasks");
}
