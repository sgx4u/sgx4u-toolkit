/**
 * Fields for {@link getEasterSunday}.
 */
export interface GetEasterSundayParams {
    /**
     * The Gregorian year.
     */
    year: number;
    /**
     * Western Easter uses the Gregorian computus. Orthodox Easter uses the
     * Julian computus converted to a Gregorian date.
     *
     * @defaultValue `"western"`
     */
    tradition?: "western" | "orthodox";
}