import { roundNumber } from "../round-number/round-number.js";

/**
 * Rounds `value` toward zero at `precision` decimal places.
 *
 * @throws {@link RangeError} When `precision` is not an integer from -308 to 308.
 *
 * @example
 * truncateNumber({ value: -1.8 });
 */
export function truncateNumber(parameters: {
    value: number;
    precision?: number;
}): number | undefined {
    return roundNumber({
        value: parameters.value,
        precision: parameters.precision ?? 0,
        mode: "trunc",
    });
}
