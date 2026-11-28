/**
 * A property key, or a function of an item, its index, and the source array.
 *
 * A key reads one own or inherited property. Dotted paths such as
 * `"address.city"` are not read as paths. `"address.city"` is the property
 * whose name is that whole string.
 */
export type Iteratee<Item, Result = unknown> =
    | PropertyKey
    | ((item: Item, index: number, array: readonly Item[]) => Result);

/**
 * A function that reports whether an item should be kept.
 */
export type Predicate<Item> = (
    item: Item,
    index: number,
    array: readonly Item[],
) => boolean;
