import type { UUIDVersion } from "../types/string-unit.types.js";

/**
 * Options for `isUUID`.
 */
export interface IsUUIDOptions {
    /** The identifier to test. */
    value: string;
    /**
     * Which RFC 9562 version to accept.
     *
     * `"any"` allows versions 1 through 8 with a variant nibble of `8`,
     * `9`, `a`, or `b`, plus the nil and max UUIDs. A number checks that
     * version nibble. `"nil"` and `"max"` check those exact values.
     *
     * @defaultValue `"any"`
     */
    version?: UUIDVersion;
    /**
     * When `true`, an optional `urn:uuid:` prefix is accepted.
     *
     * The prefix is case-insensitive. Braces are never accepted.
     *
     * @defaultValue false
     */
    allowURN?: boolean;
}

export type { UUIDVersion };
