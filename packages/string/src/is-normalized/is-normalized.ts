import { readEnum } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { IsNormalizedOptions } from "./is-normalized.types.js";

const unicodeForms = ["NFC", "NFD", "NFKC", "NFKD"] as const;

/**
 * Reports whether `value` is already in the requested normalization form.
 *
 * The check is `value === value.normalize(form)`. An empty string is
 * normalized. A non-string returns `false`. The input is not changed.
 *
 * @returns `true` when `value` is already in `form`.
 * @throws {@link RangeError} When `form` is not `NFC`, `NFD`, `NFKC`, or `NFKD`.
 * @throws {@link TypeError} When `form` is present and is not a string.
 * @example
 * isNormalized("é");
 */
export function isNormalized(value: string): boolean;
/**
 * @param options - `value` and an optional `form`.
 * @returns `true` when `value` is already in `form`.
 */
export function isNormalized(options: IsNormalizedOptions): boolean;
/**
 * @param valueOrOptions - A string, or `value` plus `form`.
 * @returns `true` when `value` is already in `form`. A non-string returns `false`.
 */
export function isNormalized(valueOrOptions: unknown): boolean {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        form: readEnum("form", record.form, unicodeForms, "NFC"),
    }));
    if (resolved === undefined) {
        return false;
    }
    return resolved.value === resolved.value.normalize(resolved.options.form);
}
