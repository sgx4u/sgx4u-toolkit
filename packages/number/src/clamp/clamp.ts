/**
 * Clamps `value` to the inclusive interval `[lower, upper]`. `-0` is preserved when it is the bound that is hit or the value already inside the interval.
 *
 * @throws {@link RangeError} When `lower` is greater than `upper`.
 *
 * @example
 * clamp({ value: 5, lower: 0, upper: 3 });
 */
export function clamp(parameters: {
    value: number;
    lower: number;
    upper: number;
}): number | undefined {
    const { value, lower, upper } = parameters;
    if (lower > upper) {
        throw new RangeError(
            `lower must not be greater than upper. Received lower ${String(lower)}, upper ${String(upper)}.`,
        );
    }
    if (
        !Number.isFinite(value) ||
        !Number.isFinite(lower) ||
        !Number.isFinite(upper)
    ) {
        return undefined;
    }
    if (!(value >= lower)) {
        return lower;
    }
    if (!(value <= upper)) {
        return upper;
    }
    return value;
}
