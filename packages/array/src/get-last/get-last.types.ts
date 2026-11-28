/**
 * Arguments for {@link getLast}.
 */
export interface GetLastParams<Item, DefaultValue = undefined> {
    /** Array whose last item is read. */
    array: readonly Item[];

    /**
     * Value returned when `array` is empty.
     *
     * When this property is present it is returned as-is, including `0`
     * and `false`. When it is absent, an empty array returns `undefined`.
     * A hole in the last position is an item, so that hole is returned
     * instead of this value.
     *
     * @defaultValue undefined
     */
    defaultValue?: DefaultValue | undefined;
}
