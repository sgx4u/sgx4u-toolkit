/**
 * A short rendering of `value` for an error message.
 *
 * Strings are JSON-quoted. Everything else uses a compact literal or the
 * object tag, so the message names what the caller passed.
 *
 * @param value - The rejected argument.
 * @returns Text that can follow `received`.
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
        value === undefined ||
        value === null ||
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return String(value);
    }
    return Object.prototype.toString.call(value);
}

/**
 * Formats allowed string values the way option errors list them.
 *
 * @param allowed - Legal values, already in display order.
 * @returns A phrase such as `"dot" or "json-pointer"`.
 */
export function formatAllowedList(allowed: readonly string[]): string {
    const quoted = allowed.map((value) => `"${value}"`);
    if (quoted.length <= 1) {
        return quoted[0] ?? "";
    }
    if (quoted.length === 2) {
        return `${quoted[0]} or ${quoted[1]}`;
    }
    const leading = quoted.slice(0, -1).join(", ");
    return `${leading}, or ${quoted[quoted.length - 1]}`;
}

/**
 * Throws when `value` is not a function.
 *
 * @param value - The callback the caller passed.
 * @param name - The parameter name, without backticks.
 * @throws {TypeError} When `value` is not a function.
 */
export function assertFunction(
    value: unknown,
    name: string,
): asserts value is (...args: never[]) => unknown {
    if (typeof value !== "function") {
        throw new TypeError(
            `\`${name}\` must be a function; received ${describeReceived(value)}.`,
        );
    }
}

/**
 * Reads a string option, or throws when the value is not one of `allowed`.
 *
 * `undefined` selects `fallback`.
 *
 * @param value - The option the caller passed.
 * @param name - The parameter name, without backticks.
 * @param allowed - Legal values.
 * @param fallback - Value used when `value` is omitted.
 * @returns The selected value.
 * @throws {RangeError} When `value` is present and not one of `allowed`.
 */
export function readChoice<T extends string>(
    value: unknown,
    name: string,
    allowed: readonly T[],
    fallback: T,
): T {
    if (value === undefined) {
        return fallback;
    }
    if (typeof value === "string" && includesChoice(allowed, value)) {
        return value;
    }
    throw new RangeError(
        `\`${name}\` must be ${formatAllowedList(allowed)}; received ${describeReceived(value)}.`,
    );
}

/**
 * Reads a string option for a predicate.
 *
 * An unknown value returns `undefined` so `is*` and `has*` can return
 * `false` without throwing.
 *
 * @param value - The option the caller passed.
 * @param allowed - Legal values.
 * @param fallback - Value used when `value` is omitted.
 * @returns The selected value, or `undefined` when `value` is not allowed.
 */
export function readChoiceOrSkip<T extends string>(
    value: unknown,
    allowed: readonly T[],
    fallback: T,
): T | undefined {
    if (value === undefined) {
        return fallback;
    }
    if (typeof value === "string" && includesChoice(allowed, value)) {
        return value;
    }
    return undefined;
}

/**
 * Reads `pathDelimiter`.
 *
 * @param value - The delimiter the caller passed.
 * @param fallback - Value used when `value` is omitted.
 * @returns A non-empty string.
 * @throws {RangeError} When `value` is present and is not a non-empty string.
 */
export function readPathDelimiter(value: unknown, fallback: string): string {
    if (value === undefined) {
        return fallback;
    }
    if (typeof value === "string" && value.length > 0) {
        return value;
    }
    throw new RangeError(
        `\`pathDelimiter\` must be a non-empty string; received ${describeReceived(value)}.`,
    );
}

/**
 * Whether `value` is one of `allowed`.
 *
 * @param allowed - Legal values.
 * @param value - Candidate text.
 * @returns `true` when `value` is a member.
 */
function includesChoice<T extends string>(
    allowed: readonly T[],
    value: string,
): value is T {
    return allowed.some((candidate) => candidate === value);
}
