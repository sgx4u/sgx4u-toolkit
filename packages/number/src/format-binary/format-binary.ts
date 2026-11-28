import { toBase } from "../to-base/to-base.js";

/**
 * Formats an integer as binary. `prefix` defaults to `true`.
 *
 * @example
 * formatBinary({ value: 5 });
 */
export function formatBinary(parameters: {
    value: number | bigint;
    prefix?: boolean;
    minimumDigits?: number;
}): string | undefined {
    return toBase({
        value: parameters.value,
        base: 2,
        prefix: parameters.prefix ?? true,
        minimumDigits: parameters.minimumDigits ?? 1,
    });
}
