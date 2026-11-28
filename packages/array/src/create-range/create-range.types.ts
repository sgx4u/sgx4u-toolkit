/**
 * Parameters for {@link createRange}.
 *
 * `createRange(end)` is the same as `{ end }` with `start` of `0` and
 * `step` of `1`.
 */
export interface CreateRangeParams {
    /**
     * First value.
     *
     * @defaultValue 0
     */
    start?: number;

    /** Value the range stops at. It is excluded unless `inclusive` is true. */
    end: number;

    /**
     * Distance between values. A negative step counts down.
     *
     * @defaultValue 1
     */
    step?: number;

    /**
     * When true, `end` is included when it lands on a step.
     *
     * @defaultValue false
     */
    inclusive?: boolean;
}
