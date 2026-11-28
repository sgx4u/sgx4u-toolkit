import { randomBigIntBetween } from "../utils/random-source.utils.js";

/**
 * Returns a bigint in the range. `includeUpper` defaults to `true`. Not cryptographically secure.
 *
 * @throws {@link RangeError} When `lower` is greater than the included end, or `random` is outside `[0, 1)`.
 *
 * @example
 * randomBigInt({ lower: 1n, upper: 3n, random: () => 0 });
 */
export function randomBigInt(parameters: {
    lower: bigint;
    upper: bigint;
    includeUpper?: boolean;
    random?: () => number;
}): bigint {
    return randomBigIntBetween(
        parameters.lower,
        parameters.upper,
        parameters.includeUpper ?? true,
        parameters.random ?? Math.random,
    );
}
