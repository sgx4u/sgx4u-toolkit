import { readOptionalString } from "../utils/assertions.utils.js";
import { describeReceived } from "../utils/describe-received.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { EscapeCSVOptions } from "./escape-csv.types.js";

/**
 * Quotes a CSV field when the field would otherwise split or break a line.
 *
 * The field is wrapped in double quotes when it contains `delimiter`, a
 * double quote, a carriage return, or a line feed. A double quote inside
 * the field is doubled. A field that needs no quotes is returned unchanged.
 * The input is not changed.
 *
 * @param value - One field.
 * @returns The field, quoted when required.
 * @example
 * escapeCSV('say "hello"');
 */
export function escapeCSV(value: string): string;
/**
 * @param options - `value` plus an optional delimiter.
 * @returns The field, or `undefined` when `value` is not a string.
 * @throws {@link TypeError} When `delimiter` is present and is not a string.
 * @throws {@link RangeError} When `delimiter` is empty.
 */
export function escapeCSV(options: EscapeCSVOptions): string | undefined;
/**
 * @param valueOrOptions - A string, or one flat options object.
 * @returns The field, or `undefined` when the text is not a string.
 */
export function escapeCSV(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, readEscapeCSVOptions);
    if (resolved === undefined) {
        return undefined;
    }
    return quoteField(resolved.value, resolved.options.delimiter);
}

/**
 * @param record - The options object, or an empty object for a bare string.
 * @returns The checked delimiter.
 */
function readEscapeCSVOptions(record: Record<string, unknown>): {
    delimiter: string;
} {
    const delimiter = readOptionalString("delimiter", record.delimiter) ?? ",";
    if (delimiter.length === 0) {
        throw new RangeError(
            `delimiter must not be empty. Received ${describeReceived(delimiter)}.`,
        );
    }
    return { delimiter };
}

/**
 * @param value - The field text.
 * @param delimiter - The separator that forces quoting.
 * @returns The field, with quotes when the field is not a plain token.
 */
function quoteField(value: string, delimiter: string): string {
    const doubled = value.replaceAll('"', '""');
    if (
        value.includes(delimiter) ||
        value.includes('"') ||
        value.includes("\r") ||
        value.includes("\n")
    ) {
        return `"${doubled}"`;
    }
    return doubled;
}
