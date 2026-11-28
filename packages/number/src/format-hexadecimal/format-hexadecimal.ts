import { toBase } from "../to-base/to-base.js";

/**
 * Formats an integer as hexadecimal. `prefix` defaults to `true` and `uppercase` defaults to `false`.
 *
 * @example
 * formatHexadecimal({ value: 255 });
 */
export function formatHexadecimal(parameters: {
    value: number | bigint;
    prefix?: boolean;
    minimumDigits?: number;
    uppercase?: boolean;
}): string | undefined {
    const digits = toBase({
        value: parameters.value,
        base: 16,
        prefix: parameters.prefix ?? true,
        minimumDigits: parameters.minimumDigits ?? 1,
    });
    if (digits === undefined || parameters.uppercase !== true) {
        return digits;
    }
    const negative = digits.startsWith("-");
    const body = negative ? digits.slice(1) : digits;
    const prefix = body.startsWith("0x") ? "0x" : "";
    const rest = body.slice(prefix.length);
    return `${negative ? "-" : ""}${prefix}${rest.toUpperCase()}`;
}
