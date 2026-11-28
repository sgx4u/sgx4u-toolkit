import { stripDiacritics } from "../utils/diacritics.utils.js";
import {
    readBoolean,
    readInteger,
    readOptionalString,
} from "../utils/assertions.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import { splitIntoUnits } from "../utils/units.utils.js";
import type { SlugifyOptions } from "./slugify.types.js";

const letterOrDigitExpression = /[\p{L}\p{Nd}]/u;

/**
 * Settings after defaults and checks have been applied.
 */
interface SlugifySettings {
    /** Separator between letter and digit runs. */
    separator: string;
    /** Whether the slug is lowercased. */
    lowerCase: boolean;
    /** Grapheme cap, or `undefined` when the slug is not shortened. */
    maximumLength: number | undefined;
}

/**
 * Builds a slug from letters and digits.
 *
 * Diacritics are removed first. When `lowerCase` is true, the English
 * locale supplies the lowercase form. Each run of characters that are not
 * Unicode letters or decimal digits becomes one `separator`. Separators at
 * either end are omitted. Hindi and CJK letters stay; they are not
 * rewritten to ASCII. The input is not changed.
 *
 * @param value - Text to turn into a slug.
 * @returns The slug. An empty string stays empty.
 * @example
 * slugify("Café au lait");
 */
export function slugify(value: string): string;
/**
 * @param options - `value` plus optional separator, case, and length.
 * @returns The slug, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When `separator` is empty, or `maximumLength` is negative or not an integer.
 */
export function slugify(options: SlugifyOptions): string | undefined;
/**
 * @param valueOrOptions - A string, or one flat options object.
 * @returns The slug, or `undefined` when the text is not a string.
 */
export function slugify(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, readSlugifyOptions);
    if (resolved === undefined) {
        return undefined;
    }
    return buildSlug(resolved.value, resolved.options);
}

/**
 * Reads slug options from a flat record.
 *
 * @param record - The options object, or an empty object for a bare string.
 * @returns Checked settings.
 */
function readSlugifyOptions(record: Record<string, unknown>): SlugifySettings {
    const separator = readOptionalString("separator", record.separator) ?? "-";
    if (separator.length === 0) {
        throw new RangeError(
            `separator must not be empty. Received ${describeReceived(separator)}.`,
        );
    }
    return {
        separator,
        lowerCase: readBoolean("lowerCase", record.lowerCase, true),
        maximumLength: readOptionalMaximumLength(record.maximumLength),
    };
}

/**
 * @param value - The `maximumLength` option.
 * @returns The cap, or `undefined` when it was omitted.
 */
function readOptionalMaximumLength(value: unknown): number | undefined {
    if (value === undefined) {
        return undefined;
    }
    return readInteger("maximumLength", value, 0, undefined);
}

/**
 * @param value - The caller's text.
 * @param settings - Checked slug settings.
 * @returns The slug.
 */
function buildSlug(value: string, settings: SlugifySettings): string {
    const stripped = stripDiacritics(value);
    const cased = settings.lowerCase
        ? stripped.toLocaleLowerCase("en")
        : stripped;
    let slug = joinLetterRuns(cased, settings.separator);
    if (settings.maximumLength !== undefined) {
        slug = trimTrailingSeparator(
            sliceGraphemes(slug, settings.maximumLength),
            settings.separator,
        );
    }
    return slug;
}

/**
 * Joins letter and digit runs with `separator`, without ends.
 *
 * @param value - Text that has already been stripped and cased.
 * @param separator - The separator between runs.
 * @returns The joined slug, without a leading or trailing separator.
 */
function joinLetterRuns(value: string, separator: string): string {
    let slug = "";
    let pendingSeparator = false;
    let started = false;
    for (const character of value) {
        if (letterOrDigitExpression.test(character)) {
            if (pendingSeparator && started) {
                slug += separator;
            }
            pendingSeparator = false;
            started = true;
            slug += character;
            continue;
        }
        pendingSeparator = true;
    }
    return slug;
}

/**
 * @param value - The slug so far.
 * @param maximumLength - How many graphemes to keep.
 * @returns The leading slice. A short slug is returned unchanged.
 */
function sliceGraphemes(value: string, maximumLength: number): string {
    const graphemes = splitIntoUnits(value, "grapheme");
    if (graphemes.length <= maximumLength) {
        return value;
    }
    return graphemes.slice(0, maximumLength).join("");
}

/**
 * @param value - A slug that may end with `separator` after a slice.
 * @param separator - The separator to remove from the end.
 * @returns `value` without trailing separators.
 */
function trimTrailingSeparator(value: string, separator: string): string {
    let trimmed = value;
    while (separator.length > 0 && trimmed.endsWith(separator)) {
        trimmed = trimmed.slice(0, -separator.length);
    }
    return trimmed;
}
