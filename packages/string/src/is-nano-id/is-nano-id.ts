import { readInteger, readOptionalString } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { IsNanoIDOptions } from "./is-nano-id.types.js";

export type { IsNanoIDOptions } from "./is-nano-id.types.js";

const defaultAlphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";

/**
 * Resolved NanoID options after defaults are applied.
 */
interface NanoIDCheckOptions {
    /** Expected number of code points. */
    length: number;
    /** Characters the identifier may use. */
    alphabet: string;
}

/**
 * Reports whether `value` is a NanoID.
 *
 * The default alphabet is `A-Za-z0-9_-` and the default length is 21.
 * Length is counted in Unicode code points. A non-string returns `false`.
 * The input is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when every character is in the alphabet and the length matches.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When `length` is not a positive integer.
 * @example
 * isNanoID("V1StGXR8_Z5jdHi6B-myT");
 */
export function isNanoID(value: unknown): boolean;
/**
 * @param options - `value`, optional `length`, and optional `alphabet`.
 * @returns `true` when every character is in the alphabet and the length matches.
 */
export function isNanoID(options: IsNanoIDOptions): boolean;
/**
 * @param valueOrOptions - A string, or `value` plus options.
 * @returns `true` when every character is in the alphabet and the length matches.
 */
export function isNanoID(valueOrOptions: unknown): boolean {
    const resolved = readStringCall(valueOrOptions, readNanoIDOptions);
    if (resolved === undefined) {
        return false;
    }
    return matchesNanoID(
        resolved.value,
        resolved.options.length,
        resolved.options.alphabet,
    );
}

/**
 * Reads NanoID options and applies the defaults.
 *
 * @param record - The flat options object, or an empty object for a bare string.
 * @returns The length and alphabet.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When `length` is not a positive integer.
 */
function readNanoIDOptions(
    record: Record<string, unknown>,
): NanoIDCheckOptions {
    return {
        length: readInteger("length", record.length, 1, undefined, 21),
        alphabet:
            readOptionalString("alphabet", record.alphabet) ?? defaultAlphabet,
    };
}

/**
 * Whether `value` uses only `alphabet` and has `length` code points.
 *
 * @param value - Candidate text.
 * @param length - Expected code-point count.
 * @param alphabet - Allowed characters.
 * @returns `true` when both constraints hold. An empty alphabet matches nothing.
 */
function matchesNanoID(
    value: string,
    length: number,
    alphabet: string,
): boolean {
    const characters = Array.from(value);
    if (characters.length !== length || alphabet.length === 0) {
        return false;
    }
    const allowed = new Set(Array.from(alphabet));
    return characters.every((character) => allowed.has(character));
}
