import { z } from "zod";

export const minuteValidation = z
  .coerce
  .number()
  .int("整数で入力してください")
  .min(0, "0以上で入力してください")
  .max(60, "60以下で入力してください");

export const hourValidation = z
  .coerce
  .number()
  .int("整数で入力してください")
  .min(0, "0以上で入力してください");
