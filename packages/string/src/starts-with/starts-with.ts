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
import type { StartsWithOptions } from "./starts-with.types.js";

/**
 * Reports whether `value` starts with `search` at `position`.
 *
 * `position` counts `unit`s from the start. A negative position is clamped
 * to 0, like `String.prototype.startsWith`. An empty `search` matches.
 * The comparison does not split a unit, so a search that is only part of
 * a grapheme does not match when `unit` is `"grapheme"`. Case-insensitive
 * comparison uses sensitivity `"accent"`: case is ignored and accents
 * still matter. A non-string `value` returns `false`. The input is not changed.
 *
 * @param options - `value`, `search`, and the search options.
 * @returns `true` when the text starts with `search`.
 * @throws {@link RangeError} When `position` is not an integer or `unit` is unknown.
 * @throws {@link TypeError} When `search` is not a string.
 * @example
 * startsWith({ value: "hello", search: "he" });
 */
export function startsWith(options: StartsWithOptions): boolean {
    const resolved = readOptionsCall(options, (record) => ({
        search: readRequiredString("search", record.search),
        position: readInteger(
            "position",
            record.position,
            Number.MIN_SAFE_INTEGER,
            Number.MAX_SAFE_INTEGER,
            0,
        ),
        unit: readUnit(record.unit),
        ignoreCase: readBoolean("ignoreCase", record.ignoreCase, false),
        locale: readLocale(record.locale),
    }));
    if (resolved === undefined || typeof resolved.record.value !== "string") {
        return false;
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
    const start = clampSearchIndex(resolved.options.position, units.length);
    if (searchUnits.length === 0) {
        return true;
    }
    if (start + searchUnits.length > units.length) {
        return false;
    }
    return windowMatches(
        units,
        start,
        searchUnits,
        resolved.options.ignoreCase,
        resolved.options.locale,
    );
}

/**
 * Clamps `index` into `0` through `length`.
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
