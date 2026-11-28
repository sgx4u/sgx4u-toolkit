/**
 * A value a date function can accept.
 *
 * A `Date` is an instant. A `number` is Unix time in milliseconds. A
 * `string` is a `YYYY-MM-DD` calendar date or an ISO date-time with an
 * explicit offset. Membership in this union is not validity:
 * `new Date(Number.NaN)` and `"2024-02-30"` are members, and `isValidDate`
 * returns `false` for both.
 */
export type DateInput = Date | number | string;
