import { readBoolean, readEnum } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type { Base64Padding, IsBase64Options } from "./is-base64.types.js";

export type { Base64Padding, IsBase64Options } from "./is-base64.types.js";

const paddingModes = ["required", "optional"] as const;

/**
 * Reports whether `value` is Base64 text.
 *
 * The standard alphabet is `A-Za-z0-9+/`. The URL-safe alphabet is
 * `A-Za-z0-9-_`. Whitespace is rejected. An empty string is accepted as
 * the encoding of empty bytes. A non-string returns `false`. The input
 * is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` matches the alphabet and padding rule.
 * @throws {@link TypeError} When an option has the wrong type.
 * @throws {@link RangeError} When `padding` is not `"required"` or `"optional"`.
 * @example
 * isBase64("aGk=");
 */
export function isBase64(value: unknown): boolean;
/**
 * @param options - `value`, `urlSafe`, and `padding`.
 * @returns `true` when `value` matches the alphabet and padding rule.
 */
export function isBase64(options: IsBase64Options): boolean;
/**
 * @param valueOrOptions - A string, or `value` plus options.
 * @returns `true` when `value` matches the alphabet and padding rule.
 */
export function isBase64(valueOrOptions: unknown): boolean {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        urlSafe: readBoolean("urlSafe", record.urlSafe, false),
        padding: readEnum("padding", record.padding, paddingModes, "optional"),
    }));
    if (resolved === undefined) {
        return false;
    }
    return matchesBase64Text(
        resolved.value,
        resolved.options.urlSafe,
        resolved.options.padding,
    );
}

/**
 * Whether `value` is Base64 for the selected alphabet and padding rule.
 *
 * @param value - Candidate text.
 * @param urlSafe - When `true`, accept `-` and `_` instead of `+` and `/`.
 * @param padding - `"required"` or `"optional"`.
 * @returns `true` when the alphabet and padding length are valid.
 */
export function matchesBase64Text(
    value: string,
    urlSafe: boolean,
    padding: Base64Padding,
): boolean {
    if (value.length === 0) {
        return true;
    }
    const alphabet = urlSafe ? "[A-Za-z0-9_-]" : "[A-Za-z0-9+/]";
    if (!new RegExp(`^${alphabet}*={0,2}$`, "u").test(value)) {
        return false;
    }
    const paddingIndex = value.indexOf("=");
    if (paddingIndex === -1) {
        if (value.length % 4 === 1) {
            return false;
        }
        return padding === "optional" || value.length % 4 === 0;
    }
    const paddingLength = value.length - paddingIndex;
    if (value.slice(paddingIndex) !== "=".repeat(paddingLength)) {
        return false;
    }
    if (value.length % 4 !== 0 || paddingLength > 2) {
        return false;
    }
    const remainder = paddingIndex % 4;
    const expectedPadding = remainder === 0 ? 0 : 4 - remainder;
    return paddingLength === expectedPadding;
}
