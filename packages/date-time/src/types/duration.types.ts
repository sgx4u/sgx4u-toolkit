/**
 * A length of time. Every non-zero field must share one sign.
 *
 * A fractional value is allowed only on the smallest non-zero field, and
 * only when that field is a clock unit (`hours`, `minutes`, `seconds`, or
 * `milliseconds`).
 */
export interface Duration {
    years?: number;
    months?: number;
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
}
