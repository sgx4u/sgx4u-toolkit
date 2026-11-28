import { isAcceptedTimeZone } from "../utils/time-zone.utils.js";

/**
 * Reports whether `timeZone` is a zone this runtime can use.
 *
 * An IANA name is accepted when `Intl` accepts it. A fixed offset
 * `±HH:mm`, `±HHmm`, or `±HH` is accepted from its text, with hours
 * `00`–`23` and minutes `00`–`59`. Anything else, including a non-string,
 * returns `false`. The function does not throw.
 *
 * @param timeZone - Any value.
 * @returns `true` when date functions can use `timeZone`.
 * @example
 * isValidTimeZone("Asia/Kolkata"); // true
 */
export function isValidTimeZone(timeZone: unknown): boolean {
    return isAcceptedTimeZone(timeZone);
}
