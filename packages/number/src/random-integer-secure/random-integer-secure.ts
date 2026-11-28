import { randomIntegerSecureBetween } from "../utils/random-source.utils.js";

/**
 * Returns a uniform integer using `crypto.getRandomValues`.
 *
 * @throws {@link Error} When `crypto.getRandomValues` is missing. {@link RangeError} When the range is invalid.
 *
 * @example
 * randomIntegerSecure({ lower: 0, upper: 1 });
 */
export function randomIntegerSecure(parameters: {
    lower: number;
    upper: number;
    includeUpper?: boolean;
}): number {
    return randomIntegerSecureBetween(
        parameters.lower,
        parameters.upper,
        parameters.includeUpper ?? true,
    );
}
