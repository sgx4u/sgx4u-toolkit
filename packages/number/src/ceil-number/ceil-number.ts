import { roundNumber } from "../round-number/round-number.js";

/**
 * Rounds `value` toward positive infinity at `precision` decimal places.
 *
 * @throws {@link RangeError} When `precision` is not an integer from -308 to 308.
 *
 * @example
 * ceilNumber({ value: 1.2 });
 */
export function ceilNumber(parameters: {
    value: number;
    precision?: number;
}): number | undefined {
    return roundNumber({
        value: parameters.value,
        precision: parameters.precision ?? 0,
        mode: "ceil",
    });
}
