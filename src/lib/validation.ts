import { TaskStatus } from "@prisma/client";
import { z } from "zod";

export const minuteValidation = z.coerce
  .number()
  .int("整数で入力してください")
  .min(0, "0以上で入力してください")
  .max(60, "60以下で入力してください");

export const hourValidation = z.coerce
  .number()
  .int("整数で入力してください")
  .min(0, "0以上で入力してください");

export const workDescriptionValidation = z.object({
  id: z.string(),
  description: z.string().max(100, "最大100文字で入力してください").optional(),
});

export const projectValidation = z.object({
  title: z
    .string({ message: "タイトルを入力してください" })
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

export const taskValidation = z.object({
  id: z.string(),
  title: z
    .string({message: "タイトルを入力してください"})
    .trim()
    .min(1, "タイトルを入力してください")
    .max(32, "32文字以内で入力してください"),
  description: z.string().max(200, "200文字以内で入力してください").optional(),
  status: z.nativeEnum(TaskStatus, { message: "ステータスを選択してください" }),
  dueDate: z
    .date({ message: "期日を入力してください" })
    .min(new Date(), "本日以降を入力してください"),
});

export const subTaksValidation = z.object({
  id: z.string(),
  description: z
    .string()
    .min(1, "内容を入力してください")
    .max(200, "200文字以内で入力してください"),
});
