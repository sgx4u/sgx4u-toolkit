/**
 * Reports whether `value` is a TCP or UDP port as a digit string.
 *
 * The integer is from 0 through 65535. `0` is accepted. A leading zero is
 * rejected, so `08` is false. Spaces and signs are rejected. A non-string
 * returns `false`. The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` is a port number in range.
 * @example
 * isPort("443");
 */
export function isPort(value: unknown): boolean {
    if (typeof value !== "string" || !/^(?:0|[1-9]\d{0,4})$/u.test(value)) {
        return false;
    }
    return Number(value) <= 65535;
}
