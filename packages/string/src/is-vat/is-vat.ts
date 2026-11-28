import {
    vatCountryRules,
    type VatChecksum,
    type VatCountryRule,
} from "../data/vat-countries.data.js";
import { readOptionalString } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { IsVATOptions } from "./is-vat.types.js";

export type { IsVATOptions } from "./is-vat.types.js";

const rulesByCode = new Map<string, VatCountryRule>(
    vatCountryRules.map((rule) => [rule.code, rule]),
);

/**
 * Reports whether `value` is a VAT number for a known prefix.
 *
 * The country is the first two letters, unless `country` is passed. Spaces,
 * dots, and hyphens are ignored. Belgium, the United Kingdom's nine-digit
 * form, and the Netherlands are checked with a checksum. Every other EU
 * prefix and the `XI` Northern Ireland prefix are pattern checks. See
 * `vatCountryRules` for which is which. An unknown prefix returns `false`.
 * An explicit unknown `country` throws `RangeError`. A non-string returns
 * `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when the prefix, shape, and checksum agree.
 * @throws {@link TypeError} When `country` is present and is not a string.
 * @throws {@link RangeError} When `country` is not a known VAT prefix.
 * @example
 * isVAT("BE0428759497");
 */
export function isVAT(value: unknown): boolean;
/**
 * @param options - `value` and an optional `country`.
 * @returns `true` when the prefix, shape, and checksum agree.
 */
export function isVAT(options: IsVATOptions): boolean;
/**
 * @param valueOrOptions - A string, or `value` plus `country`.
 * @returns `true` when the prefix, shape, and checksum agree.
 */
export function isVAT(valueOrOptions: unknown): boolean {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        country: readVatCountry(record.country),
    }));
    if (resolved === undefined) {
        return false;
    }
    return matchesVat(resolved.value, resolved.options.country);
}

/**
 * Reads an optional country and rejects unknown codes.
 *
 * @param value - The option value.
 * @returns The uppercase code, or `undefined` when it was omitted.
 * @throws {@link TypeError} When `value` is present and is not a string.
 * @throws {@link RangeError} When the code is not a known VAT prefix.
 */
function readVatCountry(value: unknown): string | undefined {
    const country = readOptionalString("country", value);
    if (country === undefined) {
        return undefined;
    }
    const code = country.toUpperCase();
    if (!rulesByCode.has(code)) {
        throw new RangeError(
            `country must be a known VAT country. Received ${JSON.stringify(code)}.`,
        );
    }
    return code;
}

/**
 * Whether `value` matches `country` or its own prefix.
 *
 * @param value - The original text.
 * @param country - An explicit prefix, or `undefined` to infer one.
 * @returns `true` when the shape and checksum match.
 */
function matchesVat(value: string, country: string | undefined): boolean {
    const normalized = value.replace(/[\s.-]/gu, "").toUpperCase();
    const split = splitVat(normalized, country);
    if (split === undefined) {
        return false;
    }
    if (!split.rule.body.test(split.body)) {
        return false;
    }
    return passesVatChecksum(split.rule.checksum, split.body);
}

/**
 * A prefix and the body that follows it.
 */
interface VatParts {
    /** The rule for the prefix. */
    rule: VatCountryRule;
    /** The characters after the prefix. */
    body: string;
}

/**
 * Splits a normalized VAT number into a prefix and a body.
 *
 * @param normalized - Uppercase text with separators removed.
 * @param country - An explicit prefix, or `undefined` to read the first two letters.
 * @returns The parts, or `undefined` when the prefix is not known.
 */
function splitVat(
    normalized: string,
    country: string | undefined,
): VatParts | undefined {
    if (country !== undefined) {
        const rule = rulesByCode.get(country);
        if (rule === undefined) {
            return undefined;
        }
        const body = normalized.startsWith(country)
            ? normalized.slice(country.length)
            : normalized;
        return { rule, body };
    }
    const code = normalized.slice(0, 2);
    const rule = rulesByCode.get(code);
    if (rule === undefined) {
        return undefined;
    }
    return { rule, body: normalized.slice(2) };
}

/**
 * Runs the checksum for `kind`.
 *
 * Pattern-only countries return `true` once the shape has matched.
 * The United Kingdom checksum runs only for a nine-digit body.
 *
 * @param kind - Which algorithm to use.
 * @param body - The characters after the prefix.
 * @returns `true` when the checksum matches, or when no checksum applies.
 */
function passesVatChecksum(kind: VatChecksum, body: string): boolean {
    if (kind === "be") {
        return passesBelgium(body);
    }
    if (kind === "gb") {
        return body.length === 9 ? passesUnitedKingdom(body) : true;
    }
    if (kind === "nl") {
        return passesNetherlands(body);
    }
    return true;
}

/**
 * Belgium: `97 - (first eight digits mod 97)` equals the last two digits.
 *
 * A nine-digit body is padded with a leading zero.
 *
 * @param body - Nine or ten digits.
 * @returns `true` when the check digits match.
 */
function passesBelgium(body: string): boolean {
    const digits = body.length === 9 ? `0${body}` : body;
    if (!/^[01]\d{9}$/u.test(digits)) {
        return false;
    }
    const expected = 97 - (Number(digits.slice(0, 8)) % 97);
    return Number(digits.slice(8)) === expected;
}

/**
 * United Kingdom nine-digit modulus 97 check.
 *
 * The first seven digits are weighted 8, 7, 6, 5, 4, 3, 2. The last two
 * digits equal `97 - (sum mod 97)`, or `0` when the sum is divisible by 97.
 *
 * @param digits - Nine ASCII digits.
 * @returns `true` when the check digits match.
 */
function passesUnitedKingdom(digits: string): boolean {
    const weights = [8, 7, 6, 5, 4, 3, 2];
    let total = 0;
    for (let index = 0; index < weights.length; index += 1) {
        total += Number(digits.charAt(index)) * (weights[index] ?? 0);
    }
    const remainder = total % 97;
    const expected = remainder === 0 ? 0 : 97 - remainder;
    return Number(digits.slice(7, 9)) === expected;
}

/**
 * Netherlands modulus 11 check on the first nine digits.
 *
 * Weights are 9, 8, 7, 6, 5, 4, 3, 2. A remainder of 10 is never valid.
 * The `B` and the two digits after it are not part of the sum.
 *
 * @param body - Nine digits, `B`, and two digits.
 * @returns `true` when the ninth digit is the check digit.
 */
function passesNetherlands(body: string): boolean {
    const weights = [9, 8, 7, 6, 5, 4, 3, 2];
    let total = 0;
    for (let index = 0; index < weights.length; index += 1) {
        total += Number(body.charAt(index)) * (weights[index] ?? 0);
    }
    const remainder = total % 11;
    if (remainder > 9) {
        return false;
    }
    return remainder === Number(body.charAt(8));
}
