"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import parseFiledErros from "@/validation/parseValidationError";
import { TaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
// バリデーションを定義
const validationSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください")
    .max(32, "32文字以内で入力してください"),
  description: z
    .string()
    .trim()
    .max(200, "200文字以内で入力してください")
    .optional(),
  status: z.nativeEnum(TaskStatus),
});

/**
 * Create a task.
 * @param prevState
 * @param formData
 * @returns
 */
export async function createTask(prevState: any, formData: FormData) {
  console.log(formData);
  // ログイン済みかの確認
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return {
      message: "Unauthorized",
      error: {},
    };
  }

  const validationFields = validationSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!validationFields.success) {
    const errors = {
      error: parseFiledErros(validationFields.error),
      message: "入力内容に誤りがあります。入力内容をご確認ください。",
    };

    console.warn("Task", errors);
    return errors;
  }

  // 選択中のプロジェクトが無ければエラーにする
  const project = await prisma.project.findUnique({
    where: { selecterId: user.id },
  });
  if (!project) {
    throw new Error("Project not found");
  }
  const { title, description, status } = validationFields.data;
  await prisma.task.create({
    data: {
      title,
      description,
      status,
      projectId: project.id,
    },
  });

  revalidatePath("/tasks");
}

export async function updateTask(prevState: any, formData: FormData) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return {
      message: "Unauthorized",
      error: {},
    };
  }

  const validationFields = validationSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!validationFields.success) {
    const errors = {
      error: parseFiledErros(validationFields.error),
      message: "入力内容に誤りがあります。入力内容をご確認ください。",
    };

    console.warn("Task", errors);
    return errors;
  }

  const project = await prisma.project.findUnique({
    where: {
      selecterId: user.id,
    },
  });
  if (!project) {
    throw new Error("proejct not found");
  }

  const { id, title, description, status } = validationFields.data;
  await prisma.task.update({
    where: {
      projectId: project.id,
      id,
    },
    data: {
      title,
      description,
      status,
    },
  });

  revalidatePath("/tasks");
}

export async function updateCardBgColor(taskId: string, cardBgColor: string) {
  // ログイン済みかの確認
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    return { message: "Unauthorized" };
  }

  // 選択中のプロジェクトがなければエラー
  const project = await prisma.project.findUnique({
    where: { selecterId: user.id },
  });
  if (!project) {
    throw new Error("Project not founed");
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

/**
 * Delete a task that created by the user.
 * @param taskId
 * @returns
 */
export async function deleteTask(taskId: string) {
  // ログイン済みかの確認
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    return { message: "Unauthorized" };
  }

  // 選択中のプロジェクトがなければエラー
  const project = await prisma.project.findUnique({
    where: { selecterId: user.id },
  });
  if (!project) {
    throw new Error("Project not found");
  }

  await prisma.task.delete({ where: { id: taskId, projectId: project.id } });

  revalidatePath("/tasks");
}
