import { readInteger } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { IsCUID2Options } from "./is-cuid2.types.js";

export type { IsCUID2Options } from "./is-cuid2.types.js";

/**
 * Reports whether `value` is a CUID2.
 *
 * The default length is 24. The first character is a lowercase letter and
 * the rest are lowercase letters or digits. A non-string returns `false`.
 * The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is a CUID2 of the selected length.
 * @throws {@link TypeError} When `length` is present and is not a number.
 * @throws {@link RangeError} When `length` is less than 1 or is not an integer.
 * @example
 * isCUID2("a7k3m9qx2p4n8r1t6v0w5ybd");
 */
export function isCUID2(value: unknown): boolean;
/**
 * @param options - `value` and optional `length`.
 * @returns `true` when `value` is a CUID2 of the selected length.
 */
export function isCUID2(options: IsCUID2Options): boolean;
/**
 * @param valueOrOptions - A string, or `value` plus `length`.
 * @returns `true` when `value` is a CUID2 of the selected length.
 */
export function isCUID2(valueOrOptions: unknown): boolean {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        length: readInteger("length", record.length, 1, undefined, 24),
    }));
    if (resolved === undefined) {
        return false;
    }
    const { value, options } = resolved;
    return value.length === options.length && /^[a-z][a-z0-9]*$/u.test(value);
}
