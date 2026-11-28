import { readEnum } from "../utils/assertions.utils.js";
import { readOptionsCall } from "../utils/read-call.utils.js";
import type { EqualsNormalizedOptions } from "./equals-normalized.types.js";

const forms = ["NFC", "NFD", "NFKC", "NFKD"] as const;

/**
 * Reports whether two strings are equal after Unicode normalization.
 *
 * The default form is NFC. A non-string returns `false`. The inputs are not changed.
 *
 * @param options - `first`, `second`, and an optional `form`.
 * @returns `true` when the normalized strings are the same code points.
 * @throws {@link RangeError} When `form` is unknown.
 * @example
 * equalsNormalized({ first: "é", second: "e\u0301" });
 */
export function equalsNormalized(options: EqualsNormalizedOptions): boolean {
    const resolved = readOptionsCall(options, (record) => ({
        form: readEnum("form", record.form, forms, "NFC"),
    }));
    if (
        resolved === undefined ||
        typeof resolved.record.first !== "string" ||
        typeof resolved.record.second !== "string"
    )
        return false;
    return (
        resolved.record.first.normalize(resolved.options.form) ===
        resolved.record.second.normalize(resolved.options.form)
    );
}
