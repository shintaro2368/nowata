import { string, z } from "zod";

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
  id: string(),
  description: string().max(100, "最大100文字で入力してください").optional(),
});

export const projectValidation = z.object({
  title: z
    .string({message: "タイトルを入力してください"})
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
