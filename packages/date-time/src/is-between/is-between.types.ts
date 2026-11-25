/**
 * Which ends of a range count as inside it.
 */
export interface IsBetweenOptions {
    /**
     * Whether the start instant itself counts.
     *
     * @defaultValue `true`
     */
    includeStart?: boolean;
    /**
     * Whether the end instant itself counts.
     *
     * @defaultValue `true`
     */
    includeEnd?: boolean;
}
