import type { Iteratee } from "../types/iteratee.types.js";
import type { IndexByParams } from "./index-by.types.js";
import { assertChoice, describeReceived } from "../utils/errors.utils.js";
import { assertIteratee, resolveIteratee } from "../utils/iteratee.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

const conflictNames = ["first", "last", "throw"] as const;

/**
 * Keeps one item for each string key.
 *
 * The key is `String(by(item))`. Distinct objects share
 * `"[object Object]"`. A symbol key uses `Symbol.prototype.toString`.
 * `onConflict` defaults to `"last"`. `"first"` keeps the earliest item.
 * `"throw"` throws when a key is repeated. Unknown `onConflict` names throw
 * before the array is read.
 *
 * @param params - `array`, `by`, and optional `onConflict`.
 * @returns A record of one item per key, or `undefined` when `array` is not an array.
 * @throws {@link TypeError} When `by` is not a property key or a function.
 * @throws {@link RangeError} When `onConflict` is not `"first"`, `"last"`, or `"throw"`, or when it is `"throw"` and a key is repeated.
 * @example
 * indexBy({ array: [{ id: "a" }, { id: "b" }], by: "id" })
 */
export function indexBy<Item>(
    params: IndexByParams<Item>,
): Record<string, Item> | undefined;
export function indexBy(params: unknown): Record<string, unknown> | undefined;
export function indexBy(params: unknown): Record<string, unknown> | undefined {
    const resolved = readParams<IndexByParams<unknown>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    assertIteratee("by", resolved.by);
    assertChoice("onConflict", resolved.onConflict, conflictNames);
    const onConflict = resolved.onConflict ?? "last";
    const array = readArray<unknown>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    const read = resolveIteratee(resolved.by as Iteratee<unknown>);
    return indexItems(array, read, onConflict);
}

/**
 * Writes one item per string key.
 *
 * @param array - The source array.
 * @param read - The resolved iteratee.
 * @param onConflict - Which duplicate to keep, or `"throw"`.
 * @returns The index record.
 * @throws {@link RangeError} When `onConflict` is `"throw"` and a key repeats.
 */
function indexItems<Item>(
    array: readonly Item[],
    read: (item: Item, index: number, array: readonly Item[]) => unknown,
    onConflict: "first" | "last" | "throw",
): Record<string, Item> {
    const result: Record<string, Item> = {};
    const seen = new Set<string>();
    for (let index = 0; index < array.length; index += 1) {
        const item = array[index] as Item;
        const key = stringKey(read(item, index, array));
        if (seen.has(key)) {
            if (onConflict === "throw") {
                throw new RangeError(
                    `\`by\` produced a duplicate key ${describeReceived(String(key))} while \`onConflict\` is "throw".`,
                );
            }
            if (onConflict === "first") {
                continue;
            }
        } else {
            seen.add(key);
        }
        result[key] = item;
    }
    return result;
}

/**
 * Text used as a record key.
 *
 * @param key - The iteratee result.
 * @returns `String(key)`, or the symbol's own text when `key` is a symbol.
 */
function stringKey(key: unknown): string {
    if (typeof key === "symbol") {
        return key.toString();
    }
    return String(key);
}
