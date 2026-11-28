import { rangeError, typeError } from "./errors.utils.js";

const uint32Range = 4_294_967_296;

/**
 * A deterministic 32-bit generator for one seed.
 *
 * The state is a xorshift step written for this package. Two calls with the
 * same seed return the same sequence, and calls with different seeds do not
 * share state.
 *
 * @param seed - A finite number. The integer part and the fraction both
 * affect the first state.
 * @returns A function that returns numbers in `[0, 1)`.
 */
export function createSeededRandom(seed: number): () => number {
    const integerPart = Math.trunc(seed);
    const fractionalPart = Math.abs(seed - integerPart);
    let state =
        (integerPart >>> 0) ^ (Math.trunc(fractionalPart * uint32Range) >>> 0);
    if (state === 0) {
        state = 0x6d2b79f5;
    }
    return () => {
        state ^= state << 13;
        state >>>= 0;
        state ^= state >>> 17;
        state ^= state << 5;
        state >>>= 0;
        return state / uint32Range;
    };
}

/**
 * Picks the random source for one shuffle or sample.
 *
 * A finite `seed` wins over `random`. Otherwise `random` is used when it is
 * a function. Otherwise `Math.random` is used. A supplied `random` must
 * return a number in `[0, 1)` each time it is called.
 *
 * @param options - The call's `random` and `seed`.
 * @returns A function that returns numbers in `[0, 1)`.
 * @throws {@link RangeError} When `seed` is not finite, or when `random` returns a number outside `[0, 1)`.
 * @throws {@link TypeError} When `random` is present and is not a function.
 */
export function resolveRandom(options: {
    random?: unknown;
    seed?: unknown;
}): () => number {
    if (options.seed !== undefined) {
        if (
            typeof options.seed !== "number" ||
            !Number.isFinite(options.seed)
        ) {
            throw rangeError("seed", "a finite number", options.seed);
        }
        return createSeededRandom(options.seed);
    }
    if (options.random === undefined) {
        return Math.random;
    }
    if (typeof options.random !== "function") {
        throw typeError("random", "a function", options.random);
    }
    const random = options.random as () => number;
    return () => {
        const value = random();
        if (typeof value !== "number" || value < 0 || value >= 1) {
            throw rangeError(
                "random",
                "a function that returns a number in [0, 1)",
                value,
            );
        }
        return value;
    };
}

/**
 * An integer index in `0..upperExclusive` using `random`.
 *
 * @param random - A source of numbers in `[0, 1)`.
 * @param upperExclusive - A positive integer. The result is strictly less.
 * @returns An integer index.
 */
export function randomIndexBelow(
    random: () => number,
    upperExclusive: number,
): number {
    return Math.floor(random() * upperExclusive);
}
