import { randomIntegerBetween } from "../utils/random-source.utils.js";

/**
 * Returns an integer in the range. `includeUpper` defaults to `true`. Not cryptographically secure. Pass `random` to supply a float in `[0, 1)`.
 *
 * @throws {@link RangeError} When the bounds are not integers, the range is empty, or `random` returns a value outside `[0, 1)`.
 *
 * @example
 * randomInteger({ lower: 1, upper: 6, random: () => 0 });
 */
export function randomInteger(parameters: {
    lower: number;
    upper: number;
    includeUpper?: boolean;
    random?: () => number;
}): number {
    return randomIntegerBetween(
        parameters.lower,
        parameters.upper,
        parameters.includeUpper ?? true,
        parameters.random ?? Math.random,
    );
}
