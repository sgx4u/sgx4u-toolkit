import { parsePercentText } from "../utils/parse-text.utils.js";

/**
 * Parses a percentage into a ratio. `"25%"`, `"25 %"`, `"25"`, and `25` are all `0.25`. This is the form-input direction. {@link formatPercent} takes a ratio instead.
 *
 * @throws {@link RangeError} When `locale` is not a valid locale.
 *
 * @example
 * parsePercent({ value: "25%" });
 */
export function parsePercent(parameters: {
    value: string | number;
    locale?: string | readonly string[];
}): number | undefined {
    return parsePercentText(parameters.value, parameters.locale);
}
