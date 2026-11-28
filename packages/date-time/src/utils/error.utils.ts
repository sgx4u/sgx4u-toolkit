import { isDateValue } from "./date-value.utils.js";

/**
 * Text for the value named in an error message.
 *
 * Strings are quoted. An Invalid Date is the words `Invalid Date`.
 *
 * @param value - The value the caller passed.
 * @returns A short description that can follow "received".
 */
export function receivedText(value: unknown): string {
    if (typeof value === "string") {
        return JSON.stringify(value);
    }
    if (typeof value === "number") {
        if (Number.isNaN(value)) {
            return "NaN";
        }
        if (value === Number.POSITIVE_INFINITY) {
            return "Infinity";
        }
        if (value === Number.NEGATIVE_INFINITY) {
            return "-Infinity";
        }
        return String(value);
    }
    if (typeof value === "bigint") {
        return `${String(value)}n`;
    }
    if (typeof value === "boolean") {
        return String(value);
    }
    if (value === null) {
        return "null";
    }
    if (value === undefined) {
        return "undefined";
    }
    if (typeof value === "symbol") {
        return value.toString();
    }
    if (typeof value === "function") {
        return "a function";
    }
    if (isDateValue(value)) {
        try {
            if (Number.isNaN(value.getTime())) {
                return "Invalid Date";
            }
        } catch {
            return "Invalid Date";
        }
        return "a Date";
    }
    return Object.prototype.toString.call(value);
}

/**
 * @param argumentName - The parameter name, without backticks.
 * @param requirement - What the argument must be, without a trailing period.
 * @param value - The value the caller passed.
 * @returns A TypeError whose message names the argument and the value.
 */
export function typeError(
    argumentName: string,
    requirement: string,
    value: unknown,
): TypeError {
    return new TypeError(
        `\`${argumentName}\` must be ${requirement}; received ${receivedText(value)}.`,
    );
}

/**
 * @param argumentName - The parameter name, without backticks.
 * @param requirement - What the argument must be, without a trailing period.
 * @param value - The value the caller passed.
 * @returns A RangeError whose message names the argument and the value.
 */
export function rangeError(
    argumentName: string,
    requirement: string,
    value: unknown,
): RangeError {
    return new RangeError(
        `\`${argumentName}\` must be ${requirement}; received ${receivedText(value)}.`,
    );
}
