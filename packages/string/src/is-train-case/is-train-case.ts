import { toTrainCase } from "../to-train-case/to-train-case.js";

/**
 * Reports whether `value` is already trainCase.
 *
 * True only when converting the string produces the same string and the
 * string is non-empty. A non-string returns `false`. The input is not changed.
 *
 * @param value - Any value.
 * @returns `true` when the string is already in that case.
 * @example
 * isTrainCase("value");
 */
export function isTrainCase(value: unknown): boolean {
    if (typeof value !== "string" || value.length === 0) {
        return false;
    }
    if (toTrainCase(value) !== value) {
        return false;
    }

    return true;
}
