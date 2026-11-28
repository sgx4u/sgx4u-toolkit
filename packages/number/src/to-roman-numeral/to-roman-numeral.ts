import { romanFromInteger } from "../utils/roman-numeral.utils.js";

/**
 * Converts an integer to a Roman numeral. Standard numerals cover 1 to 3999. `style: "extended"` covers 1 to 3999999 using parentheses for thousands, so 4000 is `(IV)`.
 *
 * @throws {@link RangeError} When `style` is unknown.
 *
 * @example
 * toRomanNumeral({ value: 4 });
 */
export function toRomanNumeral(parameters: {
    value: number;
    style?: "standard" | "extended";
}): string | undefined {
    const style = parameters.style ?? "standard";
    if (style !== "standard" && style !== "extended") {
        throw new RangeError(
            `style must be "standard" or "extended". Received ${JSON.stringify(style)}.`,
        );
    }
    return romanFromInteger(parameters.value, style);
}
