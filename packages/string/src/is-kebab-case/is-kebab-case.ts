import { toKebabCase } from "../to-kebab-case/to-kebab-case.js";

/**
 * Reports whether `value` is already kebabCase.
 *
 * True only when converting the string produces the same string and the
 * string is non-empty. A non-string returns `false`. The input is not changed.
 *
 * @param value - Any value.
 * @returns `true` when the string is already in that case.
 * @example
 * isKebabCase("value");
 */
export function isKebabCase(value: unknown): boolean {
    if (typeof value !== "string" || value.length === 0) {
        return false;
    }
    if (toKebabCase(value) !== value) {
        return false;
    }

    return true;
}
