/**
 * Options for `isHexColor`.
 */
export interface IsHexColorOptions {
    /** The color to test. */
    value: string;
    /**
     * When `true`, `#RGB` and `#RGBA` are accepted.
     *
     * @defaultValue true
     */
    allowShort?: boolean;
    /**
     * When `true`, `#RGBA` and `#RRGGBBAA` are accepted.
     *
     * @defaultValue true
     */
    allowAlpha?: boolean;
}
