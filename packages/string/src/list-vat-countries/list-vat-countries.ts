import { vatCountryRules } from "../data/vat-countries.data.js";

/**
 * Lists the VAT prefixes `isVAT` knows.
 *
 * The codes include EU member prefixes (`EL` for Greece), `GB`, and `XI`.
 * They are sorted. The array is a copy.
 *
 * @returns The prefixes that have a pattern or a checksum.
 * @example
 * listVATCountries();
 */
export function listVATCountries(): readonly string[] {
    return vatCountryRules.map((rule) => rule.code).sort();
}
