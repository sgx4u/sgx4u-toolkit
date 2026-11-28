import { readOptionalString } from "./assertions.utils.js";
import { readStringCall } from "./read-call.utils.js";
import { splitIntoUnits } from "./units.utils.js";

/**
 * A trim call after the options have been checked.
 */
export interface TrimCall {
    /** The text to trim. */
    value: string;
    /** Graphemes to remove, or `undefined` for Unicode whitespace. */
    characters: string | undefined;
}

/**
 * Reads a trim call.
 *
 * @param valueOrOptions - A string, or `value` plus `characters`.
 * @returns The call, or `undefined` when the text is not a string.
 * @throws {@link TypeError} When `characters` is present and is not a string.
 */
export function readTrimCall(valueOrOptions: unknown): TrimCall | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        characters: readOptionalString("characters", record.characters),
    }));
    if (resolved === undefined) {
        return undefined;
    }
    return {
        value: resolved.value,
        characters: resolved.options.characters,
    };
}

/**
 * Whether `grapheme` should be trimmed.
 *
 * @param grapheme - One grapheme from the text.
 * @param characters - Graphemes to remove, or `undefined` for whitespace.
 * @returns `true` when the grapheme is trimmed.
 */
function isTrimGrapheme(
    grapheme: string,
    characters: string | undefined,
): boolean {
    if (characters === undefined) {
        return /^\p{White_Space}+$/u.test(grapheme);
    }
    return new Set(splitIntoUnits(characters, "grapheme")).has(grapheme);
}

/**
 * Trims matching graphemes from the chosen ends.
 *
 * @param value - The text.
 * @param characters - Graphemes to remove, or `undefined` for whitespace.
 * @param trimAtStart - Trim the start.
 * @param trimAtEnd - Trim the end.
 * @returns The trimmed string.
 */
export function trimUnits(
    value: string,
    characters: string | undefined,
    trimAtStart: boolean,
    trimAtEnd: boolean,
): string {
    const graphemes = splitIntoUnits(value, "grapheme");
    let start = 0;
    let end = graphemes.length;
    if (trimAtStart) {
        while (
            start < end &&
            isTrimGrapheme(graphemes[start] ?? "", characters)
        ) {
            start += 1;
        }
    }
    if (trimAtEnd) {
        while (
            end > start &&
            isTrimGrapheme(graphemes[end - 1] ?? "", characters)
        ) {
            end -= 1;
        }
    }
    return graphemes.slice(start, end).join("");
}
