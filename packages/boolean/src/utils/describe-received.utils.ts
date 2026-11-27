/**
 * A short label for `value` inside an error message.
 *
 * Strings are quoted. Other values use a type name so building the message
 * cannot throw.
 *
 * @param value - The rejected argument or entry.
 * @returns Text that names what the caller passed.
 */
export function describeReceived(value: unknown): string {
    if (typeof value === "string") {
        return JSON.stringify(value);
    }
    if (typeof value === "bigint") {
        return `${value}n`;
    }
    if (typeof value === "symbol") {
        return value.toString();
    }
    if (
        value !== null &&
        (typeof value === "object" || typeof value === "function")
    ) {
        return Object.prototype.toString.call(value);
    }
    return String(value);
}
