import { readEnum } from "../utils/assertions.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import { getListFormat } from "../utils/intl-cache.utils.js";
import { readLocale } from "../utils/locale.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type { FormatListOptions } from "./format-list.types.js";

/**
 * Formats `values` with `Intl.ListFormat`.
 *
 * An empty list returns an empty string. The input array is not changed.
 *
 * @param options - `values` and the list options.
 * @returns The formatted list, or `undefined` when `options` is not an object.
 * @throws {@link TypeError} When `values` is not an array or an element is not a string.
 * @throws {@link RangeError} When `type` or `style` is unknown.
 * @example
 * formatList({ values: ["a", "b"] });
 */
export function formatList(options: FormatListOptions): string | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        locale: readLocale(record.locale),
        type: readEnum(
            "type",
            record.type,
            ["conjunction", "disjunction", "unit"] as const,
            "conjunction",
        ),
        style: readEnum(
            "style",
            record.style,
            ["long", "short", "narrow"] as const,
            "long",
        ),
    }));
    if (resolved === undefined) return undefined;
    if (!Array.isArray(resolved.record.values)) {
        throw new TypeError(
            `values must be an array of strings. Received ${describeReceived(resolved.record.values)}.`,
        );
    }
    const values: string[] = [];
    for (const entry of resolved.record.values) {
        if (typeof entry !== "string") {
            throw new TypeError(
                `values must be an array of strings. Received ${describeReceived(entry)}.`,
            );
        }
        values.push(entry);
    }
    if (values.length === 0) return "";
    return getListFormat(
        resolved.options.locale,
        resolved.options.type,
        resolved.options.style,
    ).format(values);
}
