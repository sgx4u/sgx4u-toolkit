import type { EscapeHTMLEntitiesOptions } from "../escape-html-entities/escape-html-entities.types.js";
import type { HtmlEntityLevel } from "../escape-html-entities/escape-html-entities.types.js";
import type { StringConfig } from "../types/string-config.types.js";
import type { UnescapeHTMLEntitiesOptions } from "../unescape-html-entities/unescape-html-entities.types.js";

/**
 * Config for `createHTMLEntities`.
 *
 * `level` is bound into both functions. Other {@link StringConfig} keys are
 * accepted so one config object can be shared. Any other key throws
 * `RangeError`.
 */
export interface HTMLEntitiesConfig extends StringConfig {
    /**
     * Level bound into both functions. A call can still pass its own `level`.
     *
     * @defaultValue `"html5"`
     */
    level?: HtmlEntityLevel;
}

/**
 * Escape and unescape functions that share one bound level.
 */
export interface HTMLEntitiesToolkit {
    /**
     * Escapes markup characters at the bound level.
     *
     * @param value - The text to escape.
     * @returns The escaped text, or `undefined` when `value` is not a string.
     */
    escapeHTMLEntities(value: string): string | undefined;
    /**
     * @param options - `value` and an optional `level` that overrides the bound one.
     * @returns The escaped text, or `undefined` when `value` is not a string.
     */
    escapeHTMLEntities(options: EscapeHTMLEntitiesOptions): string | undefined;
    /**
     * Decodes character references at the bound level.
     *
     * @param value - The text to decode.
     * @returns The decoded text, or `undefined` when `value` is not a string.
     */
    unescapeHTMLEntities(value: string): string | undefined;
    /**
     * @param options - `value` and an optional `level` that overrides the bound one.
     * @returns The decoded text, or `undefined` when `value` is not a string.
     */
    unescapeHTMLEntities(
        options: UnescapeHTMLEntitiesOptions,
    ): string | undefined;
}

export type { HtmlEntityLevel } from "../escape-html-entities/escape-html-entities.types.js";
