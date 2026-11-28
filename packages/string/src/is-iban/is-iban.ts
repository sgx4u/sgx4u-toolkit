import { ibanLengthByCountry } from "../data/iban-lengths.data.js";
import { mod97 } from "../utils/checksum.utils.js";

/**
 * Reports whether `value` is an IBAN.
 *
 * Spaces are ignored and letters are compared without case. The country
 * code must be in the length table and the compact text must have that
 * length. An unknown country returns `false` and does not throw. The
 * rearranged body must have a mod-97 remainder of 1. A non-string returns
 * `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is an IBAN for a known country.
 * @example
 * isIBAN("GB82 WEST 1234 5698 7654 32");
 */
export function isIBAN(value: unknown): boolean {
    if (typeof value !== "string") {
        return false;
    }
    const compact = value.replace(/ /gu, "").toUpperCase();
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/u.test(compact)) {
        return false;
    }
    const country = compact.slice(0, 2);
    const expectedLength = ibanLengthByCountry[country];
    if (expectedLength === undefined || compact.length !== expectedLength) {
        return false;
    }
    const rearranged = compact.slice(4) + compact.slice(0, 4);
    return mod97(rearranged) === 1;
}
