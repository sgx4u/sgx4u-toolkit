/**
 * Negates a primitive boolean.
 *
 * `toggle` returns the same result. `not` is the logic-gate name. A value
 * that is not a primitive boolean returns `undefined`. The function does
 * not coerce with `!!` and never throws.
 *
 * @param value - A candidate boolean.
 * @returns The opposite boolean, or `undefined` when `value` is not a primitive boolean.
 * @example
 * not(true); // false
 */
export function not(value: unknown): boolean | undefined {
    if (typeof value !== "boolean") {
        return undefined;
    }
    return !value;
}
