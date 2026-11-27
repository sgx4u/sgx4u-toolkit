import type { LocaleNumberSymbols } from "../types/locale-number-symbols.types.js";
import { assertLocale, readLocaleSymbols } from "../utils/intl-locale.utils.js";

/**
 * Returns the decimal, group, sign, percent, infinity, NaN, and exponent characters for a locale.
 *
 * @throws {@link RangeError} When `locale` is invalid.
 *
 * @example
 * getLocaleNumberSymbols({ locale: "de-DE" });
 */
export function getLocaleNumberSymbols(parameters: {
    locale?: string | readonly string[];
}): LocaleNumberSymbols {
    if (parameters.locale !== undefined) {
        assertLocale(parameters.locale);
    }
    const symbols = readLocaleSymbols(parameters.locale);
    return {
        decimal: symbols.decimal,
        group: symbols.group,
        plusSign: symbols.plusSign,
        minusSign: symbols.minusSign,
        percentSign: symbols.percentSign,
        infinity: symbols.infinity,
        nan: symbols.nan,
        exponentSeparator: symbols.exponentSeparator,
    };
}
