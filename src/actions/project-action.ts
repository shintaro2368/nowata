"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { hourValidation, minuteValidation } from "@/lib/validation";
import parseFiledErros from "@/validation/parseValidationError";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const maxProjectSize: number = 10;
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
  minimumWorkHour: hourValidation.optional(),
  minimumWorkMinute: minuteValidation.optional(),
  standardWorkHour: hourValidation.optional(),
  standardWorkMinute: minuteValidation.optional(),
  maximumWorkHour: hourValidation.optional(),
  maximumWorkMinute: minuteValidation.optional(),
});

/**
 * プロジェクトの作成と設定の初期化を行います。これらは同一トランザクション内で実行されます。
 * @param userId ユーザーID
 * @param title プロジェクトタイトル
 * @param description プロジェクト概要
 * @returns Promiseオブジェクト
 */
async function initProjectAndSetting(
  userId: string,
  title: string,
  description: string | undefined
) {
  await prisma.$transaction(async (tx) => {
    const project = await prisma.project.create({
      data: {
        userId,
        title,
        description,
      },
    });

    await prisma.setting.create({
      data: {
        projectId: project.id,
      },
    });
  });
}

/**
 * プロジェクトの作成を行います。
 * @param prevState
 * @param formData フォームデータ
 * @returns 入力内容に誤りがあればバリデーションメッセージを返却
 */
export async function createProject(prevState: any, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("ログインしてください");
  }

  const count = await prisma.project.count({ where: { userId: userId } });
  if (count >= maxProjectSize) {
    return {
      message: `プロジェクトは${maxProjectSize}件まで作成できます`,
      error: {},
    };
  }

  const validationFields = validationSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!validationFields.success) {
    console.warn("project", validationFields.data);
    return {
      message: "入力内容に誤りがあります\n入力内容をご確認ください",
      error: parseFiledErros(validationFields.error),
    };
  }

  const { title, description } = validationFields.data;
  // プロジェクトの作成と設定の初期化
  await initProjectAndSetting(userId, title, description);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updataProject(prevState: any, formDate: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("ログインしてください");
  }

  const project = await prisma.project.findUnique({
    where: {
      selecterId: userId,
    },
  });

  if (!project) {
    throw new Error("プロジェクトが存在しません");
  }

  const validationFields = validationSchema.safeParse(
    Object.fromEntries(formDate)
  );

  if (!validationFields.success) {
    return {
      message: "入力内容に誤りがあります。入力内容をご確認ください。",
      error: parseFiledErros(validationFields.error),
    };
  }

  const {
    title,
    description,
    minimumWorkHour,
    minimumWorkMinute,
    standardWorkHour,
    standardWorkMinute,
    maximumWorkHour,
    maximumWorkMinute,
  } = validationFields.data;
  await prisma.project.update({
    where: {
      id: project.id,
    },
    data: {
      title,
      description,
      minimumWorkHour,
      minimumWorkMinute,
      standardWorkHour,
      standardWorkMinute,
      maximumWorkHour,
      maximumWorkMinute,
    },
  });
  revalidatePath("/settings");
}

/**
 * 選択中のプロジェクトがあれば解除し、新たな選択中のプロジェクトを設定します。
 * @param projectId プロジェクトID
 * @param userId ユーザーID
 * @returns Promiseオブジェクト
 */
async function subUpdateSelectProject(projectId: string, userId: string) {
  await prisma.$transaction(async (tx) => {
    const oldSeldctProject = await prisma.project.findUnique({
      where: { selecterId: userId },
    });

    // 別のプロジェクトを選択中だった場合は解除させる
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
  });
}

/**
 * 選択中のプロジェクトを更新します。
 * @param projectId プロジェクトID
 */
export async function updateSelectProject(projectId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("ログインしてください。");
  }

  await subUpdateSelectProject(projectId, userId);

  revalidatePath("/dashboard");
}
