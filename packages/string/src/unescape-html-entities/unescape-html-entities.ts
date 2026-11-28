import { unescapeHTMLCall } from "../escape-html-entities/html-entity-codec.js";
import type { UnescapeHTMLEntitiesOptions } from "./unescape-html-entities.types.js";

export type {
    HtmlEntityLevel,
    UnescapeHTMLEntitiesOptions,
} from "./unescape-html-entities.types.js";

/**
 * Decodes HTML character references in `value`.
 *
 * The default level is `"html5"`. Named references use the selected level.
 * Names in the HTML optional
 * semicolon list may omit the semicolon, and so may numeric references.
 * Decimal (`&#60;`) and hexadecimal (`&#x3C;`) forms are both accepted.
 * An unknown reference is left unchanged. A non-string returns
 * `undefined`. The input is not changed.
 *
 * @param value - The text to decode.
 * @returns The decoded text, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `level` is present and is not a string.
 * @throws {@link RangeError} When `level` is not `xml`, `html4`, or `html5`.
 * @example
 * unescapeHTMLEntities("&amp;");
 */
export function unescapeHTMLEntities(value: string): string | undefined;
/**
 * @param options - `value` and an optional `level`.
 * @returns The decoded text, or `undefined` when `value` is not a string.
 */
export function unescapeHTMLEntities(
    options: UnescapeHTMLEntitiesOptions,
): string | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus `level`.
 * @returns The decoded text, or `undefined` when `value` is not a string.
 */
export function unescapeHTMLEntities(
    valueOrOptions: unknown,
): string | undefined {
    return unescapeHTMLCall(valueOrOptions, "html5");
}
