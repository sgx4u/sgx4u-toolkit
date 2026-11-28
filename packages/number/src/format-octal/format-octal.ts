import { toBase } from "../to-base/to-base.js";

/**
 * Formats an integer as octal. `prefix` defaults to `true`.
 *
 * @example
 * formatOctal({ value: 8 });
 */
export function formatOctal(parameters: {
    value: number | bigint;
    prefix?: boolean;
    minimumDigits?: number;
}): string | undefined {
    return toBase({
        value: parameters.value,
        base: 8,
        prefix: parameters.prefix ?? true,
        minimumDigits: parameters.minimumDigits ?? 1,
    });
}
