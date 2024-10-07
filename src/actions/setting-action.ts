"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import parseFiledErros from "@/validation/parseValidationError";
import { revalidatePath } from "next/cache";
import { z } from "zod";


const validationSchema = z.object({
  stdStartHour: z.coerce.number().optional(),
  stdStartMinute: z.coerce.number().optional(),
  stdEndHour: z.coerce.number().optional(),
  stdEndMinute: z.coerce.number().optional(),
  breakHour: z.coerce
    .number()
    .min(0, "時間は正の整数で入力してください")
    .optional(),
  breakMinute: z.coerce
    .number()
    .min(0, "分は正の整数で入力してください")
    .max(60, "分は60以下で入力してください")
    .optional(),
  stdWorkHour: z.coerce
    .number()
    .min(0, "時間は正の整数で入力してください")
    .optional(),
  stdWorkMinute: z.coerce
    .number()
    .min(0, "分は正の整数で入力してください")
    .max(60, "分は60以下で入力してください")
    .optional(),
  minWorkHour: z.coerce
    .number()
    .min(0, "時間は正の整数で入力してください")
    .optional(),
  minWorkMinute: z.coerce
    .number()
    .min(0, "分は正の整数で入力してください")
    .max(60, "分は正の整数で入力してください")
    .optional(),
  maxWorkHour: z.coerce
    .number()
    .min(0, "時間は正の整数で入力してください")
    .optional(),
  maxWorkMinute: z.coerce
    .number()
    .min(0, "分は正の整数で入力してください")
    .max(60, "分は60以下で入力してください")
    .optional(),
});

export async function updataSetting(prevState: any, formData: FormData) {
  const session = await auth();
  const useId = session?.user?.id;

  if (!useId) {
    return {
      message: "Unauthorized",
    };
  }

  const validationFields = validationSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!validationFields.success) {
    console.log(Object.fromEntries(formData));
    return {
      message: "入力内容に誤りがあります。入力内容をご確認ください。",
      error: parseFiledErros(validationFields.error),
    };
  }

  const {
    stdStartHour,
    stdStartMinute,
    stdEndHour,
    stdEndMinute,
    breakHour,
    breakMinute,
    minWorkHour,
    minWorkMinute,
    stdWorkHour,
    stdWorkMinute,
    maxWorkHour,
    maxWorkMinute,
  } = validationFields.data;

  const project = await prisma.project.findUnique({
    where: {
      selecterId: useId,
    },
  });

  if (!project) {
    return {
      message: "Project not found",

    };
  }
  await prisma.setting.update({
    where: {
      projectId: project.id,
    },
    data: {
      standardStartWorkHour: stdStartHour,
      standardStartWorkMinute: stdStartMinute,
      standardEndWorkHour: stdEndHour,
      standardEndWorkMinute: stdEndMinute,
      standardBreakHour: breakHour,
      standardBreakMinute: breakMinute,
      minimumWorkHour: minWorkHour,
      minimumWorkMinute: minWorkMinute,
      standardWorkHour: stdWorkHour,
      standardWorkMinute: stdWorkMinute,
      maximumWorkHour: maxWorkHour,
      maximumWorkMinute: maxWorkMinute,
    },
  });

  revalidatePath("/settings");
}
