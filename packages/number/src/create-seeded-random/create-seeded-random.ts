import {
    createMulberry32,
    randomIntegerBetween,
    randomRealBetween,
} from "../utils/random-source.utils.js";

/**
 * Returns a deterministic generator for a numeric or string seed. The same seed produces the same sequence. Not for secrets.
 *
 * @throws {@link RangeError} When `seed` is not a finite number or a string, or a later range is invalid.
 *
 * @example
 * const seeded = createSeededRandom({ seed: 1 });
 */
export function createSeededRandom(parameters: { seed: number | string }): {
    random: () => number;
    randomInteger: (parameters: {
        lower: number;
        upper: number;
        includeUpper?: boolean;
    }) => number;
    randomNumber: (parameters: {
        lower: number;
        upper: number;
        includeUpper?: boolean;
    }) => number;
} {
    const random = createMulberry32(parameters.seed);
    return {
        random,
        randomInteger: (range) =>
            randomIntegerBetween(
                range.lower,
                range.upper,
                range.includeUpper ?? true,
                random,
            ),
        randomNumber: (range) =>
            randomRealBetween(
                range.lower,
                range.upper,
                range.includeUpper ?? false,
                random,
            ),
    };
}
