/**
 * Maps `value` into the half-open interval `[lower, upper)`. Useful for angles and cyclic indexes.
 *
 * @throws {@link RangeError} When `lower` is greater than or equal to `upper`.
 *
 * @example
 * wrapNumber({ value: 370, lower: 0, upper: 360 });
 */
export function wrapNumber(parameters: {
    value: number;
    lower: number;
    upper: number;
}): number | undefined {
    const { value, lower, upper } = parameters;
    if (!(lower < upper)) {
        throw new RangeError(
            `lower must be less than upper. Received lower ${String(lower)}, upper ${String(upper)}.`,
        );
    }
    if (!Number.isFinite(value)) {
        return undefined;
    }
    const width = upper - lower;
    const offset = value - lower;
    const wrapped = lower + (((offset % width) + width) % width);
    return wrapped === upper ? lower : wrapped;
}
