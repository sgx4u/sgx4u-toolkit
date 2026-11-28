import type { LocaleArgument } from "../utils/locale.utils.js";
import {
    readBoolean,
    readInteger,
    readRequiredString,
} from "../utils/assertions.utils.js";
import { getCollator } from "../utils/intl-cache.utils.js";
import { readLocale } from "../utils/locale.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import { readUnit, splitIntoUnits } from "../utils/units.utils.js";
import type { IndexOfMatchOptions } from "./index-of-match.types.js";

/**
 * Returns the unit index of the first `search`, or -1 when it is missing.
 *
 * An empty `search` matches at the clamped `fromIndex` and is not treated
 * as missing. A negative `fromIndex` is clamped to 0, like
 * `String.prototype.indexOf`. A non-string `value` returns `undefined`,
 * not -1. The input is not changed.
 *
 * @param options - `value`, `search`, and the search options.
 * @returns The unit index, -1, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `fromIndex` is not an integer or `unit` is unknown.
 * @throws {@link TypeError} When `search` is not a string.
 * @example
 * indexOfMatch({ value: "hello", search: "ll" });
 */
export function indexOfMatch(options: IndexOfMatchOptions): number | undefined {
    return findIndex(options, false);
}

/**
 * Shared index search for the first or last match.
 *
 * @param options - The call.
 * @param last - When true, return the last match at or before `fromIndex`.
 * @returns The unit index, -1, or `undefined`.
 */
export function findIndex(options: unknown, last: boolean): number | undefined {
    const resolved = readOptionsCall(options, (record) => ({
        search: readRequiredString("search", record.search),
        fromIndex: Object.hasOwn(record, "fromIndex")
            ? readInteger(
                  "fromIndex",
                  record.fromIndex,
                  Number.MIN_SAFE_INTEGER,
                  Number.MAX_SAFE_INTEGER,
              )
            : undefined,
        unit: readUnit(record.unit),
        ignoreCase: readBoolean("ignoreCase", record.ignoreCase, false),
        locale: readLocale(record.locale),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return undefined;
    }
    const units = splitIntoUnits(
        resolved.record.value,
        resolved.options.unit,
        resolved.options.locale,
    );
    const searchUnits = splitIntoUnits(
        resolved.options.search,
        resolved.options.unit,
        resolved.options.locale,
    );
    const fromIndex =
        resolved.options.fromIndex === undefined
            ? last
                ? units.length
                : 0
            : clampSearchIndex(resolved.options.fromIndex, units.length);
    if (searchUnits.length === 0) {
        return fromIndex;
    }
    const lastStart = units.length - searchUnits.length;
    if (!last) {
        for (let index = fromIndex; index <= lastStart; index += 1) {
            if (
                windowMatches(
                    units,
                    index,
                    searchUnits,
                    resolved.options.ignoreCase,
                    resolved.options.locale,
                )
            ) {
                return index;
            }
        }
        return -1;
    }
    const upper = Math.min(fromIndex, lastStart);
    let found = -1;
    for (let index = 0; index <= upper; index += 1) {
        if (
            windowMatches(
                units,
                index,
                searchUnits,
                resolved.options.ignoreCase,
                resolved.options.locale,
            )
        ) {
            found = index;
        }
    }
    return found;
}

/**
 * Clamps `index` into `0` through `length`.
 *
 * Negative indexes become 0. They do not count from the end.
 *
 * @param index - The caller index.
 * @param length - The number of units.
 * @returns The clamped index.
 */
function clampSearchIndex(index: number, length: number): number {
    if (index < 0) {
        return 0;
    }
    if (index > length) {
        return length;
    }
    return index;
}

/**
 * Whether the units at `index` match `searchUnits`.
 *
 * Case-insensitive comparison uses a collator with sensitivity `"accent"`,
 * so accents still matter. The windows stay the same number of units.
 *
 * @param units - The source units.
 * @param index - The start unit.
 * @param searchUnits - The search units.
 * @param ignoreCase - When true, ignore case and keep accents.
 * @param locale - Locale for the collator.
 * @returns `true` when the window matches.
 */
function windowMatches(
    units: readonly string[],
    index: number,
    searchUnits: readonly string[],
    ignoreCase: boolean,
    locale: LocaleArgument | undefined,
): boolean {
    const candidate = units.slice(index, index + searchUnits.length).join("");
    const search = searchUnits.join("");
    if (!ignoreCase) {
        return candidate === search;
    }
    return (
        getCollator(locale, "accent", false).compare(candidate, search) === 0
    );
}
