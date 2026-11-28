import { createUniqueIntegerSource } from "../utils/random-source.utils.js";

/**
 * Returns a function that yields each integer in the range once, then starts again. Not cryptographically secure.
 *
 * @throws {@link RangeError} When the range is invalid or longer than 1000000.
 *
 * @example
 * const next = createUniqueRandomInteger({ lower: 1, upper: 2, random: () => 0 });
 */
export function createUniqueRandomInteger(parameters: {
    lower: number;
    upper: number;
    includeUpper?: boolean;
    random?: () => number;
}): () => number {
    return createUniqueIntegerSource(
        parameters.lower,
        parameters.upper,
        parameters.includeUpper ?? true,
        parameters.random ?? Math.random,
    );
}
