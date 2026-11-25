/** True when the string is empty or contains only whitespace. */
export function isBlank(value: string): boolean {
  return value.trim().length === 0;
}
