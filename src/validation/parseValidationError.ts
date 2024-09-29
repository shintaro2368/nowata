import { ZodError } from "zod";

/**
 * Format error message from ZodEror object.
 * @param err
 * @returns
 */
export default function parseFiledErros(err: ZodError) {
  return Object.fromEntries(
    err.errors.map(({ path, message }) => [path[0], { message }])
  );
}
