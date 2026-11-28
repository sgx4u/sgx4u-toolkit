/**
 * Reports whether `value` is a finite integer multiple of `divisor`.
 *
 * Either argument not being a finite integer, or a divisor of zero, returns `false`.
 *
 * @example
 * isMultipleOf({ value: 10, divisor: 5 });
 */
export function isMultipleOf(parameters: {
    value: number;
    divisor: number;
}): boolean {
    const { value, divisor } = parameters;
    if (
        !Number.isInteger(value) ||
        !Number.isInteger(divisor) ||
        divisor === 0
    ) {
        return false;
    }
    return value % divisor === 0;
}
