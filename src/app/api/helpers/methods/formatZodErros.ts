import { ZodError } from "zod";

function isZodErrorShape(val: unknown): val is { _errors: string[] } {
  return (
    typeof val === "object" &&
    val !== null &&
    "_errors" in val &&
    Array.isArray((val as any)._errors) &&
    (val as any)._errors.every((e: unknown) => typeof e === "string")
  );
}

export function formatZodErrors(error: ZodError) {
  return Object.entries(error.format()).reduce(
    (acc, [key, val]) => {
      if (isZodErrorShape(val)) {
        acc[key] = val._errors;
      }
      return acc;
    },
    {} as Record<string, string[]>
  );
}
