/**
 * Clamps a bigint to an inclusive range.
 *
 * @throws {@link RangeError} When `lower` is greater than `upper`.
 *
 * @example
 * clampBigInt({ value: 5n, lower: 0n, upper: 3n });
 */
export function clampBigInt(parameters: {
    value: bigint;
    lower: bigint;
    upper: bigint;
}): bigint | undefined {
    const { value, lower, upper } = parameters;
    if (lower > upper) {
        throw new RangeError(
            `lower must not be greater than upper. Received lower ${lower.toString()}n, upper ${upper.toString()}n.`,
        );
    }
    if (value < lower) {
        return lower;
    }
    if (value > upper) {
        return upper;
    }
    return value;
}
