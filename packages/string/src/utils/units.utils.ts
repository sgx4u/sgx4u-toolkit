import type { StringUnit } from "../types/string-unit.types.js";
import { readEnum } from "./assertions.utils.js";
import { getSegmenter } from "./intl-cache.utils.js";
import { readLocale, type LocaleArgument } from "./locale.utils.js";

const stringUnits = ["grapheme", "codePoint", "codeUnit"] as const;

/**
 * Reads a `unit` option.
 *
 * @param value - The option value.
 * @param fallback - Unit used when `value` is omitted.
 * @returns The unit.
 * @throws {@link RangeError} When `value` is a string and is not a known unit.
 * @throws {@link TypeError} When `value` is present and is not a string.
 */
export function readUnit(
    value: unknown,
    fallback: StringUnit = "grapheme",
): StringUnit {
    return readEnum("unit", value, stringUnits, fallback);
}

/**
 * Splits `value` into the chosen unit.
 *
 * The result is a new array. `value` is not changed. Graphemes come from
 * `Intl.Segmenter` and keep family emoji, flags, and combining marks together.
 *
 * @param value - The string to split.
 * @param unit - The unit. Defaults to graphemes when the caller already checked it.
 * @param locale - Locale for the grapheme segmenter. Ignored for code points and code units.
 * @returns A new array of units.
 */
export function splitIntoUnits(
    value: string,
    unit: StringUnit,
    locale?: LocaleArgument,
): string[] {
    if (unit === "codeUnit") {
        const units: string[] = [];
        for (let index = 0; index < value.length; index += 1) {
            units.push(value.charAt(index));
        }
        return units;
    }
    if (unit === "codePoint") {
        return Array.from(value);
    }
    const units: string[] = [];
    for (const segment of getSegmenter("grapheme", locale).segment(value)) {
        units.push(segment.segment);
    }
    return units;
}

/**
 * Resolves a possibly negative index the way `String.prototype.slice` does.
 *
 * @param index - The caller index. Negative counts from the end.
 * @param length - The number of units.
 * @returns An index from 0 through `length`.
 */
export function clampIndex(index: number, length: number): number {
    const resolved = index < 0 ? length + index : index;
    if (resolved < 0) {
        return 0;
    }
    if (resolved > length) {
        return length;
    }
    return resolved;
}

/**
 * Slices units the way `String.prototype.slice` slices code units.
 *
 * @param units - Units from `splitIntoUnits`.
 * @param start - Start index. Negative counts from the end.
 * @param end - Exclusive end index. Omit to keep the tail.
 * @returns The joined slice. It may be empty.
 */
export function sliceUnits(
    units: readonly string[],
    start: number,
    end?: number,
): string {
    const startIndex = clampIndex(start, units.length);
    const endIndex =
        end === undefined ? units.length : clampIndex(end, units.length);
    if (endIndex <= startIndex) {
        return "";
    }
    return units.slice(startIndex, endIndex).join("");
}

/**
 * Reads `locale` from an options record when the key is present.
 *
 * @param record - The options object.
 * @returns The locale, or `undefined` when the key was omitted.
 */
export function readLocaleOption(
    record: Record<string, unknown>,
): LocaleArgument | undefined {
    if (!Object.hasOwn(record, "locale")) {
        return undefined;
    }
    return readLocale(record.locale);
}
