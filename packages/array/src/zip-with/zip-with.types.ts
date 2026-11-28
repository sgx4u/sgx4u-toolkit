import type { ZipMode } from "../zip/zip.types.js";

/**
 * Parameters for {@link zipWith}.
 */
export interface ZipWithParams<Result> {
    /** Arrays to combine by index. Every slot must be an array. */
    arrays: readonly (readonly unknown[])[];

    /** Called with one tuple. The arguments line up with `arrays`. */
    combine: (...items: unknown[]) => Result;

    /**
     * Which tuples to combine. The rules match `zip`.
     *
     * @defaultValue "longest"
     */
    mode?: ZipMode;

    /**
     * Value passed to `combine` for a missing entry when `mode` is `"longest"`.
     *
     * @defaultValue undefined
     */
    fillValue?: unknown;
}
