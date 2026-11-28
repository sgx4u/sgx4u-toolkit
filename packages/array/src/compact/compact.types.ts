/**
 * Values {@link compact} removes.
 *
 * `NaN` is removed as well. It is not part of this union, because a
 * `number` type includes `NaN` and a type cannot name `NaN` alone.
 * `-0` is removed because `-0 === 0`.
 */
export type Falsy = false | 0 | 0n | "" | null | undefined;
