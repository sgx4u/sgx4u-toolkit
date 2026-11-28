/**
 * A function applied to one property, or nested rules for a plain object.
 */
export type EvolveRule =
    ((value: unknown) => unknown) | { readonly [key: string]: EvolveRule };

/**
 * Arguments for `evolve`.
 */
export interface EvolveParams {
    /**
     * The value to evolve.
     *
     * A value that is not a plain object returns `undefined`.
     */
    object: unknown;
    /**
     * Functions and nested plain objects, keyed like `object`.
     *
     * A listed key that is missing from `object` is skipped.
     */
    transformations: EvolveRule;
}
