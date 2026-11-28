import { randomRealBetween } from "../utils/random-source.utils.js";

/**
 * Returns a float in the range. `includeUpper` defaults to `false`. Not cryptographically secure.
 *
 * @throws {@link RangeError} When `lower` is greater than `upper`, the half-open range is empty, or `random` is outside `[0, 1)`.
 *
 * @example
 * randomNumber({ lower: 0, upper: 1, random: () => 0.5 });
 */
export function randomNumber(parameters: {
    lower: number;
    upper: number;
    includeUpper?: boolean;
    random?: () => number;
}): number {
    return randomRealBetween(
        parameters.lower,
        parameters.upper,
        parameters.includeUpper ?? false,
        parameters.random ?? Math.random,
    );
}
