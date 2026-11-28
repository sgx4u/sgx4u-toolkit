/**
 * Reports whether `value` is a MongoDB ObjectId.
 *
 * An ObjectId is 24 hexadecimal characters. Matching is case-insensitive.
 * A non-string returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is 24 hexadecimal characters.
 * @example
 * isMongoObjectId("507f1f77bcf86cd799439011");
 */
export function isMongoObjectId(value: unknown): boolean {
    return typeof value === "string" && /^[0-9A-Fa-f]{24}$/u.test(value);
}
