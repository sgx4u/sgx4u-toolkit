import type { Iteratee, Predicate } from "../types/iteratee.types.js";
import { typeError } from "./errors.utils.js";

/**
 * Whether `value` can be used as a property key.
 *
 * @param value - Any value.
 * @returns `true` for a string, number, or symbol.
 */
export function isPropertyKey(value: unknown): value is PropertyKey {
    const valueType = typeof value;
    return (
        valueType === "string" ||
        valueType === "number" ||
        valueType === "symbol"
    );
}

/**
 * Whether `value` is a property key or a function.
 *
 * @param value - Any value.
 * @returns `true` when `resolveIteratee` can read it.
 */
export function isIterateeValue(value: unknown): value is Iteratee<unknown> {
    return typeof value === "function" || isPropertyKey(value);
}

/**
 * Throws when `value` is not a property key or a function.
 *
 * @param name - Argument name.
 * @param value - The candidate iteratee.
 * @throws {@link TypeError} When `value` is not an iteratee.
 */
export function assertIteratee(name: string, value: unknown): void {
    if (!isIterateeValue(value)) {
        throw typeError(name, "a property key or a function", value);
    }
}

/**
 * Throws when `value` is not a function.
 *
 * @param name - Argument name.
 * @param value - The candidate function.
 * @throws {@link TypeError} When `value` is not a function.
 */
export function assertFunction(name: string, value: unknown): void {
    if (typeof value !== "function") {
        throw typeError(name, "a function", value);
    }
}

/**
 * Turns a property key or function into a function of an item.
 *
 * A key reads that property. `null` and `undefined` items produce
 * `undefined` instead of throwing. The function form is returned unchanged.
 *
 * @param by - A property key or a function.
 * @returns A function that reads the key for one item.
 */
export function resolveIteratee<Item, Result>(
    by: Iteratee<Item, Result>,
): (item: Item, index: number, array: readonly Item[]) => Result {
    if (typeof by === "function") {
        return by;
    }
    return (item: Item): Result => {
        if (item === null || item === undefined) {
            return undefined as Result;
        }
        return (item as Record<PropertyKey, Result>)[by] as Result;
    };
}

/**
 * Reads a predicate after checking that it is a function.
 *
 * @param name - Argument name.
 * @param predicate - The candidate predicate.
 * @returns The same function.
 * @throws {@link TypeError} When `predicate` is not a function.
 */
export function assertPredicate<Item>(
    name: string,
    predicate: unknown,
): Predicate<Item> {
    assertFunction(name, predicate);
    return predicate as Predicate<Item>;
}
