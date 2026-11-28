/**
 * VAT number shapes for EU member states plus the United Kingdom.
 *
 * Greece uses the prefix `EL`. Northern Ireland uses `XI`.
 *
 * Checksums:
 * - `be`: Belgium. The last two digits are `97 - (first eight digits mod 97)`.
 *   A nine-digit body is padded with a leading zero before that check.
 * - `gb`: United Kingdom, nine-digit form only. The last two digits are
 *   `97 - (weighted sum of the first seven digits mod 97)`, weights
 *   8, 7, 6, 5, 4, 3, 2. A 12-digit number and the `GD` / `HA` forms are
 *   pattern checks.
 * - `nl`: Netherlands. The ninth digit is the weighted sum of the first
 *   eight digits modulo 11, weights 9 through 2. A remainder of 10 is
 *   not a valid check digit. The body is nine digits, `B`, and two digits.
 * - `pattern`: the body only has to match `body`.
 */
export type VatChecksum = "be" | "gb" | "nl" | "pattern";

/**
 * One VAT prefix.
 */
export interface VatCountryRule {
    /** The two-letter prefix stored on the number. */
    code: string;
    /** Pattern for the body after the prefix. */
    body: RegExp;
    /** Which checksum applies after the pattern matches. */
    checksum: VatChecksum;
}

/**
 * Country rules in prefix order. `listVATCountries` sorts the codes.
 */
export const vatCountryRules: readonly VatCountryRule[] = [
    { code: "AT", body: /^U\d{8}$/u, checksum: "pattern" },
    { code: "BE", body: /^(?:[01]\d{9}|\d{9})$/u, checksum: "be" },
    { code: "BG", body: /^\d{9,10}$/u, checksum: "pattern" },
    { code: "CY", body: /^\d{8}[A-Z]$/u, checksum: "pattern" },
    { code: "CZ", body: /^\d{8,10}$/u, checksum: "pattern" },
    { code: "DE", body: /^\d{9}$/u, checksum: "pattern" },
    { code: "DK", body: /^\d{8}$/u, checksum: "pattern" },
    { code: "EE", body: /^\d{9}$/u, checksum: "pattern" },
    { code: "EL", body: /^\d{9}$/u, checksum: "pattern" },
    { code: "ES", body: /^[A-Z0-9]\d{7}[A-Z0-9]$/u, checksum: "pattern" },
    { code: "FI", body: /^\d{8}$/u, checksum: "pattern" },
    { code: "FR", body: /^[A-Z0-9]{2}\d{9}$/u, checksum: "pattern" },
    {
        code: "GB",
        body: /^(?:\d{9}|\d{12}|GD\d{3}|HA\d{3})$/u,
        checksum: "gb",
    },
    { code: "HR", body: /^\d{11}$/u, checksum: "pattern" },
    { code: "HU", body: /^\d{8}$/u, checksum: "pattern" },
    {
        code: "IE",
        body: /^(?:\d{7}[A-Z]{1,2}|\d[A-Z]\d{5}[A-Z])$/u,
        checksum: "pattern",
    },
    { code: "IT", body: /^\d{11}$/u, checksum: "pattern" },
    { code: "LT", body: /^(?:\d{9}|\d{12})$/u, checksum: "pattern" },
    { code: "LU", body: /^\d{8}$/u, checksum: "pattern" },
    { code: "LV", body: /^\d{11}$/u, checksum: "pattern" },
    { code: "MT", body: /^\d{8}$/u, checksum: "pattern" },
    { code: "NL", body: /^\d{9}B\d{2}$/u, checksum: "nl" },
    { code: "PL", body: /^\d{10}$/u, checksum: "pattern" },
    { code: "PT", body: /^\d{9}$/u, checksum: "pattern" },
    { code: "RO", body: /^\d{2,10}$/u, checksum: "pattern" },
    { code: "SE", body: /^\d{12}$/u, checksum: "pattern" },
    { code: "SI", body: /^\d{8}$/u, checksum: "pattern" },
    { code: "SK", body: /^\d{10}$/u, checksum: "pattern" },
    {
        code: "XI",
        body: /^(?:\d{9}|\d{12}|GD\d{3}|HA\d{3})$/u,
        checksum: "pattern",
    },
];
