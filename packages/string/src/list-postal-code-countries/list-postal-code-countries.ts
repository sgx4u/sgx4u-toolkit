import { postalCodePatternByCountry } from "../data/postal-code-patterns.data.js";

/**
 * Lists the countries `isPostalCode` knows.
 *
 * The codes are ISO 3166-1 alpha-2 and are sorted. The array is a copy.
 *
 * @returns The country codes that have a postal-code pattern.
 * @example
 * listPostalCodeCountries();
 */
export function listPostalCodeCountries(): readonly string[] {
    return Object.keys(postalCodePatternByCountry).sort();
}
