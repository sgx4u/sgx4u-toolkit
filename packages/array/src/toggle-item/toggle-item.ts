import type { Equals } from "../types/equals.types.js";
import type { ToggleItemParams, TogglePlacement } from "./toggle-item.types.js";
import { copyArray } from "../utils/array.utils.js";
import { assertChoice } from "../utils/errors.utils.js";
import { resolveEquals } from "../utils/equality.utils.js";
import { readArray, readParams } from "../utils/params.utils.js";

const placements = ["start", "end"] as const;

/**
 * Removes every equal item, or inserts the item when none exist.
 *
 * A match removes all equal items. No match inserts `item` at the end, or
 * at the start when `placement` is `"start"`. An unknown placement throws
 * before the source array is read. The input is not mutated.
 *
 * @param params - The source array, the item, and an optional placement.
 * @returns The new array, or `undefined` when `array` is not an array.
 * @throws {@link RangeError} When `placement` is present and is not `"start"` or `"end"`.
 * @throws {@link TypeError} When `equals` is present and is not a function.
 * @example
 * toggleItem({ array: [1, 2, 2, 3], item: 2 });
 */
export function toggleItem<Item>(
    params: ToggleItemParams<Item>,
): Item[] | undefined {
    const resolved = readParams<ToggleItemParams<Item>>(params);
    if (resolved === undefined) {
        return undefined;
    }
    assertChoice("placement", resolved.placement, placements);
    if (resolved.equals !== undefined) {
        resolveEquals(resolved.equals);
    }
    const array = readArray<Item>(resolved.array);
    if (array === undefined) {
        return undefined;
    }
    const placement: TogglePlacement =
        resolved.placement === "start" ? "start" : "end";
    return toggle(
        array,
        resolved.item,
        resolveEquals(resolved.equals),
        placement,
    );
}

/**
 * Removes every equal item, or inserts `item` at `placement`.
 *
 * @param array - The source array.
 * @param item - The item to toggle.
 * @param equals - Item equality.
 * @param placement - `"start"` or `"end"`.
 * @returns The new array.
 */
function toggle<Item>(
    array: readonly Item[],
    item: Item,
    equals: Equals<Item>,
    placement: TogglePlacement,
): Item[] {
    const copy = copyArray(array);
    let found = false;
    for (let index = 0; index < copy.length; index += 1) {
        if (equals(copy[index] as Item, item)) {
            found = true;
            break;
        }
    }
    if (found) {
        return copy.filter((candidate) => !equals(candidate, item));
    }
    if (placement === "start") {
        return [item, ...copy];
    }
    return [...copy, item];
}
