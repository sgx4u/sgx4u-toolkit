import { toConstantCase } from "../to-constant-case/to-constant-case.js";

/**
 * Reports whether `value` is already constantCase.
 *
 * True only when converting the string produces the same string and the
 * string is non-empty. A non-string returns `false`. The input is not changed.
 *
 * @param value - Any value.
 * @returns `true` when the string is already in that case.
 * @example
 * isConstantCase("value");
 */
export function isConstantCase(value: unknown): boolean {
    if (typeof value !== "string" || value.length === 0) {
        return false;
    }
    if (toConstantCase(value) !== value) {
        return false;
    }

    return true;
}
