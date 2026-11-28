import { toSnakeCase } from "../to-snake-case/to-snake-case.js";

/**
 * Reports whether `value` is already snakeCase.
 *
 * True only when converting the string produces the same string and the
 * string is non-empty. A non-string returns `false`. The input is not changed.
 *
 * @param value - Any value.
 * @returns `true` when the string is already in that case.
 * @example
 * isSnakeCase("value");
 */
export function isSnakeCase(value: unknown): boolean {
    if (typeof value !== "string" || value.length === 0) {
        return false;
    }
    if (toSnakeCase(value) !== value) {
        return false;
    }

    return true;
}
