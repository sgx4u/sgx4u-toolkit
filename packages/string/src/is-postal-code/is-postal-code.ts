import { postalCodePatternByCountry } from "../data/postal-code-patterns.data.js";
import { readRequiredString } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { IsPostalCodeOptions } from "./is-postal-code.types.js";

export type { IsPostalCodeOptions } from "./is-postal-code.types.js";

/**
 * Reports whether `value` matches the postal-code shape for `country`.
 *
 * `country` is required. The patterns are the practical shapes in
 * `postalCodePatternByCountry`. The value is tested as given: spaces are
 * removed only when the pattern itself allows them. An unknown country
 * throws `RangeError`. A non-string returns `false`. The input is not
 * changed.
 *
 * A bare string has no country, so it throws. Pass `{ value, country }`.
 *
 * @param value - Any value. Only a string can match, and only together with a country.
 * @returns `true` when `value` matches that country's pattern.
 * @throws {@link TypeError} When `country` is present and is not a string.
 * @throws {@link RangeError} When `country` is missing, empty, or not in the pattern table.
 * @example
 * isPostalCode({ value: "90210", country: "US" });
 */
export function isPostalCode(value: unknown): boolean;
/**
 * @param options - `value` and the required `country`.
 * @returns `true` when `value` matches that country's pattern.
 */
export function isPostalCode(options: IsPostalCodeOptions): boolean;
/**
 * @param valueOrOptions - A string, or `value` plus `country`.
 * @returns `true` when `value` matches that country's pattern.
 */
export function isPostalCode(valueOrOptions: unknown): boolean {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        country: readCountry(record.country),
    }));
    if (resolved === undefined) {
        return false;
    }
    const pattern = postalCodePatternByCountry[resolved.options.country];
    if (pattern === undefined) {
        throw new RangeError(
            `country must be a known postal-code country. Received ${JSON.stringify(resolved.options.country)}.`,
        );
    }
    return pattern.test(resolved.value);
}

/**
 * Reads the required country code.
 *
 * @param value - The option value.
 * @returns The code in uppercase.
 * @throws {@link TypeError} When `value` is not a string.
 * @throws {@link RangeError} When `value` is missing or empty.
 */
function readCountry(value: unknown): string {
    if (value === undefined) {
        throw new RangeError("country is required. Received undefined.");
    }
    const country = readRequiredString("country", value);
    if (country.length === 0) {
        throw new RangeError(
            'country must be a non-empty string. Received "".',
        );
    }
    return country.toUpperCase();
}
