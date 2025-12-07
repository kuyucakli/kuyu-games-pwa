import { ZodError, flattenError } from "zod";

export function customFlattenError(
  error: ZodError<Record<string, any>>
): Record<string, string[]> {
  const { fieldErrors } = flattenError(error);

  const flattened: Record<string, string[]> = {};

  for (const key in fieldErrors) {
    flattened[key] = fieldErrors[key] ?? []; // normalize undefined to empty array
  }

  return flattened;
}
