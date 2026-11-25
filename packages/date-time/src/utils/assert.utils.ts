import { rangeError, typeError } from "./error.utils.js";

/**
 * @param value - The argument to check.
 * @param argumentName - The parameter name, without backticks.
 * @returns `value` when it is a finite number.
 * @throws {@link TypeError} When `value` is not a number.
 * @throws {@link RangeError} When `value` is `NaN` or an infinity.
 */
export function assertFiniteNumber(
    value: unknown,
    argumentName: string,
): number {
    if (typeof value !== "number") {
        throw typeError(argumentName, "a number", value);
    }
    if (!Number.isFinite(value)) {
        throw rangeError(argumentName, "a finite number", value);
    }
    return value;
}

/**
 * @param value - The argument to check.
 * @param argumentName - The parameter name, without backticks.
 * @returns `value` when it is a finite integer.
 * @throws {@link TypeError} When `value` is not a number.
 * @throws {@link RangeError} When `value` is not a finite integer.
 */
export function assertInteger(value: unknown, argumentName: string): number {
    const numberValue = assertFiniteNumber(value, argumentName);
    if (!Number.isInteger(numberValue)) {
        throw rangeError(argumentName, "an integer", numberValue);
    }
    return numberValue;
}

/**
 * @param value - The argument to check.
 * @param argumentName - The parameter name, without backticks.
 * @param minimum - The smallest allowed integer.
 * @param maximum - The largest allowed integer.
 * @returns `value` when it is an integer in the range.
 * @throws {@link TypeError} When `value` is not a number.
 * @throws {@link RangeError} When `value` is outside the range or not an integer.
 */
export function assertIntegerInRange(
    value: unknown,
    argumentName: string,
    minimum: number,
    maximum: number,
): number {
    const integerValue = assertInteger(value, argumentName);
    if (integerValue < minimum || integerValue > maximum) {
        throw rangeError(
            argumentName,
            `an integer from ${String(minimum)} to ${String(maximum)}`,
            integerValue,
        );
    }
    return integerValue;
}
