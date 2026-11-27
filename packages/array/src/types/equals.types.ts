/**
 * Compares two items for equality.
 *
 * When a call omits `equals`, comparison is SameValueZero: `Object.is`,
 * except `-0` and `0` are equal, and `NaN` equals `NaN`.
 */
export type Equals<Item> = (left: Item, right: Item) => boolean;
