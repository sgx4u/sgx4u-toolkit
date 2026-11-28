import type { JoinItemsParams } from "./join-items.types.js";
import { readItem } from "../utils/array.utils.js";
import { typeError } from "../utils/errors.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

/**
 * Joins formatted items into one string.
 *
 * `separator` defaults to `", "`. `format` defaults to `String`. One item
 * is just the formatted item. Zero items is `""`. Two items use
 * `lastSeparator` when it is set, otherwise `separator`. Three or more
 * items use `separator` between every pair except the last, then
 * `lastSeparator` or `separator` before the last. A present `format` that
 * is not a function throws before the source array is read.
 *
 * @param params - The items and the separators.
 * @returns The joined text, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `format` is present and is not a function.
 * @example
 * joinItems({ array: ["A", "B", "C"], lastSeparator: ", and " });
 */
export function joinItems<Item>(
    params: JoinItemsParams<Item>,
): string | undefined;
/**
 * @param params - A value that is not a params object.
 * @returns `undefined` when `params` is not an object.
 */
export function joinItems(
    params:
        null | undefined | string | number | boolean | bigint | symbol | object,
): undefined;
export function joinItems(params: unknown): string | undefined {
    const resolved = readParams<JoinItemsParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    if (
        resolved.format !== undefined &&
        typeof resolved.format !== "function"
    ) {
        throw typeError("format", "a function", resolved.format);
    }
    const array = readArray(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    const format =
        resolved.format === undefined
            ? (item: unknown) => String(item)
            : (resolved.format as (item: unknown, index: number) => string);
    const separator =
        resolved.separator === undefined ? ", " : resolved.separator;
    const lastSeparator =
        resolved.lastSeparator === undefined
            ? separator
            : resolved.lastSeparator;
    return joinFormatted(array, format, separator, lastSeparator);
}

/**
 * Formats every item, then joins them.
 *
 * @param array - The source array.
 * @param format - Formats one item.
 * @param separator - Text between items that are not the last pair.
 * @param lastSeparator - Text before the last item.
 * @returns The joined text.
 */
function joinFormatted(
    array: readonly unknown[],
    format: (item: unknown, index: number) => string,
    separator: string,
    lastSeparator: string,
): string {
    if (array.length === 0) {
        return "";
    }
    const parts: string[] = [];
    for (let index = 0; index < array.length; index += 1) {
        if (index > 0) {
            parts.push(index === array.length - 1 ? lastSeparator : separator);
        }
        parts.push(textFrom(format(readItem(array, index), index)));
    }
    return parts.join("");
}

/**
 * @param formatted - The value returned by `format`.
 * @returns A string. A non-string is converted with `String`.
 */
function textFrom(formatted: unknown): string {
    return typeof formatted === "string" ? formatted : String(formatted);
}
