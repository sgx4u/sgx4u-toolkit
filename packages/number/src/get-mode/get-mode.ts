import { getModes } from "../get-modes/get-modes.js";

/**
 * Returns the unique most frequent finite value. An empty list or a tie returns `undefined`.
 *
 * @example
 * getMode([1, 2, 2, 3]);
 */
export function getMode(values: readonly number[]): number | undefined {
    const modes = getModes(values);
    return modes.length === 1 ? modes[0] : undefined;
}
