import type { EscapeHTMLEntitiesOptions } from "./escape-html-entities.types.js";
import { escapeHTMLCall } from "./html-entity-codec.js";

export type {
    EscapeHTMLEntitiesOptions,
    HtmlEntityLevel,
} from "./escape-html-entities.types.js";

/**
 * Escapes characters that HTML or XML would treat as markup.
 *
 * The default level is `"html5"`. `"xml"` escapes `&`, `<`, `>`, `"`, and
 * `'`. `"html4"` uses HTML 4.01 names. `"html5"` uses the full named set.
 * A character that is escaped
 * and has no name becomes a decimal reference. The character-to-name map
 * is built on the first call that needs it, not when the module loads.
 * A non-string returns `undefined`. The input is not changed.
 *
 * @param value - The text to escape.
 * @returns The escaped text, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `level` is present and is not a string.
 * @throws {@link RangeError} When `level` is not `xml`, `html4`, or `html5`.
 * @example
 * escapeHTMLEntities("<a>");
 */
export function escapeHTMLEntities(value: string): string | undefined;
/**
 * @param options - `value` and an optional `level`.
 * @returns The escaped text, or `undefined` when `value` is not a string.
 */
export function escapeHTMLEntities(
    options: EscapeHTMLEntitiesOptions,
): string | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus `level`.
 * @returns The escaped text, or `undefined` when `value` is not a string.
 */
export function escapeHTMLEntities(
    valueOrOptions: unknown,
): string | undefined {
    return escapeHTMLCall(valueOrOptions, "html5");
}
