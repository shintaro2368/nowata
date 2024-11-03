"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { projectValidation } from "@/lib/validation";
import { parseWithZod } from "@conform-to/zod";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const maxProjectSize: number = 10;
/**
 * プロジェクトの作成を行います。
 * @param prevState
 * @param formData
 * @returns
 */
export async function createProject(prevState: unknown, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("ログインしてください");
  }
  // TODO Conformでカスタムバリデーションメッセージを返却するには?
  // const count = await prisma.project.count({ where: { userId: userId } });
  // if (count >= maxProjectSize) {
  //   return {
  //     message: `プロジェクトは${maxProjectSize}件まで作成できます`,
  //     error: {},
  //   };
  // }

  const submission = await parseWithZod(formData, {
    schema: projectValidation,
    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { title, description } = submission.value;
  // プロジェクトの作成と設定の初期化
  await prisma.project.create({
    data: {
      userId,
      title,
      description,
    },
  });

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

  const submission = await parseWithZod(formDate, {
    schema: projectValidation,
    async: true,
  });
  if (submission.status != "success") {
    return submission.reply();
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
  } = submission.value;

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
 * 選択中のプロジェクトを更新します。
 * @param projectId プロジェクトID
 */
export async function updateSelectProject(projectId: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("ログインしてください。");
  }

  await prisma.$transaction(async (tx) => {
    // 現在アクティブなプロジェクトを取得
    const currentActiveProject = await tx.project.findUnique({
      where: { selecterId: userId },
    });

    if (currentActiveProject) {
      // 非アクティブにする
      await tx.project.update({
        where: { id: currentActiveProject.id },
        data: { selecterId: null },
      });

      // 非アクティブにさせたプロジェクトの作業を全て終了させる
      const now = dayjs().add(9, "hour").toDate();
      await tx.work.updateMany({
        where: { task: { projectId: currentActiveProject.id } },
        data: { endAt: now },
      });
    }

    // 選択したプロジェクトをアクティブにする
    await tx.project.update({
      where: { id: projectId },
      data: { selecterId: userId },
    });
  });

  revalidatePath("/dashboard");
}
