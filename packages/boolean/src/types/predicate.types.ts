/**
 * A function that answers a yes-or-no question about `Value`.
 *
 * Combinators return this shape. They do not narrow `Value`.
 */
export type Predicate<Value> = (value: Value) => boolean;
