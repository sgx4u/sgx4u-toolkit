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
import type { EndsWithOptions } from "./ends-with.types.js";

/**
 * Reports whether `value` ends with `search` at `position`.
 *
 * `position` is the end index in `unit`, like `String.prototype.endsWith`.
 * Omit it to use the full length. A negative position is clamped to 0.
 * An empty `search` matches. The comparison does not split a unit.
 * Case-insensitive comparison uses sensitivity `"accent"`. A non-string
 * `value` returns `false`. The input is not changed.
 *
 * @param options - `value`, `search`, and the search options.
 * @returns `true` when the text ends with `search`.
 * @throws {@link RangeError} When `position` is not an integer or `unit` is unknown.
 * @throws {@link TypeError} When `search` is not a string.
 * @example
 * endsWith({ value: "hello", search: "lo" });
 */
export function endsWith(options: EndsWithOptions): boolean {
    const resolved = readOptionsCall(options, (record) => ({
        search: readRequiredString("search", record.search),
        position:
            record.position === undefined
                ? undefined
                : readInteger(
                      "position",
                      record.position,
                      Number.MIN_SAFE_INTEGER,
                      Number.MAX_SAFE_INTEGER,
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
    const end =
        resolved.options.position === undefined
            ? units.length
            : clampSearchIndex(resolved.options.position, units.length);
    if (searchUnits.length === 0) {
        return true;
    }
    if (searchUnits.length > end) {
        return false;
    }
    return windowMatches(
        units,
        end - searchUnits.length,
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
