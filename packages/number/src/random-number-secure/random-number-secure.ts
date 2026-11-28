import { randomRealSecureBetween } from "../utils/random-source.utils.js";

/**
 * Returns a float in the range using `crypto.getRandomValues`. `includeUpper` defaults to `false`.
 *
 * @throws {@link Error} When `crypto.getRandomValues` is missing. {@link RangeError} When the range is invalid.
 *
 * @example
 * randomNumberSecure({ lower: 0, upper: 1 });
 */
export function randomNumberSecure(parameters: {
    lower: number;
    upper: number;
    includeUpper?: boolean;
}): number {
    return randomRealSecureBetween(
        parameters.lower,
        parameters.upper,
        parameters.includeUpper ?? false,
    );
}
