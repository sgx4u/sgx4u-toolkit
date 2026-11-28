/**
 * Arguments for {@link createWindows}.
 */
export interface CreateWindowsParams<Item> {
    /**
     * Items the windows are copied from.
     */
    array: readonly Item[];
    /**
     * Number of items in a full window.
     */
    size: number;
    /**
     * How many items to move before the next window starts.
     * @defaultValue 1
     */
    step?: number;
    /**
     * When `false`, a window shorter than `size` is dropped.
     * @defaultValue true
     */
    partial?: boolean;
}
