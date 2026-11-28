/**
 * Reports whether `value` has an E.164 shape.
 *
 * An optional leading `+` is followed by 8 to 15 digits, and the first
 * digit is not zero. No spaces or punctuation are accepted. The check is
 * the shape only: it does not look up a country plan. A non-string
 * returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` has that shape.
 * @example
 * isE164("+14155552671");
 */
export function isE164(value: unknown): boolean {
    return typeof value === "string" && /^\+?[1-9]\d{7,14}$/u.test(value);
}
