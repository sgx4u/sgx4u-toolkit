import { isPlainObjectValue } from "./value-kind.utils.js";

/**
 * Whether `value` is the options-object form of a function.
 *
 * The object must be plain, own `requiredKey`, own no symbol keys, and own
 * no string keys outside `allowedKeys`. A data object that merely contains
 * `requiredKey` plus some other field stays data.
 *
 * @param value - The argument to test.
 * @param requiredKey - The key that marks the options object, such as `"value"` or `"object"`.
 * @param allowedKeys - Every string key the options object may own, including `requiredKey`.
 * @returns `true` when `value` should be read as parameters.
 */
export function isParameterRecord(
    value: unknown,
    requiredKey: string,
    allowedKeys: readonly string[],
): value is Record<string, unknown> {
    if (!isPlainObjectValue(value)) {
        return false;
    }
    if (!Object.hasOwn(value, requiredKey)) {
        return false;
    }
    if (Object.getOwnPropertySymbols(value).length > 0) {
        return false;
    }
    return Object.keys(value).every((key) => allowedKeys.includes(key));
}
