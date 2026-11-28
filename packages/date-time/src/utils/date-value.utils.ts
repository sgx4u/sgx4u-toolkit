/**
 * Whether `value` is a `Date`, including a `Date` from another realm.
 *
 * `Object.prototype.toString` stays true across realms. `instanceof Date`
 * does not. An Invalid Date is included; callers that need a real instant
 * check the time value separately.
 *
 * @param value - Any value.
 * @returns `true` when `value` is a Date object.
 */
export function isDateValue(value: unknown): value is Date {
    return Object.prototype.toString.call(value) === "[object Date]";
}
