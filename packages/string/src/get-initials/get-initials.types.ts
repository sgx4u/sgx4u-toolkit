import type { LocaleArgument } from "../utils/locale.utils.js";

/**
 * Options for `getInitials`.
 */
export interface GetInitialsOptions {
    /** The name to read. */
    value: string;
    /**
     * How many initials to keep.
     *
     * @defaultValue 2
     */
    maximumLength?: number;
    /**
     * Locale used for grapheme boundaries and uppercase.
     *
     * @defaultValue the runtime locale
     */
    locale?: LocaleArgument;
}
