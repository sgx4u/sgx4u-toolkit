import { isOptionsRecord } from "./assertions.utils.js";

/**
 * A string call resolved from either a bare string or one options object.
 */
export interface ResolvedStringCall<Options> {
    /** The string the caller asked to transform or test. */
    value: string;
    /** Options read from the object, or the defaults when the call was a bare string. */
    options: Options;
}

/**
 * Reads a call that is either a string or one flat options object.
 *
 * Option types are checked even when `value` is missing or is not a
 * string, so a bad option is not hidden by invalid text. A non-string
 * `value` resolves to `undefined` after those checks.
 *
 * @typeParam Options - Options produced by `readOptions`.
 * @param valueOrOptions - A string, or an object that may contain `value`.
 * @param readOptions - Reads and checks the flat options. Called with an empty object for a bare string.
 * @returns The string and its options, or `undefined` when the text is not a string.
 */
export function readStringCall<Options>(
    valueOrOptions: unknown,
    readOptions: (record: Record<string, unknown>) => Options,
): ResolvedStringCall<Options> | undefined {
    if (typeof valueOrOptions === "string") {
        return { value: valueOrOptions, options: readOptions({}) };
    }
    if (!isOptionsRecord(valueOrOptions)) {
        return undefined;
    }
    const options = readOptions(valueOrOptions);
    if (typeof valueOrOptions.value !== "string") {
        return undefined;
    }
    return { value: valueOrOptions.value, options };
}

/**
 * Reads a call that is only an options object.
 *
 * @typeParam Options - Options produced by `readOptions`.
 * @param options - The flat options object.
 * @param readOptions - Reads and checks the flat options.
 * @returns The record and the checked options, or `undefined` when `options` is not an object.
 */
export function readOptionsCall<Options>(
    options: unknown,
    readOptions: (record: Record<string, unknown>) => Options,
): { record: Record<string, unknown>; options: Options } | undefined {
    if (!isOptionsRecord(options)) {
        return undefined;
    }
    return { record: options, options: readOptions(options) };
}
