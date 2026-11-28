import type { LocaleArgument } from "../utils/locale.utils.js";

/**
 * Options for {@link getOrdinal}.
 *
 * There is no noun. `count` is required and must be a safe integer.
 */
export interface GetOrdinalOptions {
    /** The integer to write with an English ordinal suffix. */
    count: number;
    /**
     * An English language tag.
     *
     * @defaultValue `"en"`
     */
    locale?: LocaleArgument;
}
