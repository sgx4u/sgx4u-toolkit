import type { CurrencyDisplay } from "../types/format-display.types.js";
import { currencySymbolText } from "../utils/format-number.utils.js";

/**
 * Returns the currency symbol, narrow symbol, code, or name.
 *
 * @throws {@link RangeError} When `currency` or `locale` is invalid.
 *
 * @example
 * getCurrencySymbol({ currency: "USD", locale: "en-US" });
 */
export function getCurrencySymbol(parameters: {
    currency: string;
    locale?: string | readonly string[];
    currencyDisplay?: CurrencyDisplay;
}): string | undefined {
    return currencySymbolText(
        parameters.currency,
        parameters.locale,
        parameters.currencyDisplay ?? "symbol",
    );
}
