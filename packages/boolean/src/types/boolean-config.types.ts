import type {
    BooleanCapitalization,
    BooleanFormatStyle,
} from "./format-options.types.js";
import type { BooleanParseOptions } from "./parse-options.types.js";

/**
 * Defaults stored by `createBoolean`.
 *
 * Every field is optional. A value passed on a later call replaces the
 * stored one. There is no module-level copy of this object.
 */
export interface BooleanConfig extends BooleanParseOptions {
    /**
     * Default locale for parsing, formatting, and `getBooleanWords`.
     *
     * @defaultValue "en"
     */
    locale?: string;

    /**
     * Default extra words that parse as `true`.
     *
     * @defaultValue []
     */
    truthyWords?: readonly string[];

    /**
     * Default extra words that parse as `false`.
     *
     * @defaultValue []
     */
    falsyWords?: readonly string[];

    /**
     * Boolean returned when a parse does not recognize its value.
     *
     * When omitted, that parse returns `undefined`.
     *
     * @defaultValue undefined
     */
    fallback?: boolean;

    /**
     * Default `formatBoolean` style.
     *
     * @defaultValue "true-false"
     */
    formatStyle?: BooleanFormatStyle;

    /**
     * Default `formatBoolean` capitalization.
     *
     * @defaultValue "lower"
     */
    formatCapitalization?: BooleanCapitalization;
}
