import {
    halfWidthCodePointRanges,
    wideCodePointRanges,
} from "../data/east-asian-width.data.js";
import { splitAnsiParts } from "./ansi.utils.js";
import { splitIntoUnits } from "./units.utils.js";

const emojiExpression = /\p{Extended_Pictographic}|\p{Regional_Indicator}/u;
const ignorableExpression = /\p{Mn}|\p{Me}|\p{Cf}|\p{Cc}/u;

/**
 * Whether `codePoint` falls inside an inclusive range table.
 *
 * @param codePoint - A Unicode scalar value.
 * @param ranges - Inclusive ranges, sorted by the first column.
 * @returns `true` when a range contains `codePoint`.
 */
function isInRanges(
    codePoint: number,
    ranges: readonly (readonly [number, number])[],
): boolean {
    let low = 0;
    let high = ranges.length - 1;
    while (low <= high) {
        const middle = Math.floor((low + high) / 2);
        const range = ranges[middle];
        if (range === undefined) {
            return false;
        }
        if (codePoint < range[0]) {
            high = middle - 1;
        } else if (codePoint > range[1]) {
            low = middle + 1;
        } else {
            return true;
        }
    }
    return false;
}

/**
 * Column width of one code point that is not part of an emoji grapheme.
 *
 * Combining marks, format characters, and controls add 0. Wide and
 * fullwidth characters add 2. Everything else, including ambiguous
 * characters, adds 1.
 *
 * @param codePoint - A Unicode scalar value.
 * @returns `0`, `1`, or `2`.
 */
function codePointWidth(codePoint: number): number {
    const character = String.fromCodePoint(codePoint);
    if (ignorableExpression.test(character)) {
        return 0;
    }
    if (isInRanges(codePoint, wideCodePointRanges)) {
        return 2;
    }
    return 1;
}

/**
 * Column width of one grapheme.
 *
 * An emoji grapheme, including a ZWJ sequence or a flag pair, is 2 columns
 * as a whole. Any other grapheme sums the widths of its code points, so a
 * combining mark does not add a column.
 *
 * @param grapheme - One grapheme cluster.
 * @returns The number of columns.
 */
function graphemeWidth(grapheme: string): number {
    if (emojiExpression.test(grapheme)) {
        return 2;
    }
    let width = 0;
    for (const character of grapheme) {
        const codePoint = character.codePointAt(0);
        if (codePoint === undefined) {
            continue;
        }
        width += codePointWidth(codePoint);
    }
    return width;
}

/**
 * Column width of plain text, with ANSI escapes already removed.
 *
 * @param value - Text without ANSI escapes.
 * @returns The number of terminal columns.
 */
function plainDisplayWidth(value: string): number {
    let width = 0;
    for (const grapheme of splitIntoUnits(value, "grapheme")) {
        width += graphemeWidth(grapheme);
    }
    return width;
}

/**
 * Returns the monospaced columns `value` occupies.
 *
 * ANSI escapes are ignored unless `countAnsiEscapeCodes` is true, in which
 * case each of their code units adds 1. The input is not changed.
 *
 * @param value - The text to measure.
 * @param countAnsiEscapeCodes - When `true`, escape code units count as width 1.
 * @returns The column count. An empty string returns 0.
 */
export function measureDisplayWidth(
    value: string,
    countAnsiEscapeCodes: boolean,
): number {
    if (!countAnsiEscapeCodes) {
        const plain = splitAnsiParts(value)
            .filter((part) => !part.isEscape)
            .map((part) => part.text)
            .join("");
        return plainDisplayWidth(plain);
    }
    let width = 0;
    for (const part of splitAnsiParts(value)) {
        if (part.isEscape) {
            width += part.text.length;
        } else {
            width += plainDisplayWidth(part.text);
        }
    }
    return width;
}

/**
 * Whether `value` contains a wide or fullwidth character.
 *
 * Emoji presentation also counts, because the grapheme occupies two columns.
 *
 * @param value - The text to scan.
 * @returns `true` when any grapheme has display width 2.
 */
export function containsFullWidth(value: string): boolean {
    for (const grapheme of splitIntoUnits(value, "grapheme")) {
        if (graphemeWidth(grapheme) === 2) {
            return true;
        }
    }
    return false;
}

/**
 * Whether `value` contains a halfwidth character.
 *
 * Halfwidth katakana and the halfwidth forms in the FF00 block qualify.
 * Ordinary ASCII does not.
 *
 * @param value - The text to scan.
 * @returns `true` when a halfwidth code point is present.
 */
export function containsHalfWidth(value: string): boolean {
    for (const character of value) {
        const codePoint = character.codePointAt(0);
        if (
            codePoint !== undefined &&
            isInRanges(codePoint, halfWidthCodePointRanges)
        ) {
            return true;
        }
    }
    return false;
}
