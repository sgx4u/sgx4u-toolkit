import { indianWords } from "../indian-words.data.js";
import { spellCurrency } from "../../spell-number.utils.js";

/**
 * Spells a currency amount. `USD`, `EUR`, `GBP`, and `INR` have unit names. Another three-letter code uses the code as the major unit and `minor` for the hundredth.
 *
 * @throws {@link RangeError When `currency` is not a three-letter code and is not in the locale table.}
 *
 * @example
 * toCurrencyWords({ value: 1, currency: "USD" });
 */
export function toCurrencyWords(parameters: {
    value: number;
    currency: string;
    style?: "plain" | "cheque";
}): string | undefined {
    const style = parameters.style ?? "plain";
    if (style !== "plain" && style !== "cheque") {
        return undefined;
    }
    return spellCurrency(
        parameters.value,
        parameters.currency,
        style,
        indianWords,
    );
}
