/**
 * A short description of `value` for an error message.
 *
 * Strings are JSON-quoted so an empty string is visible. Other primitives
 * use their own text. Objects say which kind they are, not their contents.
 *
 * @param value - The rejected argument.
 * @returns Text that can follow `Received`.
 */
export function describeReceived(value: unknown): string {
    if (value === null) {
        return "null";
    }
    if (value === undefined) {
        return "undefined";
    }
    if (typeof value === "string") {
        return JSON.stringify(value);
    }
    if (
        typeof value === "number" ||
        typeof value === "boolean" ||
        typeof value === "bigint"
    ) {
        return String(value);
    }
    if (typeof value === "symbol") {
        return value.toString();
    }
    if (typeof value === "function") {
        return "a function";
    }
    if (Array.isArray(value)) {
        return "an array";
    }
    return "an object";
}
