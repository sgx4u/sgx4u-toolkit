import {
    isBinaryContainer,
    isErrorValue,
    isMapValue,
    isSetValue,
    isWeakMapValue,
    isWeakSetValue,
} from "./value-kind.utils.js";

/**
 * Visits the object children of `value`.
 *
 * Arrays yield own elements. Maps yield keys and values. Sets yield values.
 * Other records yield own enumerable string properties. An error `cause` is
 * visited even when it is non-enumerable. Binary containers, `WeakMap`, and
 * `WeakSet` have no readable children.
 *
 * @param value - The parent object.
 * @param visit - Called with each child and the key or index that selected it.
 */
export function forEachChild(
    value: object,
    visit: (child: unknown, key: PropertyKey) => void,
): void {
    if (
        isBinaryContainer(value) ||
        isWeakMapValue(value) ||
        isWeakSetValue(value)
    ) {
        return;
    }
    if (isMapValue(value)) {
        for (const [key, entry] of value) {
            visit(key, key as PropertyKey);
            visit(entry, key as PropertyKey);
        }
        return;
    }
    if (isSetValue(value)) {
        let index = 0;
        for (const entry of value) {
            visit(entry, index);
            index += 1;
        }
        return;
    }
    if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index += 1) {
            if (Object.hasOwn(value, index)) {
                visit(value[index], index);
            }
        }
        return;
    }
    const keys = Object.keys(value);
    if (
        isErrorValue(value) &&
        Object.hasOwn(value, "cause") &&
        !keys.includes("cause")
    ) {
        visit((value as { cause?: unknown }).cause, "cause");
    }
    for (const key of keys) {
        visit((value as Record<string, unknown>)[key], key);
    }
}
