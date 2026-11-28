/**
 * Reports whether `value` is a bigint.
 *
 * @example
 * isBigInt(1n);
 */
export function isBigInt(value: unknown): value is bigint {
    return typeof value === "bigint";
}
