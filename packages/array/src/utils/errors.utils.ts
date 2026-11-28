/**
 * Text for the value that caused a thrown error.
 *
 * Numbers, booleans, `null`, and `undefined` use their ordinary spelling.
 * Strings are quoted. Other values use a short kind name so the message
 * stays one sentence.
 *
 * @param value - The rejected argument.
 * @returns Text that can follow "received".
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
    return Object.prototype.toString.call(value);
}

/**
 * @param name - Argument name, without backticks.
 * @param requirement - What the argument must be, without a leading "must be".
 * @param received - The value the caller passed.
 * @returns An error whose message names the argument and the value.
 */
export function rangeError(
    name: string,
    requirement: string,
    received: unknown,
): RangeError {
    return new RangeError(
        `\`${name}\` must be ${requirement}; received ${describeReceived(received)}.`,
    );
}

/**
 * @param name - Argument name, without backticks.
 * @param requirement - What the argument must be, without a leading "must be".
 * @param received - The value the caller passed.
 * @returns An error whose message names the argument and the value.
 */
export function typeError(
    name: string,
    requirement: string,
    received: unknown,
): TypeError {
    return new TypeError(
        `\`${name}\` must be ${requirement}; received ${describeReceived(received)}.`,
    );
}

/**
 * Joins quoted option names for an error message.
 *
 * @param choices - Allowed option names.
 * @returns A phrase such as `"first" or "last"`.
 */
export function choiceList(choices: readonly string[]): string {
    const quoted = choices.map((choice) => `"${choice}"`);
    if (quoted.length <= 1) {
        return quoted[0] ?? "";
    }
    if (quoted.length === 2) {
        return `${quoted[0]} or ${quoted[1]}`;
    }
    const lastChoice = quoted[quoted.length - 1];
    return `${quoted.slice(0, -1).join(", ")}, or ${lastChoice}`;
}

/**
 * Throws when `value` is present and is not one of `choices`.
 *
 * An absent value is left for the caller to replace with a default.
 *
 * @param name - Argument name.
 * @param value - The option the caller passed.
 * @param choices - Allowed names.
 * @throws {@link RangeError} When `value` is not one of `choices`.
 */
export function assertChoice(
    name: string,
    value: unknown,
    choices: readonly string[],
): void {
    if (value === undefined) {
        return;
    }
    if (typeof value !== "string" || !choices.includes(value)) {
        throw rangeError(name, choiceList(choices), value);
    }
}
