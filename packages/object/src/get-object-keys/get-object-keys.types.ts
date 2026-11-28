/**
 * Arguments for the options form of `getObjectKeys`, `getObjectValues`, and `getObjectEntries`.
 */
export interface ObjectKeyListParams {
    /** The value whose keys are listed. A non-object returns `undefined`. */
    object: unknown;
    /**
     * Include symbol keys.
     *
     * @defaultValue `false`
     */
    includeSymbols?: boolean;
    /**
     * Include non-enumerable string keys. Symbol keys are included only when
     * `includeSymbols` is also true; non-enumerable symbols are included when
     * both flags are true.
     *
     * @defaultValue `false`
     */
    includeNonEnumerable?: boolean;
}
