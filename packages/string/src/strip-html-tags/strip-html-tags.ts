import { readStringCall } from "../utils/read-call.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import type { StripHTMLTagsOptions } from "./strip-html-tags.types.js";

/**
 * One tag the scanner accepted.
 */
interface ParsedTag {
    /** The lowercase tag name, without `<` or `/`. */
    name: string;
    /** The original slice, including brackets and attributes. */
    raw: string;
    /** Index just after the closing `>`. */
    end: number;
}

/**
 * Removes HTML tags with a single left-to-right scan.
 *
 * Comments that start with `<!--` and end with `-->` are removed. A tag
 * is `<`, an optional `/`, an ASCII letter, a short name, then attributes
 * up to the next `>` that is not inside quotes. Listed names are kept,
 * compared after lowercasing. Every other recognized tag is removed. Text
 * between tags is kept, including the text inside `script`. An unclosed
 * comment or tag is left in place.
 *
 * This is not protection against script injection. A caller who renders
 * untrusted HTML needs a dedicated HTML sanitizer. The input is not
 * changed.
 *
 * @param value - Text that may contain tags.
 * @returns The text with tags removed, aside from `allowedTags`.
 * @example
 * stripHTMLTags("<p>Hello</p>");
 */
export function stripHTMLTags(value: string): string;
/**
 * @param options - `value` plus tag names to keep.
 * @returns The scanned text, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `allowedTags` is present and is not an array of strings.
 */
export function stripHTMLTags(
    options: StripHTMLTagsOptions,
): string | undefined;
/**
 * @param valueOrOptions - A string, or one flat options object.
 * @returns The scanned text, or `undefined` when the text is not a string.
 */
export function stripHTMLTags(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, readStripHTMLTagsOptions);
    if (resolved === undefined) {
        return undefined;
    }
    return scanTags(resolved.value, resolved.options.allowedTags);
}

/**
 * @param record - The options object, or an empty object for a bare string.
 * @returns The lowercase names that should be kept.
 */
function readStripHTMLTagsOptions(record: Record<string, unknown>): {
    allowedTags: ReadonlySet<string>;
} {
    return { allowedTags: readAllowedTags(record.allowedTags) };
}

/**
 * @param value - The `allowedTags` option.
 * @returns A set of lowercase names. An omitted option is an empty set.
 */
function readAllowedTags(value: unknown): ReadonlySet<string> {
    if (value === undefined) {
        return new Set();
    }
    if (!Array.isArray(value)) {
        throw new TypeError(
            `allowedTags must be an array. Received ${describeReceived(value)}.`,
        );
    }
    const names = new Set<string>();
    for (const entry of value) {
        if (typeof entry !== "string") {
            throw new TypeError(
                `allowedTags must contain strings. Received ${describeReceived(entry)}.`,
            );
        }
        names.add(entry.toLocaleLowerCase("en"));
    }
    return names;
}

/**
 * @param value - The source text.
 * @param allowedTags - Lowercase names to copy through.
 * @returns The scanned text.
 */
function scanTags(value: string, allowedTags: ReadonlySet<string>): string {
    let result = "";
    let index = 0;
    while (index < value.length) {
        if (value.startsWith("<!--", index)) {
            const end = value.indexOf("-->", index + 4);
            if (end === -1) {
                result += value.slice(index);
                break;
            }
            index = end + 3;
            continue;
        }
        if (value[index] === "<") {
            const tag = readTag(value, index);
            if (tag !== undefined) {
                if (allowedTags.has(tag.name)) {
                    result += tag.raw;
                }
                index = tag.end;
                continue;
            }
        }
        result += value[index] ?? "";
        index += 1;
    }
    return result;
}

/**
 * @param value - The source text.
 * @param start - The index of `<`.
 * @returns The tag, or `undefined` when `<` does not open a finished tag.
 */
function readTag(value: string, start: number): ParsedTag | undefined {
    let index = start + 1;
    if (value[index] === "/") {
        index += 1;
    }
    const nameStart = index;
    if (!isASCIILetter(value[index] ?? "")) {
        return undefined;
    }
    index += 1;
    while (index < value.length && isTagNameCharacter(value[index] ?? "")) {
        index += 1;
    }
    const name = value.slice(nameStart, index).toLocaleLowerCase("en");
    let quote = "";
    while (index < value.length) {
        const character = value[index] ?? "";
        if (quote.length > 0) {
            if (character === quote) {
                quote = "";
            }
            index += 1;
            continue;
        }
        if (character === '"' || character === "'") {
            quote = character;
            index += 1;
            continue;
        }
        if (character === ">") {
            return {
                name,
                raw: value.slice(start, index + 1),
                end: index + 1,
            };
        }
        index += 1;
    }
    return undefined;
}

/**
 * @param character - One code unit from a tag name.
 * @returns `true` for ASCII `A`–`Z` and `a`–`z`.
 */
function isASCIILetter(character: string): boolean {
    return (
        (character >= "A" && character <= "Z") ||
        (character >= "a" && character <= "z")
    );
}

/**
 * @param character - One code unit from a tag name.
 * @returns `true` for a letter, digit, hyphen, or colon.
 */
function isTagNameCharacter(character: string): boolean {
    return (
        isASCIILetter(character) ||
        (character >= "0" && character <= "9") ||
        character === "-" ||
        character === ":"
    );
}
