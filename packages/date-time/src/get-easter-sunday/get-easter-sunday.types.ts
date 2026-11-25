/**
 * Which computus to use.
 */
export interface EasterOptions {
    /**
     * Western Easter uses the Gregorian computus. Orthodox Easter uses the
     * Julian computus converted to a Gregorian date.
     *
     * @defaultValue `"western"`
     */
    tradition?: "western" | "orthodox";
}
