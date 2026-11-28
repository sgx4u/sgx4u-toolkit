import { readInteger, readOptionalString } from "../utils/assertions.utils.js";
import { encodeUtf8 } from "../utils/encoding.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { splitIntoUnits } from "../utils/units.utils.js";
import type { TruncateToBytesOptions } from "./truncate-to-bytes.types.js";

/**
 * Shortens `value` so its UTF-8 encoding is at most `maximumBytes`.
 *
 * A code point is never split. A grapheme is kept whole when it fits in
 * the remaining bytes. When the next grapheme does not fit, code points
 * from that grapheme are kept while they fit. The omission is measured in
 * UTF-8 bytes as well. The default omission is the ellipsis. The input is
 * not changed.
 *
 * @param options - `value`, `maximumBytes`, and an optional `omission`.
 * @returns The shortened string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `maximumBytes` is negative.
 * @example
 * truncateToBytes({ value: "hello", maximumBytes: 4 });
 */
export function truncateToBytes(
    options: TruncateToBytesOptions,
): string | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        maximumBytes: readInteger(
            "maximumBytes",
            record.maximumBytes,
            0,
            undefined,
        ),
        omission: readOptionalString("omission", record.omission) ?? "\u2026",
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return undefined;
    }
    const value = resolved.record.value;
    if (encodeUtf8(value).length <= resolved.options.maximumBytes) {
        return value;
    }
    const omissionBytes = encodeUtf8(resolved.options.omission).length;
    if (omissionBytes > resolved.options.maximumBytes) {
        return fitBytes(
            resolved.options.omission,
            resolved.options.maximumBytes,
        );
    }
    return (
        fitBytes(value, resolved.options.maximumBytes - omissionBytes) +
        resolved.options.omission
    );
}

/**
 * Takes a prefix whose UTF-8 size is at most `maximumBytes`, preferring graphemes.
 *
 * @param value - The text.
 * @param maximumBytes - The byte budget.
 * @returns The prefix.
 */
function fitBytes(value: string, maximumBytes: number): string {
    if (maximumBytes <= 0) {
        return "";
    }
    let kept = "";
    for (const grapheme of splitIntoUnits(value, "grapheme")) {
        const nextGrapheme = kept + grapheme;
        if (encodeUtf8(nextGrapheme).length <= maximumBytes) {
            kept = nextGrapheme;
            continue;
        }
        for (const character of grapheme) {
            const nextCharacter = kept + character;
            if (encodeUtf8(nextCharacter).length > maximumBytes) {
                return kept;
            }
            kept = nextCharacter;
        }
        return kept;
    }
    return kept;
}
