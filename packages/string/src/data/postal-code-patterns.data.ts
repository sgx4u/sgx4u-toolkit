/**
 * Compact postal-code patterns for a curated set of countries.
 *
 * These are practical shapes, not a complete official database. Patterns
 * are matched against the value with spaces removed only when the pattern
 * itself allows whitespace. Unknown countries are not listed.
 */
export const postalCodePatternByCountry: Readonly<Record<string, RegExp>> = {
    AE: /^[A-Za-z0-9]{3,10}$/u,
    AU: /^\d{4}$/u,
    BE: /^\d{4}$/u,
    BR: /^\d{5}-?\d{3}$/u,
    CA: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ ]?\d[ABCEGHJ-NPRSTV-Z]\d$/iu,
    CN: /^\d{6}$/u,
    DE: /^\d{5}$/u,
    DK: /^\d{4}$/u,
    ES: /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/u,
    FI: /^\d{5}$/u,
    FR: /^\d{5}$/u,
    GB: /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/iu,
    IE: /^[AC-FHKNPRTV-Y]\d{2}\s?[0-9AC-FHKNPRTV-Y]{4}$/iu,
    IN: /^[1-9]\d{5}$/u,
    IT: /^\d{5}$/u,
    JP: /^\d{3}-?\d{4}$/u,
    KR: /^\d{5}$/u,
    MX: /^\d{5}$/u,
    NL: /^\d{4}\s?[A-Z]{2}$/iu,
    NO: /^\d{4}$/u,
    NZ: /^\d{4}$/u,
    PL: /^\d{2}-\d{3}$/u,
    PT: /^\d{4}-\d{3}$/u,
    SE: /^\d{3}\s?\d{2}$/u,
    SG: /^\d{6}$/u,
    US: /^\d{5}(?:-\d{4})?$/u,
    ZA: /^\d{4}$/u,
};
