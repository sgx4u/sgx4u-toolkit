import {
    readBoolean,
    readInteger,
    readOptionalString,
} from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import { splitIntoUnits } from "../utils/units.utils.js";
import type { GetExcerptOptions } from "./get-excerpt.types.js";

export type { GetExcerptOptions } from "./get-excerpt.types.js";

/**
 * Excerpt options after defaults are applied.
 */
interface ExcerptOptions {
    /** Maximum graphemes, including the omission. */
    maximumLength: number;
    /** Whether to retreat to a word boundary. */
    breakOnWord: boolean;
    /** Text appended when the value is shortened. */
    omission: string;
}

/**
 * Shortens `value` at the end and appends an omission.
 *
 * Length is counted in graphemes. The default maximum is 140 and the
 * default omission is `…`. When `breakOnWord` is true and the cut would
 * land inside a word, the cut moves back to the previous whitespace.
 * A value that already fits is returned unchanged, with no omission. A
 * non-string returns `undefined`. The input is not changed.
 *
 * @param value - The text to shorten.
 * @returns The excerpt, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When `maximumLength` is not an integer of at least 1.
 * @example
 * getExcerpt({ value: "The quick brown fox", maximumLength: 12 });
 */
export function getExcerpt(value: string): string | undefined;
/**
 * @param options - `value`, `maximumLength`, `breakOnWord`, and `omission`.
 * @returns The excerpt, or `undefined` when `value` is not a string.
 */
export function getExcerpt(options: GetExcerptOptions): string | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus options.
 * @returns The excerpt, or `undefined` when `value` is not a string.
 */
export function getExcerpt(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, readExcerptOptions);
    if (resolved === undefined) {
        return undefined;
    }
    return excerptText(resolved.value, resolved.options);
}

/**
 * Reads excerpt options and applies the defaults.
 *
 * @param record - The flat options object, or an empty object for a bare string.
 * @returns Options with length, word breaking, and omission set.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When `maximumLength` is not an integer of at least 1.
 */
function readExcerptOptions(record: Record<string, unknown>): ExcerptOptions {
    const omission = readOptionalString("omission", record.omission);
    return {
        maximumLength: readInteger(
            "maximumLength",
            record.maximumLength,
            1,
            undefined,
            140,
        ),
        breakOnWord: readBoolean("breakOnWord", record.breakOnWord, true),
        omission: omission ?? "\u2026",
    };
}

/**
 * Cuts `value` to `options.maximumLength` graphemes.
 *
 * @param value - The original text.
 * @param options - Length, word breaking, and omission.
 * @returns The excerpt.
 */
function excerptText(value: string, options: ExcerptOptions): string {
    const units = splitIntoUnits(value, "grapheme");
    if (units.length <= options.maximumLength) {
        return value;
    }
    const omissionUnits = splitIntoUnits(options.omission, "grapheme");
    const budget = options.maximumLength - omissionUnits.length;
    if (budget <= 0) {
        return omissionUnits.slice(0, options.maximumLength).join("");
    }
    let cut = units.slice(0, budget).join("");
    const next = units[budget] ?? "";
    const endsInsideWord =
        next.length > 0 && !/\s/u.test(next) && !/\s/u.test(cut.slice(-1));
    if (options.breakOnWord && endsInsideWord) {
        const boundary = cut.search(/\s+\S*$/u);
        if (boundary > 0) {
            cut = cut.slice(0, boundary).replace(/\s+$/u, "");
        }
    } else if (options.breakOnWord) {
        cut = cut.replace(/\s+$/u, "");
    }
    return cut + options.omission;
}
