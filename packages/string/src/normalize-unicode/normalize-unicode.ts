import { readEnum } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { NormalizeUnicodeOptions } from "./normalize-unicode.types.js";

const forms = ["NFC", "NFD", "NFKC", "NFKD"] as const;

/**
 * Returns `value` in the requested Unicode normalization form.
 *
 * The default form is NFC. The input is not changed.
 *
 * @param value - The text to normalize.
 * @returns The normalized string, or `undefined` when `value` is not a string.
 * @throws {@link RangeError} When `form` is not a known form.
 * @throws {@link TypeError} When `form` is present and is not a string.
 * @example
 * normalizeUnicode("é");
 */
export function normalizeUnicode(value: string): string | undefined;
/**
 * @param options - `value` and an optional `form`.
 * @returns The normalized string, or `undefined` when `value` is not a string.
 */
export function normalizeUnicode(
    options: NormalizeUnicodeOptions,
): string | undefined;
/**
 * @param valueOrOptions - A string, or `value` plus `form`.
 * @returns The normalized string, or `undefined` when `value` is not a string.
 */
export function normalizeUnicode(valueOrOptions: unknown): string | undefined {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        form: readEnum("form", record.form, forms, "NFC"),
    }));
    if (resolved === undefined) {
        return undefined;
    }
    return resolved.value.normalize(resolved.options.form);
}
