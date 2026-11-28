import { readEnum } from "../utils/assertions.utils.js";
import { readStringCall } from "../utils/read-call.utils.js";
import type {
    IsMACAddressOptions,
    MACAddressFormat,
} from "./is-mac-address.types.js";

export type {
    IsMACAddressOptions,
    MACAddressFormat,
} from "./is-mac-address.types.js";

const formats = ["any", "colon", "hyphen", "dot", "bare"] as const;

const formatExpression: Readonly<
    Record<Exclude<MACAddressFormat, "any">, RegExp>
> = {
    colon: /^(?:[0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/u,
    hyphen: /^(?:[0-9A-Fa-f]{2}-){5}[0-9A-Fa-f]{2}$/u,
    dot: /^(?:[0-9A-Fa-f]{4}\.){2}[0-9A-Fa-f]{4}$/u,
    bare: /^[0-9A-Fa-f]{12}$/u,
};

/**
 * Reports whether `value` is a 48-bit MAC address.
 *
 * Colon, hyphen, Cisco dot, and bare hexadecimal forms are separate
 * formats. `"any"` accepts each of them and rejects a mix of separators.
 * An EUI-64 address is rejected. A non-string returns `false`. The input
 * is not changed.
 *
 * @param value - Any value. Only a string can match.
 * @returns `true` when `value` uses the selected format.
 * @throws {@link TypeError} When `format` is present and is not a string.
 * @throws {@link RangeError} When `format` is not a known format.
 * @example
 * isMACAddress("aa:bb:cc:dd:ee:ff");
 */
export function isMACAddress(value: unknown): boolean;
/**
 * @param options - `value` and optional `format`.
 * @returns `true` when `value` uses the selected format.
 */
export function isMACAddress(options: IsMACAddressOptions): boolean;
/**
 * @param valueOrOptions - A string, or `value` plus `format`.
 * @returns `true` when `value` uses the selected format.
 */
export function isMACAddress(valueOrOptions: unknown): boolean {
    const resolved = readStringCall(valueOrOptions, (record) => ({
        format: readEnum("format", record.format, formats, "any"),
    }));
    if (resolved === undefined) {
        return false;
    }
    return matchesMACAddress(resolved.value, resolved.options.format);
}

/**
 * Whether `value` uses `format`.
 *
 * @param value - Candidate text.
 * @param format - The grouping to accept.
 * @returns `true` when the text matches that grouping.
 */
function matchesMACAddress(value: string, format: MACAddressFormat): boolean {
    if (format === "any") {
        return (
            formatExpression.colon.test(value) ||
            formatExpression.hyphen.test(value) ||
            formatExpression.dot.test(value) ||
            formatExpression.bare.test(value)
        );
    }
    return formatExpression[format].test(value);
}
