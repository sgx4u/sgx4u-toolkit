import type { LocaleOptions, TimeZoneOptions } from "../types/options.types.js";
import { getLocaleDatePattern } from "../get-locale-date-pattern/get-locale-date-pattern.js";
import {
    instantFromWallTime,
    resolveTimeZone,
} from "../utils/time-zone.utils.js";
import { isRealGregorianDay } from "../utils/gregorian.utils.js";
import { typeError } from "../utils/error.utils.js";

/**
 * Parses a numeric date written the way the locale writes it.
 *
 * Separators may be `/`, `.`, `-`, or a space. Day and month may be one or
 * two digits. The result is midnight in `timeZone`. An impossible day
 * returns `undefined`.
 *
 * @param value - The candidate text.
 * @param options - `locale` defaults to the runtime locale.
 * @returns A new `Date`, or `undefined` when the text does not match.
 * @throws {@link TypeError} When `value` is not a string.
 * @example
 * parseLocaleDate("11/26/2026", { locale: "en-US", timeZone: "UTC" })?.toISOString(); // "2026-11-26T00:00:00.000Z"
 */
export function parseLocaleDate(
    value: string,
    options?: TimeZoneOptions & LocaleOptions,
): Date | undefined {
    if (typeof value !== "string") {
        throw typeError("value", "a string", value);
    }
    const pattern = getLocaleDatePattern({
        style: "short",
        ...(options?.locale !== undefined ? { locale: options.locale } : {}),
    });
    const fields = readNumericDate(value, pattern);
    if (
        fields === undefined ||
        !isRealGregorianDay(fields.year, fields.month, fields.day)
    ) {
        return undefined;
    }
    return new Date(
        instantFromWallTime(
            { ...fields, hour: 0, minute: 0, second: 0, millisecond: 0 },
            resolveTimeZone(options?.timeZone),
            "compatible",
        ),
    );
}

/**
 * @param value - The numeric text.
 * @param pattern - A pattern of `dd`, `MM`, `yyyy`, and separators.
 * @returns The calendar fields, or `undefined` when the text does not fit.
 */
function readNumericDate(
    value: string,
    pattern: string,
): { year: number; month: number; day: number } | undefined {
    const numbers = value.trim().split(/[/.\s-]+/);
    const tokens = pattern
        .split(/[/.\s-]+/)
        .filter((token) => token.length > 0);
    if (numbers.length !== tokens.length) {
        return undefined;
    }
    const fields = { year: 0, month: 0, day: 0 };
    for (let index = 0; index < tokens.length; index += 1) {
        const token = tokens[index];
        const number = Number(numbers[index]);
        if (!Number.isInteger(number)) {
            return undefined;
        }
        if (token === "yyyy") {
            fields.year = number;
        } else if (token === "MM") {
            fields.month = number;
        } else if (token === "dd") {
            fields.day = number;
        }
    }
    if (fields.year < 1000 || fields.year > 9999) {
        return undefined;
    }
    return fields;
}
