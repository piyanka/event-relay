import type { ZodError, ZodIssue } from 'zod';

export type FieldErrors = Record<string, string>;

export function flattenZodErrors(error: ZodError): FieldErrors {
  return error.issues.reduce<FieldErrors>((accumulator, issue: ZodIssue) => {
    const field = issue.path.join('.');
    if (!field) {
      return accumulator;
    }

    if (!accumulator[field]) {
      accumulator[field] = issue.message;
    }

    return accumulator;
  }, {});
}

export function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: number }).code === 11000
  );
}
