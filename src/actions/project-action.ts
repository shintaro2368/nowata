"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import parseFiledErros from "@/validation/parseValidationError";

const validationSchema = z.object({
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
});

export async function createProject(prevState: any, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return {
      message: "Unauthorized",
      error: {},
    };
  }

  const count = await prisma.project.count({ where: { userId: userId } });
  if (count >= 10) {
    return {
      message: "プロジェクトは10件まで作成できます",
      error: {},
    };
  }

  const validationFields = validationSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!validationFields.success) {
    console.warn("project", validationFields.data);
    return {
      message: "入力内容に誤りがあります。入力内容をご確認ください。",
      error: parseFiledErros(validationFields.error),
    };
  }

  const { title, description } = validationFields.data;
  await prisma.project.create({
    data: {
      title,
      description,
      userId,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateSelectProject(projectId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  const oldSeldctProject = await prisma.project.findUnique({
    where: { selecterId: userId },
  });
  if (oldSeldctProject) {
    await prisma.project.update({
      where: { id: oldSeldctProject.id },
      data: { selecterId: null },
    });
  }
  await prisma.project.update({
    where: { id: projectId },
    data: { selecterId: userId },
  });

  revalidatePath("/dashboard");
}
