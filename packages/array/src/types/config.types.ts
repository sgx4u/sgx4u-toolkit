import type { Equals } from "./equals.types.js";

/**
 * Defaults for one `createArray`, `createAsyncArray`, or
 * `createCombinatorics` instance.
 *
 * The object is read once at creation. Later changes to the object passed
 * in do not affect the instance. There is no module-level default.
 */
export interface ArrayConfig {
    /**
     * Equality used by unique, set, search, diff, and toggle functions.
     * @defaultValue SameValueZero
     */
    equals?: Equals<unknown>;
    /**
     * BCP 47 language tag or list, used by `sortBy`, `sortNatural`, and
     * `createComparator`.
     * @defaultValue the runtime locale
     */
    locale?: string | readonly string[];
    /**
     * When true, string keys that contain numbers are compared as numbers
     * (`"item2"` before `"item10"`).
     * @defaultValue false
     */
    numeric?: boolean;
    /**
     * Collator sensitivity for locale-aware sorts.
     * @defaultValue "variant"
     */
    sensitivity?: "base" | "accent" | "case" | "variant";
    /**
     * Where nullish sort keys, and `NaN` keys, go.
     * @defaultValue "last"
     */
    nulls?: "first" | "last";
    /**
     * Source of randomness for shuffle and sample. Must return a number in
     * `[0, 1)`. A per-call `seed` wins over this function.
     * @defaultValue Math.random
     */
    random?: () => number;
    /**
     * Maximum number of in-flight promises for async helpers on
     * `createAsyncArray`.
     * @defaultValue Infinity
     */
    concurrency?: number;
}
