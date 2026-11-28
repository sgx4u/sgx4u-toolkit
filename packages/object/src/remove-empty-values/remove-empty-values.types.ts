import type { EmptyValue } from "../types/object-config.types.js";

/**
 * Arguments for `removeEmptyValues`.
 */
export interface RemoveEmptyValuesParams {
    /**
     * The plain object or array to clean.
     *
     * `null` and primitives return `undefined`.
     */
    object: unknown;

    /**
     * Which values count as empty.
     *
     * `nan` matches `Number.NaN` only. `0`, `false`, and other numbers stay.
     *
     * @defaultValue `["undefined"]`
     */
    emptyValues?: readonly EmptyValue[];

    /**
     * When true, clean nested plain objects and arrays before deciding whether
     * the parent entry is empty.
     *
     * @defaultValue `true`
     */
    deep?: boolean;
}
