import { not } from "../not/not.js";

/**
 * Flips a primitive boolean.
 *
 * The result is the same as `not`. `toggle` is the everyday name. A value
 * that is not a primitive boolean returns `undefined`. The function never
 * throws.
 *
 * @param value - A candidate boolean.
 * @returns The opposite boolean, or `undefined` when `value` is not a primitive boolean.
 * @example
 * toggle(false); // true
 */
export function toggle(value: unknown): boolean | undefined {
    return not(value);
}
