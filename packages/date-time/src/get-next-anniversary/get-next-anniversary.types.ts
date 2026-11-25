import type { AgeOptions } from "../get-age/get-age.types.js";

/**
 * Options for the next anniversary.
 */
export interface NextAnniversaryOptions extends AgeOptions {
    /**
     * Whether today's anniversary counts as the next one.
     *
     * @defaultValue `true`
     */
    includeToday?: boolean;
}
